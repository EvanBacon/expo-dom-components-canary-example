"use dom";

import { StyleNoSelect } from "@/components/NoSelect";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import "@/global.css";

export default function App() {
  return (
    <div className="flex flex-1 h-[100vh] items-center justify-center">
      <StyleNoSelect />
      <Picker data={data} onEmojiSelect={console.log} />
    </div>
  );
}
