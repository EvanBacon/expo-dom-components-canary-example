import RemotionRoot from "@/components/remotion/RemotionRoot";

export default function Remotion() {
  return <RemotionRoot dom={{
    mediaPlaybackRequiresUserAction: false,
    allowsInlineMediaPlayback: true,
  }} />;
}