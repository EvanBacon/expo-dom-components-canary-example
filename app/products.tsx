"use dom";

import "@/global.css";

import Story from "@/components/mdx/story.mdx";
import { getDOMComponents, MDXComponents } from "@bacons/mdx";
import { Highlight, themes } from "prism-react-renderer";

const webElements = getDOMComponents();

export default function StoryWrapper() {
  // Use the custom image which has support for loading Metro assets.
  const Img = webElements.img;
  // Provide pure DOM elements for the MDX.
  return (
    <div className="p-4 max-w-[100vw]">
      <MDXComponents
        components={{
          // Ensure we use default DOM elements instead of the default universal elements.
          // This is easier to style and results in simpler DOM elements for debugging.
          ...webElements,
          // Good tailwind defaults for MDX.
          img: (props) => <Img {...props} className="max-w-full rounded-md" />,
          h1: (props) => <h1 {...props} className="text-4xl font-bold mb-4" />,
          hr: (props) => <hr {...props} className="my-4 border-gray-300" />,
          p: (props) => <p {...props} className="mb-4" />,
          ul: (props) => <ul {...props} className="list-disc pl-4" />,
          ol: (props) => <ol {...props} className="list-decimal pl-4" />,
          li: (props) => <li {...props} className="mb-2" />,
          a: (props) => <a {...props} className="text-blue-500" />,
          blockquote: (props) => (
            <blockquote
              {...props}
              className="border-l-4 border-gray-300 pl-4 italic"
            />
          ),
          pre: (props) => (
            <pre
              {...props}
              className="bg-white text-white p-4 rounded-md overflow-auto"
            />
          ),
          code: CustomCode,
        }}
      >
        <Story />
      </MDXComponents>
    </div>
  );
}

function CustomCode(props: {
  children: string;
  // language-ts
  className: string;
  // "app.config.ts"
  metastring: string;
  // "html.pre"
  parentName: string;
}) {
  return (
    <Highlight
      theme={themes.vsLight}
      code={props.children.trim()}
      language={props.className.replace(/^language-/, "")}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className="pr-2">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
