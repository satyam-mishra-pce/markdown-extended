"use client";

import { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
} from "lucide-react";
import { Button } from "./ui/button";
import useMarkdownStore from "@/store/markdown";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}

export default function MarkdownEditor() {
  const markdown = useMarkdownStore((state) => state.markdown);
  const setMarkdown = useMarkdownStore((state) => state.setMarkdown);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [codeLanguage, setCodeLanguage] = useState<string>("javascript");

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    const newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case "bold":
        insertText("**", "**");
        break;
      case "italic":
        insertText("*", "*");
        break;
      case "h1":
        insertText("# ");
        break;
      case "h2":
        insertText("## ");
        break;
      case "h3":
        insertText("### ");
        break;
      case "ul":
        insertText("- ");
        break;
      case "ol":
        insertText("1. ");
        break;
      case "link":
        insertText("[", "](url)");
        break;
      case "image":
        insertText("![alt text](", ")");
        break;
      case "code":
        insertText("```" + codeLanguage + "\n", "\n```");
        break;
      case "quote":
        insertText("> ");
        break;
      default:
        break;
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCodeLanguage(e.target.value);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: file,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return data.link;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  }, []);

  function generateUploadId() {
    return btoa(Math.random().toString()).substring(0, 10);
  }

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const textarea = textareaRef.current;
      if (!textarea || document.activeElement !== textarea) {
        return;
      }

      const items = e.clipboardData.items;
      for (const item of items) {
        if (!item.type.match(/^image\/(png|jpeg|gif|webp)$/)) {
          continue;
        }

        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const uploadId = generateUploadId();
        const uploadingText = `![Uploading Image ${uploadId}]()`;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          markdown.substring(0, start) +
          uploadingText +
          markdown.substring(end);

        setMarkdown(newText);

        try {
          const imageUrl = await handleImageUpload(file);
          if (!imageUrl) {
            const updatedText = newText.replace(uploadingText, "");
            setMarkdown(updatedText);
            return;
          }

          const finalImageText = `![Image](${imageUrl}){${uploadId}:50}`;
          const textWithImage = newText.includes(uploadingText)
            ? newText.replace(uploadingText, finalImageText)
            : markdown + "\n" + finalImageText;

          setMarkdown(textWithImage);
        } catch (error) {
          console.error("Failed to handle image paste:", error);
          const updatedText = newText.replace(uploadingText, "");
          setMarkdown(updatedText);
        }

        break;
      }
    },
    [markdown, setMarkdown, handleImageUpload]
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex shadow-sm items-center flex-wrap gap-1 p-2 bg-background rounded-2xl border border-border min-h-16">
        <ToolbarButton
          icon={<Bold size={18} />}
          onClick={() => handleToolbarAction("bold")}
          tooltip="Bold"
        />
        <ToolbarButton
          icon={<Italic size={18} />}
          onClick={() => handleToolbarAction("italic")}
          tooltip="Italic"
        />
        <ToolbarButton
          icon={<Heading1 size={18} />}
          onClick={() => handleToolbarAction("h1")}
          tooltip="Heading 1"
        />
        <ToolbarButton
          icon={<Heading2 size={18} />}
          onClick={() => handleToolbarAction("h2")}
          tooltip="Heading 2"
        />
        <ToolbarButton
          icon={<Heading3 size={18} />}
          onClick={() => handleToolbarAction("h3")}
          tooltip="Heading 3"
        />
        <ToolbarButton
          icon={<List size={18} />}
          onClick={() => handleToolbarAction("ul")}
          tooltip="Unordered List"
        />
        <ToolbarButton
          icon={<ListOrdered size={18} />}
          onClick={() => handleToolbarAction("ol")}
          tooltip="Ordered List"
        />
        <ToolbarButton
          icon={<Link size={18} />}
          onClick={() => handleToolbarAction("link")}
          tooltip="Link"
        />
        <ToolbarButton
          icon={<Image size={18} />}
          onClick={() => handleToolbarAction("image")}
          tooltip="Image"
        />
        <div className="flex items-center">
          <ToolbarButton
            icon={<Code size={18} />}
            onClick={() => handleToolbarAction("code")}
            tooltip="Code Block"
          />
          <select
            value={codeLanguage}
            onChange={handleLanguageChange}
            className="ml-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5"
          >
            <option value="javascript">JavaScript</option>
            <option value="jsx">JSX</option>
            <option value="typescript">TypeScript</option>
            <option value="tsx">TSX</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="swift">Swift</option>
            <option value="bash">Bash</option>
            <option value="sql">SQL</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
        <ToolbarButton
          icon={<Quote size={18} />}
          onClick={() => handleToolbarAction("quote")}
          tooltip="Blockquote"
        />
      </div>
      <textarea
        ref={textareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        onPaste={handlePaste}
        className="p-4 font-mono resize-none rounded-2xl grow"
        placeholder="Type your markdown here..."
      />
    </div>
  );
}

function ToolbarButton({ icon, onClick, tooltip }: ToolbarButtonProps) {
  return (
    <Button variant="ghost" onClick={onClick} title={tooltip}>
      {icon}
    </Button>
  );
}
