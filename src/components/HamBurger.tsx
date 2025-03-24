"use client";
import { Menu, Download, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClearAllDialogContent from "@/components/ClearAllDialogContent";
import React, { useCallback } from "react";
import useMarkdownStore from "@/store/markdown";
import { downloadMarkdown } from "@/lib/utils/download";
import { uploadMarkdown } from "@/lib/utils/upload";

const Hamburger = () => {
  const markdown = useMarkdownStore((state) => state.markdown);
  const title = useMarkdownStore((state) => state.title);
  const setMarkdown = useMarkdownStore((state) => state.setMarkdown);
  const setTitle = useMarkdownStore((state) => state.setTitle);

  const handleDownload = () => {
    downloadMarkdown(markdown, title);
  };

  const handleUpload = useCallback(async () => {
    try {
      const { content, filename } = await uploadMarkdown();
      setMarkdown(content);
      setTitle(filename);
    } catch (error) {
      console.error("Failed to upload markdown:", error);
    }
  }, [setMarkdown, setTitle]);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Markdown
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <ClearAllDialogContent />
    </Dialog>
  );
};

export default Hamburger;
