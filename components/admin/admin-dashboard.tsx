"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Props = {
  totalScholars: number;
  activeScholars: number;
  atRiskScholars: number;
  pendingReviews: number;
  submissions: any[];
  notifications: any[];
};

export default function AdminDashboard(props: Props) {
  const trend =
    props.submissions?.reduce((acc: any[], item: any) => {
      const date = new Date(item.submitted_at).toLocaleDateString();
      const found = acc.find((x) => x.date === date);

      if (found) found.total += 1;
      else acc.push({ date, total: 1 });

      return acc;
    }, []) || [];

  const pieData = [
    {
      name: "Approved",
      value: props.submissions.filter((s) => s.status === "approved").length,
    },
    {
      name: "Pending",
      value: props.submissions.filter((s) => s.status === "pending").length,
    },
    {
      name: "Rejected",
      value: props.submissions.filter((s) => s.status === "rejected").length,
    },
  ];

  const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
        <p className="text-gray-500 text-sm">Command Center</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Total Scholars" value={props.totalScholars} />
        <KPI label="Active Scholars" value={props.activeScholars} />
        <KPI label="At Risk" value={props.atRiskScholars} warn />
        <KPI label="Pending" value={props.pendingReviews} info />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Submission Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="total" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={pieData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* PIE */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}

function KPI({ label, value, warn, info }: any) {
  return (
    <div className="p-4 bg-white border rounded-xl">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-xl font-bold ${
          warn ? "text-yellow-500" : info ? "text-blue-500" : ""
        }`}
      >
        {value ?? 0}
      </p>
    </div>
  );
}