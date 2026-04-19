import { FormEvent, type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import { ContactRound, LifeBuoy, Save, Settings2, UserRound } from "lucide-react";
import { adminApi } from "../lib/api";
import {
  AdminPageHeader,
  FormField,
  LoadingState,
  Notice,
  Section,
  StatCard,
  TextArea,
  TextInput,
} from "./components/AdminUI";

type FieldDefinition = {
  key: string;
  label: string;
  placeholder: string;
  rows?: number;
  hint?: string;
};

const CONTACT_PAGE_FIELDS: FieldDefinition[] = [
  {
    key: "contacts_title",
    label: "Заголовок страницы контактов",
    placeholder: "Свяжитесь с нами",
  },
  {
    key: "contacts_subtitle",
    label: "Подзаголовок",
    placeholder: "Поможем подобрать маршрут и ответим на организационные вопросы.",
    rows: 3,
  },
];

const CONTACT_FIELDS: FieldDefinition[] = [
  {
    key: "office_text",
    label: "Адрес или описание офиса",
    placeholder: "Владикавказ, Республика Северная Осетия...",
    rows: 3,
  },
  {
    key: "phones_text",
    label: "Телефоны",
    placeholder: "+7 (999) 123-45-67\n+7 (999) 765-43-21",
    rows: 3,
    hint: "Один номер на строку",
  },
  {
    key: "email_text",
    label: "Email",
    placeholder: "travel@myossetia.ru",
  },
  {
    key: "schedule_text",
    label: "Режим работы",
    placeholder: "Ежедневно с 09:00 до 20:00",
    rows: 3,
  },
];

const MESSENGER_FIELDS: FieldDefinition[] = [
  {
    key: "whatsapp_url",
    label: "Ссылка WhatsApp",
    placeholder: "https://wa.me/79991234567",
  },
  {
    key: "telegram_url",
    label: "Ссылка Telegram",
    placeholder: "https://t.me/myossetia",
  },
];

const GUIDE_FIELDS: FieldDefinition[] = [
  {
    key: "guide_name",
    label: "Имя гида",
    placeholder: "Аслан",
  },
  {
    key: "guide_bio",
    label: "Текст о гиде",
    placeholder: "Короткая история, опыт и подход к маршрутам.",
    rows: 5,
  },
];

export default function AdminSiteSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setStatus("");

    try {
      setForm(await adminApi.getSiteSettings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки настроек.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    try {
      await adminApi.updateSiteSettings(form);
      setStatus("Настройки сайта сохранены.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filledFields = useMemo(
    () => Object.values(form).filter((value) => String(value).trim().length > 0).length,
    [form],
  );

  if (loading) {
    return (
      <LoadingState
        title="Загрузка настроек сайта"
        description="Подтягиваем контактные данные, тексты и мессенджеры."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <AdminPageHeader
        eyebrow="Общие данные"
        title="Настройки сайта"
        description="Здесь редактируются контакты, описания и служебные тексты, которые переиспользуются на публичных страницах."
        actions={
          <>
            <button type="button" onClick={() => void load()} className="admin-button-secondary">
              Обновить
            </button>
            <button type="submit" disabled={saving} className="admin-button-primary">
              <Save className="h-4 w-4" />
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </>
        }
        meta={
          <>
            <StatCard
              icon={Settings2}
              label="Заполнено"
              value={filledFields}
              description="Количество заполненных ключевых полей в настройках."
              tone={filledFields > 0 ? "success" : "default"}
            />
            <StatCard
              icon={ContactRound}
              label="Контакты"
              value={form.email_text || "Не задано"}
              description="Основной email, который будет доступен на сайте."
            />
            <StatCard
              icon={LifeBuoy}
              label="Мессенджеры"
              value={
                [form.whatsapp_url, form.telegram_url].filter((item) => (item ?? "").trim().length > 0).length
              }
              description="Ссылки на быстрые каналы связи с клиентом."
              tone="accent"
            />
            <StatCard
              icon={UserRound}
              label="Гид"
              value={form.guide_name || "Не указан"}
              description="Имя и описание эксперта, который сопровождает туры."
            />
          </>
        }
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}
      {status ? <Notice tone="success">{status}</Notice> : null}

      <Section
        title="Страница контактов"
        description="Тексты первого экрана и вводного блока на странице контактов."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {CONTACT_PAGE_FIELDS.map((field) => (
            <div key={field.key}>
              <FieldEditor field={field} form={form} setForm={setForm} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Контактные данные"
        description="Основной адрес, телефоны, почта и график работы. Эти данные должны быть актуальными для клиентов."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {CONTACT_FIELDS.map((field) => (
            <div key={field.key}>
              <FieldEditor field={field} form={form} setForm={setForm} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Мессенджеры"
        description="Добавьте быстрые ссылки на чаты и каналы. Если поле пустое, соответствующая ссылка на сайте может быть скрыта."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {MESSENGER_FIELDS.map((field) => (
            <div key={field.key}>
              <FieldEditor field={field} form={form} setForm={setForm} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Блок о гиде"
        description="Личность проводника усиливает доверие к бренду. Поддерживайте этот блок живым и конкретным."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {GUIDE_FIELDS.map((field) => (
            <div key={field.key}>
              <FieldEditor field={field} form={form} setForm={setForm} />
            </div>
          ))}
        </div>
      </Section>
    </form>
  );
}

function FieldEditor({
  field,
  form,
  setForm,
}: {
  field: FieldDefinition;
  form: Record<string, string>;
  setForm: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  return (
    <FormField label={field.label} hint={field.hint}>
      {field.rows ? (
        <TextArea
          rows={field.rows}
          value={form[field.key] ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
          placeholder={field.placeholder}
        />
      ) : (
        <TextInput
          value={form[field.key] ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
          placeholder={field.placeholder}
        />
      )}
    </FormField>
  );
}
