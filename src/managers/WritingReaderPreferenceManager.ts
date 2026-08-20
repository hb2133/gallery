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
    FontSize: 16,
    IsIndented: false,
    LineHeight: 1.6,
    Padding: 48,
    ParagraphGap: 14,
    Tone: 'light',
    VerticalPadding: 40,
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

    const IsLegacyDensity = Value.FontSize === 18
        && Value.LineHeight === 1.85
        && Value.ParagraphGap === 24
        && Value.VerticalPadding === 48;

    return {
        Alignment: Value.Alignment === 'justify' ? 'justify' : 'left',
        Font: ['sans', 'serif', 'rounded', 'mono'].includes(String(Value.Font))
            ? Value.Font as WritingReaderFont
            : DefaultWritingReaderPreferences.Font,
        FontSize: IsLegacyDensity
            ? DefaultWritingReaderPreferences.FontSize
            : NormalizeNumber(
                Value.FontSize,
                14,
                32,
                DefaultWritingReaderPreferences.FontSize,
            ),
        IsIndented: Value.IsIndented === true,
        LineHeight: IsLegacyDensity
            ? DefaultWritingReaderPreferences.LineHeight
            : NormalizeNumber(
                Value.LineHeight,
                1.3,
                2.6,
                DefaultWritingReaderPreferences.LineHeight,
            ),
        Padding: NormalizeNumber(Value.Padding, 20, 100, 48),
        ParagraphGap: IsLegacyDensity
            ? DefaultWritingReaderPreferences.ParagraphGap
            : NormalizeNumber(
                Value.ParagraphGap,
                8,
                48,
                DefaultWritingReaderPreferences.ParagraphGap,
            ),
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
        VerticalPadding: IsLegacyDensity
            ? DefaultWritingReaderPreferences.VerticalPadding
            : NormalizeNumber(
                Value.VerticalPadding,
                20,
                100,
                DefaultWritingReaderPreferences.VerticalPadding,
            ),
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
