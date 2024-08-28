import SettingsRoute from "@/components/shad/settings";
import { router } from "expo-router";

export default function Settings() {
  return (
    <SettingsRoute
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
      }}
    />
  );
}

// import { ScrollView } from "react-native";
// import MapView from "react-native-maps";
// import TipTapWrap from "@/components/tiptap-wrap";
// export default function Settings() {
//   return (
//     <ScrollView contentInsetAdjustmentBehavior="automatic">
//       <MapView
//         style={{ height: 200, minHeight: 200 }}
//         initialRegion={{
//           latitude: 30.27462842088456,
//           longitude: -97.7403959609991,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       />
//       <TipTapWrap
//         dom={{ style: { height: 500 }, scrollEnabled: false }}
//         content={`
//   <p>Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems to work.</p>
//   <p>By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It’s configurable though.</p>
//   <p><strong>This is bold.</strong></p>
//   <p><u>This is underlined though.</u></p>
//   <p><em>This is italic.</em></p>
//   <p><s>But that’s striked through.</s></p>
//   <p><code>This is code.</code></p>
//       `}
//       />
//     </ScrollView>
//   );
// }
