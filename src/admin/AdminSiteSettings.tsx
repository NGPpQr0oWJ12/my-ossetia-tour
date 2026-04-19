import { useEffect, useState } from "react";
import { 
  Save, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send as TelegramIcon,
  Globe,
  Settings,
  AlertCircle
} from "lucide-react";
import { adminApi } from "../lib/api";
import { 
  AdminPageHeader, 
  FormField, 
  LoadingState, 
  Notice, 
  Section, 
  TextInput, 
  TextArea, 
  ImageUpload 
} from "./components/AdminUI";
import { SiteSettings } from "../lib/types";

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await adminApi.getSiteSettings();
      // Приводим Record<string, string> к SiteSettings c дефолтными значениями
      setSettings({
        contacts_title: data.contacts_title || "",
        contacts_subtitle: data.contacts_subtitle || "",
        office_text: data.office_text || "",
        phones_text: data.phones_text || "",
        email_text: data.email_text || "",
        schedule_text: data.schedule_text || "",
        whatsapp_url: data.whatsapp_url || "",
        telegram_url: data.telegram_url || "",
        guide_name: data.guide_name || "",
        guide_bio: data.guide_bio || "",
        guide_image_url: data.guide_image_url || "/gid.png",
      });
    } catch (err) {
      setError("Не удалось загрузить настройки");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      await adminApi.updateSiteSettings(settings as unknown as Record<string, string>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setSaved(false);
  };

  if (loading) return <LoadingState title="Загрузка настроек" description="Получаем текущие параметры сайта..." />;

  if (!settings) return (
    <div className="p-8">
      <Notice tone="danger" title="Ошибка">{error || "Настройки не найдены"}</Notice>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        eyebrow="Конфигурация"
        title="Настройки сайта"
        description="Управляйте контактами, информацией о гиде и ссылками на мессенджеры."
        actions={
          <button
            onClick={save}
            disabled={saving}
            className={`admin-button-primary min-w-[140px] ${saved ? 'bg-emerald-600 border-emerald-600' : ''}`}
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <>Применено</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Сохранить
              </>
            )}
          </button>
        }
      />

      {error && <Notice tone="danger" title="Проблема">{error}</Notice>}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Гид */}
        <Section 
          title="Информация о гиде" 
          description="Эти данные отображаются в блоке 'Ваш гид' на главной странице."
        >
          <div className="flex flex-col gap-6">
            <ImageUpload 
              label="Фото гида" 
              description="Рекомендуется портретное фото на светлом фоне."
              value={settings.guide_image_url}
              onChange={(url) => updateSetting("guide_image_url", url)}
              aspectClassName="aspect-square max-w-[240px]"
            />
            
            <FormField label="Имя гида">
              <TextInput 
                value={settings.guide_name}
                onChange={(e) => updateSetting("guide_name", e.target.value)}
                placeholder="Например: Тимур"
              />
            </FormField>

            <FormField label="Биография / Описание">
              <TextArea 
                value={settings.guide_bio}
                onChange={(e) => updateSetting("guide_bio", e.target.value)}
                placeholder="Краткий рассказ о себе..."
                rows={5}
              />
            </FormField>
          </div>
        </Section>

        {/* Контакты */}
        <div className="space-y-8">
          <Section 
            title="Контакты" 
            description="Основные контактные данные для связи."
          >
            <div className="grid gap-6">
              <FormField label="Заголовок блока">
                <TextInput 
                  value={settings.contacts_title}
                  onChange={(e) => updateSetting("contacts_title", e.target.value)}
                />
              </FormField>

              <FormField label="Подзаголовок">
                <TextInput 
                  value={settings.contacts_subtitle}
                  onChange={(e) => updateSetting("contacts_subtitle", e.target.value)}
                />
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Телефон(ы)">
                  <TextArea 
                    value={settings.phones_text}
                    onChange={(e) => updateSetting("phones_text", e.target.value)}
                    rows={2}
                  />
                </FormField>
                <FormField label="Почта">
                  <TextInput 
                    value={settings.email_text}
                    onChange={(e) => updateSetting("email_text", e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Адрес офиса">
                <TextArea 
                  value={settings.office_text}
                  onChange={(e) => updateSetting("office_text", e.target.value)}
                  rows={2}
                />
              </FormField>

              <FormField label="Режим работы">
                <TextInput 
                  value={settings.schedule_text}
                  onChange={(e) => updateSetting("schedule_text", e.target.value)}
                />
              </FormField>
            </div>
          </Section>

          <Section 
            title="Мессенджеры" 
            description="Ссылки для быстрого перехода в чат."
          >
            <div className="grid gap-6">
              <FormField label="Ссылка на WhatsApp" hint="Формат: https://wa.me/79001234567">
                <TextInput 
                  value={settings.whatsapp_url}
                  onChange={(e) => updateSetting("whatsapp_url", e.target.value)}
                />
              </FormField>

              <FormField label="Ссылка на Telegram" hint="Формат: https://t.me/username">
                <TextInput 
                  value={settings.telegram_url}
                  onChange={(e) => updateSetting("telegram_url", e.target.value)}
                />
              </FormField>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
