import { useState, useEffect } from "react";
import Icon from "./Icon";
export default function ProductImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  ) : (
    <div
      className={`${className} flex flex-col items-center justify-center gap-3 bg-lilac text-plum`}
      role="img"
      aria-label={alt}
    >
      <Icon name="box" className="h-10 w-10" />
      <span className="text-xs">Image unavailable</span>
    </div>
  );
}
