
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://buaoasayrplrordqngrg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1YW9hc2F5cnBscm9yZHFuZ3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTA0MDksImV4cCI6MjA2MDgyNjQwOX0.Ieu07_2Y-YZBHDDXxsesGt8uYvglji3Lu4b67whoOOg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Add a helper function to check if user is logged in
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Helper function to convert UUID to numeric ID for database
export const convertUuidToNumericId = (uuid: string) => {
  // Remove hyphens and take first 10 characters, convert to integer, and mod to keep it within a reasonable range
  return parseInt(uuid.replace(/-/g, '').substring(0, 10), 16) % 1000000;
};

// Helper for test user authentication
export const signInWithTestCredentials = async (email: string, password: string) => {
  // Check if it's our test user
  if (email === "obaida@wallet.com" && password === "2002") {
    // Try to sign in first - this is more likely to succeed if the user already exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If sign in was successful, return the result
    if (signInData?.user && !signInError) {
      return { data: signInData, error: null };
    }
    
    // If sign in failed, try to sign up this test user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    // If we successfully created the user, also add them to the users table
    if (data?.user && !signUpError) {
      try {
        const numericId = convertUuidToNumericId(data.user.id);
        
        // Check if the user already exists in the users table
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", numericId)
          .single();
          
        // Only insert if the user doesn't exist
        if (!existingUser) {
          await supabase
            .from("users")
            .insert({
              id: numericId
            });
        }
        
        // Now try to sign in again
        return supabase.auth.signInWithPassword({
          email,
          password,
        });
      } catch (error) {
        console.error("Error adding test user to database:", error);
        
        // Still try to sign in even if there was an error with the users table
        return supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
    }

    // If sign up also failed, return the original sign in error
    return { data: signInData, error: signInError };
  }
  
  // For all other users, use regular sign in
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
};
