import { create } from "zustand";
import { devtools } from "zustand/middleware";
import preParse from "@/store/utils/pre-parse";

type State = {
  title: string;
  markdown: string;
  cleanMarkdown: string;
  imagesMetadata: ImageMetadata[];
};

type Action = {
  setTitle: (title: string) => void;
  setMarkdown: (markdown: string) => void;
  setImageWidthInMarkdown: (
    metadata: { id: string; index: number },
    width: number
  ) => void;
  reset: () => void;
};

export type ImageMetadata = {
  id: string;
  width: number;
  src: string;
  alt: string;
};

const useMarkdownStore = create<State & Action>()(
  devtools(
    (set, get) => ({
      title: "Untitled",
      markdown: "",
      cleanMarkdown: "",
      imagesMetadata: [],
      setTitle: (title) => {
        set({ title });
      },
      setMarkdown: (markdown) => {
        const { cleanMarkdown, imagesMetadata } = preParse(markdown);
        set({
          markdown,
          cleanMarkdown,
          imagesMetadata,
        });
      },
      setImageWidthInMarkdown: (metadata, width) => {
        const { markdown } = get();

        // Replace the nth occurrence of an image with the new syntax
        let index = 0;
        const newMarkdown = markdown.replace(
          /!\[(.*?)\]\((.*?)\)(?:\{[\w\-]+:\d+\})?/g,
          (match, alt, src) => {
            if (index === metadata.index) {
              // This is our target image, update it with new width
              return `![${alt}](${src}){${metadata.id}:${Math.round(width)}}`;
            }
            index++;
            return match; // Keep other images unchanged
          }
        );

        // Update the store with new markdown
        get().setMarkdown(newMarkdown);
      },
      reset: () => {
        set({
          markdown: "",
          cleanMarkdown: "",
          imagesMetadata: [],
          title: "Untitled",
        });
      },
    }),
    {
      name: "markdown-store",
    }
  )
);

export default useMarkdownStore;
