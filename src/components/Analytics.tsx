
import { useState } from "react";
import { format, subDays, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon, ArrowUp, ArrowDown, Table } from "lucide-react";

// Sample data for demonstration
const generateData = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    data.unshift({
      date: format(date, "MMM d"),
      income: Math.floor(Math.random() * 300) + 100,
      expense: Math.floor(Math.random() * 200) + 50,
    });
  }
  return data;
};

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#A569BD", "#5DADE2", "#EC7063", "#F5B041", "#AAB7B8", "#45B39D"];

const categoryData = [
  { name: "Housing", value: 600 },
  { name: "Food", value: 300 },
  { name: "Transportation", value: 150 },
  { name: "Entertainment", value: 120 },
  { name: "Utilities", value: 180 },
  { name: "Healthcare", value: 90 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  
  // Generate data based on time range
  const getData = () => {
    switch (timeRange) {
      case "day":
        return generateData(7).slice(-1);
      case "week":
        return generateData(7);
      case "month":
        return generateData(30);
      default:
        return generateData(7);
    }
  };

  const data = getData();
  
  // Calculate totals
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const chartConfig = {
    income: { color: "hsl(143, 85%, 60%)" },
    expense: { color: "hsl(346, 84%, 61%)" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <PieChartIcon className="h-6 w-6" />
          Analytics
        </h2>
        
        <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">${totalExpense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <Table className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">${netSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PieChartIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Of total income</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="text-sm font-medium">{label}</div>
                        <div className="grid gap-2 mt-2">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="font-medium capitalize">{entry.name}</span>
                              <span>${entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Income"
                  stroke="hsl(143, 85%, 60%)" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expense"
                  stroke="hsl(346, 84%, 61%)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="text-sm font-medium">{label}</div>
                        <div className="grid gap-2 mt-2">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="font-medium capitalize">{entry.name}</span>
                              <span>${entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }} />
                <Bar 
                  dataKey="income" 
                  name="Income"
                  fill="hsl(143, 85%, 60%)" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expense" 
                  name="Expense"
                  fill="hsl(346, 84%, 61%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-2 rounded-md shadow-md">
                            <p className="font-medium">{payload[0].name}</p>
                            <p className="text-sm">${payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">${category.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${categoryData.reduce((sum, item) => sum + item.value, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
