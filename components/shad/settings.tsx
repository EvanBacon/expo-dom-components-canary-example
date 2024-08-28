"use dom";

import ShadLayout from "../shad-layout";
import StoryWrapper from "../mdx/mdx-route";

export default function SettingsRoute({
  navigate,
}: {
  navigate: typeof import("expo-router").router["navigate"];
  dom?: import("expo/dom").DOMProps;
}) {
  return (
    <ShadLayout navigate={navigate}>
      <StoryWrapper />
    </ShadLayout>
  );
}
