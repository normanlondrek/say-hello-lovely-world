import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowUp, Calendar as CalendarIcon, Search } from "lucide-react";

const initialIncomeData = [
  { id: 1, amount: 2500, category: "Salary", source: "Company ABC", date: new Date(2023, 3, 15), notes: "Monthly salary" },
  { id: 2, amount: 150, category: "Freelance", source: "Design project", date: new Date(2023, 3, 20), notes: "Logo design" },
  { id: 3, amount: 75, category: "Dividend", source: "Stock XYZ", date: new Date(2023, 3, 25), notes: "Quarterly dividend" },
];

const incomeCategories = ["Salary", "Freelance", "Dividend", "Investment", "Gift", "Other"];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2"];

const Income = () => {
  const [incomeData, setIncomeData] = useState(initialIncomeData);
  const [newIncome, setNewIncome] = useState({
    amount: "",
    category: "Salary",
    source: "",
    date: new Date(),
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const pieData = incomeCategories.map((category) => {
    const total = incomeData
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0);
    return { name: category, value: total };
  }).filter(item => item.value > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIncome(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewIncome(prev => ({ ...prev, category: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewIncome(prev => ({ ...prev, date }));
    }
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry = {
      id: Date.now(),
      amount: parseFloat(newIncome.amount),
      category: newIncome.category,
      source: newIncome.source,
      date: newIncome.date,
      notes: newIncome.notes
    };
    
    setIncomeData([...incomeData, newEntry]);
    
    setNewIncome({
      amount: "",
      category: "Salary",
      source: "",
      date: new Date(),
      notes: ""
    });
  };

  const filteredIncomeData = incomeData.filter(item => {
    const matchesSearch = item.source.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || item.category === filterCategory;
    
    const matchesDate = !filterDate || 
      (item.date.getDate() === filterDate.getDate() && 
       item.date.getMonth() === filterDate.getMonth() && 
       item.date.getFullYear() === filterDate.getFullYear());
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <ArrowUp className="h-6 w-6 text-emerald-500" />
        Income
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Record Income</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={newIncome.amount} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newIncome.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input 
                    id="source" 
                    name="source" 
                    placeholder="Source of income" 
                    value={newIncome.source} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newIncome.date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newIncome.date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="Add additional details..." 
                  value={newIncome.notes} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <Button type="submit" className="w-full">Add Income</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search income entries..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {incomeCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {(filterCategory || filterDate || searchTerm) && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                  setFilterDate(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomeData.length > 0 ? (
                filteredIncomeData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{format(item.date, "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium">${item.amount.toFixed(2)}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.source}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No income entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Income;
