"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import useMarkdownStore from "@/store/markdown";
export default function ResizableImage({
  src,
  alt,
  id,
  widthPercentage,
  index,
  readonly,
}: {
  src: string;
  alt: string;
  id: string;
  widthPercentage: number;
  index: number;
  readonly: boolean;
}) {
  const [width, setWidth] = useState<number>(widthPercentage ?? 50);
  const widthRef = useRef(width);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const setImageWidthInMarkdown = useMarkdownStore(
    (state) => state.setImageWidthInMarkdown
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      if (readonly) return;
      e.preventDefault();

      const startX = e.pageX;
      const imageElement = e.currentTarget.parentElement?.querySelector("img");
      const startWidthPercent =
        widthRef.current ??
        ((imageElement?.offsetWidth || 0) / containerWidth) * 100;

      const isLeftHandle = (e.target as HTMLElement).classList.contains(
        "left-handle"
      );

      const handleMouseMove = (e: MouseEvent) => {
        const delta = e.pageX - startX;
        const factor = 2;
        const pixelChange = delta * factor;
        const percentageChange = (pixelChange / containerWidth) * 100;

        const newWidth =
          startWidthPercent +
          (isLeftHandle ? -percentageChange : percentageChange);
        setWidth(Math.min(Math.max(newWidth, 0), 100));
      };

      const handleMouseUp = () => {
        setImageWidthInMarkdown({ id, index }, widthRef.current);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [containerWidth, id, index, setImageWidthInMarkdown]
  );

  return (
    <div
      ref={containerRef}
      className="image-container w-full flex items-center justify-center"
      id={id}
      data-image-index={index}
    >
      <div
        className="group min-w-24 max-w-full relative hover:ring-8 hover:ring-primary/10 hover:shadow-lg rounded-xl overflow-hidden transition-colors"
        style={{ width: width ? `${width}%` : undefined }}
      >
        <img src={src} alt={alt} className="w-full h-auto duration-200" />
        {!readonly && (
          <>
            <div
              className="left-handle absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-12 max-h-full cursor-w-resize opacity-0 group-hover:opacity-100 bg-neutral-500/80 backdrop-blur-md hover:brightness-110 hover:scale-105 duration-200 rounded-full"
              style={{
                transitionProperty: "opacity, scale, filter",
              }}
              onMouseDown={startResize}
            />
            <div
              className="right-handle absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-12 max-h-full cursor-e-resize opacity-0 group-hover:opacity-100 bg-neutral-500/80 backdrop-blur-md hover:brightness-110 hover:scale-105 duration-200 rounded-full"
              style={{
                transitionProperty: "opacity, scale, filter",
              }}
              onMouseDown={startResize}
            />
          </>
        )}
      </div>
    </div>
  );
}
