
import { useState } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Sample data for demonstration - properly typed
const sampleTransactions = [
  { id: 1, type: "income" as const, amount: 2500, category: "Salary", date: new Date(2023, 3, 15) },
  { id: 2, type: "expense" as const, amount: 450, category: "Housing", date: new Date(2023, 3, 1) },
  { id: 3, type: "expense" as const, amount: 85, category: "Groceries", date: new Date(2023, 3, 8) },
  { id: 4, type: "income" as const, amount: 150, category: "Freelance", date: new Date(2023, 3, 20) },
  { id: 5, type: "expense" as const, amount: 35, category: "Utilities", date: new Date(2023, 3, 15) },
  { id: 6, type: "expense" as const, amount: 25, category: "Transportation", date: new Date(2023, 3, 10) },
  { id: 7, type: "income" as const, amount: 75, category: "Dividend", date: new Date(2023, 3, 25) },
];

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: Date;
};

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Filter transactions for selected date
  const selectedDateTransactions = selectedDate
    ? transactions.filter(transaction => isSameDay(transaction.date, selectedDate))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Transaction Calendar
        </h2>
        <Button variant="outline" onClick={goToToday}>Today</Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((date, index) => {
              // Get transactions for this day
              const dayTransactions = transactions.filter(transaction => isSameDay(transaction.date, date));
              const hasIncome = dayTransactions.some(t => t.type === "income");
              const hasExpense = dayTransactions.some(t => t.type === "expense");
              
              return (
                <Button
                  key={date.toISOString()}
                  variant="ghost"
                  className={cn(
                    "h-14 relative", 
                    isToday(date) && "bg-primary/10 font-bold",
                    selectedDate && isSameDay(date, selectedDate) && "border border-primary"
                  )}
                  onClick={() => setSelectedDate(date)}
                >
                  <span>{format(date, "d")}</span>
                  {(hasIncome || hasExpense) && (
                    <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                      {hasIncome && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
                      {hasExpense && <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Transactions on {format(selectedDate, "PPP")}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTransactions.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        transaction.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                      )}>
                        {transaction.type === "income" ? "+" : "-"}
                      </span>
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-sm text-muted-foreground">{format(transaction.date, "p")}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "font-medium",
                      transaction.type === "income" ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No transactions on this day</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
