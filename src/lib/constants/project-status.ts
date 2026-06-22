import type { ProjectStatus } from "@/types/firestore";

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "idea",      label: "Idé — håller fortfarande på att tänka" },
  { value: "mvp",       label: "MVP — halvfärdigt men fungerar" },
  { value: "live",      label: "Live — lanserad, folk använder det" },
  { value: "feedback",  label: "Söker feedback — behöver input" },
  { value: "testers",   label: "Behöver betatestare — prova det?" },
  { value: "cofounder", label: "Söker medgrundare — vill du bygga med?" },
];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  idea:      "Idé",
  mvp:       "MVP",
  live:      "Live",
  feedback:  "Söker feedback",
  testers:   "Behöver testare",
  cofounder: "Söker medgrundare",
};

export const STATUS_ACCENT: Record<ProjectStatus, string> = {
  idea:      "var(--hammer-yellow)",
  mvp:       "var(--build-green)",
  live:      "var(--supabase-green)",
  feedback:  "var(--warning-orange)",
  testers:   "var(--code-blue)",
  cofounder: "var(--prompt-purple)",
};
