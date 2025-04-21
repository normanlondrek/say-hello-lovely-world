
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp, ArrowDown, CircleDollarSign, Wallet } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  // Placeholder data for the dashboard
  const summaryData = {
    totalBalance: 5840.75,
    totalIncome: 2500.00,
    totalExpenses: 1250.50,
    netSavings: 1249.50,
  };

  // Mock data for the overview chart
  const chartData = [
    { name: "Mon", income: 250, expense: 145 },
    { name: "Tue", income: 310, expense: 180 },
    { name: "Wed", income: 280, expense: 195 },
    { name: "Thu", income: 350, expense: 210 },
    { name: "Fri", income: 270, expense: 220 },
    { name: "Sat", income: 140, expense: 180 },
    { name: "Sun", income: 220, expense: 170 },
  ];

  const chartConfig = {
    income: { color: "hsl(143, 85%, 60%)" },
    expense: { color: "hsl(346, 84%, 61%)" },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current wallet balance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+${summaryData.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">-${summaryData.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">${summaryData.netSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="grid gap-2">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="font-medium">{entry.name}</span>
                              <span>${entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="hsl(143, 85%, 60%)"
                fill="hsl(143, 85%, 60%)"
                fillOpacity={0.2}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="hsl(346, 84%, 61%)"
                fill="hsl(346, 84%, 61%)"
                fillOpacity={0.2}
                name="Expense"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
