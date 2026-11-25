import { ImageResponse } from "next/og";
import { company, formulas } from "@/content/site-data";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0f0f0f 0%, #2a2a2a 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>{company.name}</div>
        <div style={{ fontSize: 30, marginTop: 20, color: "#8cc8ff" }}>{company.activity}</div>
        <div style={{ fontSize: 22, marginTop: 8, color: "rgba(255,255,255,0.7)" }}>
          {company.zone}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: 14,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {company.slogan}
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 28, fontWeight: 700 }}>
          {formulas.map((f) => `${f.name} ${f.priceFrom} €`).join("  ·  ")}
        </div>
      </div>
    ),
    { ...size }
  );
}
