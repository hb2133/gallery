import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

const WritingPageSettingsId = true;

export const DefaultWritingPageCategories = [
    '공간',
    '여행',
    '생각',
] as const;

export interface WritingPageTextCustomization
{
    Color: string | null;
    Font: string;
    Size: number;
    Text: string;
}

export const DefaultWritingPageHeading: WritingPageTextCustomization = {
    Color: null,
    Font: 'inherit',
    Size: 72,
    Text: '오래 생각한 것은\n긴 문장으로 남깁니다.',
};

export const DefaultWritingPageDescription: WritingPageTextCustomization = {
    Color: null,
    Font: 'inherit',
    Size: 11,
    Text: '일과 생활 사이에서 발견한 생각을 천천히 읽는 공간입니다.',
};

function NormalizeWritingPageText(
    TextValue: unknown,
    StyleValue: unknown,
    DefaultValue: WritingPageTextCustomization,
    MinimumSize: number,
    MaximumSize: number,
    MaximumLength: number,
): WritingPageTextCustomization
{
    const Style = typeof StyleValue === 'object' && StyleValue !== null
        ? StyleValue as Record<string, unknown>
        : {};

    return {
        Color:
            typeof Style.Color === 'string'
            && /^#[0-9a-f]{6}$/i.test(Style.Color)
                ? Style.Color
                : null,
        Font:
            typeof Style.Font === 'string'
            && Style.Font.trim() !== ''
            && Style.Font.length <= 120
                ? Style.Font.trim()
                : DefaultValue.Font,
        Size:
            typeof Style.Size === 'number'
            && Number.isFinite(Style.Size)
                ? Math.min(MaximumSize, Math.max(MinimumSize, Style.Size))
                : DefaultValue.Size,
        Text:
            typeof TextValue === 'string'
                ? TextValue.slice(0, MaximumLength)
                : DefaultValue.Text,
    };
}

export function NormalizeWritingPageHeading(
    TextValue: unknown,
    StyleValue: unknown,
): WritingPageTextCustomization
{
    return NormalizeWritingPageText(
        TextValue,
        StyleValue,
        DefaultWritingPageHeading,
        24,
        160,
        120,
    );
}

export function NormalizeWritingPageDescription(
    TextValue: unknown,
    StyleValue: unknown,
): WritingPageTextCustomization
{
    return NormalizeWritingPageText(
        TextValue,
        StyleValue,
        DefaultWritingPageDescription,
        8,
        64,
        240,
    );
}

export function NormalizeWritingPageCategories(Value: unknown): string[]
{
    if(Array.isArray(Value) === false)
    {
        return [...DefaultWritingPageCategories];
    }

    const Categories: string[] = [];

    for(const Candidate of Value)
    {
        if(typeof Candidate !== 'string')
        {
            continue;
        }

        const Category = Candidate.trim().slice(0, 20);

        if(
            Category === ''
            || Category === '전체'
            || Categories.includes(Category)
        )
        {
            continue;
        }

        Categories.push(Category);

        if(Categories.length >= 20)
        {
            break;
        }
    }

    const LegacyDefaults = [
        '기타 마케팅 칼럼',
        '디자인 노트',
        '생활 기록',
        '작업 기록',
    ];
    const IsLegacyDefault = Categories.some((Category) =>
        LegacyDefaults.includes(Category),
    );

    return Categories.length > 0 && IsLegacyDefault === false
        ? Categories
        : [...DefaultWritingPageCategories];
}

export function NormalizeWritingArticleOrder(Value: unknown): string[]
{
    if(Array.isArray(Value) === false)
    {
        return [];
    }

    return Value.reduce<string[]>((Order, Candidate) =>
    {
        if(
            typeof Candidate === 'string'
            && Candidate !== ''
            && Order.includes(Candidate) === false
        )
        {
            Order.push(Candidate.slice(0, 160));
        }

        return Order;
    }, []).slice(0, 500);
}

export async function LoadWritingPageCategories(): Promise<string[]>
{
    const { data, error } = await GetSupabaseBrowserClient()
        .from('writing_page_settings')
        .select('categories')
        .eq('id', WritingPageSettingsId)
        .maybeSingle();

    if(error)
    {
        throw error;
    }

    return data === null
        ? [...DefaultWritingPageCategories]
        : NormalizeWritingPageCategories(data.categories);
}

export async function SaveWritingPageCategories(
    Categories: string[],
): Promise<string[]>
{
    const Normalized = NormalizeWritingPageCategories(Categories);
    const { error } = await GetSupabaseBrowserClient()
        .from('writing_page_settings')
        .upsert({
            id: WritingPageSettingsId,
            categories: Normalized,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return Normalized;
}

export async function SaveWritingPageIntroduction(
    Heading: WritingPageTextCustomization,
    Description: WritingPageTextCustomization,
): Promise<{
    Heading: WritingPageTextCustomization;
    Description: WritingPageTextCustomization;
}>
{
    const NormalizedHeading = NormalizeWritingPageHeading(
        Heading.Text,
        Heading,
    );
    const NormalizedDescription = NormalizeWritingPageDescription(
        Description.Text,
        Description,
    );
    const { error } = await GetSupabaseBrowserClient()
        .from('writing_page_settings')
        .upsert({
            id: WritingPageSettingsId,
            heading_text: NormalizedHeading.Text,
            heading_style: {
                Color: NormalizedHeading.Color,
                Font: NormalizedHeading.Font,
                Size: NormalizedHeading.Size,
            },
            description_text: NormalizedDescription.Text,
            description_style: {
                Color: NormalizedDescription.Color,
                Font: NormalizedDescription.Font,
                Size: NormalizedDescription.Size,
            },
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return {
        Heading: NormalizedHeading,
        Description: NormalizedDescription,
    };
}

export async function SaveWritingArticleOrder(Order: string[]): Promise<string[]>
{
    const Normalized = NormalizeWritingArticleOrder(Order);
    const { error } = await GetSupabaseBrowserClient()
        .from('writing_page_settings')
        .upsert({
            id: WritingPageSettingsId,
            article_order: Normalized,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return Normalized;
}
