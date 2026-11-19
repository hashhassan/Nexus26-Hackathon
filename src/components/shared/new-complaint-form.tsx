"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, CloudUpload, Send, Split, X } from "lucide-react";
import { toast } from "sonner";
import { DEPARTMENTS, DEPARTMENT_KEYS } from "@/lib/constants";
import { createComplaintSchema, updateMyComplaintSchema } from "@/lib/schemas";
import { createComplaint, updateMyComplaint } from "@/server/actions/complaints";
import { cn } from "@/lib/utils";
import { DepartmentIcon } from "./department-icon";

type Department = keyof typeof DEPARTMENTS;

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg"];

const fieldClass =
  "w-full rounded-lg bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface shadow-[0_0_0_1px_var(--color-surface-dim)] transition duration-200 placeholder:text-secondary/60 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary-container),0_0_0_4px_rgb(55_48_163/0.12)] aria-invalid:shadow-[0_0_0_2px_var(--color-error)]";

function StepHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-container font-label-sm text-label-sm font-semibold text-on-primary">
          {step}
        </span>
        <h2 className="font-headline-md text-headline-md font-medium text-on-surface">{title}</h2>
      </div>
      <span className="rounded bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm text-on-secondary-container">
        Step {step} of 2
      </span>
    </div>
  );
}

function Hint({ error, children }: { error?: string; children?: React.ReactNode }) {
  if (error) return <span className="font-label-sm text-[11px] text-error">{error}</span>;
  return children ? <span className="font-label-sm text-[11px] text-secondary">{children}</span> : null;
}

type EditValues = {
  id: string;
  department: Department;
  issueType: string;
  title: string;
  description: string;
  imageUrl: string | null;
};

