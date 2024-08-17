"use dom";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TipTapWrap({
  content,
}: {
  content: string;
  dom?: import("expo/dom").DOMProps;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
