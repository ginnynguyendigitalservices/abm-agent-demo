import { ImageResponse } from "next/og";

export const alt = "ABM Agent Demo — by Ginny Nguyen";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          backgroundColor: "#0a0b14",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(245,158,11,0.18) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(16,185,129,0.18) 0%, transparent 50%)",
          fontFamily: "Inter",
          color: "#f5f5f7",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 20,
            color: "#a0a0b0",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#f59e0b" }}>●</span> Built for Prismic · AI
          Solutions Engineer
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>The self-serve&nbsp;</span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f59e0b 0%, #8b5cf6 50%, #10b981 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              aha moment
            </span>
            <span>&nbsp;Prismic doesn&rsquo;t have.</span>
          </div>

          <div
            style={{
              fontSize: 26,
              color: "#a0a0b0",
              lineHeight: 1.4,
              maxWidth: 960,
            }}
          >
            Enter a company URL. Get a personalised landing page and a
            quantified growth brief in ~60 seconds.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#a0a0b0",
          }}
        >
          <span>by Ginny Nguyen</span>
          <span style={{ color: "#8b5cf6" }}>
            ginny-nguyen-abm-demo.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
