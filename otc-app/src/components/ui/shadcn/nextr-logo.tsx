// ============================================================================
// NexTR Logo — Custom SVG mark
// Combines a hexagonal blockchain-node shape with a ballot checkmark,
// representing on-chain governance on the Liquid Network.
// ============================================================================

import { cn } from "@/lib/utils";

interface NexTRLogoProps {
  className?: string;
  /** Render size in px (width & height). Defaults to 36. */
  size?: number;
  /** If true, render only the icon mark (no text). */
  iconOnly?: boolean;
}

/**
 * The icon mark — a rounded hexagon with a stylised ballot checkmark.
 * Uses currentColor so it inherits text colour from parent.
 */
export function NexTRLogoIcon({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rounded hexagon background */}
      <path
        d="M29.07 4.53a6 6 0 0 1 5.86 0l18.6 10.4A6 6 0 0 1 56.5 20v20.8a6 6 0 0 1-2.97 5.17l-18.6 10.5a6 6 0 0 1-5.86 0l-18.6-10.5A6 6 0 0 1 7.5 40.8V20a6 6 0 0 1 2.97-5.07z"
        fill="url(#nextr-grad)"
      />

      {/* Ballot / checkmark — bold geometric stroke */}
      <path
        d="M22 33l7 7 13-16"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small blockchain "dot" nodes at each vertex hint */}
      <circle cx="22" cy="33" r="2" fill="white" opacity="0.5" />
      <circle cx="42" cy="24" r="2" fill="white" opacity="0.5" />

      <defs>
        <linearGradient
          id="nextr-grad"
          x1="7"
          y1="4"
          x2="57"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          {/* Warm orange → deeper amber, matching NexTR primary palette */}
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Full logo mark — icon + "NexTR" wordmark + tagline.
 */
export function NexTRLogo({ className, size = 36, iconOnly }: NexTRLogoProps) {
  if (iconOnly) {
    return <NexTRLogoIcon size={size} className={className} />;
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <NexTRLogoIcon size={size} />
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight leading-none">
          NexTR
        </span>
        <span className="text-[10px] text-muted-foreground leading-none">
          Liquid Network Voting
        </span>
      </div>
    </div>
  );
}
