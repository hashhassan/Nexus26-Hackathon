"use client";

import { useState } from "react";
import { Send, Star } from "lucide-react";
import { toast } from "sonner";
import { rateComplaintSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const RATING_LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

type RatingCardProps = {
  rating: number | null;
  ratingComment: string | null;
};

export function RatingCard({ rating: initialRating, ratingComment: initialComment }: RatingCardProps) {
  const [saved, setSaved] = useState<{ rating: number; comment: string | null } | null>(
    initialRating !== null ? { rating: initialRating, comment: initialComment } : null,
  );
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const parsed = rateComplaintSchema.safeParse({ rating: value || undefined, comment });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    // Mock only: the rating action arrives in Task 8.
    setSaved({ rating: parsed.data.rating, comment: parsed.data.comment || null });
    toast.success("Thanks for rating this resolution");
  }

  const shown = hover || value;

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Rate this resolution</h2>
          <p className="mt-1 font-body-md text-body-md text-secondary">
            {saved
              ? "Thank you for your feedback."
              : "Help us improve campus services. How satisfied are you with the resolution speed and communication?"}
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
          <Star className="size-5" />
        </div>
      </div>

      {saved ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1" aria-label={`Rated ${saved.rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn("size-7", n <= saved.rating ? "fill-amber-500 text-amber-500" : "fill-surface-dim text-surface-dim")}
              />
            ))}
            <span className="ml-2 font-label-md text-label-md text-secondary">{RATING_LABELS[saved.rating - 1]}</span>
          </div>
          {saved.comment ? (
            <p className="rounded-lg bg-surface-container-low p-3 font-body-md text-body-md text-on-surface-variant">
              {saved.comment}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  title={`${n} Star${n > 1 ? "s" : ""} - ${RATING_LABELS[n - 1]}`}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => {
                    setValue(n);
                    setErrors((e) => ({ ...e, rating: "" }));
                  }}
                  className="transition duration-200 hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={cn(
                      "size-8 transition-colors",
                      n <= shown ? "fill-amber-500 text-amber-500" : "fill-surface-dim text-surface-dim",
                    )}
                  />
                </button>
              ))}
            </div>
            <span className={cn("font-label-md text-label-md", errors.rating ? "text-error" : "text-secondary")}>
              {errors.rating || (shown ? RATING_LABELS[shown - 1] : "Click to rate")}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rating-comment" className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Optional Student Feedback
            </label>
            <textarea
              id="rating-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              aria-invalid={!!errors.comment}
              placeholder="Optional feedback for the department staff..."
              className="w-full rounded-lg bg-surface-container-low p-3 font-body-md text-body-md text-on-surface transition-all placeholder:text-secondary/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 aria-invalid:ring-2 aria-invalid:ring-error"
            />
            {errors.comment ? <span className="font-label-sm text-[11px] text-error">{errors.comment}</span> : null}
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover active:translate-y-0"
            >
              <Send className="size-[18px]" />
              Submit Rating
            </button>
          </div>
        </>
      )}
    </section>
  );
}
