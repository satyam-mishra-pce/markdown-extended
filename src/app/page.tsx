import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";

export default function Home() {
  return (
    <div className="grid grid-cols-2 divide-x">
      <MarkdownEditor />
      <MarkdownPreview />
    </div>
  );
}
