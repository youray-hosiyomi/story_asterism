import { useLogin } from "@/app/features/auth/hook";
import { FC, FormEvent, useState } from "react";
import AppTitle from "../../app-title.component";
import { KeyIcon, MailIcon } from "lucide-react";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    login.mutateAsync({ email, password });
  };
  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 pb-48 pt-6 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <AppTitle className="select-none text-3xl font-semibold" />
          <div className="mt-7">
            <div>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="label">
                    <div color="blue-gray" className="label-text">
                      メールアドレス
                    </div>
                  </label>
                  <div className="mt-2">
                    <label className="input input-bordered w-full flex items-center gap-2">
                      <MailIcon className="w-4 h-4 opacity-70" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="grow"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="label">
                    <div color="blue-gray" className="label-text">
                      パスワード
                    </div>
                  </label>
                  <div className="mt-2">
                    <label className="input input-bordered w-full flex items-center gap-2">
                      <KeyIcon className="w-4 h-4 opacity-70" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="grow"
                        placeholder="パスワード"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn btn-primary w-full" disabled={login.isPending}>
                    ログイン
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
