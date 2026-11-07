"use client";

type Props = {
  action: (formData: FormData) => Promise<void>;
  error?: boolean;
};

export function AdminLoginForm({ action, error }: Props) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lg)]">
      <h1 className="text-xl font-semibold text-foreground">Вход в админку</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Invest Demidov · логи, аудитория, рассылки, ИИ-ассистент
      </p>
      <form action={action} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="login" className="block text-sm font-medium">
            Логин
          </label>
          <input
            id="login"
            name="login"
            type="text"
            required
            autoComplete="username"
            className="min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            Неверный логин или пароль.
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
