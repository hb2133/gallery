import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import { CreateUniqueId } from '@/core/identity/UniqueId';
import {
    DefaultStartPageCustomization,
    NormalizeCategoryBoxLayouts,
    NormalizeDailyMessageRotationSeconds,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelState';
import type {
    GalleryCategory,
    GalleryCategoryMap,
    GalleryTextStyle,
    HeaderLinkCustomization,
    StartPageCustomization,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

interface StartPageSettingsRow
{
    category_box_layouts: unknown;
    category_images: unknown;
    category_labels: unknown;
    category_center_text_styles: unknown;
    category_text_styles: unknown;
    daily_message_rotation_seconds: unknown;
    daily_messages: unknown;
    destination_labels: unknown;
    destination_text_styles: unknown;
    header_link: unknown;
}

interface StartPageCustomizationCache
{
    Customization: unknown;
    Version: number;
}

const StartPageCustomizationCacheKey =
    'gallery-start-page-customization';
const StartPageCustomizationCacheVersion = 1;

const CategoryIds: GalleryCategory[] = [
    'architecture',
    'portraits',
    'journeys',
    'journal',
];

function IsRecord(Value: unknown): Value is Record<string, unknown>
{
    return typeof Value === 'object' && Value !== null;
}

function NormalizeCategoryMap(
    Value: unknown,
    Fallback: GalleryCategoryMap<string>,
): GalleryCategoryMap<string>
{
    if(IsRecord(Value) === false)
    {
        return {
            ...Fallback,
        };
    }

    return CategoryIds.reduce<GalleryCategoryMap<string>>(
        (Result, Category) =>
        {
            const Candidate = Value[Category];
            Result[Category] =
                typeof Candidate === 'string' && Candidate.trim()
                    ? Candidate
                    : Fallback[Category];
            return Result;
        },
        {
            ...Fallback,
        },
    );
}

function NormalizeDailyMessages(
    Value: unknown,
    Fallback: string[],
): string[]
{
    if(Array.isArray(Value) === false)
    {
        return [
            ...Fallback,
        ];
    }

    return Value.flatMap((Message) =>
    {
        if(typeof Message !== 'string')
        {
            return [];
        }

        const NormalizedMessage = Message.trim();

        return NormalizedMessage ? [NormalizedMessage] : [];
    });
}

function NormalizeTextStyleMap(
    Value: unknown,
    Fallback: GalleryCategoryMap<GalleryTextStyle>,
): GalleryCategoryMap<GalleryTextStyle>
{
    return CategoryIds.reduce<GalleryCategoryMap<GalleryTextStyle>>(
        (Result, Category) =>
        {
            const Candidate =
                IsRecord(Value) && IsRecord(Value[Category])
                    ? Value[Category]
                    : {};
            const CandidateFont = Candidate.Font;
            const CandidateSize = Candidate.Size;
            const CandidateColor = Candidate.Color;

            Result[Category] = {
                Font:
                    typeof CandidateFont === 'string'
                    && CandidateFont.trim().length > 0
                    && CandidateFont.length <= 120
                    && /^GalleryFont_[a-f0-9]+$/i.test(
                        CandidateFont,
                    ) === false
                        ? CandidateFont.trim()
                        : Fallback[Category].Font,
                Size:
                    typeof CandidateSize === 'number'
                    && CandidateSize >= 8
                    && CandidateSize <= 64
                        ? CandidateSize
                        : Fallback[Category].Size,
                Color:
                    typeof CandidateColor === 'string'
                    && /^#[0-9a-f]{6}$/i.test(CandidateColor)
                        ? CandidateColor
                        : Fallback[Category].Color,
            };
            return Result;
        },
        {
            ...Fallback,
        },
    );
}

function NormalizeHeaderLink(
    Value: unknown,
    Fallback: HeaderLinkCustomization,
): HeaderLinkCustomization
{
    if(IsRecord(Value) === false)
    {
        return {
            ...Fallback,
        };
    }

    return {
        Text:
            typeof Value.Text === 'string'
                ? Value.Text
                : Fallback.Text,
        Url:
            typeof Value.Url === 'string'
                ? Value.Url
                : Fallback.Url,
    };
}

export function ReadCachedStartPageCustomization():
    StartPageCustomization | null
{
    if(typeof window === 'undefined')
    {
        return null;
    }

    try
    {
        const StoredValue = window.localStorage.getItem(
            StartPageCustomizationCacheKey,
        );

        if(StoredValue === null)
        {
            return null;
        }

        const Cache = JSON.parse(
            StoredValue,
        ) as StartPageCustomizationCache;

        if(
            IsRecord(Cache)
            && Cache.Version === StartPageCustomizationCacheVersion
            && IsRecord(Cache.Customization)
        )
        {
            return {
                CategoryBoxLayouts: NormalizeCategoryBoxLayouts(
                    Cache.Customization.CategoryBoxLayouts,
                ),
                CategoryLabels: NormalizeCategoryMap(
                    Cache.Customization.CategoryLabels,
                    DefaultStartPageCustomization.CategoryLabels,
                ),
                CategoryCenterTextStyles: NormalizeTextStyleMap(
                    Cache.Customization.CategoryCenterTextStyles,
                    DefaultStartPageCustomization
                        .CategoryCenterTextStyles,
                ),
                CategoryImages: NormalizeCategoryMap(
                    Cache.Customization.CategoryImages,
                    DefaultStartPageCustomization.CategoryImages,
                ),
                CategoryTextStyles: NormalizeTextStyleMap(
                    Cache.Customization.CategoryTextStyles,
                    DefaultStartPageCustomization.CategoryTextStyles,
                ),
                DailyMessages: NormalizeDailyMessages(
                    Cache.Customization.DailyMessages,
                    DefaultStartPageCustomization.DailyMessages,
                ),
                DailyMessageRotationSeconds:
                    NormalizeDailyMessageRotationSeconds(
                        Cache.Customization
                            .DailyMessageRotationSeconds,
                    ),
                HeaderLink: NormalizeHeaderLink(
                    Cache.Customization.HeaderLink,
                    DefaultStartPageCustomization.HeaderLink,
                ),
                DestinationLabels: NormalizeCategoryMap(
                    Cache.Customization.DestinationLabels,
                    DefaultStartPageCustomization.DestinationLabels,
                ),
                DestinationTextStyles: NormalizeTextStyleMap(
                    Cache.Customization.DestinationTextStyles,
                    DefaultStartPageCustomization.DestinationTextStyles,
                ),
            };
        }
    }
    catch
    {
        return null;
    }

    return null;
}

export function CacheStartPageCustomization(
    Customization: StartPageCustomization,
)
{
    if(typeof window === 'undefined')
    {
        return;
    }

    try
    {
        window.localStorage.setItem(
            StartPageCustomizationCacheKey,
            JSON.stringify({
                Customization,
                Version: StartPageCustomizationCacheVersion,
            }),
        );
    }
    catch
    {
        // The live Supabase value remains the source of truth.
    }
}

export async function LoadStartPageCustomization(): Promise<
    StartPageCustomization
>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('start_page_settings')
        .select(
            'category_box_layouts, category_labels, category_images, category_center_text_styles, category_text_styles, daily_message_rotation_seconds, daily_messages, destination_labels, destination_text_styles, header_link',
        )
        .eq('id', 'default')
        .maybeSingle();

    if(error || data === null)
    {
        return {
            CategoryBoxLayouts: NormalizeCategoryBoxLayouts(null),
            CategoryLabels: {
                ...DefaultStartPageCustomization.CategoryLabels,
            },
            CategoryImages: {
                ...DefaultStartPageCustomization.CategoryImages,
            },
            CategoryCenterTextStyles: {
                ...DefaultStartPageCustomization
                    .CategoryCenterTextStyles,
            },
            CategoryTextStyles: {
                ...DefaultStartPageCustomization.CategoryTextStyles,
            },
            DailyMessages: [
                ...DefaultStartPageCustomization.DailyMessages,
            ],
            DailyMessageRotationSeconds:
                DefaultStartPageCustomization
                    .DailyMessageRotationSeconds,
            HeaderLink: {
                ...DefaultStartPageCustomization.HeaderLink,
            },
            DestinationLabels: {
                ...DefaultStartPageCustomization.DestinationLabels,
            },
            DestinationTextStyles: {
                ...DefaultStartPageCustomization.DestinationTextStyles,
            },
        };
    }

    const Row = data as StartPageSettingsRow;

    return {
        CategoryBoxLayouts: NormalizeCategoryBoxLayouts(
            Row.category_box_layouts,
        ),
        CategoryLabels: NormalizeCategoryMap(
            Row.category_labels,
            DefaultStartPageCustomization.CategoryLabels,
        ),
        CategoryCenterTextStyles: NormalizeTextStyleMap(
            Row.category_center_text_styles,
            DefaultStartPageCustomization.CategoryCenterTextStyles,
        ),
        CategoryImages: NormalizeCategoryMap(
            Row.category_images,
            DefaultStartPageCustomization.CategoryImages,
        ),
        CategoryTextStyles: NormalizeTextStyleMap(
            Row.category_text_styles,
            DefaultStartPageCustomization.CategoryTextStyles,
        ),
        DailyMessages: NormalizeDailyMessages(
            Row.daily_messages,
            DefaultStartPageCustomization.DailyMessages,
        ),
        DailyMessageRotationSeconds:
            NormalizeDailyMessageRotationSeconds(
                Row.daily_message_rotation_seconds,
            ),
        HeaderLink: NormalizeHeaderLink(
            Row.header_link,
            DefaultStartPageCustomization.HeaderLink,
        ),
        DestinationLabels: NormalizeCategoryMap(
            Row.destination_labels,
            DefaultStartPageCustomization.DestinationLabels,
        ),
        DestinationTextStyles: NormalizeTextStyleMap(
            Row.destination_text_styles,
            DefaultStartPageCustomization.DestinationTextStyles,
        ),
    };
}

export async function SaveStartPageCustomization(
    Customization: StartPageCustomization,
): Promise<void>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data: UserData, error: UserError } =
        await Supabase.auth.getUser();

    if(
        UserError
        || UserData.user.app_metadata.role !== 'admin'
    )
    {
        throw new Error('Admin authentication is required.');
    }

    const { error } = await Supabase
        .from('start_page_settings')
        .update({
            category_box_layouts: Customization.CategoryBoxLayouts,
            category_labels: Customization.CategoryLabels,
            category_images: Customization.CategoryImages,
            category_center_text_styles:
                Customization.CategoryCenterTextStyles,
            category_text_styles: Customization.CategoryTextStyles,
            daily_message_rotation_seconds:
                Customization.DailyMessageRotationSeconds,
            daily_messages: Customization.DailyMessages,
            destination_labels: Customization.DestinationLabels,
            destination_text_styles:
                Customization.DestinationTextStyles,
            header_link: Customization.HeaderLink,
            updated_at: new Date().toISOString(),
            updated_by: UserData.user.id,
        })
        .eq('id', 'default');

    if(error)
    {
        throw error;
    }
}

export async function UploadStartPageCategoryImage(
    Category: GalleryCategory,
    File: File,
): Promise<string>
{
    if(File.type.startsWith('image/') === false)
    {
        throw new Error('Only image files can be uploaded.');
    }

    if(File.size > 10 * 1024 * 1024)
    {
        throw new Error('Images must be 10 MB or smaller.');
    }

    const Supabase = GetSupabaseBrowserClient();
    const ExtensionByMimeType: Record<string, string> = {
        'image/gif': 'gif',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
    };
    const Extension = ExtensionByMimeType[File.type];

    if(Extension === undefined)
    {
        throw new Error('This image format is not supported.');
    }

    const StoragePath =
        `${Category}/${CreateUniqueId()}.${Extension}`;
    const { error } = await Supabase.storage
        .from('start-page-images')
        .upload(StoragePath, File, {
            cacheControl: '3600',
            contentType: File.type,
            upsert: false,
        });

    if(error)
    {
        throw error;
    }

    const { data } = Supabase.storage
        .from('start-page-images')
        .getPublicUrl(StoragePath);

    return data.publicUrl;
}
