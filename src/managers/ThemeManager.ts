export type ThemeMode = 'light' | 'dark';

const ThemeStorageKey = 'gallery-theme';

export function ReadStoredTheme(): ThemeMode
{
    if(typeof window === 'undefined')
    {
        return 'light';
    }

    return window.localStorage.getItem(ThemeStorageKey) === 'dark'
        ? 'dark'
        : 'light';
}

export function ApplyTheme(Theme: ThemeMode)
{
    document.documentElement.dataset.theme = Theme;
    window.localStorage.setItem(ThemeStorageKey, Theme);
}
