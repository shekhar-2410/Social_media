import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import  client from "../apolloClient.ts";
import { ApolloProvider } from "@apollo/client";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
      </ApolloProvider>
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>
);
