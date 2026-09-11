import { ImageResponse } from "next/og";
import { company } from "@/content/site-data";

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
          background: "#0a1730",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>{company.name}</div>
        <div style={{ fontSize: 30, marginTop: 20, color: "#8cc8ff" }}>{company.activity}</div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: 14,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {`« ${company.slogan} »`}
        </div>
      </div>
    ),
    { ...size }
  );
}
