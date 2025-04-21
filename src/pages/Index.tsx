
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, WalletIcon, CircleDollarSign, ArrowUp, ArrowDown, LogOut } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Income from "@/components/Income";
import Expenses from "@/components/Expenses";
import Analytics from "@/components/Analytics";
import CalendarView from "@/components/CalendarView";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/context/UserContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Wallet Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-muted-foreground">
                {user.email}
              </div>
            )}
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <WalletIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">Income</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="income">
            <Income />
          </TabsContent>
          
          <TabsContent value="expenses">
            <Expenses />
          </TabsContent>
          
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
