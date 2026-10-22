export type LogLevel = "info" | "warn" | "error" | "critical";

export type AppLogRow = {
  id: string;
  created_at: string;
  level: LogLevel;
  channel: string;
  message: string;
  context: Record<string, unknown>;
  notified_ops: boolean;
};
