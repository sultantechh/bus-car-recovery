import { useEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Max automatic retries on load failure (default 3). */
  maxRetries?: number;
  /** Wrapper class for the skeleton/blur container. */
  wrapperClassName?: string;
};

/**
 * Image with an elegant skeleton + blur-up placeholder and automatic retry
 * on load failure (useful on slow / flaky mobile networks).
 */
export function SmartImage({
  src,
  alt,
  maxRetries = 3,
  className,
  wrapperClassName,
  ...rest
}: Props) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Catch loads that already finished before React attached handlers
  // (server-rendered markup, or an image completed while hydrating).
  useEffect(() => {
    const el = imgRef.current;
    if (!el || !el.complete) return;
    if (el.naturalWidth > 0) setLoaded(true);
    else if (attempt < maxRetries) {
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
    <span className={`relative block overflow-hidden ${wrapperClassName ?? className ?? ""}`}>
      {!loaded && (
        <span
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"
        />
      )}
      <img
        key={url}
        ref={imgRef}
        src={url}
        alt={alt}
        onError={onError}
        onLoad={() => setLoaded(true)}
        className={`${className ?? ""} transition-[filter,opacity] duration-500 ${
          loaded ? "blur-0 opacity-100" : "blur-md opacity-0"
        }`}
        {...rest}
      />
    </span>
  );
}
