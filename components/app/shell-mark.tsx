import { cn } from "@/lib/utils";

export function ShellMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-md bg-primary p-2 text-primary-foreground",
        className,
      )}
    >
      <svg fill="none" viewBox="0 0 32 32">
        <path
          d="M7.5 16c0-5.8 3.8-10 8.5-10s8.5 4.2 8.5 10c0 3.9-2.4 7.2-6 8.7h-5C9.9 23.2 7.5 19.9 7.5 16Z"
          fill="currentColor"
        />
        <path
          d="m16 6-3 5 3 4.5 3-4.5-3-5ZM7.5 16l5.5-5 3 4.5-2.5 5L7.5 16Zm17 0L19 11l-3 4.5 2.5 5 6-4.5Zm-11 4.5 2.5-5 2.5 5-2.5 4.2-2.5-4.2Z"
          stroke="#4d6453"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
