import FlowDemo from "@/components/flow/flow";

export default function App() {
  return (
    <FlowDemo
      dom={{
        style: { flex: 1, backgroundColor: "blue" },
        scrollEnabled: false,
      }}
    />
  );
}
