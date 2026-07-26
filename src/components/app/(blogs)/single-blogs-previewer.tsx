"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  content: any;
};



const renderHTML = (html: string) => {
  if (!html || html.trim() === "") return "";
  return { __html: html };
};

// --- IMAGE COMPONENT ---
const ImageBlock: React.FC<{ file?: any; caption?: string }> = ({ file, caption }) => {
  if (!file?.url) return null;

  return (
    <div className="my-8 flex flex-col items-center p-0">
      <Image
        src={file.url}
        alt={caption || "Image"}
        width={800}
        height={350}
        className="object-contain max-h-[350px]"
      />
    </div>
  );
};

// --- CODE COMPONENT ---
const CodeBlock: React.FC<{ code?: string }> = ({ code }) => {
  if (!code) return null;
  return (
    <pre className="mb-2 overflow-x-auto p-4 bg-gray-300 dark:bg-gray-800 rounded text-sm">
      <code>{code}</code>
    </pre>
  );
};

export const SingleBlogPreviewer: React.FC<Props> = ({ content }) => {
  const [openToggles, setOpenToggles] = useState<Record<string, boolean>>({});
  console.log("The conetent is ",content)

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  if (!content || !content.blocks?.length) return null;

  const handleToggleClick = (id: string) => {
    setOpenToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const alertClasses: Record<string, string> = {
    primary: "bg-blue-100 border border-blue-400 text-blue-800",
    secondary: "bg-gray-100 border border-gray-400 text-gray-800",
    info: "bg-sky-100 border border-sky-400 text-sky-800",
    success: "bg-green-100 border border-green-400 text-green-800",
    warning: "bg-yellow-100 border border-yellow-400 text-yellow-800",
    danger: "bg-red-100 border border-red-400 text-red-800",
    light: "bg-white border border-gray-300 text-gray-900",
    dark: "bg-gray-800 border border-gray-900 text-white",
  };

  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="prose dark:prose-invert max-w-6xl mx-auto mt-8">
      {content.blocks.map((block: any, index: number) => {
        const type = block.type.toLowerCase();

        switch (type) {
          case "toggle": {
            const isOpen = openToggles[block.id] ?? block.data.status === "open";
            if (!block.data.text && !block.data.itemsContent) return null;
            return (
              <div key={index} className="mb-4 border rounded-md shadow-sm">
                <button
                  onClick={() => handleToggleClick(block.id)}
                  className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold flex justify-between items-center"
                >
                  <span>{block.data.text}</span>
                  <span>{isOpen ? "▼" : "►"}</span>
                </button>
                {isOpen && block.data.itemsContent && (
                  <div
                    className="px-4 py-2 dark:text-gray-400"
                    // @ts-expect-error dangerouslySetInnerHTML type mismatch
                    dangerouslySetInnerHTML={renderHTML(block.data.itemsContent)}
                  />
                )}
              </div>
            );
          }

          case "alert": {
            if (!block.data) return null;
            const alertMessage = block.data.message?.trim();
            if (!alertMessage) return null;
            const alertTitle = block.data.title === "Be Attentivte" ? "Be Attentive" : block.data.title;
            const alertType = block.data.type || "warning";
            const alertAlign = block.data.align || "left";

            return (
              <div
                key={block.id}
                className={`mb-4 p-4 rounded ${alertClasses[alertType]} ${alignClasses[alertAlign]}`}
              >
                {alertTitle && <strong className="block mb-1">{alertTitle}</strong>}
                <span 
                  // @ts-expect-error dangerouslySetInnerHTML type mismatch
                  dangerouslySetInnerHTML={renderHTML(alertMessage)} 
                />
              </div>
            );
          }

          case "warning": {
            if (!block.data) return null;
            const alertTitle = block.data.title?.trim() || "Warning";
            const alertMessage = block.data.message?.trim();
            if (!alertMessage) return null;

            return (
              <div className="mb-4 p-4 rounded bg-yellow-100 border border-yellow-400 text-yellow-800 text-left">
                {alertTitle && <strong className="block mb-1">{alertTitle}</strong>}
                <span>{alertMessage}</span>
              </div>
            );
          }

          case "paragraph":
          case "aitext": {
            const text = block.data.text?.trim();
            if (!text) return null;
            return (
              <p
                key={index}
                className="text-justify leading-loose text-lg text-gray-800 dark:text-gray-400 mb-4"
                // @ts-expect-error dangerouslySetInnerHTML type mismatch
                dangerouslySetInnerHTML={renderHTML(text)}
              />
            );
          }

          case "linktool": {
            const link = block.data.link;
            const meta = block.data.meta;
            if (!link) return null;
            return (
              <div key={index} className="my-4 p-4 border rounded-md shadow-sm flex items-start">
                {meta?.image?.url && (
                  <div className="mr-4 flex-shrink-0">
                    <Image src={meta.image.url} alt={meta.title || "Link preview"} width={100} height={100} />
                  </div>
                )}
                <div className="flex-1">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {meta?.title || link}
                  </a>
                  {meta?.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{meta.description}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">{link}</p>
                </div>
              </div>
            );
          }

          case "attaches": {
            const file = block.data.file;
            const title = block.data.title || file?.name || "Download";
            if (!file?.url) return null;
            return (
              <div key={index} className="mb-4">
                <a
                  href={file.url}
                  download={title}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {title}
                </a>
              </div>
            );
          }

          case "mermaid":
            return (
              <div key={index} className="my-4 p-4 bg-muted rounded-lg text-center text-muted-foreground">
                <p className="text-sm">Mermaid diagram (preview not available)</p>
              </div>
            );

          case "image":
            return <ImageBlock key={index} file={block.data.file} caption={block.data.caption} />;

          case "code":
            return <CodeBlock key={index} code={block.data.code} />;

          case "header": {
            if (!block.data.text) return null;
            const Tag =
              block.data.level === 1
                ? "h1"
                : block.data.level === 2
                ? "h2"
                : block.data.level === 3
                ? "h3"
                : "h4";
            const classes =
              block.data.level === 1
                ? "text-4xl font-bold mt-5 mb-4 text-gray-900 dark:text-gray-400"
                : block.data.level === 2
                ? "text-3xl font-semibold mt-5 mb-1 text-gray-900 dark:text-gray-400"
                : block.data.level === 3
                ? "text-2xl font-semibold mt-8 mb-1 text-gray-900 dark:text-gray-400"
                : "text-xl font-semibold mt-6 mb-1 text-gray-900 dark:text-gray-400";
            return React.createElement(Tag, { key: index, className: classes }, block.data.text);
          }

          case "list": {
            if (!block.data.items?.length) return null;
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            const listClass =
              block.data.style === "ordered"
                ? "list-decimal list-inside space-y-1 "
                : "list-disc list-inside space-y-1 ";
            return (
              <ListTag key={index} className={listClass}>
                {block.data.items.map((item: any, i: number) => (
                  <li
                    key={i}
                    // @ts-expect-error dangerouslySetInnerHTML type mismatch
                    dangerouslySetInnerHTML={renderHTML(
                      typeof item === "string" ? item : item.content || ""
                    )}
                  />
                ))}
              </ListTag>
            );
          }

          case "checklist": {
            if (!block.data.items?.length) return null;
            return (
              <ul key={index} className="space-y-1 mb-4">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span 
                      // @ts-expect-error dangerouslySetInnerHTML type mismatch
                      dangerouslySetInnerHTML={renderHTML(item.text)} 
                    />
                  </li>
                ))}
              </ul>
            );
          }

          case "delimiter": {
            const style = block.data?.style || "star";
            const delimiterStyles: Record<string, string> = {
              star: "★ ★ ★ ★ ★",
              dash: "— — — — —",
              line: "──────────────",
            };
            return (
              <div key={index} className="my-4 text-center text-gray-400 dark:text-gray-500">
                {delimiterStyles[style] || delimiterStyles.star}
              </div>
            );
          }

          case "raw":
            if (!block.data.html) return null;
            return (
              <div className="my-8" key={index} 
                // @ts-expect-error dangerouslySetInnerHTML type mismatch
                dangerouslySetInnerHTML={renderHTML(block.data.html)} 
              />
            );

          case "quote":
            if (!block.data.text) return null;
            return (
              <blockquote
                key={index}
                className="border-blue-500 italic text-gray-600 dark:text-gray-300 mb-2"
              >
                {block.data.text}
                {block.data.caption && (
                  <footer className="mt-2 text-sm text-gray-400">— {block.data.caption}</footer>
                )}
              </blockquote>
            );

          default:
            return null;
        }
      })}

      <style jsx global>{`
        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};