/** Without `edit` this is the new-complaint form; with it, a PENDING complaint is edited (category and image locked). */
export function NewComplaintForm({ edit }: { edit?: EditValues }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [department, setDepartment] = useState<Department>(edit?.department ?? DEPARTMENT_KEYS[0]);
  const [issueType, setIssueType] = useState(edit?.issueType ?? "");
  const [title, setTitle] = useState(edit?.title ?? "");
  const [description, setDescription] = useState(edit?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dept = DEPARTMENTS[department];

  const previewRef = useRef<string | null>(null);

  // Revoke the object URL when leaving the page.
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function setAttachment(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setFile(next);
    setPreview(previewRef.current);
  }

  function selectDepartment(next: Department) {
    setDepartment(next);
    setIssueType("");
    setErrors((e) => ({ ...e, department: "", issueType: "" }));
  }

  function pickFile(picked?: File) {
    if (!picked) return;
    if (!ACCEPTED_TYPES.includes(picked.type)) {
      setFileError("Only PNG or JPG images are allowed");
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setFileError("Image must be 4MB or smaller");
      return;
    }
    setFileError(undefined);
    setAttachment(picked);
  }

  function removeFile() {
    setAttachment(null);
    setFileError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (edit) {
      const parsedEdit = updateMyComplaintSchema.safeParse({ issueType, title, description });
      if (!parsedEdit.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsedEdit.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      setSubmitting(true);
      const updated = await updateMyComplaint(edit.id, parsedEdit.data);
      if (!updated.ok) {
        setSubmitting(false);
        if (updated.fieldErrors) setErrors(updated.fieldErrors);
        toast.error(updated.error);
        return;
      }
      toast.success("Complaint updated");
      router.push(`/complaints/${edit.id}`);
      return;
    }
    const parsed = createComplaintSchema.safeParse({ department, issueType, title, description });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const body = new FormData();
    for (const [key, value] of Object.entries(parsed.data)) body.append(key, value);
    if (file) body.append("image", file);
    const result = await createComplaint(body);
    if (!result.ok) {
      setSubmitting(false);
      if (result.fieldErrors?.image) setFileError(result.fieldErrors.image);
      if (result.fieldErrors) setErrors(result.fieldErrors);
      toast.error(result.error);
      return;
    }
    toast.success("Complaint submitted");
    router.push(`/complaints/${result.id}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Step 1 */}
      <section className="mb-space-xl flex flex-col gap-space-md">
        <StepHeader step={1} title={edit ? "Category" : "Choose category"} />
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {(edit ? [department] : DEPARTMENT_KEYS).map((key) => {
            const selected = key === department;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => (edit ? undefined : selectDepartment(key))}
                className={cn(
                  "group relative flex h-44 flex-col justify-between rounded-xl p-space-lg text-left shadow-sm transition duration-200 hover:shadow-md",
                  edit ? "cursor-default" : "cursor-pointer",
                  selected
                    ? "bg-surface-container-low shadow-[0_0_0_2px_var(--color-primary-container)]"
                    : "bg-surface-container-lowest",
                )}
              >
                {selected ? (
                  <span className="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-on-primary">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                ) : null}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110",
                      selected ? "bg-surface-container-high text-primary" : "bg-surface-container text-secondary",
                    )}
                  >
                    <DepartmentIcon department={key} className="size-[22px]" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {DEPARTMENTS[key].label}
                  </span>
                  <span className="mt-0.5 font-body-md text-label-md text-secondary">{DEPARTMENTS[key].hint}</span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.department ? <Hint error={errors.department} /> : null}
        {edit ? <Hint>Category can&apos;t be changed after submission.</Hint> : null}

        <div className="flex flex-col items-start gap-3 rounded-xl bg-surface-container-low p-space-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <Split className="size-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary">
                Target Routing System
              </span>
              <p className="font-body-md text-body-md text-on-surface">
                This will be sent to: <span className="font-semibold text-primary">{dept.adminName}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2 */}
      <section className="flex flex-col gap-space-md">
        <StepHeader step={2} title="Issue details" />
        <div className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="flex flex-col gap-1.5 md:col-span-7">
              <label
                htmlFor="complaint-title"
                className="flex items-center justify-between font-label-md text-label-md font-semibold text-on-surface"
              >
                <span>Complaint Title</span>
                <span className="font-label-sm font-normal text-secondary">Required</span>
              </label>
              <input
                id="complaint-title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!errors.title}
                placeholder="e.g., Wi-Fi keeps disconnecting in the CS block"
                className={fieldClass}
              />
              <Hint error={errors.title}>Briefly summarize the defect, service lapse, or physical obstruction.</Hint>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-5">
              <label
                htmlFor="issue-type"
                className="flex items-center justify-between font-label-md text-label-md font-semibold text-on-surface"
              >
                <span>Issue Type / Subcategory</span>
                <span className="font-label-sm font-normal text-secondary">Required</span>
              </label>
              <div className="relative">
                <select
                  id="issue-type"
                  name="issueType"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  aria-invalid={!!errors.issueType}
                  className={cn(fieldClass, "cursor-pointer appearance-none pr-10", !issueType && "text-secondary/60")}
                >
                  <option value="">Select an issue type</option>
                  {dept.issueTypes.map((type) => (
                    <option key={type} value={type} className="text-on-surface">
                      {type}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-secondary">
                  <ChevronDown className="size-5" />
                </span>
              </div>
              <Hint error={errors.issueType}>Determines the tier of staff assigned to dispatch.</Hint>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="complaint-description" className="font-label-md text-label-md font-semibold text-on-surface">
                Detailed Description
              </label>
              <span className={cn("font-label-sm text-label-sm", description.length > 1000 ? "text-error" : "text-secondary")}>
                {description.length.toLocaleString("en-US")} / 1,000 characters
              </span>
            </div>
            <textarea
              id="complaint-description"
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
              placeholder="Please describe the problem clearly. Include when it started, any immediate safety or academic impact, and specific details that will help staff find it."
              className={fieldClass}
            />
            <Hint error={errors.description} />
          </div>

          {edit ? (
            edit.imageUrl ? (
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md font-semibold text-on-surface">Attached image</span>
                <div className="relative h-32 w-48 overflow-hidden rounded-lg bg-surface-container-high">
                  <Image src={edit.imageUrl} alt="Attached evidence" fill sizes="192px" className="object-cover" />
                </div>
                <Hint>The attachment can&apos;t be changed after submission.</Hint>
              </div>
            ) : null
          ) : (
          <div className="flex flex-col gap-2">
            <span className="flex items-center justify-between font-label-md text-label-md font-semibold text-on-surface">
              <span>Supporting Evidence &amp; Visual Documentation</span>
              <span className="font-label-sm font-normal text-secondary">Optional</span>
            </span>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files[0]);
              }}
              className={cn(
                "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl p-space-xl text-center outline-2 -outline-offset-4 outline-dashed outline-secondary-fixed-dim transition duration-200 hover:bg-surface-container-low",
                dragging ? "bg-surface-container-low" : "bg-surface-container-low/50",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high text-primary transition-transform group-hover:scale-110">
                <CloudUpload className="size-[26px]" />
              </div>
              <p className="font-title-md text-title-md font-medium text-on-surface">
                <span className="text-primary group-hover:underline">Drag and drop an image</span> or click to browse
              </p>
              <p className="mt-1 max-w-md font-body-md text-label-md text-secondary">PNG or JPG up to 4MB</p>
              {file && preview ? (
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-surface-container-lowest p-2 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Selected attachment preview" className="h-16 w-16 rounded-md object-cover" />
                  <span className="max-w-[12rem] truncate font-label-md text-label-md text-on-surface">{file.name}</span>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-secondary transition duration-200 hover:bg-surface-container hover:text-error"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>
            <Hint error={fileError} />
          </div>
          )}
        </div>
      </section>

      <footer className="mt-space-lg flex flex-col-reverse items-center justify-end gap-3 pt-space-md sm:flex-row">
        <Link
          href="/complaints"
          className="w-full rounded-xl bg-surface-container-lowest px-space-lg py-2.5 text-center font-label-md text-label-md font-medium text-on-surface shadow-sm transition duration-200 hover:bg-surface-container sm:w-auto"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full cursor-pointer disabled:pointer-events-none disabled:opacity-50 items-center justify-center gap-2 rounded-xl bg-primary-container px-space-xl py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover hover:shadow-lg active:translate-y-0 sm:w-auto"
        >
          <span>
            {submitting
              ? edit
                ? "Saving..."
                : file
                  ? "Uploading..."
                  : "Submitting..."
              : edit
                ? "Save changes"
                : "Submit complaint"}
          </span>
          {submitting ? null : <Send className="size-[18px]" />}
        </button>
      </footer>
    </form>
  );
}
