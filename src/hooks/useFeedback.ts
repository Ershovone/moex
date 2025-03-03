// src/hooks/useFeedback.ts

import { useState, useCallback } from "react";

type FeedbackSeverity = "success" | "error" | "info" | "warning";

interface FeedbackState {
  open: boolean;
  message: string;
  severity: FeedbackSeverity;
}

interface UseFeedbackReturn {
  feedback: FeedbackState;
  showFeedback: (message: string, severity?: FeedbackSeverity) => void;
  closeFeedback: () => void;
}

/**
 * Хук для показа уведомлений об операциях
 */
const useFeedback = (): UseFeedbackReturn => {
  const [feedback, setFeedback] = useState<FeedbackState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showFeedback = useCallback(
    (message: string, severity: FeedbackSeverity = "success") => {
      setFeedback({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const closeFeedback = useCallback(() => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    feedback,
    showFeedback,
    closeFeedback,
  };
};

export default useFeedback;
