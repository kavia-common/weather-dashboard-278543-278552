import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function ForecastGraph({ hourly = [] }) {
  /**
   * Renders a simple temperature trend line using Canvas API.
   * No external dependencies are used to keep the template lightweight.
   */
  const canvasRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const width = (cvs.width = cvs.offsetWidth);
    const height = (cvs.height = cvs.offsetHeight);

    ctx.clearRect(0, 0, width, height);

    if (!hourly.length) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu';
      ctx.fillText('No data', 10, 20);
      return;
    }

    const temps = hourly.map((h) => h.tempC);
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const pad = 20;

    const xStep = (width - pad * 2) / Math.max(1, hourly.length - 1);
    const yScale = (height - pad * 2) / Math.max(1, maxT - minT);

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, height - pad);
    ctx.stroke();

    // Line
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    hourly.forEach((h, i) => {
      const x = pad + i * xStep;
      const y = height - pad - (h.tempC - minT) * yScale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points
    ctx.fillStyle = '#2563EB';
    hourly.forEach((h, i) => {
      const x = pad + i * xStep;
      const y = height - pad - (h.tempC - minT) * yScale;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [hourly]);

  return (
    <section className="card">
      <h2 className="section-title">Temperature Trend</h2>
      <div className="chart" role="img" aria-label="Hourly temperature trend chart">
        <canvas ref={canvasRef} />
      </div>
    </section>
  );
}
