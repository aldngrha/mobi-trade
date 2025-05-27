import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

type statusData = {
  status: string;
  count: number;
  fill: string;
};

type transactionStatus = {
  status: statusData[];
};

const statusChartConfig = {
  DELIVERED: {
    label: "Delivered",
    color: "#bbf7d0",
  },
  APPROVED: {
    label: "Approved",
    color: "#bae6fd",
  },
  SHIPPED: {
    label: "Shipped",
    color: "#bfdbfe",
  },
  PAID: {
    label: "Paid",
    color: "#fde68a",
  },
  PENDING: {
    label: "Pending",
    color: "#e2e8f0",
  },
  REJECTED: {
    label: "Rejected",
    color: "#fecaca",
  },
} satisfies ChartConfig;

export default function DonutChartDashboard({ status }: transactionStatus) {
  return (
    <ChartContainer config={statusChartConfig}>
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={status}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
          {status.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
