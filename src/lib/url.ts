const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an absolute site path ("/projects/") with the deploy base path. */
export function url(path: string): string {
  return `${base}${path}`;
}
