"use dom";

import "../global.css";

import Story from "@/components/mdx/story.mdx";
import { getDOMComponents, MDXComponents } from "@bacons/mdx";

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
