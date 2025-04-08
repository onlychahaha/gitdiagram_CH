from fastapi import APIRouter, Request, HTTPException
from dotenv import load_dotenv

# from app.services.claude_service import ClaudeService
# from app.core.limiter import limiter
from anthropic._exceptions import RateLimitError
from app.prompts import SYSTEM_MODIFY_PROMPT
from pydantic import BaseModel
from app.services.o1_mini_openai_service import OpenAIO1Service


load_dotenv()

router = APIRouter(prefix="/modify", tags=["Claude"])

# 初始化服务
# claude_service = ClaudeService()
o1_service = OpenAIO1Service()


# 定义请求体模型


class ModifyRequest(BaseModel):
    instructions: str
    current_diagram: str
    repo: str
    username: str
    explanation: str


@router.post("")
# @limiter.limit("2/minute;10/day")
async def modify(request: Request, body: ModifyRequest):
    try:
        # Check instructions length
        if not body.instructions or not body.current_diagram:
            return {"error": "Instructions and/or current diagram are required"}
        elif (
            len(body.instructions) > 1000 or len(body.current_diagram) > 100000
        ):  # just being safe
            return {"error": "Instructions exceed maximum length of 1000 characters"}

        if body.repo in [
            "fastapi",
            "streamlit",
            "flask",
            "api-analytics",
            "monkeytype",
        ]:
            return {"error": "Example repos cannot be modified"}

        # modified_mermaid_code = claude_service.call_claude_api(
        #     system_prompt=SYSTEM_MODIFY_PROMPT,
        #     data={
        #         "instructions": body.instructions,
        #         "explanation": body.explanation,
        #         "diagram": body.current_diagram,
        #     },
        # )

        modified_mermaid_code = o1_service.call_o1_api(
            system_prompt=SYSTEM_MODIFY_PROMPT,
            data={
                "instructions": body.instructions,
                "explanation": body.explanation,
                "diagram": body.current_diagram,
            },
        )

        # Check for BAD_INSTRUCTIONS response
        if "BAD_INSTRUCTIONS" in modified_mermaid_code:
            return {"error": "Invalid or unclear instructions provided"}

        return {"diagram": modified_mermaid_code}
    except RateLimitError as e:
        raise HTTPException(
            status_code=429,
            detail="Service is currently experiencing high demand. Please try again in a few minutes.",
        )
    except Exception as e:
        return {"error": str(e)}
