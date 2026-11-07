import { redirect } from "next/navigation";
import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { AdminLoginForm } from "@/app/admin/admin-login-form";
import { loadAgentSettings } from "@/lib/agent-config";
import {
  checkAdminCredentials,
  getAdminSession,
  setAdminSession,
} from "@/lib/admin-auth";
import { listActiveBotUsers, listAudienceOptions } from "@/lib/bot-audience";

export const metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

async function loginAction(formData: FormData) {
  "use server";
  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkAdminCredentials(login, password)) {
    redirect("/admin?error=1");
  }
  await setAdminSession();
  redirect("/admin");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const session = await getAdminSession();

  if (!session) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
        <AdminLoginForm action={loginAction} error={Boolean(sp.error)} />
      </div>
    );
  }

  const [users, lists, agentSettings] = await Promise.all([
    listActiveBotUsers(200),
    listAudienceOptions(),
    loadAgentSettings(),
  ]);

  return (
    <AdminDashboard
      lists={lists}
      users={users}
      agentSettings={agentSettings}
    />
  );
}
