export const TOOL_OPTIONS = [
  "Claude",
  "Claude Code",
  "ChatGPT",
  "Cursor",
  "v0",
  "Bolt",
  "Replit",
  "Lovable",
  "Vercel",
  "Supabase",
  "Firebase",
  "Stripe",
  "Annat",
] as const;

export type ToolOption = (typeof TOOL_OPTIONS)[number];

export const TOOL_ACCENT: Record<string, string> = {
  Claude: "var(--bug-red)",
  "Claude Code": "var(--bug-red)",
  "Claude AI": "var(--bug-red)",
  ChatGPT: "var(--build-green)",
  Cursor: "var(--code-blue)",
  v0: "var(--code-blue)",
  Bolt: "var(--hammer-yellow)",
  Replit: "var(--warning-orange)",
  Lovable: "var(--prompt-purple)",
  Vercel: "var(--code-blue)",
  Supabase: "var(--supabase-green)",
  Firebase: "var(--warning-orange)",
  Stripe: "var(--hammer-yellow)",
  Auth: "var(--prompt-purple)",
  CSS: "var(--warning-orange)",
  Annat: "var(--soft-olive)",
};

export function toolAccent(tool: string): string {
  return TOOL_ACCENT[tool] ?? "var(--soft-olive)";
}
