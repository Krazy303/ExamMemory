import { ReactNode } from "react";

const EMOJI_MAP: Record<string, string> = {
  ":smile:": "😊",
  ":laughing:": "😆",
  ":blush:": "😊",
  ":heart:": "❤️",
  ":fire:": "🔥",
  ":thumbsup:": "👍",
  ":check:": "✅",
  ":warn:": "⚠️",
  ":warning:": "⚠️",
  ":error:": "❌",
  ":cross:": "❌",
  ":cry:": "😢",
  ":sob:": "😭",
  ":wink:": "😉",
  ":thinking:": "🤔",
  ":eyes:": "👀",
  ":ok_hand:": "👌",
  ":clap:": "👏",
  ":party:": "🎉",
  ":tada:": "🎉",
  ":star:": "⭐",
  ":sparkles:": "✨",
  ":book:": "📖",
  ":bulb:": "💡",
  ":rocket:": "🚀",
  ":cool:": "😎",
  ":sunglasses:": "😎",
  ":dance:": "💃",
};

function replaceEmojis(text: string): string {
  return text.replace(/:[a-z0-9_]+:/g, (match) => {
    return EMOJI_MAP[match] || match;
  });
}

export function parseInline(text: string): ReactNode {
  if (!text) return "";

  // Replace standard emoji codes
  const textWithEmojis = replaceEmojis(text);

  interface Token {
    type:
      | "text"
      | "bold"
      | "italic"
      | "bolditalic"
      | "code"
      | "link"
      | "image"
      | "strike"
      | "mark"
      | "footnoteRef";
    text: string;
    href?: string;
    alt?: string;
    footnoteId?: string;
  }

  let tokens: Token[] = [{ type: "text", text: textWithEmojis }];

  // 1. Parse Images: ![alt](url)
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(!\[.*?\]\(.*?\))/g);
    return parts.map((part) => {
      const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return { type: "image", text: imgMatch[2], alt: imgMatch[1] };
      }
      return { type: "text", text: part };
    });
  });

  // 2. Parse Links: [title](url)
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part) => {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return { type: "link", text: linkMatch[1], href: linkMatch[2] };
      }
      return { type: "text", text: part };
    });
  });

  // 3. Parse Inline Code: `code`
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(`[^`]+`)/g);
    return parts.map((part) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return { type: "code", text: part.slice(1, -1) };
      }
      return { type: "text", text: part };
    });
  });

  // 4. Parse Bold + Italic: ***bolditalic***
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(\*\*\*.*?\*\*\*)/g);
    return parts.map((part) => {
      if (part.startsWith("***") && part.endsWith("***")) {
        return { type: "bolditalic", text: part.slice(3, -3) };
      }
      return { type: "text", text: part };
    });
  });

  // 5. Parse Bold: **bold**
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return { type: "bold", text: part.slice(2, -2) };
      }
      return { type: "text", text: part };
    });
  });

  // 6. Parse Italic: *italic*
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(\*.*?\*)/g);
    return parts.map((part) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return { type: "italic", text: part.slice(1, -1) };
      }
      return { type: "text", text: part };
    });
  });

  // 7. Parse Footnote References: [^1]
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(\[\^[^\]]+\])/g);
    return parts.map((part) => {
      const fnMatch = part.match(/^\[\^([^\]]+)\]$/);
      if (fnMatch) {
        return {
          type: "footnoteRef",
          text: fnMatch[1],
          footnoteId: fnMatch[1],
        };
      }
      return { type: "text", text: part };
    });
  });

  // 8. Parse Strikethrough: ~~deleted~~
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(~~.*?~~)/g);
    return parts.map((part) => {
      if (part.startsWith("~~") && part.endsWith("~~")) {
        return { type: "strike", text: part.slice(2, -2) };
      }
      return { type: "text", text: part };
    });
  });

  // 9. Parse Highlight: <mark>highlight</mark>
  tokens = tokens.flatMap((t) => {
    if (t.type !== "text") return t;
    const parts = t.text.split(/(<mark>.*?<\/mark>)/gi);
    return parts.map((part) => {
      if (
        part.toLowerCase().startsWith("<mark>") &&
        part.toLowerCase().endsWith("</mark>")
      ) {
        return { type: "mark", text: part.slice(6, -7) };
      }
      return { type: "text", text: part };
    });
  });

  // Render tokens into React elements
  return (
    <>
      {tokens.map((tok, i) => {
        switch (tok.type) {
          case "image":
            return (
              <img
                key={i}
                src={tok.text}
                alt={tok.alt}
                className="max-w-full rounded-xl border border-white/10 my-2 inline-block"
              />
            );
          case "link":
            return (
              <a
                key={i}
                href={tok.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {tok.text}
              </a>
            );
          case "code":
            return (
              <code
                key={i}
                className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5 font-mono text-[12px] text-white/95"
              >
                {tok.text}
              </code>
            );
          case "bolditalic":
            return (
              <strong key={i} className="font-bold italic text-white">
                {tok.text}
              </strong>
            );
          case "bold":
            return (
              <strong key={i} className="font-bold text-white">
                {tok.text}
              </strong>
            );
          case "italic":
            return (
              <em key={i} className="italic text-white/90">
                {tok.text}
              </em>
            );
          case "footnoteRef":
            return (
              <sup
                key={i}
                className="text-primary font-mono text-[9px] cursor-pointer hover:underline px-0.5 font-bold"
                title={`Footnote ${tok.footnoteId}`}
              >
                {tok.footnoteId}
              </sup>
            );
          case "strike":
            return (
              <span key={i} className="line-through text-white/40">
                {tok.text}
              </span>
            );
          case "mark":
            return (
              <mark
                key={i}
                className="bg-primary/30 text-white rounded px-1.5 py-0.5"
              >
                {tok.text}
              </mark>
            );
          default:
            return tok.text;
        }
      })}
    </>
  );
}

export function Markdown({ text }: { text: string }) {
  if (!text) return null;

  // 1. Isolate code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);
  const blockElements: ReactNode[] = [];
  const footnoteDefs: { id: string; content: string }[] = [];

  parts.forEach((part, pIdx) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      // Code Block
      const lines = part.split("\n");
      const firstLine = lines[0].slice(3).trim(); // Language name
      const codeLines = lines.slice(1, -1);
      const codeText = codeLines.join("\n");

      blockElements.push(
        <div
          key={`codeblock-${pIdx}`}
          className="my-4 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[13px] text-white/90 overflow-x-auto"
        >
          <div className="flex justify-between items-center text-[10px] text-[color:var(--link)] uppercase font-semibold mb-2 tracking-wider">
            <span>{firstLine || "code"}</span>
          </div>
          <pre>
            <code>{codeText}</code>
          </pre>
        </div>,
      );
    } else {
      // Normal Markdown text
      const lines = part.split("\n");
      let currentTableLines: string[] = [];

      const flushTable = (key: number) => {
        if (currentTableLines.length === 0) return;

        const parsedRows = currentTableLines.map((line) => {
          const parts = line.split("|").map((p) => p.trim());
          return parts.slice(1, -1);
        });

        const isDividerRow = (row: string[]) =>
          row.every((cell) => /^:?-+:?$/.test(cell));
        const cleanRows = parsedRows.filter(
          (row) => row.length > 0 && !isDividerRow(row),
        );

        if (cleanRows.length > 0) {
          const headers = cleanRows[0];
          const dataRows = cleanRows.slice(1);

          blockElements.push(
            <div
              key={`table-${key}`}
              className="overflow-x-auto my-3 rounded-xl border border-white/10 bg-white/[0.01]"
            >
              <table className="min-w-full divide-y divide-white/10 text-[13px]">
                <thead className="bg-white/5">
                  <tr>
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-4 py-2.5 text-left font-semibold text-white"
                      >
                        {parseInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.01]">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5 text-white/80">
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>,
          );
        }
        currentTableLines = [];
      };

      lines.forEach((line, idx) => {
        // Footnote definitions: [^1]: content
        const fnDefMatch = line.match(/^\[\^([^\]]+)\]:\s*(.*)/);
        if (fnDefMatch) {
          footnoteDefs.push({ id: fnDefMatch[1], content: fnDefMatch[2] });
          return;
        }

        const trimmed = line.trim();
        const isTableLine = trimmed.startsWith("|") && trimmed.endsWith("|");

        if (isTableLine) {
          currentTableLines.push(trimmed);
        } else {
          if (currentTableLines.length > 0) {
            flushTable(idx);
          }

          // Get indentation spaces count for nested list support
          const leadingSpaces = line.match(/^(\s*)/)?.[0].length || 0;
          const plStyle =
            leadingSpaces > 0
              ? { paddingLeft: `${Math.max(1, leadingSpaces / 2) * 16}px` }
              : undefined;

          // Blockquote
          if (trimmed.startsWith("> ")) {
            blockElements.push(
              <blockquote
                key={`bq-${idx}`}
                className="border-l-4 border-primary/50 pl-4 py-1 italic text-white/70 my-3 bg-white/[0.02] rounded-r-lg"
              >
                {parseInline(trimmed.slice(2))}
              </blockquote>,
            );
          }
          // Horizontal Rule
          else if (trimmed === "---" || trimmed === "***") {
            blockElements.push(
              <hr
                key={`hr-${idx}`}
                className="border-t border-white/10 my-4"
              />,
            );
          }
          // Headings (1 to 6)
          else if (trimmed.startsWith("###### ")) {
            blockElements.push(
              <h6
                key={`h6-${idx}`}
                className="text-[12px] font-bold text-white/70 mt-2 mb-1 uppercase tracking-wider"
              >
                {parseInline(trimmed.slice(7))}
              </h6>,
            );
          } else if (trimmed.startsWith("##### ")) {
            blockElements.push(
              <h5
                key={`h5-${idx}`}
                className="text-[13px] font-bold text-white/80 mt-2 mb-1 uppercase tracking-wider"
              >
                {parseInline(trimmed.slice(6))}
              </h5>,
            );
          } else if (trimmed.startsWith("#### ")) {
            blockElements.push(
              <h4
                key={`h4-${idx}`}
                className="text-[14px] font-bold text-white mt-3 mb-1"
              >
                {parseInline(trimmed.slice(5))}
              </h4>,
            );
          } else if (trimmed.startsWith("### ")) {
            blockElements.push(
              <h3
                key={`h3-${idx}`}
                className="text-[15px] font-bold text-white mt-3 mb-1"
              >
                {parseInline(trimmed.slice(4))}
              </h3>,
            );
          } else if (trimmed.startsWith("## ")) {
            blockElements.push(
              <h2
                key={`h2-${idx}`}
                className="text-[17px] font-bold text-white mt-4 mb-2"
              >
                {parseInline(trimmed.slice(3))}
              </h2>,
            );
          } else if (trimmed.startsWith("# ")) {
            blockElements.push(
              <h1
                key={`h1-${idx}`}
                className="text-[20px] font-bold text-white mt-5 mb-2"
              >
                {parseInline(trimmed.slice(2))}
              </h1>,
            );
          }
          // Task List (Checked)
          else if (
            trimmed.startsWith("- [x] ") ||
            trimmed.startsWith("* [x] ") ||
            trimmed.startsWith("- [X] ") ||
            trimmed.startsWith("* [X] ")
          ) {
            blockElements.push(
              <div
                key={`task-${idx}`}
                style={plStyle}
                className="flex items-center gap-2.5 text-[14px] my-1"
              >
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                />
                <span className="flex-1 text-white/40 line-through">
                  {parseInline(trimmed.slice(6))}
                </span>
              </div>,
            );
          }
          // Task List (Unchecked)
          else if (
            trimmed.startsWith("- [ ] ") ||
            trimmed.startsWith("* [ ] ")
          ) {
            blockElements.push(
              <div
                key={`task-${idx}`}
                style={plStyle}
                className="flex items-center gap-2.5 text-[14px] my-1"
              >
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                />
                <span className="flex-1 text-white/90">
                  {parseInline(trimmed.slice(6))}
                </span>
              </div>,
            );
          }
          // Unordered List
          else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            blockElements.push(
              <div
                key={`ul-${idx}`}
                style={plStyle}
                className="flex items-start gap-2 text-[14px] my-1"
              >
                <span className="text-primary mt-1.5 font-bold text-[10px]">
                  •
                </span>
                <span className="flex-1 text-white/90">
                  {parseInline(trimmed.slice(2))}
                </span>
              </div>,
            );
          }
          // Ordered List
          else if (/^\d+\.\s+/.test(trimmed)) {
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
              const num = numMatch[1];
              const rest = numMatch[2];
              blockElements.push(
                <div
                  key={`ol-${idx}`}
                  style={plStyle}
                  className="flex items-start gap-2 text-[14px] my-1"
                >
                  <span className="text-primary font-semibold min-w-[1.2rem] text-right">
                    {num}.
                  </span>
                  <span className="flex-1 text-white/90">
                    {parseInline(rest)}
                  </span>
                </div>,
              );
            }
          }
          // Default Paragraph
          else {
            blockElements.push(
              <p
                key={`p-${idx}`}
                style={plStyle}
                className="text-[14px] min-h-[1.2em] leading-relaxed text-white/90 my-1"
              >
                {parseInline(line)}
              </p>,
            );
          }
        }
      });

      if (currentTableLines.length > 0) {
        flushTable(lines.length);
      }
    }
  });

  return (
    <div className="space-y-1">
      {blockElements}

      {/* Footnotes Definition Section */}
      {footnoteDefs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5 text-[11px] text-[color:var(--link)]">
          <div className="font-semibold uppercase tracking-wider text-[10px]">
            Footnotes
          </div>
          {footnoteDefs.map((def) => (
            <div key={def.id} className="flex items-start gap-1.5">
              <span className="font-mono text-primary font-bold">
                [{def.id}]
              </span>
              <span className="flex-1 text-white/70">
                {parseInline(def.content)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
