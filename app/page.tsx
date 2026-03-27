export default function Home() {
  const examples = [
    {
      label: "2024 Porsche 911 — Side",
      src: "/images/car.png?view=side&brand=porsche&model=911&year=2024&color=red&w=600",
    },
    {
      label: "2023 Tesla Model 3 — Front",
      src: "/images/car.png?view=front&brand=tesla&model=model-3&year=2023&color=white&w=600",
    },
    {
      label: "2022 BMW M3 — Side",
      src: "/images/car.png?view=side&brand=bmw&model=m3&year=2022&color=blue&w=600",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Car Image API</h1>
      <p style={{ color: "#666", fontSize: 18, marginBottom: 40 }}>
        AI-generated car images with transparent backgrounds. Images are
        generated on first request, then cached.
      </p>

      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Endpoint</h2>
      <code
        style={{
          display: "block",
          background: "#f4f4f4",
          padding: 16,
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 32,
          overflowX: "auto",
        }}
      >
        GET /images/car.png?view=side&brand=toyota&model=corolla&year=2012
      </code>

      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Parameters</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 40,
          fontSize: 15,
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: "8px 12px" }}>Param</th>
            <th style={{ padding: "8px 12px" }}>Required</th>
            <th style={{ padding: "8px 12px" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["view", "Yes", '"side" or "front"'],
            ["brand", "Yes", "Car manufacturer (e.g. toyota, bmw, tesla)"],
            ["model", "Yes", "Car model (e.g. corolla, m3, model-3)"],
            ["year", "Yes", "Model year (1990 to current year + 1)"],
            ["color", "No", 'Car color (default: "silver")'],
            ["w", "No", "Resize width in px (1–1024)"],
            ["h", "No", "Resize height in px (1–1024)"],
          ].map(([param, required, desc]) => (
            <tr key={param} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 12px" }}>
                <code>{param}</code>
              </td>
              <td style={{ padding: "8px 12px" }}>{required}</td>
              <td style={{ padding: "8px 12px" }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Examples</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>
        First load may take a few seconds while the image is generated. Subsequent
        requests are served from cache.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 24,
        }}
      >
        {examples.map((ex) => (
          <div
            key={ex.label}
            style={{
              background: "#1a1a1a",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ex.src}
              alt={ex.label}
              style={{ width: "100%", display: "block" }}
              loading="lazy"
            />
            <p
              style={{
                color: "#ccc",
                fontSize: 13,
                padding: "8px 12px",
                margin: 0,
              }}
            >
              {ex.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
