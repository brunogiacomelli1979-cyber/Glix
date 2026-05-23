import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatShortDate, getChartData, getGlucoseStatus } from "@/lib/glucose";
import type { GlucoseRecord } from "@/types/glucose";

type ChartPoint = GlucoseRecord & {
  x: number;
  y: number;
  label: string;
  status: ReturnType<typeof getGlucoseStatus>;
};

type GlucoseChartProps = {
  records: GlucoseRecord[];
};

function getSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function ChartCanvas({ records }: GlucoseChartProps) {
  const chartRecords = getChartData(records);

  if (chartRecords.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-[#b8dce8] bg-[#f8fbfc] px-4 text-center text-sm text-[#607585]">
        O gráfico aparece depois do primeiro registro.
      </div>
    );
  }

  const width = 700;
  const height = 272;
  const padding = { top: 24, right: 22, bottom: 48, left: 60 };
  const values = chartRecords.map((record) => record.value_mgdl);
  const minValue = Math.max(0, Math.min(...values, 70) - 20);
  const maxValue = Math.max(...values, 180) + 20;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const valueRange = Math.max(1, maxValue - minValue);
  const peak = Math.max(...values);

  function getY(value: number) {
    return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  }

  const points: ChartPoint[] = chartRecords.map((record, index) => {
    const x =
      padding.left +
      (chartRecords.length === 1 ? chartWidth / 2 : (index / (chartRecords.length - 1)) * chartWidth);
    const y = getY(record.value_mgdl);

    return {
      ...record,
      x,
      y,
      label: formatShortDate(record.recorded_at),
      status: getGlucoseStatus(record.value_mgdl),
    };
  });

  const yTicks = [minValue, 70, 140, 180, maxValue].filter(
    (tick, index, list) => list.indexOf(tick) === index && tick >= minValue && tick <= maxValue
  );
  const path = getSmoothPath(points);
  const bands = [
    { from: minValue, to: 70, color: "#eff8ff" },
    { from: 70, to: 140, color: "#eefaff" },
    { from: 140, to: 180, color: "#fffbeb" },
    { from: 180, to: maxValue, color: "#fff1f2" },
  ].filter((band) => band.to > minValue && band.from < maxValue);

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Gráfico de evolução da glicemia"
        className="min-w-[560px]"
      >
        {bands.map((band) => {
          const yTop = getY(Math.min(band.to, maxValue));
          const yBottom = getY(Math.max(band.from, minValue));
          return (
            <rect
              key={`${band.from}-${band.to}`}
              x={padding.left}
              y={yTop}
              width={chartWidth}
              height={Math.max(0, yBottom - yTop)}
              fill={band.color}
            />
          );
        })}

        {yTicks.map((tick) => {
          const y = getY(tick);

          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#d8edf4"
              />
              <text x={10} y={y + 4} className="fill-[#607585] text-xs">
                {tick} mg/dL
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="#94b8c5"
        />
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={height - padding.bottom}
          y2={height - padding.bottom}
          stroke="#94b8c5"
        />

        {points.length > 1 && <path d={path} fill="none" stroke="#0f6f8f" strokeWidth="3" />}

        {points.map((point, index) => {
          const isPeak = point.value_mgdl === peak && points.length > 1;

          return (
            <g key={point.id}>
              <title>
                {`${formatDate(point.recorded_at)} - ${point.value_mgdl} mg/dL (${point.status.label})`}
              </title>
              {isPeak && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="9"
                  fill="none"
                  stroke={point.status.chart}
                  strokeOpacity="0.28"
                  strokeWidth="5"
                />
              )}
              <circle cx={point.x} cy={point.y} r="5" fill={point.status.chart} />
              <text x={point.x} y={point.y - 12} textAnchor="middle" className="fill-[#082f49] text-xs">
                {point.value_mgdl}
              </text>
              {(index === 0 || index === points.length - 1 || points.length <= 6) && (
                <text
                  x={point.x}
                  y={height - 18}
                  textAnchor="middle"
                  className="fill-[#607585] text-xs"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function GlucoseChart({ records }: GlucoseChartProps) {
  return (
    <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
      <CardHeader>
        <CardTitle className="text-[#062338]">Evolução da glicemia</CardTitle>
        <CardDescription className="text-[#607585]">
          Pontos coloridos por faixa, com destaque para picos do período.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartCanvas records={records} />
      </CardContent>
    </Card>
  );
}
