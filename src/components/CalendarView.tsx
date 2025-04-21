
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@radix-ui/react-badge";
import { ArrowUp, ArrowDown, Calendar as CalendarIcon } from "lucide-react";

// Sample data for demonstration
const incomeEntries = [
  { id: 1, amount: 2500, category: "Salary", source: "Company ABC", date: new Date(2023, 3, 15), notes: "Monthly salary" },
  { id: 2, amount: 150, category: "Freelance", source: "Design project", date: new Date(2023, 3, 20), notes: "Logo design" },
  { id: 3, amount: 75, category: "Dividend", source: "Stock XYZ", date: new Date(2023, 3, 25), notes: "Quarterly dividend" },
];

const expenseEntries = [
  { id: 1, amount: 450, category: "Housing", reason: "Rent", date: new Date(2023, 3, 1), notes: "Monthly rent" },
  { id: 2, amount: 85, category: "Groceries", reason: "Supermarket", date: new Date(2023, 3, 8), notes: "Weekly groceries" },
  { id: 3, amount: 35, category: "Utilities", reason: "Electricity", date: new Date(2023, 3, 15), notes: "Monthly bill" },
  { id: 4, amount: 25, category: "Transportation", reason: "Gas", date: new Date(2023, 3, 10), notes: "Car refuel" },
];

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter entries for the selected date
  const selectedDateIncome = incomeEntries.filter(entry => 
    selectedDate && isSameDay(entry.date, selectedDate)
  );
  
  const selectedDateExpenses = expenseEntries.filter(entry => 
    selectedDate && isSameDay(entry.date, selectedDate)
  );
  
  // Generate calendar day preview
  const getDayContent = (day: Date) => {
    const dayIncome = incomeEntries.filter(entry => isSameDay(entry.date, day));
    const dayExpenses = expenseEntries.filter(entry => isSameDay(entry.date, day));
    
    if (dayIncome.length === 0 && dayExpenses.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-col items-center mt-1 text-xs">
        {dayIncome.length > 0 && (
          <div className="flex items-center text-emerald-500">
            <ArrowUp className="h-3 w-3" />
            <span>{dayIncome.length}</span>
          </div>
        )}
        {dayExpenses.length > 0 && (
          <div className="flex items-center text-rose-500">
            <ArrowDown className="h-3 w-3" />
            <span>{dayExpenses.length}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <CalendarIcon className="h-6 w-6" />
        Calendar View
      </h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsOpen(true);
                }}
                className="rounded-md border"
                components={{
                  DayContent: ({ day }) => (
                    <>
                      {day.getDate()}
                      {getDayContent(day)}
                    </>
                  ),
                }}
              />
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span>Income</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                  <span>Expense</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              {selectedDate && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{format(selectedDate, "MMMM d, yyyy")}</h3>
                  
                  {selectedDateIncome.length === 0 && selectedDateExpenses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No transactions on this date
                    </div>
                  ) : (
                    <Tabs defaultValue="all">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="income" className="text-emerald-500">Income</TabsTrigger>
                        <TabsTrigger value="expenses" className="text-rose-500">Expenses</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="space-y-4">
                        {selectedDateIncome.length > 0 && (
                          <>
                            <h4 className="text-lg font-medium flex items-center gap-2 mt-4">
                              <ArrowUp className="h-4 w-4 text-emerald-500" />
                              Income
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Source</TableHead>
                                  <TableHead>Notes</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedDateIncome.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="font-medium text-emerald-500">${item.amount.toFixed(2)}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.source}</TableCell>
                                    <TableCell>{item.notes}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </>
                        )}
                        
                        {selectedDateExpenses.length > 0 && (
                          <>
                            <h4 className="text-lg font-medium flex items-center gap-2 mt-4">
                              <ArrowDown className="h-4 w-4 text-rose-500" />
                              Expenses
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Reason</TableHead>
                                  <TableHead>Notes</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedDateExpenses.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="font-medium text-rose-500">${item.amount.toFixed(2)}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.reason}</TableCell>
                                    <TableCell>{item.notes}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="income">
                        {selectedDateIncome.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedDateIncome.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium text-emerald-500">${item.amount.toFixed(2)}</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell>{item.source}</TableCell>
                                  <TableCell>{item.notes}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            No income on this date
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="expenses">
                        {selectedDateExpenses.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedDateExpenses.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium text-rose-500">${item.amount.toFixed(2)}</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell>{item.reason}</TableCell>
                                  <TableCell>{item.notes}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            No expenses on this date
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          {selectedDate && (
            <>
              <SheetHeader>
                <SheetTitle>{format(selectedDate, "MMMM d, yyyy")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {selectedDateIncome.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-emerald-500" />
                      Income
                    </h3>
                    <div className="space-y-3 mt-3">
                      {selectedDateIncome.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.source}</p>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                {item.notes && <p className="text-sm mt-2">{item.notes}</p>}
                              </div>
                              <p className="font-semibold text-emerald-500">+${item.amount.toFixed(2)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDateExpenses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-rose-500" />
                      Expenses
                    </h3>
                    <div className="space-y-3 mt-3">
                      {selectedDateExpenses.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.reason}</p>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                {item.notes && <p className="text-sm mt-2">{item.notes}</p>}
                              </div>
                              <p className="font-semibold text-rose-500">-${item.amount.toFixed(2)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDateIncome.length === 0 && selectedDateExpenses.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No transactions on this date
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarView;
