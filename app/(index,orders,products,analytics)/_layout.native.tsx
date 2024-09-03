import { Link, Slot, Stack } from "expo-router";
import { Image } from "react-native";
import { TouchableImpact } from "@/components/touchable-impact";

export default function RootLayout({ segment }: { segment: string }) {
  // TODO: Add header bar
  // return <Slot />;

  const initialScreenName = segment.replace(
    /\((.+)\)/,
    "$1"
  ) as keyof typeof titles;
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#FAFBFC",
        },
      }}
    >
      <Stack.Screen
        name={initialScreenName}
        options={{
          title: titles[initialScreenName],
          headerLargeTitle: true,
          headerSearchBarOptions: {},
          headerRight() {
            return <ProfileButton segment={segment} />;
          },

          //
          ...(initialScreenName !== "index"
            ? {
                headerLargeTitle: undefined,
                headerSearchBarOptions: undefined,
              }
            : {}),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          presentation: "modal",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}

function ProfileButton({ segment }: { segment: string }) {
  return (
    <Link href={`/${segment}/settings`} asChild>
      <TouchableImpact
        style={{
          aspectRatio: 1,
        }}
      >
        <Image
          style={{
            width: 30,
            height: 30,
            aspectRatio: 1,
            borderRadius: 24,
          }}
          source={require("@/public/evanbacon.jpg")}
        />
      </TouchableImpact>
    </Link>
  );
}

export const unstable_settings = {
  initialRouteName: "index",
  orders: {
    initialRouteName: "orders",
  },
  products: {
    initialRouteName: "products",
  },
  analytics: {
    initialRouteName: "analytics",
  },
};

const titles = {
  index: "Dashboard",
  orders: "Orders",
  products: "Products",
  analytics: "Analytics",
};
