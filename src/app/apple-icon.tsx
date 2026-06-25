import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#64B26A",
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Hammer head */}
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 28,
          width: 85,
          height: 45,
          background: "white",
          borderRadius: 8,
        }}
      />
      {/* Hammer head extension */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 39,
          width: 50,
          height: 23,
          background: "white",
          borderRadius: 6,
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          left: 51,
          top: 68,
          width: 22,
          height: 78,
          background: "white",
          borderRadius: 8,
        }}
      />
    </div>,
    size,
  );
}
