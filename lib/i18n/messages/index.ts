import { defaultLocale, type SupportedLocale } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/messages/en";
import type { Messages } from "@/lib/i18n/messages/schema";

const messages: Record<SupportedLocale, Messages> = { en };

export function getMessages(locale: SupportedLocale = defaultLocale): Messages {
  return messages[locale];
}
