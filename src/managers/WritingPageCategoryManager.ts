import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

const WritingPageSettingsId = true;
const MaximumCategoryCount = 20;
const MaximumCategoryLength = 20;

export const DefaultWritingPageCategories = [
    '기타 마케팅 칼럼',
    '디자인 노트',
    '생활 기록',
    '작업 기록',
] as const;

export function NormalizeWritingPageCategories(
    Value: unknown,
): string[]
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

        const Category = Candidate.trim().slice(
            0,
            MaximumCategoryLength,
        );

        if(
            Category === ''
            || Category === '전체'
            || Categories.includes(Category)
        )
        {
            continue;
        }

        Categories.push(Category);

        if(Categories.length >= MaximumCategoryCount)
        {
            break;
        }
    }

    return Categories;
}

export async function LoadWritingPageCategories():
    Promise<string[]>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
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
    const NormalizedCategories =
        NormalizeWritingPageCategories(Categories);
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase
        .from('writing_page_settings')
        .upsert({
            id: WritingPageSettingsId,
            categories: NormalizedCategories,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return NormalizedCategories;
}

export function NormalizeWritingArticleOrder(
    Value: unknown,
    AvailableArticleIds: string[],
): string[]
{
    const SavedIds =
        Array.isArray(Value)
            ? Value.filter(
                (Candidate): Candidate is string =>
                    typeof Candidate === 'string',
            )
            : [];
    const OrderedIds = SavedIds.filter(
        (Id, Index) =>
            AvailableArticleIds.includes(Id)
            && SavedIds.indexOf(Id) === Index,
    );

    return [
        ...OrderedIds,
        ...AvailableArticleIds.filter(
            (Id) => OrderedIds.includes(Id) === false,
        ),
    ];
}

export async function LoadWritingArticleOrder(
    AvailableArticleIds: string[],
): Promise<string[]>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('writing_page_settings')
        .select('article_order')
        .eq('id', WritingPageSettingsId)
        .maybeSingle();

    if(error)
    {
        throw error;
    }

    return NormalizeWritingArticleOrder(
        data?.article_order,
        AvailableArticleIds,
    );
}

export async function SaveWritingArticleOrder(
    ArticleOrder: string[],
    AvailableArticleIds: string[],
): Promise<string[]>
{
    const NormalizedOrder =
        NormalizeWritingArticleOrder(
            ArticleOrder,
            AvailableArticleIds,
        );
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase
        .from('writing_page_settings')
        .upsert({
            id: WritingPageSettingsId,
            article_order: NormalizedOrder,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return NormalizedOrder;
}
