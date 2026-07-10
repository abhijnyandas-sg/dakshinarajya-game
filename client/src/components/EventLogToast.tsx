import { useState, useEffect } from "react";
import { LogEntry } from "@dakshina/shared";

interface Props {
  log: LogEntry[];
}

interface ToastItem extends LogEntry {
  id: number;
}

export function EventLogToast({ log }: Props) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [lastSeenLength, setLastSeenLength] = useState(log.length);

  useEffect(() => {
    if (log.length > lastSeenLength) {
      // New logs arrived!
      const newEntries = log.slice(lastSeenLength).map((entry, idx) => ({
        ...entry,
        id: Date.now() + idx, // unique ID for animation keying
      }));
      
      setToasts((prev) => [...prev, ...newEntries]);
      setLastSeenLength(log.length);
    }
  }, [log, lastSeenLength]);

  // Cleanup old toasts after 3.5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    
    const oldest = toasts[0];
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== oldest.id));
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="dr-event-toasts">
      {toasts.map((t) => {
        // Determine type of toast based on text for styling
        const isNegative = t.text.includes("pays") || t.text.includes("warns") || t.text.includes("-") || t.text.includes("lost");
        const isPositive = t.text.includes("gains") || t.text.includes("+") || t.text.includes("reward");
        
        let typeClass = "";
        if (isNegative) typeClass = "dr-toast-neg";
        else if (isPositive) typeClass = "dr-toast-pos";
        
        return (
          <div key={t.id} className={`dr-toast-item ${typeClass}`}>
            {t.text}
          </div>
        );
      })}
    </div>
  );
}
