"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminChartData } from "@/lib/api";
import type { AdminChartData } from "@/lib/types";

const GOLD = "#C9A227";
const GOLD_SOFT = "#E2C876";
const NAVY = "#0A0E27";
const INK_MUTED = "#8A8478";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const STATUS_ORDER = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: { orders: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-navy-900/10 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-navy-900">{label ? formatShortDate(label) : ""}</p>
      <p className="mt-1 text-charcoal/70">
        EGP {payload[0].value.toLocaleString()} · {payload[0].payload.orders} order
        {payload[0].payload.orders === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function BarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { name: string; suffix?: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="border border-navy-900/10 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-navy-900">{p.payload.name}</p>
      <p className="mt-1 text-charcoal/70">
        {p.value.toLocaleString()}
        {p.payload.suffix || ""}
      </p>
    </div>
  );
}

export default function DashboardCharts() {
  const [data, setData] = useState<AdminChartData | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off a fetch on range change
    setLoading(true);
    getAdminChartData(days)
      .then(setData)
      .finally(() => setLoading(false));
  }, [days]);

  const statusData = STATUS_ORDER.map((status) => ({
    name: STATUS_LABELS[status],
    status,
    value: data?.statusBreakdown.find((s) => s.status === status)?.count || 0,
  }));

  const topProductsData = (data?.topProducts || []).map((p) => ({
    name: p.name.length > 22 ? `${p.name.slice(0, 22)}…` : p.name,
    value: p.quantitySold,
    suffix: " sold",
  }));

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-navy-900">Revenue Trend</h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-3 py-1 text-xs uppercase tracking-wide ${
                days === r.days
                  ? "bg-navy-900 text-cream"
                  : "border border-navy-900/15 text-charcoal/60 hover:border-navy-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-64 border border-navy-900/10 bg-white p-4">
        {loading || !data ? (
          <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueTrend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEE8DA" />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={{ fontSize: 11, fill: INK_MUTED }}
                axisLine={{ stroke: "#EEE8DA" }}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis
                tick={{ fontSize: 11, fill: INK_MUTED }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={NAVY}
                strokeWidth={2}
                fill="url(#revenueFill)"
                activeDot={{ r: 4, fill: GOLD, stroke: NAVY, strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg text-navy-900">Orders by Status</h2>
          <div className="mt-4 h-56 border border-navy-900/10 bg-white p-4">
            {loading || !data ? (
              <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
                Loading...
              </div>
            ) : statusData.every((s) => s.value === 0) ? (
              <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
                No orders yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  barCategoryGap={10}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: NAVY }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(10,14,39,0.04)" }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {statusData.map((s) => (
                      <Cell key={s.name} fill={s.status === "cancelled" ? "#C4453B" : GOLD} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg text-navy-900">Top Products</h2>
          <div className="mt-4 h-56 border border-navy-900/10 bg-white p-4">
            {loading || !data ? (
              <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
                Loading...
              </div>
            ) : topProductsData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
                No sales yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  barCategoryGap={10}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: NAVY }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(10,14,39,0.04)" }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18} fill={GOLD_SOFT} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
