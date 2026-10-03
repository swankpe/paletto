import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#d47524",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <div style={{ width: 110, height: 20, background: "white", borderRadius: 6 }} />
        <div style={{ width: 110, height: 20, background: "white", borderRadius: 6 }} />
        <div style={{ width: 110, height: 14, background: "white", borderRadius: 6 }} />
        <div style={{ display: "flex", width: 110, justifyContent: "space-between" }}>
          <div style={{ width: 24, height: 22, background: "white", borderRadius: 4 }} />
          <div style={{ width: 24, height: 22, background: "white", borderRadius: 4 }} />
          <div style={{ width: 24, height: 22, background: "white", borderRadius: 4 }} />
        </div>
      </div>
    ),
    size,
  );
}
