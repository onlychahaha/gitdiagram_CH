"use client";

import { useEffect, useState, useRef } from "react";

const messages = [
  "检查是否有缓存...",
  "生成图表中...",
  "分析仓库中...",
  "提示o3-mini中...",
  "检查文件路径...",
  "寻找组件关系...",
  "链接组件到代码...",
  "提取相关目录...",
  "推理图表内容...",
  "需要提示工程师 -> 查看GitHub",
  "感谢GitIngest的灵感",
  "我需要找到使这更快的方法...",
  "寻找生命的意义...",
  "我累了...",
  "请给我图表...",
  "...现在!",
  "看来不行...",
];

interface LoadingProps {
  cost?: string;
  status:
    | "idle"
    | "started"
    | "explanation_sent"
    | "explanation"
    | "explanation_chunk"
    | "mapping_sent"
    | "mapping"
    | "mapping_chunk"
    | "diagram_sent"
    | "diagram"
    | "diagram_chunk"
    | "complete"
    | "error";
  explanation?: string;
  mapping?: string;
  diagram?: string;
}

const getStepNumber = (status: string): number => {
  if (status.startsWith("diagram")) return 3;
  if (status.startsWith("mapping")) return 2;
  if (status.startsWith("explanation")) return 1;
  return 0;
};

const SequentialDots = () => {
  return (
    <span className="inline-flex w-8 justify-start">
      <span className="flex gap-0.5">
        <span className="h-1 w-1 animate-[dot1_1.5s_steps(1)_infinite] rounded-full bg-purple-500" />
        <span className="h-1 w-1 animate-[dot2_1.5s_steps(1)_infinite] rounded-full bg-purple-500" />
        <span className="h-1 w-1 animate-[dot3_1.5s_steps(1)_infinite] rounded-full bg-purple-500" />
      </span>
    </span>
  );
};

const StepDots = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            step <= currentStep ? "bg-purple-500" : "bg-purple-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function Loading({
  status = "idle",
  explanation,
  mapping,
  diagram,
  cost,
}: LoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 自动滚动效果
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [explanation, mapping, diagram]);

  const shouldShowReasoning = (currentStatus: string) => {
    if (
      currentStatus === "explanation_sent" ||
      (currentStatus.startsWith("explanation") && !explanation)
    ) {
      return "explanation";
    }
    if (
      currentStatus === "mapping_sent" ||
      (currentStatus.startsWith("mapping") && !mapping)
    ) {
      return "mapping";
    }
    if (
      currentStatus === "diagram_sent" ||
      (currentStatus.startsWith("diagram") && !diagram)
    ) {
      return "diagram";
    }
    return null;
  };

  const renderReasoningMessage = () => {
    const reasoningType = shouldShowReasoning(status);
    switch (reasoningType) {
      case "explanation":
        return "模型正在分析仓库结构和代码库...";
      case "mapping":
        return "模型正在识别组件关系和依赖...";
      case "diagram":
        return "模型正在规划图表布局和连接...";
      default:
        return null;
    }
  };

  const getStatusDisplay = () => {
    const reasoningType = shouldShowReasoning(status);
    switch (status) {
      case "explanation_sent":
      case "explanation":
      case "explanation_chunk":
        return {
          text: reasoningType
            ? "模型正在推理仓库结构"
            : "解释仓库结构中...",
          isReasoning: !!reasoningType,
        };
      case "mapping_sent":
      case "mapping":
      case "mapping_chunk":
        return {
          text: reasoningType
            ? "模型正在推理组件关系"
            : "创建组件映射中...",
          isReasoning: !!reasoningType,
        };
      case "diagram_sent":
      case "diagram":
      case "diagram_chunk":
        return {
          text: reasoningType
            ? "模型正在推理图表结构"
            : "生成图表中...",
          isReasoning: !!reasoningType,
        };
      default:
        return {
          text: messages[currentMessageIndex],
          isReasoning: false,
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  const reasoningMessage = renderReasoningMessage();

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-xl border-2 border-purple-200 bg-purple-50/30 backdrop-blur-sm">
        <div className="border-b border-purple-100 bg-purple-100/50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-purple-500">
                {statusDisplay.text}
              </span>
              {statusDisplay.isReasoning && <SequentialDots />}
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-purple-500">
              {cost && <span>估计成本: {cost}</span>}
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-100 px-2 py-0.5">
                  步骤 {getStepNumber(status)}/3
                </span>
                <StepDots currentStep={getStepNumber(status)} />
              </div>
            </div>
          </div>
        </div>

        {/* 可滚动内容 */}
        <div ref={scrollRef} className="max-h-[400px] overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {/* 只在有内容时显示推理消息 */}
            {reasoningMessage &&
              statusDisplay.isReasoning &&
              (explanation ?? mapping ?? diagram) && (
                <div className="rounded-lg bg-purple-100/50 p-4 text-sm text-purple-500">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">推理中</p>
                    <SequentialDots />
                  </div>
                  <p className="mt-2 leading-relaxed">{reasoningMessage}</p>
                </div>
              )}
            {explanation && (
              <div className="rounded-lg bg-white/50 p-4 text-sm text-gray-600">
                <p className="font-medium text-purple-500">解释:</p>
                <p className="mt-2 leading-relaxed">{explanation}</p>
              </div>
            )}
            {mapping && (
              <div className="rounded-lg bg-white/50 p-4 text-sm text-gray-600">
                <p className="font-medium text-purple-500">映射:</p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {mapping}
                </pre>
              </div>
            )}
            {diagram && (
              <div className="rounded-lg bg-white/50 p-4 text-sm text-gray-600">
                <p className="font-medium text-purple-500">
                  Mermaid.js图表:
                </p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {diagram}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
