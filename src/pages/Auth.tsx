
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase, signInWithTestCredentials } from "@/integrations/supabase/client";
import { WalletIcon } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Insert user into users table after successful signup
      if (data.user) {
        // Convert UUID string to a number for the database
        // The users table expects id to be a number, not a string
        try {
          const numericId = parseInt(data.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000;
          
          const { error: userInsertError } = await supabase
            .from("users")
            .insert({
              id: numericId
            });

          if (userInsertError) {
            console.error("User insert error:", userInsertError);
            toast.error(
              "Account created, but failed to add user to users table: " +
                userInsertError.message
            );
          } else {
            toast.success("Account created successfully! You can now sign in.");
          }
        } catch (insertError: any) {
          console.error("Insert error:", insertError);
          toast.error("Error adding user to database: " + insertError.message);
        }
      } else {
        toast.success("Account created. You can now sign in.");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", email, password);
      
      // Use our helper function that handles the test user
      const { data, error } = await signInWithTestCredentials(email, password);

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      if (email === "obaida@wallet.com" && password === "2002") {
        toast.success("Welcome back, Obaida!");
      } else {
        toast.success("Signed in successfully!");
      }

      navigate("/");
    } catch (error: any) {
      console.error("Detailed sign in error:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <WalletIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Wallet Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Test user: obaida@wallet.com / 2002</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
