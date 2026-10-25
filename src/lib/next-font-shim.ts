export interface NextFont {
  className: string;
  variable: string;
  style: { fontFamily: string };
}

export function Sora(options?: {
  weight?: string | string[];
  subsets?: string[];
  variable?: string;
  display?: string;
}): NextFont {
  return {
    className: 'font-sora',
    variable: options?.variable || '--font-sora',
    style: { fontFamily: "var(--font-sora, 'Sora', sans-serif)" },
  };
}

export function Inter(options?: {
  weight?: string | string[];
  subsets?: string[];
  variable?: string;
  display?: string;
}): NextFont {
  return {
    className: 'font-inter',
    variable: options?.variable || '--font-inter',
    style: { fontFamily: "var(--font-inter, 'Inter', sans-serif)" },
  };
}

export default { Sora, Inter };
