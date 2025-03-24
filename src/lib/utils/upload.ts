export function uploadMarkdown(): Promise<{
  content: string;
  filename: string;
}> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,text/markdown";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject(new Error("No file selected"));

      try {
        const content = await file.text();
        const filename = file.name.replace(/\.md$/, "");
        resolve({ content, filename });
      } catch (error) {
        reject(error);
      }
    };

    input.click();
  });
}
