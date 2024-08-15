"use dom";

// Import global CSS for this component
import "../global.css";

export default function TailwindExample({}: {
  dom?: import("expo/dom").DOMProps;
}) {
  return (
    <>
      <h1 className="text-4xl text-center">Hello World</h1>
    </>
  );
}
