import type { Candle } from './data';
import { formatChartLabel } from './data';

interface Props {
  candles: Candle[];
  range: string;
}

export function PriceChart({ candles, range }: Props) {
  const width = 800;
  const height = 200;
  const pad = { top: 12, bottom: 12, left: 4, right: 8 };

  let vals = candles.map(c => c.p1 ? parseFloat(c.p1) : parseFloat(c.mid || c.close || '0'));
  const timestamps = candles.map(c => c.ts);

  if (vals.length < 2) return <div className="flex items-center justify-center h-[200px] text-[var(--text-tertiary)] text-sm">Not enough data</div>;

  // Downsample
  const maxPts: Record<string, number> = { '1d': 60, '1w': 80, '1m': 90, '3m': 120, '1y': 150 };
  const target = maxPts[range] || 120;
  if (vals.length > target) {
    const step = (vals.length - 1) / (target - 1);
    const nv: number[] = [];
    for (let i = 0; i < target; i++) nv.push(vals[Math.round(i * step)]!);
    vals = nv;
  }

  // Moving average smooth
  const sw: Record<string, number> = { '1d': 3, '1w': 3, '1m': 2 };
  const win = sw[range] || 0;
  if (win > 1 && vals.length > win * 2) {
    const smoothed = vals.map((_, i) => {
      const s = Math.max(0, i - Math.floor(win / 2));
      const e = Math.min(vals.length - 1, i + Math.floor(win / 2));
      let sum = 0;
      for (let j = s; j <= e; j++) sum += vals[j]!;
      return sum / (e - s + 1);
    });
    smoothed[0] = vals[0]!;
    smoothed[smoothed.length - 1] = vals[vals.length - 1]!;
    vals = smoothed;
  }

  const dataMin = Math.min(...vals);
  const dataMax = Math.max(...vals);
  let dataRange = dataMax - dataMin;
  if (dataRange === 0) dataRange = dataMax * 0.001 || 0.001;
  const minSpread = dataMax * 0.002;
  let p1min = dataMin, p1max = dataMax;
  if (dataRange < minSpread) {
    const mid = (dataMax + dataMin) / 2;
    p1min = mid - minSpread / 2;
    p1max = mid + minSpread / 2;
  }
  const margin = (p1max - p1min) * 0.15;
  p1min -= margin;
  p1max += margin;
  const p1range = p1max - p1min || 0.0001;

  const points = vals.map((price, i) => ({
    x: pad.left + (i / (vals.length - 1)) * (width - pad.left - pad.right),
    y: pad.top + (1 - (price - p1min) / p1range) * (height - pad.top - pad.bottom),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1]!;
  const areaPath = `${linePath} L${last.x.toFixed(1)},${height} L${points[0]!.x.toFixed(1)},${height} Z`;

  // Grid line positions
  const gridYs = [0.25, 0.5, 0.75].map(f => pad.top + f * (height - pad.top - pad.bottom));

  // X-axis labels
  const labelCount = 5;
  const step = Math.max(1, Math.floor(timestamps.length / (labelCount - 1)));
  const labels: string[] = [];
  for (let i = 0; i < labelCount; i++) {
    const idx = Math.min(i * step, timestamps.length - 1);
    labels.push(formatChartLabel(timestamps[idx]!, range));
  }

  // Y-axis labels
  let yDec = 2;
  let testFactor = Math.pow(10, yDec);
  while (Math.ceil(dataMax * testFactor) / testFactor - Math.floor(dataMin * testFactor) / testFactor < 2 / testFactor && yDec < 4) {
    yDec++;
    testFactor = Math.pow(10, yDec);
  }
  const factor = Math.pow(10, yDec);
  const niceHigh = Math.ceil(dataMax * factor) / factor;
  const niceLow = Math.floor(dataMin * factor) / factor;
  const niceMid = Math.round(((niceHigh + niceLow) / 2) * factor) / factor;

  return (
    <>
      <div className="flex gap-3 relative">
        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-[200px]">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8642C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E8642C" stopOpacity="0" />
              </linearGradient>
            </defs>
            {gridYs.map((y, i) => (
              <line key={i} x1="0" y1={y} x2={width} y2={y} className="stroke-border stroke-1" />
            ))}
            <path d={areaPath} fill="url(#chartGrad)" opacity="0.3" />
            <path d={linePath} fill="none" stroke="#E8642C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={last.x} cy={last.y} r="3.5" fill="#E8642C" className="animate-pulse" />
          </svg>
        </div>
        <div className="flex flex-col justify-between text-[10px] text-[var(--text-tertiary)] font-mono py-3">
          <span>${niceHigh.toFixed(yDec)}</span>
          <span>${niceMid.toFixed(yDec)}</span>
          <span>${niceLow.toFixed(yDec)}</span>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-2 px-1">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </>
  );
}
