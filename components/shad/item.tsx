"use dom";

import { useEffect, useRef, useState } from "react";
import ShadLayout from "./shad-layout";
import { IS_DOM } from "expo/dom";
import { useGlobalButtonHaptics } from "../global-button-haptics";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Minus, Plus } from "lucide-react";
import { ScrollView } from "react-native";

const baseUrl = IS_DOM ? process.env.EXPO_DOM_BASE_URL : "";

export default function ItemRoute({
  item,
  navigate,
  onButtonClick,
  onHeightChange,
}: {
  item: any;
  navigate: (typeof import("expo-router").router)["navigate"];
  dom?: import("expo/dom").DOMProps;
  ref?: import("react").RefObject<import("react-native-webview").WebView>;
  onHeightChange?: (height: number) => void;
  onButtonClick: (size: number) => Promise<void>;
}) {
  useGlobalButtonHaptics(onButtonClick);
  const [order, setOrder] = useState<Order>({
    size: "",
    doughType: "",
    toppings: [],
    isSliced: null,
    quantity: 1,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sizeRef = useRef<HTMLDivElement>(null);
  const doughTypeRef = useRef<HTMLDivElement>(null);
  const sliceRef = useRef<HTMLDivElement>(null);

  const basePrice = 82;
  const totalPrice =
    (SIZES.find((s) => s.value === order.size)?.price || 0) +
    TOPPINGS.filter((t) => order.toppings.includes(t.id)).reduce(
      (sum, t) => sum + t.price,
      0,
    ) +
    basePrice;

  const updateOrder = (key: keyof Order, value: any) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => prev.filter((error) => error !== key));
  };

  const handleQuantityChange = (delta: number) => {
    setOrder((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleAddToCart = () => {
    const errors: string[] = [];
    if (!order.size) errors.push("size");
    if (!order.doughType) errors.push("doughType");
    if (order.isSliced === null) errors.push("isSliced");

    if (errors.length > 0) {
      setValidationErrors(errors);
      const firstErrorRef =
        errors[0] === "size"
          ? sizeRef
          : errors[0] === "doughType"
          ? doughTypeRef
          : sliceRef;
      firstErrorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      alert(
        `הזמנה נוספה: ${order.quantity} פיצות, מחיר כולל: ₪${(
          totalPrice * order.quantity
        ).toFixed(2)}`,
      );
    }
  };

  const handleLayout = (event: any) => {
    onHeightChange?.(event.nativeEvent.layout.height);
  };

  return (
    <ShadLayout navigate={navigate}>
      <ScrollView
        onLayout={handleLayout}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
          paddingBottom: 24,
          backgroundColor: "white",
          direction: "rtl",
        }}
        scrollEnabled={false}
      >
        <div className="w-full max-w-md mx-auto p-6 -mt-4">
          <article className="mb-6">
            <header className="flex justify-between items-start mb-4">
              <div className="text-right">
                <div className="flex items-center mt-1 justify-end">
                  <span className="text-xl font-bold text-[#FF8000]">
                    ₪{item?.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through mr-2">
                    ₪{item?.price.toFixed(2)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-[#FFF0E0] text-[#FF8000] mr-2"
                  >
                    פופולרי
                  </Badge>
                </div>
              </div>
            </header>
            <p className="text-sm text-gray-600 text-right">
              {item?.description}
            </p>
          </article>
          <form className="space-y-6 p-2 mb-20">
            <div
              ref={sizeRef}
              className={`transition-all duration-300 ${
                validationErrors.includes("size") ? "animate-shake" : ""
              }`}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
                בחר את הגודל שלך
              </h3>
              <RadioGroup
                value={order.size}
                onValueChange={(value) => updateOrder("size", value)}
                className="flex flex-col space-y-2"
              >
                {SIZES.map((sizeOption) => (
                  <div
                    key={sizeOption.value}
                    className="flex items-center space-x-2"
                  >
                    <Label
                      htmlFor={`size-${sizeOption.value}`}
                      className={`flex items-center justify-end space-x-2  w-full ${
                        validationErrors.includes("size")
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <span className="text-xs text-gray-500">
                        {`${
                          sizeOption.price > 0
                            ? `(+₪${sizeOption.price})`
                            : sizeOption.price < 0
                            ? `(-₪${Math.abs(sizeOption.price)})`
                            : ""
                        }`}
                      </span>
                      <span className="text-sm font-semibold">
                        {sizeOption.label}
                      </span>
                    </Label>
                    <RadioGroupItem
                      value={sizeOption.value}
                      id={`size-${sizeOption.value}`}
                      className="w-5 h-5"
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div
              ref={doughTypeRef}
              className={`transition-all duration-300 ${
                validationErrors.includes("doughType") ? "animate-shake" : ""
              }`}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
                סוג בצק
              </h3>
              <RadioGroup
                value={order.doughType}
                onValueChange={(value) => updateOrder("doughType", value)}
                className="flex flex-col space-y-2"
              >
                {DOUGH_TYPES.map((dough) => (
                  <div
                    key={dough.value}
                    className="flex items-center space-x-2"
                  >
                    <Label
                      htmlFor={`dough-${dough.value}`}
                      className={`flex items-center justify-end w-full ${
                        validationErrors.includes("doughType")
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {dough.label}
                      </span>
                    </Label>
                    <RadioGroupItem
                      value={dough.value}
                      id={`dough-${dough.value}`}
                      className="w-5 h-5"
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
                תוספות
              </h3>
              <div className="space-y-2">
                {TOPPINGS.map((topping) => (
                  <div
                    key={topping.id}
                    className="flex items-center space-x-reverse space-x-2"
                  >
                    <Checkbox
                      id={topping.id}
                      checked={order.toppings.includes(topping.id)}
                      onCheckedChange={(checked) => {
                        const newToppings = checked
                          ? [...order.toppings, topping.id]
                          : order.toppings.filter((id) => id !== topping.id);
                        updateOrder("toppings", newToppings);
                      }}
                      className="border-[#FF8000] text-[#FF8000] hover:bg-[#FFF0E0] transition-colors duration-200 w-6 h-6"
                    />
                    <Label
                      htmlFor={topping.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {topping.label}{" "}
                      <span className="text-sm text-gray-500">
                        (₪{topping.price.toFixed(2)}+)
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div
              ref={sliceRef}
              className={`transition-all duration-300 ${
                validationErrors.includes("isSliced") ? "animate-shake" : ""
              }`}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 text-right">
                לחתוך?
              </h3>
              <RadioGroup
                value={order.isSliced ? "slice" : "not-slice"}
                onValueChange={(value) =>
                  updateOrder("isSliced", value === "slice")
                }
                className="flex flex-col space-y-2"
              >
                {[
                  { value: "not-slice", label: "לא לחתוך" },
                  { value: "slice", label: "לחתוך" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Label
                      htmlFor={`slice-${option.value}`}
                      className={`flex items-center justify-end w-full ${
                        validationErrors.includes("isSliced")
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>
                    </Label>
                    <RadioGroupItem
                      value={option.value}
                      id={`slice-${option.value}`}
                      className="w-5 h-5"
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </form>
        </div>
      </ScrollView>
    </ShadLayout>
  );
}

interface Order {
  size: string;
  doughType: string;
  toppings: string[];
  isSliced: boolean | null;
  quantity: number;
}

const SIZES = [
  { value: "S", label: "S", price: -10 },
  { value: "M", label: "M", price: 0 },
  { value: "L", label: "L", price: 15 },
  { value: "XL", label: "XL", price: 30 },
];

const DOUGH_TYPES = [
  { value: "regular", label: "רגיל" },
  { value: "thin", label: "דק" },
  { value: "thick", label: "עבה" },
];

const TOPPINGS = [
  { id: "extra-cheese", label: "תוספת גבינה", price: 5 },
  { id: "olives", label: "זיתים", price: 3 },
  { id: "peppers", label: "פלפלים", price: 3 },
];
