import { useEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Max automatic retries on load failure (default 3). */
  maxRetries?: number;
};

/**
 * Image with automatic retry on load failure.
 * Useful on slow / flaky mobile networks where a request can be dropped.
 * Each retry appends a cache-busting param and backs off exponentially.
 */
export function SmartImage({ src, alt, maxRetries = 3, className, ...rest }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Catch loads that already failed before React attached the error handler
  // (server-rendered markup, or an image finished while hydrating).
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0 && attempt < maxRetries) {
      timer.current = setTimeout(() => setAttempt((a) => a + 1), 400);
    }
  }, [attempt, maxRetries]);


  const onError = () => {
    if (attempt >= maxRetries) {
      setFailed(true);
      return;
    }
    const delay = 600 * 2 ** attempt;
    timer.current = setTimeout(() => setAttempt((a) => a + 1), delay);
  };

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-slate-100 text-[10px] text-slate-400 ${className ?? ""}`}
      >
        Image unavailable
      </div>
    );
  }

  const url = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    <img
      key={url}
      src={url}
      alt={alt}
      onError={onError}
      className={className}
      {...rest}
    />
  );
}
