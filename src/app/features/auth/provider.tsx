import { ReactNode, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "./hook";
import { AuthContext } from "./context";
import { Auth } from "../../api/auth.api";

export type AuthProviderHandler = {
  auth: Auth | null;
  refetch: () => void;
};

const AuthProvider = forwardRef<AuthProviderHandler, { children: ReactNode }>(({ children }, ref) => {
  const { data: auth, isLoading, refetch } = useAuth();
  useImperativeHandle(
    ref,
    () => {
      return {
        auth: auth ?? null,
        refetch,
      };
    },
    [auth, refetch],
  );
  return (
    <AuthContext.Provider value={{ auth: auth ?? null, userId: auth?.user.id ?? "", isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
});

export default AuthProvider;
