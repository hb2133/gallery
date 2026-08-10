import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

const PhotoPageSettingsId = true;
const MaximumCategoryCount = 20;
const MaximumCategoryLength = 20;

export const DefaultPhotoPageCategories = [
    '공간',
    '여행',
    '인물',
    '일상',
] as const;

export interface PhotoPageHeadingCustomization
{
    Text: string;
    Font: string;
    Size: number;
    Color: string | null;
}

export type PhotoPageDescriptionCustomization =
    PhotoPageHeadingCustomization;

export const DefaultPhotoPageHeading: PhotoPageHeadingCustomization = {
    Text: 'What have we collected?',
    Font: 'inherit',
    Size: 82,
    Color: null,
};

export const DefaultPhotoPageDescription:
    PhotoPageDescriptionCustomization = {
        Text: '개인적인 장면과 작업을 한곳에 모은 시각 인덱스.',
        Font: 'inherit',
        Size: 11,
        Color: null,
    };

function IsRecord(
    Value: unknown,
): Value is Record<string, unknown>
{
    return (
        typeof Value === 'object'
        && Value !== null
        && Array.isArray(Value) === false
    );
}

export function NormalizePhotoPageHeading(
    TextValue: unknown,
    StyleValue: unknown,
): PhotoPageHeadingCustomization
{
    const Style =
        IsRecord(StyleValue) ? StyleValue : {};
    const Font = Style.Font;
    const Size = Style.Size;
    const Color = Style.Color;

    return {
        Text:
            typeof TextValue === 'string'
                ? TextValue.slice(0, 120)
                : DefaultPhotoPageHeading.Text,
        Font:
            typeof Font === 'string'
            && Font.trim() !== ''
            && Font.length <= 120
            && /^GalleryFont_[a-f0-9]+$/i.test(Font) === false
                ? Font.trim()
                : DefaultPhotoPageHeading.Font,
        Size:
            typeof Size === 'number'
            && Number.isFinite(Size)
                ? Math.min(160, Math.max(24, Size))
                : DefaultPhotoPageHeading.Size,
        Color:
            typeof Color === 'string'
            && /^#[0-9a-f]{6}$/i.test(Color)
                ? Color
                : null,
    };
}

export function NormalizePhotoPageDescription(
    TextValue: unknown,
    StyleValue: unknown,
): PhotoPageDescriptionCustomization
{
    const Style =
        IsRecord(StyleValue) ? StyleValue : {};
    const Font = Style.Font;
    const Size = Style.Size;
    const Color = Style.Color;

    return {
        Text:
            typeof TextValue === 'string'
                ? TextValue.slice(0, 240)
                : DefaultPhotoPageDescription.Text,
        Font:
            typeof Font === 'string'
            && Font.trim() !== ''
            && Font.length <= 120
            && /^GalleryFont_[a-f0-9]+$/i.test(Font) === false
                ? Font.trim()
                : DefaultPhotoPageDescription.Font,
        Size:
            typeof Size === 'number'
            && Number.isFinite(Size)
                ? Math.min(64, Math.max(8, Size))
                : DefaultPhotoPageDescription.Size,
        Color:
            typeof Color === 'string'
            && /^#[0-9a-f]{6}$/i.test(Color)
                ? Color
                : null,
    };
}

export function NormalizePhotoPageCategories(
    Value: unknown,
): string[]
{
    if(Array.isArray(Value) === false)
    {
        return [...DefaultPhotoPageCategories];
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

export async function LoadPhotoPageCategories(): Promise<string[]>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('photo_page_settings')
        .select('categories')
        .eq('id', PhotoPageSettingsId)
        .maybeSingle();

    if(error)
    {
        throw error;
    }

    if(data === null)
    {
        return [...DefaultPhotoPageCategories];
    }

    return NormalizePhotoPageCategories(data.categories);
}

export async function SavePhotoPageCategories(
    Categories: string[],
): Promise<string[]>
{
    const NormalizedCategories =
        NormalizePhotoPageCategories(Categories);
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase
        .from('photo_page_settings')
        .upsert({
            id: PhotoPageSettingsId,
            categories: NormalizedCategories,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return NormalizedCategories;
}

export async function LoadPhotoPageHeading():
    Promise<PhotoPageHeadingCustomization>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('photo_page_settings')
        .select('heading_text, heading_style')
        .eq('id', PhotoPageSettingsId)
        .maybeSingle();

    if(error)
    {
        throw error;
    }

    if(data === null)
    {
        return {
            ...DefaultPhotoPageHeading,
        };
    }

    return NormalizePhotoPageHeading(
        data.heading_text,
        data.heading_style,
    );
}

export async function LoadPhotoPageDescription():
    Promise<PhotoPageDescriptionCustomization>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('photo_page_settings')
        .select('description_text, description_style')
        .eq('id', PhotoPageSettingsId)
        .maybeSingle();

    if(error)
    {
        throw error;
    }

    if(data === null)
    {
        return {
            ...DefaultPhotoPageDescription,
        };
    }

    return NormalizePhotoPageDescription(
        data.description_text,
        data.description_style,
    );
}

export async function SavePhotoPageHeading(
    Heading: PhotoPageHeadingCustomization,
    Description: PhotoPageDescriptionCustomization,
): Promise<{
    Heading: PhotoPageHeadingCustomization;
    Description: PhotoPageDescriptionCustomization;
}>
{
    const NormalizedHeading =
        NormalizePhotoPageHeading(
            Heading.Text,
            Heading,
        );
    const NormalizedDescription =
        NormalizePhotoPageDescription(
            Description.Text,
            Description,
        );
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase
        .from('photo_page_settings')
        .upsert({
            id: PhotoPageSettingsId,
            heading_text: NormalizedHeading.Text,
            heading_style: {
                Font: NormalizedHeading.Font,
                Size: NormalizedHeading.Size,
                Color: NormalizedHeading.Color,
            },
            description_text: NormalizedDescription.Text,
            description_style: {
                Font: NormalizedDescription.Font,
                Size: NormalizedDescription.Size,
                Color: NormalizedDescription.Color,
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
