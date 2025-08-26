// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { corsHeaders } from "../_shared/cors.ts";

/**
 * The main handler for the Supabase Edge Function.
 * This function acts as a proxy, receiving requests from the frontend,
 * securely forwarding them to an AI backend, and returning the response.
 *
 * @param req The incoming HTTP request object.
 * @returns A JSON response from the AI backend or an error message.
 */
serve(async (req: Request) => {
  // Handle pre-flight CORS requests
  // This is essential for a web frontend to communicate with the Edge Function.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // --- Step 1: Request Validation and Data Extraction ---

  // Ensure the request method is POST. We only accept POST for sending data.
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST requests are allowed." }),
      {
        status: 405, // Method Not Allowed
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Check for the presence of the API key from the frontend for a simple security check.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid Authorization header." }), {
      status: 401, // Unauthorized
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Parse the incoming JSON body to get the user's query.
  let requestData;
  try {
    requestData = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400, // Bad Request
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Ensure the user's query is present in the request body.
  const userQuery = requestData.user_query;
  if (!userQuery) {
    return new Response(JSON.stringify({ error: "Missing 'user_query' in request body." }), {
      status: 400, // Bad Request
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // --- Step 2: Call the AI Backend Service ---

  // Here, we'll use a placeholder for the actual API call to your AI backend.
  // The API URL should be stored as a Supabase secret for security.
  const AI_BACKEND_URL = Deno.env.get("AI_BACKEND_URL");
  if (!AI_BACKEND_URL) {
    console.error("AI_BACKEND_URL environment variable is not set.");
    return new Response(
      JSON.stringify({
        error: "Server configuration error. AI backend URL is not defined.",
      }),
      {
        status: 500, // Internal Server Error
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Forward the user's query to your AI backend service.
    // This is the core logic of the proxy.
    const response = await fetch(AI_BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass any necessary credentials or headers to your AI backend here.
        // Example: "X-API-Key": Deno.env.get("AI_SERVICE_API_KEY"),
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      console.error(`AI backend returned an error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({
          error: "Failed to get a response from the AI backend.",
          status: response.status,
          statusText: response.statusText,
        }),
        {
          status: response.502, // Bad Gateway
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Return the response from the AI backend directly to the client.
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200, // OK
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error during AI backend fetch: ${error.message}`);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred while communicating with the AI backend." }),
      {
        status: 500, // Internal Server Error
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
