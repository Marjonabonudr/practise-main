import React from 'react';

/**
 * Bitta chiziqli (stroke) ikonka to'plami.
 * Emoji ishlatilmaydi — barcha UI belgilari shu komponent orqali chiziladi.
 */

const P = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.4" />
      <rect x="13.5" y="3" width="7.5" height="4.5" rx="1.4" />
      <rect x="13.5" y="10.5" width="7.5" height="10.5" rx="1.4" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.4" />
    </>
  ),
  users: (
    <>
      <path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 18.4V20" />
      <circle cx="9.5" cy="7.6" r="3.6" />
      <path d="M21 20v-1.6a3.4 3.4 0 0 0-2.6-3.3" />
      <path d="M15.6 4.2a3.6 3.6 0 0 1 0 6.9" />
    </>
  ),
  user: (
    <>
      <path d="M19 20v-1.8A4.2 4.2 0 0 0 14.8 14H9.2A4.2 4.2 0 0 0 5 18.2V20" />
      <circle cx="12" cy="7.5" r="4" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.6" />
      <path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15" />
      <path d="M10 21v-3h4v3" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7.5" width="19" height="12.5" rx="2" />
      <path d="M8.5 7.5V5.4A1.9 1.9 0 0 1 10.4 3.5h3.2a1.9 1.9 0 0 1 1.9 1.9v2.1" />
      <path d="M2.5 12.5h19" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 3.9 2.5 17.4a1.9 1.9 0 0 0 1.7 2.9h15.6a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.95 1.95 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.6h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10.5h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5v-11" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m20 20-4.6-4.6" />
    </>
  ),
  filter: <path d="M3.5 5.5h17l-6.6 7.7V19l-3.8 2v-7.8L3.5 5.5Z" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  'chevron-down': <path d="m5.5 9 6.5 6.5L18.5 9" />,
  'chevron-up': <path d="m5.5 15 6.5-6.5L18.5 15" />,
  'chevron-left': <path d="M14.5 5.5 8 12l6.5 6.5" />,
  'chevron-right': <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  'arrow-right': (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M20 12H4" />
      <path d="m10 6-6 6 6 6" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  logout: (
    <>
      <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2" />
      <path d="M10 12h11" />
      <path d="m18 9 3 3-3 3" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M9.9 5.8A9.9 9.9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.9 3.7" />
      <path d="M6.4 7.6A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 3.5-.7" />
      <path d="M9.9 9.9a3.2 3.2 0 0 0 4.4 4.4" />
      <path d="m3 3 18 18" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.6 6.4 8.4 6 8.4-6" />
    </>
  ),
  phone: (
    <path d="M20.5 16.9v2.3a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.2-2.9 18.4 18.4 0 0 1-5.7-5.7A18.7 18.7 0 0 1 1.6 4.2 1.9 1.9 0 0 1 3.5 2.1h2.3a1.9 1.9 0 0 1 1.9 1.6c.1 1 .4 1.9.7 2.8a1.9 1.9 0 0 1-.4 2L6.9 9.6a15 15 0 0 0 5.6 5.6l1.1-1.1a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.8.7a1.9 1.9 0 0 1 1.6 1.9Z" />
  ),
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
      <path d="M7.8 10.5V7.4a4.2 4.2 0 0 1 8.4 0v3.1" />
      <path d="M12 15v2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  activity: <path d="M3 12.5h4l2.5-7 5 14 2.5-7h4" />,
  'trending-up': (
    <>
      <path d="m3 16.5 6-6 4 4 8-8" />
      <path d="M15 6.5h6v6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 4v5h-5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3.6 8a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V8a1.7 1.7 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3.5 6.5h17" />
      <path d="M8.5 6.5V4.8A1.8 1.8 0 0 1 10.3 3h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7" />
      <path d="M18.5 6.5 17.6 19a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5.5 6.5" />
      <path d="M10.2 10.5v6M13.8 10.5v6" />
    </>
  ),
  link: (
    <>
      <path d="M10.2 13.8a4.5 4.5 0 0 0 6.4 0l2.8-2.8a4.5 4.5 0 0 0-6.4-6.4L11.6 6" />
      <path d="M13.8 10.2a4.5 4.5 0 0 0-6.4 0l-2.8 2.8a4.5 4.5 0 0 0 6.4 6.4L12.4 18" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.8h.01" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.8 2.8L16.2 9.6" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  star: (
    <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8L12 3.6Z" />
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.6" />
      <path d="m8.4 13.8-1.3 6.4 4.9-2.6 4.9 2.6-1.3-6.4" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15.5H5.5A1.5 1.5 0 0 0 4 20V4.5Z" />
      <path d="M4 18.5A1.5 1.5 0 0 1 5.5 17H19" />
    </>
  ),
  'graduation-cap': (
    <>
      <path d="M22 9 12 4.5 2 9l10 4.5L22 9Z" />
      <path d="M6 11.2v5.1c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9v-5.1" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5.2-2 6.7-2 6.7h16s-2-1.5-2-6.7Z" />
      <path d="M13.7 19a2 2 0 0 1-3.4 0" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </>
  ),
  send: (
    <>
      <path d="M21.5 2.5 11 13" />
      <path d="M21.5 2.5 15 21l-4-8-8-4 18.5-6.5Z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2.8 9.2 4.6-9.2 4.6L2.8 7.4 12 2.8Z" />
      <path d="m2.8 12.4 9.2 4.6 9.2-4.6" />
      <path d="m2.8 16.9 9.2 4.6 9.2-4.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.7 4.5 5.8v5.5c0 4.6 3.1 8.3 7.5 9.9 4.4-1.6 7.5-5.3 7.5-9.9V5.8L12 2.7Z" />
      <path d="m9.2 11.8 2 2 3.6-3.9" />
    </>
  ),
  zap: <path d="M13.5 2.5 4 13.8h6.4l-.9 7.7 9.5-11.3h-6.4l.9-7.7Z" />,
  pin: (
    <>
      <path d="M20 10.4c0 5.6-8 11.1-8 11.1s-8-5.5-8-11.1a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.2" r="2.9" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2l-1.7-5.8L4.5 10.7 10.3 9 12 3.2Z" />
      <path d="M18.5 16.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </>
  ),
  inbox: (
    <>
      <path d="M21 12.5h-5l-1.6 2.6H9.6L8 12.5H3" />
      <path d="M5.5 4.5h13l2.5 8v5a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-5l2.5-8Z" />
    </>
  ),
};

const Icon = ({ name, size = 18, strokeWidth = 1.75, className = '', style, ...rest }) => {
  const path = P[name];
  if (!path) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
};

export default Icon;
