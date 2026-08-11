import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

const WritingPageSettingsId = true;

export const DefaultWritingPageCategories = [
    '공간',
    '여행',
    '생각',
] as const;

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
