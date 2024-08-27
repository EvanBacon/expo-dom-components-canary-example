import MdxDom from "@/components/mdx/mdx-route";

export default function App() {
  return (
    <MdxDom
      dom={{
        menuItems: [
          { label: "Post 𝕏", key: "post" },
          { label: "Save for later", key: "saveForLater" },
        ],
        onCustomMenuSelection: (webViewEvent) => {
          const { label } = webViewEvent.nativeEvent; // The name of the menu item, i.e. 'Tweet'
          const { key } = webViewEvent.nativeEvent; // The key of the menu item, i.e. 'tweet'
          const { selectedText } = webViewEvent.nativeEvent; // Text highlighted
          console.log(label, key, selectedText);
        },
      }}
    />
  );
}
