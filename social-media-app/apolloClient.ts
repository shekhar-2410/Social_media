import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_URL = "https://hwuczpdrsyqfddhqegjl.supabase.co/graphql/v1";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWN6cGRyc3lxZmRkaHFlZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTQ4MjksImV4cCI6MjA0OTU3MDgyOX0.mjnRHWq8-uyngNFmLJ0wApcquPnr8oayKtQMAjExglo"; 

const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
    headers: {
      authorization: `Bearer ${ANON_KEY}`, 
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
