"use dom";

import ShadLayout from "./shad-layout";
import StoryWrapper from "../mdx/mdx-route";
// import { useEffect } from "react";

export default function SettingsRoute({
  navigate,
}: {
  navigate: typeof import("expo-router").router["navigate"];
  dom?: import("expo/dom").DOMProps;
}) {
  // useEffect(() => {
  //   import("eruda").then((eruda) => eruda.default.init());
  // }, []);

  return (
    <ShadLayout navigate={navigate} select>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <StoryWrapper />
        </div>
      </main>
    </ShadLayout>
  );
}
