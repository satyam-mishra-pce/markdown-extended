"use client";
import React from "react";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import useMarkdownStore from "@/store/markdown";

const ClearAllDialogContent = () => {
  const setMarkdown = useMarkdownStore((state) => state.setMarkdown);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Clear All Content</DialogTitle>
        <DialogDescription>
          Are you sure you want to clear all content? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={() => setMarkdown("")}>
            Clear All
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default ClearAllDialogContent;
