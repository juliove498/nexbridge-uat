/* ------------------------------------------------------------------ */
/*  Explore page: formatting & chart helpers                          */
/* ------------------------------------------------------------------ */

import type { CandlePoint } from "@/lib/data/explore-assets";

export function fmtPrice(n: number) {
  return "$" + (n >= 100 ? n.toFixed(2) : n.toFixed(3));
}

export function fmtPriceLong(n: number) {
  return "$" + (n >= 100 ? n.toFixed(2) : n.toFixed(4));
}

export function fmtSpread(bps: number) {
  return (bps / 100).toFixed(2) + "%";
}

export function fmtNum(n: number, d: number) {
  if (isNaN(n) || n === 0) return "";
  const parts = n.toFixed(d).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function cleanInput(v: string) {
  let c = v.replace(/[^0-9.]/g, "");
  const p = c.split(".");
  if (p.length > 2) c = p[0] + "." + p.slice(1).join("");
  return c;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatLabel(ts: number, range: string) {
  const d = new Date(ts * 1000);
  if (range === "1d") {
    return (
      (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" +
      (d.getMinutes() < 10 ? "0" : "") + d.getMinutes()
    );
  } else if (range === "1w") {
    return MONTHS[d.getMonth()] + " " + d.getDate() + " " +
      (d.getHours() < 10 ? "0" : "") + d.getHours() + ":00";
  }
  return MONTHS[d.getMonth()] + " " + d.getDate();
}

/* ------------------------------------------------------------------ */
/*  Chart drawing — pure data transform, no React state               */
/* ------------------------------------------------------------------ */

export type ChartResult = {
  line: string;
  area: string;
  dotX: number;
  dotY: number;
  yAxis: { high: string; mid: string; low: string };
  gridY: { high: number; mid: number; low: number };
  stats: { high: string; low: string };
  labels: string[];
};

export function computeChart(candles: CandlePoint[], range: string): ChartResult | null {
  let p1vals = candles.map((c) =>
    c.p1 ? parseFloat(c.p1) : parseFloat(c.mid || c.close || "0"),
  );
  let timestamps = candles.map((c) => c.ts);

  if (p1vals.length < 2) return null;

  // Down-sample
  const maxPts: Record<string, number> = { "1d": 60, "1w": 80, "1m": 90, "3m": 120, "1y": 150 };
  const target = maxPts[range] || 120;
  if (p1vals.length > target) {
    const step = (p1vals.length - 1) / (target - 1);
    const nv: number[] = [], nt: number[] = [];
    for (let i = 0; i < target; i++) {
      const idx = Math.min(Math.round(i * step), p1vals.length - 1);
      nv.push(p1vals[idx]);
      nt.push(timestamps[idx]);
    }
    p1vals = nv;
    timestamps = nt;
  }

  // Smooth
  const smoothW: Record<string, number> = { "1d": 3, "1w": 3, "1m": 2, "3m": 2 };
  const sw = smoothW[range] || 0;
  if (sw > 1 && p1vals.length > sw * 2) {
    const smoothed = p1vals.map((_, i) => {
      const s = Math.max(0, i - Math.floor(sw / 2));
      const e = Math.min(p1vals.length - 1, i + Math.floor(sw / 2));
      let sum = 0;
      for (let j = s; j <= e; j++) sum += p1vals[j];
      return sum / (e - s + 1);
    });
    smoothed[0] = p1vals[0];
    smoothed[smoothed.length - 1] = p1vals[p1vals.length - 1];
    p1vals = smoothed;
  }

  const W = 800, H = 200;
  const pad = { top: 12, bottom: 12, left: 4, right: 8 };

  let dataMin = Math.min(...p1vals), dataMax = Math.max(...p1vals);
  let dataRange = dataMax - dataMin;
  if (dataRange === 0) dataRange = dataMax * 0.001 || 0.001;

  const minSpread = dataMax * 0.002;
  if (dataRange < minSpread) {
    const midVal = (dataMax + dataMin) / 2;
    const m = minSpread / 2;
    dataMin = midVal - m;
    dataMax = midVal + m;
    dataRange = dataMax - dataMin;
  }

  const margin = dataRange * 0.15;
  const p1min = dataMin - margin, p1max = dataMax + margin;
  const p1range = p1max - p1min || 0.0001;

  const points = p1vals.map((price, i) => ({
    x: pad.left + (i / (p1vals.length - 1)) * (W - pad.left - pad.right),
    y: pad.top + (1 - (price - p1min) / p1range) * (H - pad.top - pad.bottom),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const areaPath = `${linePath} L${last.x.toFixed(1)},${H} L${points[0].x.toFixed(1)},${H} Z`;

  // Y-axis labels
  let yDec = 2;
  let tF = Math.pow(10, yDec);
  let tH = Math.ceil(dataMax * tF) / tF;
  let tL = Math.floor(dataMin * tF) / tF;
  while (tH - tL < 2 / tF && yDec < 4) {
    yDec++;
    tF = Math.pow(10, yDec);
    tH = Math.ceil(dataMax * tF) / tF;
    tL = Math.floor(dataMin * tF) / tF;
  }
  const f = Math.pow(10, yDec);
  const nH = Math.ceil(dataMax * f) / f;
  const nL = Math.floor(dataMin * f) / f;
  const nM = Math.round(((nH + nL) / 2) * f) / f;

  const chartH = H - pad.top - pad.bottom;
  const priceToY = (price: number) => pad.top + (1 - (price - p1min) / p1range) * chartH;

  // Stats
  const dec = p1vals[p1vals.length - 1] >= 100 ? 2 : 4;

  // X labels
  const labelCount = 5;
  const labelStep = Math.max(1, Math.floor(timestamps.length / (labelCount - 1)));
  const labels: string[] = [];
  for (let i = 0; i < labelCount; i++) {
    const idx = Math.min(i * labelStep, timestamps.length - 1);
    labels.push(formatLabel(timestamps[idx], range));
  }

  return {
    line: linePath,
    area: areaPath,
    dotX: last.x,
    dotY: last.y,
    yAxis: { high: "$" + nH.toFixed(yDec), mid: "$" + nM.toFixed(yDec), low: "$" + nL.toFixed(yDec) },
    gridY: { high: priceToY(nH), mid: priceToY(nM), low: priceToY(nL) },
    stats: { high: "$" + Math.max(...p1vals).toFixed(dec), low: "$" + Math.min(...p1vals).toFixed(dec) },
    labels,
  };
}
