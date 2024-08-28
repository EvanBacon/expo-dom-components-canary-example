import "@/global.css";

import { DOMRouterProvider } from "@/lib/router-with-dom";
import { Header, SideNavigationBar } from "@/components/shad-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

import { StyleNoSelect } from "./NoSelect";
import { IS_DOM } from "expo/dom";

export default function ShadLayout({
  navigate,
  children,
}: {
  navigate: typeof import("expo-router").router["navigate"];
  children: React.ReactNode;
}) {
  if (process.env.EXPO_OS === "web" && !IS_DOM) {
    // In standard web, use a partial layout since the shared elements are in the Layout Route.
    return <>{children}</>;
  }

  return <ShadLayoutFull navigate={navigate} children={children} />;
}

export function ShadLayoutFull({
  navigate,
  children,
}: {
  navigate: typeof import("expo-router").router["navigate"];
  children: React.ReactNode;
}) {
  return (
    <>
      <StyleNoSelect />
      <DOMRouterProvider value={{ navigate }}>
        <TooltipProvider>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {!IS_DOM && <SideNavigationBar />}
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              {/* <Header /> */}
              {/* TODO: Migrate to native. */}
              {!IS_DOM && <Header />}

              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </DOMRouterProvider>
    </>
  );
}
