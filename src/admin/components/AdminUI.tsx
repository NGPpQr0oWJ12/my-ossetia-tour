import React, { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { authStorage, uploadToSupabaseStorage } from "../../lib/api";
import { cn } from "../../lib/utils";

type Tone = "default" | "accent" | "success" | "danger";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

interface SectionProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

interface NoticeProps {
  title?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  description?: string;
  tone?: Tone;
}

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

interface LoadingStateProps {
  title?: string;
  description?: string;
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  description?: string;
  aspectClassName?: string;
  inputPlaceholder?: string;
}

const toneClasses: Record<Tone, string> = {
  default: "border-stone-200/80 bg-white/80 text-stone-600",
  accent: "border-accent-500/20 bg-accent-500/10 text-accent-700",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  danger: "border-red-500/20 bg-red-500/10 text-red-700",
};

const toneIconClasses: Record<Tone, string> = {
  default: "bg-stone-900 text-white",
  accent: "bg-accent-500 text-white",
  success: "bg-emerald-600 text-white",
  danger: "bg-red-600 text-white",
};

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <label className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="admin-kicker">{label}</span>
        {hint ? <span className="text-xs text-stone-400">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
}

export function Section({
  title,
  description,
  actions,
  className,
  children,
}: SectionProps) {
  return (
    <section className={cn("admin-soft-surface p-6 md:p-8", className)}>
      <div className="mb-6 flex flex-col gap-4 border-b border-stone-100 pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="admin-kicker">Раздел</div>
          <h2 className="font-serif text-2xl font-extrabold text-stone-900">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-stone-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      <div className="grid gap-6">{children}</div>
    </section>
  );
}

export function Notice({
  title,
  tone = "default",
  className,
  children,
}: NoticeProps) {
  const Icon = tone === "danger" ? AlertCircle : CheckCircle2;

  return (
    <div className={cn("rounded-[1.4rem] border px-4 py-3.5", toneClasses[tone], className)}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="space-y-1">
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Badge({ tone = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="admin-soft-surface p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", toneIconClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="admin-kicker">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="font-serif text-3xl font-extrabold text-stone-900">{value}</div>
        {description ? <p className="text-sm leading-relaxed text-stone-500">{description}</p> : null}
      </div>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          {eyebrow ? <div className="admin-kicker">{eyebrow}</div> : null}
          <div className="space-y-2">
            <h1 className="max-w-3xl font-serif text-4xl font-extrabold leading-[0.95] text-stone-900 md:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {meta ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{meta}</div> : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="admin-soft-surface flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/10 text-accent-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-extrabold text-stone-900">{title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-stone-500">{description}</p>
      </div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  title = "Загрузка",
  description = "Подготавливаем данные и структуру страницы.",
}: LoadingStateProps) {
  return (
    <div className="admin-soft-surface flex min-h-[18rem] flex-col items-center justify-center px-6 py-10 text-center">
      <Loader2 className="mb-5 h-8 w-8 animate-spin text-accent-500" />
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-extrabold text-stone-900">{title}</h2>
        <p className="max-w-md text-sm text-stone-500">{description}</p>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-[1.3rem] border px-4 py-3 text-left transition-all duration-300",
        checked
          ? "border-accent-500/30 bg-accent-500/10"
          : "border-stone-200/80 bg-white/80 hover:border-stone-300",
      )}
      aria-pressed={checked}
    >
      <div className="space-y-1">
        <div className="text-sm font-semibold text-stone-900">{label}</div>
        {description ? <p className="text-xs leading-relaxed text-stone-500">{description}</p> : null}
      </div>
      <div
        className={cn(
          "relative h-7 w-12 rounded-full transition-colors",
          checked ? "bg-accent-500" : "bg-stone-300",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
            checked ? "left-6" : "left-1",
          )}
        />
      </div>
    </button>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("admin-input", className)} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("admin-textarea", className)} />;
}

export function ImageUpload({
  value,
  onChange,
  label,
  description,
  aspectClassName = "aspect-[16/10]",
  inputPlaceholder = "Или вставьте ссылку на изображение",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = authStorage.getToken();
    if (!token) {
      alert("Не найден токен авторизации.");
      return;
    }

    setUploading(true);

    try {
      const url = await uploadToSupabaseStorage(file, token);
      onChange(url);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить изображение.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {description ? <p className="text-sm leading-relaxed text-stone-500">{description}</p> : null}
      <div
        className={cn(
          "group relative overflow-hidden rounded-[1.5rem] border border-dashed border-stone-200 bg-stone-100/80 transition-all duration-300 hover:border-accent-500/40",
          aspectClassName,
        )}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="admin-button-secondary bg-white/95"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Обновить
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-stone-950/55 text-white backdrop-blur-md transition hover:bg-red-600"
                aria-label={`Удалить ${label}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-stone-500 transition-colors hover:text-accent-600"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-accent-600 shadow-sm">
                <ImagePlus className="h-6 w-6" />
              </div>
            )}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-stone-900">{label}</div>
              <div className="text-xs uppercase tracking-[0.26em] text-stone-400">
                Загрузить или выбрать URL
              </div>
            </div>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />

      <TextInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={inputPlaceholder}
      />
    </div>
  );
}
