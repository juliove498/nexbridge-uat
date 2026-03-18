import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTranslation } from "@/governance/hooks/use-translation";
import type { VoteTally } from "@/governance/types";

const COLORS: Record<string, string> = {
  For: "#10b981",
  Against: "#ef4444",
  Abstain: "#6b7280",
};

interface VoteResultsChartProps {
  tally: VoteTally;
}

export function VoteResultsChart({ tally }: VoteResultsChartProps) {
  const { t } = useTranslation();

  const data = tally.options.map((opt) => ({
    name: opt.label,
    value: opt.votingPower,
    percentage: opt.percentage,
    votes: opt.votes,
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="h-[220px] w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name] ?? "#8884d8"}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.percentage.toFixed(1)}% &middot;{" "}
                      {d.votes.toLocaleString()} {t.common.votes}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.value.toLocaleString()} {t.common.votingPower}
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[entry.name] ?? "#8884d8" }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.name}{" "}
              <span className="font-medium text-foreground">
                {entry.percentage.toFixed(1)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
