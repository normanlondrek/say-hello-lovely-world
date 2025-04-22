
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase, signInWithTestCredentials } from "@/integrations/supabase/client";
import { WalletIcon, LockIcon, UserPlus } from "lucide-react";

const DEMO_EMAIL = "obaida@wallet.com";
const DEMO_PASSWORD = "qazqazqaz555";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setAuthError(error.message || "Could not sign in.");
          toast.error(error.message || "Could not sign in.");
          return;
        }
        toast.success("Welcome back!");
        navigate("/");
      } else {
        // Sign up
        // Use the demo helper for demo credentials
        if (email === DEMO_EMAIL) {
          const { data, error } = await signInWithTestCredentials(email, password);
          if (error) {
            setAuthError(error.message || "Could not sign up.");
            toast.error(error.message || "Could not sign up.");
            return;
          }
          toast.success("Account created! Welcome!");
          navigate("/");
        } else {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) {
            setAuthError(error.message || "Could not sign up.");
            toast.error(error.message || "Could not sign up.");
            return;
          }
          toast.success("Account created! Check your email if asked.");
          navigate("/");
        }
      }
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed.");
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setMode("login");
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
        <CardContent className="space-y-6">
          {authError && (
            <Alert variant="destructive">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <form className="space-y-4" onSubmit={handleAuth}>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
              placeholder="Email address"
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
              placeholder="Password"
            />
            <Button type="submit" className="w-full flex gap-2 items-center justify-center" disabled={loading}>
              {mode === "login" ? <LockIcon className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {loading ? (mode === "login" ? "Signing In..." : "Signing Up...") : (mode === "login" ? "Sign In" : "Sign Up")}
            </Button>
          </form>
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-sm underline text-primary"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              disabled={loading}
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
            <button
              type="button"
              className="text-sm underline text-muted-foreground"
              onClick={handleDemoFill}
              disabled={loading}
            >
              Fill demo credentials
            </button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo credentials: obaida@wallet.com / qazqazqaz555</p>
            <p className="mt-1">Authentication is handled automatically</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

