import './global.css';

export const metadata = {
  title: 'Project Bio-Tesseract — Astronaut Bio-Telemetry & Deep Space Mission Monitor',
  description: 'Real-time multi-crew bio-telemetry, 4D hypercube bio-resonance visualization, EVA suit life support telemetry, and AI bio-diagnostic co-pilot for deep space exploration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💠</text></svg>" />
      </head>
      <body>
        <div className="app-layout">
          {children}
        </div>
      </body>
    </html>
  );
}
