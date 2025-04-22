
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase, signInWithTestCredentials } from "@/integrations/supabase/client";
import { WalletIcon, LockIcon } from "lucide-react";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
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

  const handleDemoLogin = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      console.log("Attempting to sign in with demo account");
      
      // Use our helper function that handles the test user
      const { data, error } = await signInWithTestCredentials("obaida@wallet.com", "2002");

      if (error) {
        console.error("Demo sign in error:", error);
        setAuthError(error.message || "Could not sign in with demo account");
        toast.error("Could not sign in with demo account");
        return;
      }

      toast.success("Welcome to the Wallet Manager Demo!");
      navigate("/");
    } catch (error: any) {
      console.error("Detailed demo sign in error:", error);
      setAuthError(error.message || "Could not sign in with demo account");
      toast.error("Could not sign in with demo account");
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
        <CardContent className="space-y-6">
          {authError && (
            <Alert variant="destructive">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              This is a demo application with simplified authentication.
            </p>
          </div>

          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleDemoLogin} 
            disabled={loading}
          >
            <LockIcon className="h-4 w-4" />
            {loading ? "Signing In..." : "Enter Demo Application"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo credentials: obaida@wallet.com / 2002</p>
            <p className="mt-1">Authentication is handled automatically</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
