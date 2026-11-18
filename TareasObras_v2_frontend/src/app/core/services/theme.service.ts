import { Injectable, signal } from '@angular/core';

type ColorSchemeOverride = 'light' | 'dark' | null;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly mediaQuery =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  readonly isDark = signal<boolean>(this.resolveIsDark(this.readStoredScheme()));

  constructor() {
    this.applyScheme(this.readStoredScheme());

    this.mediaQuery?.addEventListener('change', () => {
      this.applyScheme(this.readStoredScheme());
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === 'color-scheme' || event.key === 'theme' || event.key === null) {
          this.applyScheme(this.readStoredScheme());
        }
      });
    }
  }

  toggle(): void {
    const target: 'light' | 'dark' = this.isDark() ? 'light' : 'dark';
    const systemScheme: 'light' | 'dark' = this.mediaQuery?.matches ? 'dark' : 'light';
    const nextOverride: ColorSchemeOverride = target !== systemScheme ? target : null;

    try {
      if (nextOverride) {
        localStorage.setItem('color-scheme', nextOverride);
        localStorage.setItem('theme', nextOverride);
      } else {
        localStorage.removeItem('color-scheme');
        localStorage.removeItem('theme');
      }
    } catch {}

    this.applyScheme(nextOverride);
  }

  private readStoredScheme(): ColorSchemeOverride {
    try {
      const stored = localStorage.getItem('color-scheme') ?? localStorage.getItem('theme');
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  }

  private resolveIsDark(override: ColorSchemeOverride): boolean {
    if (override) {
      return override === 'dark';
    }
    return this.mediaQuery?.matches ?? false;
  }

  private applyScheme(override: ColorSchemeOverride): void {
    const metaContent = override ?? 'light dark';
    if (typeof document !== 'undefined') {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'color-scheme';
        document.head.appendChild(meta);
      }
      meta.content = metaContent;

      const dark = this.resolveIsDark(override);
      document.documentElement.classList.toggle('dark', dark);
      this.isDark.set(dark);
    }
  }
}
