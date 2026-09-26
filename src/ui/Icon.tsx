import type { SVGProps } from 'react'

const PATHS = {
  flame: 'M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .1 1.8.8 3 2 3.4C11 8.5 10.5 5.5 12 2z',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6z',
  play: 'M7 4v16l13-8z',
  check: 'M4 12.5 9.5 18 20 6.5',
  x: 'M6 6l12 12M18 6 6 18',
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
  star: 'm12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z',
  trophy: 'M8 3h8v5a4 4 0 0 1-8 0zM8 5H4v1a4 4 0 0 0 4 4m8-5h4v1a4 4 0 0 1-4 4M12 12v5m-4 4h8m-6-4h4',
  flask: 'M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21a2 2 0 0 1 2-2h13',
  gamepad: 'M6 8h12a4 4 0 0 1 4 4v2a4 4 0 0 1-7 2.6L14 16h-4l-1 .6A4 4 0 0 1 2 14v-2a4 4 0 0 1 4-4zM7 11v4M5 13h4M16 12h.01M18 14h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  home: 'M3 11 12 3l9 8M5 9.5V21h14V9.5',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  download: 'M12 3v12m-5-5 5 5 5-5M4 21h16',
  upload: 'M12 21V9m-5 5 5-5 5 5M4 3h16',
  sparkle: 'M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  atom: 'M12 12h.01M4.5 7.5c2.5-4.3 10.6-.3 13.5 5s3 11.2-1.5 9.5M19.5 7.5c-2.5-4.3-10.6-.3-13.5 5s-3 11.2 1.5 9.5M12 3c-5 0-6 9 0 18 6-9 5-18 0-18',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01',
  alert: 'M12 3 2 20h20zM12 10v4m0 3h.01',
  bulb: 'M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  pin: 'M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  heart: 'M12 20s-7.5-4.6-9.3-9.3C1.4 7.3 3.6 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.4 0 5.6 3.3 4.3 6.7C19.5 15.4 12 20 12 20z',
  shuffle: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  volume: 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  menu: 'M3 6h18M3 12h18M3 18h18',
} as const

export type IconName = keyof typeof PATHS
const FILLED = new Set<IconName>(['flame', 'bolt', 'play', 'star', 'heart'])

export function Icon({ name, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const filled = FILLED.has(name)
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
