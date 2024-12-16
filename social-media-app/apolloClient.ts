import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_URL = "https://hwuczpdrsyqfddhqegjl.supabase.co/graphql/v1";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWN6cGRyc3lxZmRkaHFlZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNzE0MTgsImV4cCI6MjA0OTY0NzQxOH0.dFvyWUBuxPpAUm3LOtc1f8B3t0feIgcgJPIW3DR0BpI";

// Create the Apollo Client instance
const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
    headers: {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
