// Renders plain text with https?:// URLs as clickable links.
// Works in both server and client components — no state or event handlers.
const URL_RE = /(https?:\/\/[^\s]+)/g;

function cleanUrl(raw: string): string {
  // Strip common trailing punctuation that isn't part of the URL
  return raw.replace(/[.,):;!?'"]+$/, "");
}

export function LinkifiedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(URL_RE);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const href = cleanUrl(part);
          const trailing = part.slice(href.length);
          return (
            <span key={i}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-build-green underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                {href}
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
