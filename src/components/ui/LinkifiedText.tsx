// Renders plain text with URLs as clickable links.
// Detects: https?://, www., and bare domains with known TLDs (e.g. Aikostnad.se).
// Works in both server and client components — no state or event handlers.

// Common TLDs for a Swedish AI/startup context. Kept as an alternation to avoid
// false positives like "Next.js", "v1.0.0", "file.txt".
const TLD = "se|com|org|net|io|ai|app|dev|co|me|tech|digital|nu|eu|info|biz|shop|store|online|site|studio|cloud|web|agency|media|design|se";

// Bare domain: at least 2 chars before the dot + known TLD + optional path.
// Requires first char to be a letter (avoids "1.se" but allows "a1.se").
const BARE_DOMAIN = `[a-zA-Z][a-zA-Z0-9-]{1,}\\.(?:${TLD})(?:\\/[^\\s]*)?`;

const SPLIT_RE = new RegExp(
  `(https?:\\/\\/[^\\s]+|www\\.[^\\s]+|${BARE_DOMAIN})`,
  "i"
);

function isUrl(s: string) {
  return (
    /^https?:\/\//i.test(s) ||
    /^www\./i.test(s) ||
    new RegExp(`^[a-zA-Z][a-zA-Z0-9-]{1,}\\.(?:${TLD})`, "i").test(s)
  );
}

function cleanUrl(raw: string): string {
  return raw.replace(/[.,):;!?'"»]+$/, "");
}

function toHref(s: string): string {
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

export function LinkifiedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(SPLIT_RE);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (isUrl(part)) {
          const clean = cleanUrl(part);
          const trailing = part.slice(clean.length);
          const href = toHref(clean);
          return (
            <span key={i}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-build-green underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                {clean}
              </a>
              {trailing}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
