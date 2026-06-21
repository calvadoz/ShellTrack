import { getMessages } from "@/lib/i18n/messages";

export function Preloader() {
  const messages = getMessages();

  return (
    <div
      aria-label={messages.loading.label}
      aria-live="polite"
      className="fixed inset-0 z-50 grid place-items-center bg-background"
      role="status"
    >
      <div className="flex flex-col items-center gap-4 text-primary">
        <svg
          className="size-16 animate-shell-breathe"
          fill="none"
          viewBox="0 0 64 64"
        >
          <path
            d="M15 32c0-11 7.6-19 17-19s17 8 17 19c0 7.5-4.8 14.3-12 17H27c-7.2-2.7-12-9.5-12-17Z"
            fill="#d0e9d4"
          />
          <path
            className="animate-track-dash"
            d="m32 13-6 10 6 9 6-9-6-10Zm-17 19 11-9 6 9-5 10-12-10Zm34 0-11-9-6 9 5 10 12-10ZM27 42l5-10 5 10-5 7-5-7Z"
            stroke="currentColor"
            strokeDasharray="6 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span className="font-display text-sm font-semibold tracking-wide">
          {messages.common.appName}
        </span>
        <span className="sr-only">{messages.loading.status}</span>
      </div>
    </div>
  );
}
