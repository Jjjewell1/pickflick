import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "PickFlick — Movie night, decided together";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const bulbs = Array.from({ length: 24 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background:
            "linear-gradient(160deg, #2a0a12 0%, #0d0508 45%, #150407 100%)",
          overflow: "hidden",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -180,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,30,58,0.45) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: -200,
            width: 680,
            height: 680,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,197,24,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Velvet curtain */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 130,
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #8B1528 0%, #A01C32 40%, #6e0f1f 100%)",
            boxShadow: "0 14px 40px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.25) 100%)",
            }}
          />
          {/* Scalloped fringe */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: 42,
            }}
          >
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 42,
                  background: "linear-gradient(180deg, #A01C32 0%, #5c0a18 100%)",
                  borderBottomLeftRadius: 22,
                  borderBottomRightRadius: 22,
                  marginLeft: -2,
                  marginRight: -2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Film strip — left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "150px 0",
            background: "rgba(0,0,0,0.55)",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 20,
                borderRadius: 6,
                background: "#0d0508",
                marginLeft: 12,
              }}
            />
          ))}
        </div>

        {/* Film strip — right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "150px 0",
            background: "rgba(0,0,0,0.55)",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 20,
                borderRadius: 6,
                background: "#0d0508",
                marginLeft: 12,
              }}
            />
          ))}
        </div>

        {/* Marquee frame */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "34px 84px",
            borderRadius: 28,
            border: "4px solid rgba(245,197,24,0.7)",
            background: "linear-gradient(180deg, #2a0a12 0%, #180508 100%)",
            boxShadow:
              "0 0 60px rgba(245,197,24,0.25), 0 30px 70px rgba(0,0,0,0.7)",
          }}
        >
          {/* Top bulbs */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 20,
              right: 20,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {bulbs.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#F5C518",
                  opacity: i % 3 === 0 ? 1 : 0.45,
                  boxShadow:
                    i % 3 === 0
                      ? "0 0 12px rgba(245,197,24,0.9)"
                      : "0 0 4px rgba(245,197,24,0.4)",
                }}
              />
            ))}
          </div>

          {/* Bottom bulbs */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 20,
              right: 20,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {bulbs.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#F5C518",
                  opacity: (i + 1) % 3 === 0 ? 1 : 0.45,
                  boxShadow:
                    (i + 1) % 3 === 0
                      ? "0 0 12px rgba(245,197,24,0.9)"
                      : "0 0 4px rgba(245,197,24,0.4)",
                }}
              />
            ))}
          </div>

          {/* Now showing */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 60,
                height: 2,
                background: "linear-gradient(90deg, transparent, #F5C518)",
              }}
            />
            <div
              style={{
                fontSize: 26,
                letterSpacing: 10,
                color: "rgba(245,197,24,0.85)",
                textTransform: "uppercase",
              }}
            >
              Now Showing
            </div>
            <div
              style={{
                width: 60,
                height: 2,
                background: "linear-gradient(270deg, transparent, #F5C518)",
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 900,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#F5C518" }}>Pick</span>
            <span style={{ color: "#E82548" }}>Flick</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 34,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: 1,
            }}
          >
            Movie night, decided together
          </div>
        </div>

        {/* Bottom site url */}
        <div
          style={{
            position: "absolute",
            bottom: 26,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 24,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          pickflick.jewellcore.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
