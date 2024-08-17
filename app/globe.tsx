import EchartsGlobe from "@/components/echarts-globe";

export default function App() {
  return (
    <EchartsGlobe
      dom={{
        scrollEnabled: false,
        domStorageEnabled: true,
        javaScriptEnabled: true,
        sharedCookiesEnabled: true,
      }}
    />
  );
}
