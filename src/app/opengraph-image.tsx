import { ImageResponse } from "next/og";

export const alt = "Paletto — Achetez et vendez des palettes entre particuliers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #fbf8f3 0%, #f9e8d4 60%, #f2cfa6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              background: "#d47524",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div style={{ width: 52, height: 9, background: "white", borderRadius: 3 }} />
            <div style={{ width: 52, height: 9, background: "white", borderRadius: 3 }} />
            <div style={{ display: "flex", width: 52, justifyContent: "space-between" }}>
              <div style={{ width: 11, height: 11, background: "white", borderRadius: 2 }} />
              <div style={{ width: 11, height: 11, background: "white", borderRadius: 2 }} />
              <div style={{ width: 11, height: 11, background: "white", borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#1c1917" }}>Paletto</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, color: "#1c1917", lineHeight: 1.05, maxWidth: 950 }}>
            Vos palettes méritent une seconde vie.
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: "#57534e" }}>
            Achetez, vendez ou donnez des palettes entre particuliers — gratuit et local.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["100 % gratuit", "Sans commission", "Près de chez vous"].map((label) => (
            <div
              key={label}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                background: "#1a382a",
                color: "white",
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
