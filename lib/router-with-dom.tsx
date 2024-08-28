import {
  Link as RouterLink,
  useSegments as useNativeSegments,
} from "expo-router";

import React, { forwardRef } from "react";

export const DomRouterContext = React.createContext<{
  navigate?: typeof import("expo-router").router["navigate"];
}>({});

export const DOMRouterProvider = DomRouterContext.Provider;

// @ts-expect-error
const IS_DOM = typeof ReactNativeWebView !== "undefined";

export const Link = !IS_DOM
  ? RouterLink
  : forwardRef(
      ({ ...props }: {} & import("expo-router").LinkProps<any>, ref) => {
        const domRouter = React.useContext(DomRouterContext);
        return (
          <RouterLink
            ref={ref}
            {...props}
            onPress={
              IS_DOM
                ? (e) => {
                    // NOTE: This is a workaround since Expo Router doesn't have DOM Components support yet.
                    e.preventDefault();
                    domRouter?.navigate?.(props.href);
                  }
                : undefined
            }
          />
        );
      }
    );

export function useSegments() {
  if (IS_DOM) {
    return [];
  }
  return useNativeSegments();
}
