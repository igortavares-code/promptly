import React from "react";
import { Text as RNText, TextProps } from "react-native";

type Props = TextProps & {
  weight?: "regular" | "bold";
};

export default function Text({ weight = "regular", style, ...props }: Props) {
  const fontFamily = weight === "bold" ? "WorkSans-Bold" : "WorkSans-Regular";

  return <RNText {...props} style={[{ fontFamily }, style]} />;
}