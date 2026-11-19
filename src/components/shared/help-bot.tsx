"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CHIP_QUESTIONS,
  FALLBACK_ANSWER,
  entryForQuestion,
  findEntry,
  type HelpRole,
} from "@/lib/help-bot-answers";
import { cn } from "@/lib/utils";

type Message = { id: number; from: "bot" | "user"; text: string };

const GREETING = "Hi! I can help you use CampusConnect. Pick a question or type your own.";

export function HelpBot({ role }: { role: HelpRole }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", text: GREETING }]);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  function ask(text: string, chipQuestion?: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry = chipQuestion ? entryForQuestion(role, chipQuestion) : findEntry(role, trimmed);
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, from: "user", text: trimmed },
      { id: nextId.current++, from: "bot", text: entry?.answer ?? FALLBACK_ANSWER },
    ]);
    setInput("");
  }

  return (
    <>
      <div
        role="dialog"
        aria-label="CampusConnect Assistant"
        aria-hidden={!open}
        className={cn(
          "fixed bottom-24 right-6 z-50 flex max-h-[420px] w-80 max-w-[calc(100vw-3rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-surface-container-lowest shadow-lg transition duration-200",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="flex items-center justify-between bg-primary-container px-4 py-3 text-on-primary">
          <div className="flex items-center gap-2">
            <Bot className="size-5" />
            <span className="font-title-md text-body-md">CampusConnect Assistant</span>
          </div>
          <button
            type="button"
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
            className="group rounded-md p-1 transition duration-200 hover:bg-white/15"
          >
            <X className="size-5 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 font-body-md text-body-md",
                m.from === "bot"
                  ? "self-start rounded-bl-sm bg-surface-container-low text-on-surface"
                  : "self-end rounded-br-sm bg-primary-container text-on-primary",
              )}
            >
              {m.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto border-t border-border px-3 py-2">
          {CHIP_QUESTIONS[role].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q, q)}
              className="rounded-full bg-surface-container px-2.5 py-1 text-left font-label-sm text-label-sm normal-case tracking-normal text-on-surface transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          className="flex items-center gap-2 border-t border-border p-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            aria-label="Type your question"
          />
          <Button type="submit" size="icon" aria-label="Send" className="group shrink-0">
            <Send className="transition-transform duration-200 group-hover/button:scale-110" />
          </Button>
        </form>
      </div>

      <button
        type="button"
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group fixed bottom-6 right-6 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary-container text-on-primary shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover hover:shadow-xl"
      >
        <Bot className="size-7 transition-transform duration-200 group-hover:scale-110" />
      </button>
    </>
  );
}
