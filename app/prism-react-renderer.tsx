import SyntaxComponent from "@/components/syntax/syntax";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, padding: 8 }}>
      <SyntaxComponent
        code={`
import Syntax from "@/syntax";

export default function App() {
  return (
    <Syntax
      code="console.log('hello')"
      dom={{ scrollEnabled: false }}
    />
  );
}`}
        dom={{
          scrollEnabled: false,
        }}
      />
    </View>
  );
}
