import type {
    WritingReaderAlignment,
    WritingReaderFont,
    WritingReaderTone,
    WritingViewMode,
} from '@/panels/base/WritingBasePanel/controller/WritingBasePanelTypes';

export const WritingReaderPreferenceCookie =
    'gallery-writing-reader-preferences';

export interface WritingReaderPreferences
{
    Alignment: WritingReaderAlignment;
    Font: WritingReaderFont;
    FontSize: number;
    IsIndented: boolean;
    LineHeight: number;
    Padding: number;
    ParagraphGap: number;
    Tone: WritingReaderTone;
    VerticalPadding: number;
    ViewMode: WritingViewMode;
}

export const DefaultWritingReaderPreferences: WritingReaderPreferences = {
    Alignment: 'left',
    Font: 'sans',
    FontSize: 18,
    IsIndented: false,
    LineHeight: 1.85,
    Padding: 48,
    ParagraphGap: 24,
    Tone: 'light',
    VerticalPadding: 48,
    ViewMode: 'spread',
};

function IsRecord(Value: unknown): Value is Record<string, unknown>
{
    return typeof Value === 'object' && Value !== null;
}

function NormalizeNumber(
    Value: unknown,
    Minimum: number,
    Maximum: number,
    Fallback: number,
): number
{
    return typeof Value === 'number'
        && Number.isFinite(Value)
        && Value >= Minimum
        && Value <= Maximum
            ? Value
            : Fallback;
}

export function NormalizeWritingReaderPreferences(
    Value: unknown,
): WritingReaderPreferences
{
    if(IsRecord(Value) === false)
    {
        return { ...DefaultWritingReaderPreferences };
    }

    return {
        Alignment: Value.Alignment === 'justify' ? 'justify' : 'left',
        Font: ['sans', 'serif', 'rounded', 'mono'].includes(String(Value.Font))
            ? Value.Font as WritingReaderFont
            : DefaultWritingReaderPreferences.Font,
        FontSize: NormalizeNumber(Value.FontSize, 14, 32, 18),
        IsIndented: Value.IsIndented === true,
        LineHeight: NormalizeNumber(Value.LineHeight, 1.3, 2.6, 1.85),
        Padding: NormalizeNumber(Value.Padding, 20, 100, 48),
        ParagraphGap: NormalizeNumber(Value.ParagraphGap, 8, 48, 24),
        Tone: [
            'light',
            'paper',
            'night',
            'black',
            'teal',
            'brown',
            'gray',
            'rose',
            'lavender',
            'sage',
        ].includes(String(Value.Tone))
            ? Value.Tone as WritingReaderTone
            : DefaultWritingReaderPreferences.Tone,
        VerticalPadding: NormalizeNumber(Value.VerticalPadding, 20, 100, 48),
        ViewMode: ['single', 'spread', 'scroll'].includes(String(Value.ViewMode))
            ? Value.ViewMode as WritingViewMode
            : DefaultWritingReaderPreferences.ViewMode,
    };
}

export function ParseWritingReaderPreferenceCookie(
    Value: string | undefined,
): WritingReaderPreferences
{
    if(Value === undefined || Value === '')
    {
        return { ...DefaultWritingReaderPreferences };
    }

    try
    {
        return NormalizeWritingReaderPreferences(
            JSON.parse(decodeURIComponent(Value)),
        );
    }
    catch
    {
        return { ...DefaultWritingReaderPreferences };
    }
}

export function SaveWritingReaderPreferences(
    Preferences: WritingReaderPreferences,
): void
{
    const Value = encodeURIComponent(JSON.stringify(
        NormalizeWritingReaderPreferences(Preferences),
    ));
    document.cookie = `${WritingReaderPreferenceCookie}=${Value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
