import React, { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Search,
  Upload,
  X,
} from "lucide-react";
import { authStorage, uploadToSupabaseStorage } from "../../lib/api";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";

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

interface TabsProps {
  tabs: { id: string; label: string; icon?: LucideIcon }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
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
    <label className="grid gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">{label}</span>
        {hint ? <span className="text-[10px] text-stone-400">{hint}</span> : null}
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
    <section className={cn("admin-soft-surface p-6 md:p-10", className)}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-stone-500 opacity-80">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      <div className="grid gap-8">{children}</div>
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em]",
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
      <div className="flex items-center gap-4">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", toneIconClasses[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</div>
          <div className="truncate font-serif text-2xl font-extrabold text-stone-900">{value}</div>
        </div>
      </div>
      {description ? <p className="mt-3 text-[10px] leading-relaxed text-stone-500 opacity-60">{description}</p> : null}
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
    <div className="space-y-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          {eyebrow ? <div className="admin-kicker">{eyebrow}</div> : null}
          <div className="space-y-2">
            <h1 className="max-w-4xl font-serif text-5xl font-extrabold leading-[0.9] tracking-tighter text-stone-900 md:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-base leading-relaxed text-stone-500 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3 pb-2">{actions}</div> : null}
      </div>
      {meta ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{meta}</div> : null}
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

      <TextInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={inputPlaceholder}
      />
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5 rounded-[1.5rem] bg-stone-200/50 p-1.5", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
              isActive
                ? "bg-white text-stone-950 shadow-sm shadow-stone-200"
                : "text-stone-500 hover:bg-white/40 hover:text-stone-700"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-accent-500" />
      <input
        {...props}
        className={cn("admin-input pl-11", className)}
      />
    </div>
  );
}

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

export function Select({ options, value, onChange, className, disabled, ...props }: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
      className={cn(
        "admin-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10",
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "2xl",
}: AdminModalProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl",
              maxWidthClasses[maxWidth]
            )}
          >
            <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8">
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-stone-500 opacity-80">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-stone-100 bg-stone-50/50 p-6 sm:p-8">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
