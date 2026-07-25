"use client"

import React from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ─── RAW MOCK DATA ─────────────────────────────────────────────

const chartData = [
  { month: "Jan", revenue: 12400, users: 840, sessions: 2100 },
  { month: "Feb", revenue: 15100, users: 920, sessions: 2400 },
  { month: "Mar", revenue: 18200, users: 1100, sessions: 2800 },
  { month: "Apr", revenue: 16500, users: 1050, sessions: 2600 },
  { month: "May", revenue: 22400, users: 1350, sessions: 3400 },
  { month: "Jun", revenue: 28100, users: 1680, sessions: 4100 },
  { month: "Jul", revenue: 32400, users: 1920, sessions: 4800 },
]

const stats = [
  {
    title: "Total Revenue",
    value: "$32,400",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Active Users",
    value: "1,920",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Sessions",
    value: "4,800",
    change: "-4.2%",
    trend: "down",
    icon: Activity,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Sales",
    value: "342",
    change: "+8.7%",
    trend: "up",
    icon: CreditCard,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// ─── COMPONENTS ────────────────────────────────────────────────

const StatCard = ({
  stat,
  index,
}: {
  stat: (typeof stats)[0]
  index: number
}) => {
  const Icon = stat.icon
  const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight
  const trendColor =
    stat.trend === "up" ? "text-emerald-500" : "text-red-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </CardTitle>
          <div className={cn("p-2 rounded-lg", stat.bg)}>
            <Icon className={cn("w-4 h-4", stat.color)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon className={cn("w-3.5 h-3.5", trendColor)} />
            <span className={cn("text-xs font-medium", trendColor)}>
              {stat.change}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────

import { cn } from "@/lib/utils"

export default function DashboarHomeSections() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} stat={stat} index={i} />
        ))}
      </div>

      {/* Chart Section ── ComposedChart (Bar + Line) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-semibold">
                Revenue Overview
              </CardTitle>
              <CardDescription>
                Monthly revenue and user growth for the current year
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[hsl(var(--chart-1))]" />
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
                <span className="text-xs text-muted-foreground">Users</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[360px] w-full">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/40"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : value
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "hsl(var(--background))",
                    stroke: "hsl(var(--chart-2))",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(var(--chart-2))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 3,
                  }}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row: Quick Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card className="md:col-span-2 border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest actions across your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                action: "New user signed up",
                detail: "john.doe@example.com",
                time: "2 min ago",
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                action: "Payment received",
                detail: "$299.00 from Premium Plan",
                time: "15 min ago",
                icon: DollarSign,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                action: "Server alert",
                detail: "CPU usage peaked at 87%",
                time: "1 hr ago",
                icon: Activity,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                action: "New subscription",
                detail: "Business Plan - Annual",
                time: "3 hr ago",
                icon: CreditCard,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className={cn("p-2.5 rounded-lg shrink-0", item.bg)}>
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.detail}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance</CardTitle>
            <CardDescription>System health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "API Uptime", value: 99.98, color: "bg-emerald-500" },
              { label: "DB Latency", value: 12, unit: "ms", color: "bg-blue-500" },
              { label: "Cache Hit", value: 94.2, color: "bg-violet-500" },
              { label: "Error Rate", value: 0.3, color: "bg-orange-500" },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium">
                    {metric.value}
                    {metric.unit || "%"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(metric.value, 100)}%`,
                    }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className={cn("h-full rounded-full", metric.color)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}