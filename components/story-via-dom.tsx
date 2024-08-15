"use dom";

import "../global.css";

import { MDXComponents, getDOMComponents } from "@bacons/mdx";

import Story from "@/components/mdx/story.mdx";

const webElements = getDOMComponents();

export default function StoryWrapper() {
  // Provide pure DOM elements for the MDX.
  return (
    <div className="p-4">
      <MDXComponents
        components={{
          ...webElements,
          h1: (props) => <h1 {...props} className="text-2xl font-bold" />,
        }}
      >
        <Story />
      </MDXComponents>
    </div>
  );
}
