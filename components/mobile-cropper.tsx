"use dom";

import { CropperRef, Cropper } from "react-mobile-cropper";
// import "react-mobile-cropper/dist/style.css";

export default function CropPage({
  image,
}: {
  image: string;
  dom?: import("expo/dom").DOMProps;
}) {
  const onChange = (cropper: CropperRef) => {
    console.log(cropper.getCoordinates(), cropper.getCanvas());
  };

  return <Cropper src={image} onChange={onChange} className={"cropper"} />;
}
