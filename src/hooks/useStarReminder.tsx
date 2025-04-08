"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useStarReminder() {
  useEffect(() => {
    // 检查我们是否已经显示过此提示
    const hasShownStarReminder = localStorage.getItem("hasShownStarReminder");

    if (!hasShownStarReminder) {
      // 设置一个定时器，在3秒后显示提示
      const timeoutId = setTimeout(() => {
        toast("Enjoying GitDiagram?", {
          action: {
            label: "Star ★",
            onClick: () =>
              window.open(
                "https://github.com/ahmedkhaleel2004/gitdiagram",
                "_blank",
              ),
          },
          duration: 5000,
          dismissible: true,
        });

        // 在localStorage中设置标志，防止再次显示
        localStorage.setItem("hasShownStarReminder", "true");
      }, 5000);

      // 如果组件卸载，清除定时器
      return () => clearTimeout(timeoutId);
    }
  }, []);
}
