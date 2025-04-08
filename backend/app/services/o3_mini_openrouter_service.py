from openai import OpenAI
from dotenv import load_dotenv
from app.utils.format_message import format_user_message
import tiktoken
import os
import aiohttp
import json
from typing import Literal, AsyncGenerator

load_dotenv()


class OpenRouterO3Service:
    def __init__(self):
        self.default_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        self.encoding = tiktoken.get_encoding("o200k_base")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    def call_o3_api(
        self,
        system_prompt: str,
        data: dict,
        api_key: str | None = None,
        reasoning_effort: Literal["low", "medium", "high"] = "low",
    ) -> str:
        """
        向OpenRouter O3发起API调用并返回响应。

        参数：
            system_prompt (str)：指令/系统提示
            data (dict)：用于格式化用户消息的变量字典
            api_key (str | None)：可选的自定义API密钥

        返回：
            str：O3的响应文本
        """
        # 使用数据创建用户消息
        user_message = format_user_message(data)

        # 如果提供了API密钥则使用自定义客户端，否则使用默认客户端
        client = (
            OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)
            if api_key
            else self.default_client
        )

        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://gitdiagram.com",  # 可选。用于openrouter.ai排名的网站URL。
                "X-Title": "gitdiagram",  # 可选。用于openrouter.ai排名的网站标题。
            },
            model="openai/o3-mini",  # 可以根据需要配置
            reasoning_effort=reasoning_effort,  # 可以根据需求调整
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_completion_tokens=12000,  # 根据需要调整
            temperature=0.2,
        )

        if completion.choices[0].message.content is None:
            raise ValueError("OpenRouter O3未返回任何内容")

        return completion.choices[0].message.content

    async def call_o3_api_stream(
        self,
        system_prompt: str,
        data: dict,
        api_key: str | None = None,
        reasoning_effort: Literal["low", "medium", "high"] = "low",
    ) -> AsyncGenerator[str, None]:
        """
        向OpenRouter O3发起流式API调用并产生响应。

        参数：
            system_prompt (str)：指令/系统提示
            data (dict)：用于格式化用户消息的变量字典
            api_key (str | None)：可选的自定义API密钥

        产生：
            str：O3响应文本的块
        """
        # 使用数据创建用户消息
        user_message = format_user_message(data)

        headers = {
            "HTTP-Referer": "https://gitdiagram.com",
            "X-Title": "gitdiagram",
            "Authorization": f"Bearer {api_key or self.default_client.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "openai/o3-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 12000,
            "temperature": 0.2,
            "stream": True,
            "reasoning_effort": reasoning_effort,
        }

        buffer = ""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.base_url, headers=headers, json=payload
            ) as response:
                async for line in response.content:
                    line = line.decode("utf-8").strip()
                    if line.startswith("data: "):
                        if line == "data: [DONE]":
                            break
                        try:
                            data = json.loads(line[6:])
                            if (
                                content := data.get("choices", [{}])[0]
                                .get("delta", {})
                                .get("content")
                            ):
                                yield content
                        except json.JSONDecodeError:
                            # 跳过任何非JSON行（如OPENROUTER PROCESSING注释）
                            continue

    def count_tokens(self, prompt: str) -> int:
        """
        计算提示中的令牌数量。
        注意：这是一个粗略估计，因为OpenRouter可能不提供直接的令牌计数。

        参数：
            prompt (str)：要计算令牌的提示

        返回：
            int：估计的输入令牌数
        """
        num_tokens = len(self.encoding.encode(prompt))
        return num_tokens
