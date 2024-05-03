import { FC, useRef } from "react";
import Router from "./Router";
import AuthProvider, { AuthProviderHandler } from "./app/features/auth/provider";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { ToastContainer } from "react-toastify";

const App: FC = () => {
  const authProviderHandler = useRef<AuthProviderHandler>(null);
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error) {
          const err = error as unknown as PostgrestError;
          if (err.code && err.code == "401") {
            authProviderHandler.current?.refetch();
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
        // refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider ref={authProviderHandler}>
          <Router />
        </AuthProvider>
      </QueryClientProvider>
      <ToastContainer
        style={{
          zIndex: 10000,
        }}
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        stacked
      />
    </>
  );
};

export default App;
