import { CreateSupabaseServerClient } from '@/core/infra/supabase/SupabaseServerClient';
import {
    NormalizePhotoCardCustomizations,
    type PhotoCardCustomization,
} from '@/managers/PhotoCardCustomizationManager';
import {
    NormalizePhotoPosts,
} from '@/managers/PhotoPostManager';
import {
    DefaultWritingPageCategories,
    NormalizeWritingArticleOrder,
    NormalizeWritingPageCategories,
} from '@/managers/WritingPageCategoryManager';
import {
    NormalizeWritingPosts,
    type WritingSavedPost,
} from '@/managers/WritingPostManager';
import {
    ParseWritingReaderPreferenceCookie,
    WritingReaderPreferenceCookie,
    type WritingReaderPreferences,
} from '@/managers/WritingReaderPreferenceManager';
import { cookies } from 'next/headers';
import {
    DefaultPhotoPageCategories,
    DefaultPhotoPageDescription,
    DefaultPhotoPageHeading,
    NormalizePhotoPageCategories,
    NormalizePhotoPageDescription,
    NormalizePhotoPageHeading,
    type PhotoPageDescriptionCustomization,
    type PhotoPageHeadingCustomization,
} from '@/managers/PhotoPageCategoryManager';
import {
    CloneStartPageCustomization,
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
import type { GalleryIndexItem } from '@/panels/base/GalleryIndexBasePanel/controller/GalleryIndexBasePanelTypes';
import {
    DefaultMediaPageCustomization,
    DefaultMediaPosts,
    NormalizeMediaPageCustomization,
    NormalizeMediaPosts,
    type MediaPageCustomization,
} from '@/panels/base/MediaBasePanel/controller/MediaBasePanelState';
import type { MediaArchiveItem } from '@/panels/base/MediaBasePanel/controller/MediaBasePanelTypes';

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

export interface InitialAppState
{
    AdminEmail: string | null;
    MediaPageCustomization: MediaPageCustomization;
    MediaPosts: MediaArchiveItem[];
    PhotoCardCustomizations:
        Record<string, PhotoCardCustomization>;
    PhotoPosts: GalleryIndexItem[];
    PhotoPageCategories: string[];
    PhotoPageDescription: PhotoPageDescriptionCustomization;
    PhotoPageHeading: PhotoPageHeadingCustomization;
    StartPageCustomization: StartPageCustomization;
    WritingPageCategories: string[];
    WritingArticleOrder: string[];
    WritingPosts: WritingSavedPost[];
    WritingReaderPreferences: WritingReaderPreferences;
}

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

function NormalizeStartPageCustomization(
    Row: StartPageSettingsRow | null,
): StartPageCustomization
{
    if(Row === null)
    {
        return CloneStartPageCustomization(
            DefaultStartPageCustomization,
        );
    }

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

export async function LoadInitialAppState():
    Promise<InitialAppState>
{
    const CookieStore = await cookies();
    const WritingReaderPreferences =
        ParseWritingReaderPreferenceCookie(
            CookieStore.get(WritingReaderPreferenceCookie)?.value,
        );

    try
    {
        const Supabase = await CreateSupabaseServerClient();
        const [
            UserResult,
            SettingsResult,
            PhotoPageSettingsResult,
            PhotoCardSettingsResult,
            PhotoPostsResult,
            WritingPageSettingsResult,
            WritingPostsResult,
            MediaPostsResult,
            MediaPageSettingsResult,
        ] = await Promise.all([
            Supabase.auth.getUser(),
            Supabase
                .from('start_page_settings')
                .select(
                    'category_box_layouts, category_labels, category_images, category_center_text_styles, category_text_styles, daily_message_rotation_seconds, daily_messages, destination_labels, destination_text_styles, header_link',
                )
                .eq('id', 'default')
                .maybeSingle(),
            Supabase
                .from('photo_page_settings')
                .select(
                    'categories, heading_text, heading_style, description_text, description_style',
                )
                .eq('id', true)
                .maybeSingle(),
            Supabase
                .from('photo_card_customizations')
                .select(
                    'card_id, category, is_deleted, is_password_protected, is_private, page_number_color, page_number_opacity, thumbnail_url, text_layers',
                ),
            Supabase.rpc('load_photo_posts'),
            Supabase
                .from('writing_page_settings')
                .select('categories, article_order')
                .eq('id', true)
                .maybeSingle(),
            Supabase
                .from('writing_posts')
                .select(
                    'id, category, title, summary, content_html, is_private, updated_at',
                )
                .order('updated_at', { ascending: false }),
            Supabase
                .from('media_posts')
                .select(
                    'id, category, title, content, studio, source_type, sort_order, video_url, youtube_id, created_at',
                )
                .order('sort_order', {
                    ascending: true,
                })
                .order('created_at', {
                    ascending: false,
                }),
            Supabase
                .from('media_page_settings')
                .select(
                    'categories, heading_text, heading_size, heading_color, description_text, description_size, description_color, grid_columns',
                )
                .eq('id', true)
                .maybeSingle(),
        ]);
        const User = UserResult.data.user;
        const AdminEmail =
            User?.app_metadata.role === 'admin'
                ? User.email ?? null
                : null;
        const SettingsRow =
            SettingsResult.error === null
                && SettingsResult.data !== null
                ? SettingsResult.data as StartPageSettingsRow
                : null;
        const PhotoPageCategories =
            PhotoPageSettingsResult.error === null
            && PhotoPageSettingsResult.data !== null
                ? NormalizePhotoPageCategories(
                    PhotoPageSettingsResult.data.categories,
                )
                : [...DefaultPhotoPageCategories];
        const PhotoCardCustomizations =
            PhotoCardSettingsResult.error === null
                ? NormalizePhotoCardCustomizations(
                    PhotoCardSettingsResult.data,
                )
                : {};
        const PhotoPosts =
            PhotoPostsResult.error === null
                ? NormalizePhotoPosts(
                    PhotoPostsResult.data,
                )
                : [];
        const PhotoPageHeading =
            PhotoPageSettingsResult.error === null
            && PhotoPageSettingsResult.data !== null
                ? NormalizePhotoPageHeading(
                    PhotoPageSettingsResult.data
                        .heading_text,
                    PhotoPageSettingsResult.data
                        .heading_style,
                )
                : {
                    ...DefaultPhotoPageHeading,
                };
        const PhotoPageDescription =
            PhotoPageSettingsResult.error === null
            && PhotoPageSettingsResult.data !== null
                ? NormalizePhotoPageDescription(
                    PhotoPageSettingsResult.data
                        .description_text,
                    PhotoPageSettingsResult.data
                        .description_style,
                )
                : {
                    ...DefaultPhotoPageDescription,
                };
        const WritingPageCategories =
            WritingPageSettingsResult.error === null
            && WritingPageSettingsResult.data !== null
                ? NormalizeWritingPageCategories(
                    WritingPageSettingsResult.data.categories,
                )
                : [...DefaultWritingPageCategories];
        const WritingArticleOrder =
            WritingPageSettingsResult.error === null
            && WritingPageSettingsResult.data !== null
                ? NormalizeWritingArticleOrder(
                    WritingPageSettingsResult.data.article_order,
                )
                : [];
        const WritingPosts = WritingPostsResult.error === null
            ? NormalizeWritingPosts(WritingPostsResult.data)
            : [];
        const MediaPosts =
            MediaPostsResult.error === null
                ? NormalizeMediaPosts(MediaPostsResult.data)
                : [...DefaultMediaPosts];
        const MediaPageCustomization =
            MediaPageSettingsResult.error === null
            && MediaPageSettingsResult.data !== null
                ? NormalizeMediaPageCustomization(
                    MediaPageSettingsResult.data,
                )
                : NormalizeMediaPageCustomization(null);
        return {
            AdminEmail,
            MediaPageCustomization,
            MediaPosts,
            PhotoCardCustomizations,
            PhotoPosts,
            PhotoPageCategories,
            PhotoPageDescription,
            PhotoPageHeading,
            StartPageCustomization:
                NormalizeStartPageCustomization(SettingsRow),
            WritingPageCategories,
            WritingArticleOrder,
            WritingPosts,
            WritingReaderPreferences,
        };
    }
    catch
    {
        return {
            AdminEmail: null,
            MediaPageCustomization: {
                Categories: [
                    ...DefaultMediaPageCustomization.Categories,
                ],
                Description: {
                    ...DefaultMediaPageCustomization.Description,
                },
                Heading: {
                    ...DefaultMediaPageCustomization.Heading,
                },
                GridColumns:
                    DefaultMediaPageCustomization.GridColumns,
            },
            MediaPosts: [...DefaultMediaPosts],
            PhotoCardCustomizations: {},
            PhotoPosts: [],
            PhotoPageCategories: [
                ...DefaultPhotoPageCategories,
            ],
            PhotoPageDescription: {
                ...DefaultPhotoPageDescription,
            },
            PhotoPageHeading: {
                ...DefaultPhotoPageHeading,
            },
            StartPageCustomization:
                CloneStartPageCustomization(
                    DefaultStartPageCustomization,
                ),
            WritingPageCategories: [
                ...DefaultWritingPageCategories,
            ],
            WritingArticleOrder: [],
            WritingPosts: [],
            WritingReaderPreferences,
        };
    }
}
