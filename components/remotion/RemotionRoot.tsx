
"use dom";

import { Logo } from "@/components/remotion/logo/Logo";
import { Player } from "@remotion/player";
import "@/global.css";
import { HelloWorld } from "@/components/remotion/helloworld/HelloWorld";
import ThreeRemotion from "@/components/remotion/three/Scene";

export default function Remotion({dom}:{
    dom: import("expo/dom").DOMProps
}) {
  return <div className="flex flex-1 h-[100vh] flex-col gap-3  bg-slate-50 p-3">
    <div>
      <h1 className="text-lg font-bold mb-2 text-slate-800">
        Remotion Player Demo (Hello World)
      </h1>
      <div className="md:w-1/3">
        <Player
          component={HelloWorld}
          style={{ width: "100%" }}
          className="bg-slate-100 w-full"
          durationInFrames={150}
          compositionWidth={1920}
          compositionHeight={1080}
          inputProps={{
            titleText: "Welcome to Remotion in Expo 🫨",
            titleColor: "#000000",
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
          autoPlay
          loop
          fps={30}
        />
      </div>
    </div>
    <div>
      <h1 className="text-lg font-bold mb-2 text-slate-800">
        Remotion Player Demo (Logo) (With controls)
      </h1>
      <div className="md:w-1/3">

        <Player
          component={Logo}
          style={{ width: "100%" }}
          className="bg-slate-100"
          durationInFrames={150}
          compositionWidth={1920}
          compositionHeight={1080}
          inputProps={{
            logoColor1: "red",
            logoColor2: "blue",
          }}
          controls
          autoPlay
          loop
          fps={30}
        />
      </div>
    </div>
       <div>
      <h1 className="text-lg font-bold mb-2 text-slate-800">
        Remotion Player Demo (Three)
      </h1>
      <div className="md:w-1/3">

        <Player
          component={ThreeRemotion}
          style={{ width: "100%" }}
          className="bg-slate-100"
          durationInFrames={300}
          compositionWidth={1280}
          compositionHeight={720}
          inputProps={{
            phoneColor: "rgba(110, 152, 191, 0.00)" as const,
            baseScale: 1,
          }}

          autoPlay={true}
          loop={true}
          fps={30}
        />
      </div>
    </div>
  </div>
}
