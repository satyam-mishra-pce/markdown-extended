import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const CodeBlock = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeElement = codeRef.current;
    if (!codeElement) return;
    const code = codeElement.innerText;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <pre className={cn("relative group", className)}>
      <code ref={codeRef}>{children}</code>
      <Button
        variant="outline"
        size={"sm"}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
        onClick={handleCopy}
        disabled={copied}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </Button>
    </pre>
  );
};

export default CodeBlock;
