import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Warehouse,
  LogIn,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  updateLoginForm,
  togglePasswordVisibility,
  clearLoginForm,
} from "@/app/store/authSlice";
import { handleLoginSubmit } from "@/app/manager/authManager";
import config from "./LoginConfig.json";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, loginForm } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearLoginForm());
  }, [dispatch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await dispatch(handleLoginSubmit());
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center relative overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-900/30" />

        <div className="relative text-left text-white px-16 max-w-2xl transform transition-all duration-700 hover:translate-x-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-400">
            <Warehouse className="icon-xl text-white" />
          </div>
          <h2 className="heading-main mb-6 text-white">
            {config.branding.titlePrefix} <br />
            <span className="text-blue-500">
              {config.branding.titleHighlight}
            </span>{" "}
            {config.branding.titleSuffix}
          </h2>
          <p className="body-main text-slate-300 mb-10 text-xl">
            {config.branding.subtitle}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {config.branding.nodes.map((node, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold"
                >
                  {node}
                </div>
              ))}
            </div>
            <p className="caption-small text-slate-400">
              <span className="text-white">
                {config.branding.activeNodesLabel}
              </span>{" "}
              {config.branding.activeNodesValue}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10" />

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center lg:text-left">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 lg:hidden mx-auto">
              <Warehouse className="icon-lg text-white" />
            </div>
            <h1 className="heading-section">
              {config.form.title}
            </h1>
            <p className="body-main mt-1">
              {config.form.subtitle}
            </p>
          </div>

          <Card className="border-0 shadow-2xl shadow-blue-900/30 rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <form
                onSubmit={onSubmit}
                autoComplete="off"
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="caption-small ml-1"
                  >
                    {config.form.usernameLabel}
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder={config.form.usernamePlaceholder}
                      value={loginForm.username}
                      onChange={(e) =>
                        dispatch(
                          updateLoginForm({
                            field: "username",
                            value: e.target.value,
                          }),
                        )
                      }
                      autoComplete="off"
                      className="rounded-2xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold px-4"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    title="Secure Credentials"
                    className="caption-small ml-1"
                  >
                    {config.form.passwordLabel}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={loginForm.showPassword ? "text" : "password"}
                      placeholder={config.form.passwordPlaceholder}
                      value={loginForm.password}
                      onChange={(e) =>
                        dispatch(
                          updateLoginForm({
                            field: "password",
                            value: e.target.value,
                          }),
                        )
                      }
                      autoComplete="new-password"
                      className="rounded-2xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold px-4 tracking-widest pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => dispatch(togglePasswordVisibility())}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-all"
                      tabIndex={-1}
                    >
                      {loginForm.showPassword ? (
                        <EyeOff className="icon-sm" />
                      ) : (
                        <Eye className="icon-sm" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 animate-in fade-in zoom-in-95">
                    <ShieldCheck className="icon-sm text-rose-600 mt-0.5" />
                    <p className="text-[11px] font-black uppercase text-rose-700 leading-tight tracking-wider">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-2xl h-14 bg-slate-900 hover:bg-black text-white font-black text-base shadow-xl shadow-slate-200 transition-all active:scale-95 group/btn"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="icon-base animate-spin mr-2" />
                  ) : (
                    <LogIn className="icon-base mr-2 group-hover/btn:translate-x-1 transition-transform" />
                  )}
                  {config.form.submitButton}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center caption-small tracking-[0.2em] pt-4">
            {config.form.footerText}
          </p>
        </div>
      </div>
    </div>
  );
};
