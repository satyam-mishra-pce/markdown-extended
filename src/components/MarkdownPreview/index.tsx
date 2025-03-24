"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ResizableImage from "./ResizableImage";
import { useState } from "react";
import useMarkdownStore from "@/store/markdown";
import RenameFileDialog from "./RenameFileDialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import CodeBlock from "./Codeblock";
import styles from "./markdown.module.css";
import { Switch } from "../ui/switch";

export default function MarkdownPreview() {
  const cleanMarkdown = useMarkdownStore((state) => state.cleanMarkdown);
  const imagesMetadata = useMarkdownStore((state) => state.imagesMetadata);
  const title = useMarkdownStore((state) => state.title);
  let imageIndex = 0;

  const [readonly, setReadonly] = useState(false);

  return (
    <div className="flex flex-col gap-2 overflow-auto">
      <div className="sticky top-0 w-full p-2 z-20 bg-gradient-to-b from-background to-transparent">
        <div className="flex shadow-sm items-center justify-between gap-1 p-2 px-6 bg-background rounded-2xl border border-border min-h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{title}</h1>
            <RenameFileDialog asChild>
              <Button variant="ghost">
                <Pencil size={18} />
              </Button>
            </RenameFileDialog>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="readonly" className="text-sm">
              Readonly
            </label>
            <Switch
              id="readonly"
              checked={readonly}
              onCheckedChange={setReadonly}
            />
          </div>
        </div>
      </div>
      <div className={`${styles["markdown-preview"]} p-4`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => {
              return <div className="my-1 leading-tight">{children}</div>;
            },
            img: () => {
              const metadata = imagesMetadata[imageIndex++];
              if (!metadata) return null;
              return (
                <ResizableImage
                  src={metadata.src}
                  alt={metadata.alt}
                  id={metadata.id}
                  widthPercentage={metadata.width}
                  index={imageIndex - 1}
                  readonly={readonly}
                />
              );
            },
            // code: ({ className, children, ...props }) => (
            //   <CodeBlock className={className}>
            //     {String(children).replace(/\n$/, "")}
            //   </CodeBlock>
            // ),
            pre: ({
              className,
              children,
            }: {
              className?: string;
              children?: React.ReactNode;
            }) => <CodeBlock className={className}>{children}</CodeBlock>,
          }}
        >
          {cleanMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
