import { CreateUniqueId } from '@/core/identity/UniqueId';
import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import {
    IsPhotoPageDirection,
    NormalizePhotoPageDirectionSequence,
} from '@/core/navigation/PhotoPageDirection';
import {
    NormalizePhotoCardTextLayers,
    type PhotoCardTextLayer,
} from '@/managers/PhotoCardCustomizationManager';
import { DeleteStoragePublicUrls } from '@/managers/StorageAssetManager';
import type {
    WritingArticle,
    WritingEnabledViewMode,
    WritingPage,
} from '@/panels/base/WritingBasePanel/controller/WritingBasePanelTypes';

export interface WritingSavedPost extends WritingArticle
{
    EnabledViewModes: WritingEnabledViewMode[];
    IsContentLocked: boolean;
    IsDeleted: boolean;
    IsPasswordProtected: boolean;
    IsPrivate: boolean;
    PageNumberColor: string;
    PageNumberOpacity: number;
    TextLayers: PhotoCardTextLayer[];
}

interface WritingPostRow
{
    id: unknown;
    category: unknown;
    title: unknown;
    summary: unknown;
    content_html: unknown;
    is_content_locked: unknown;
    is_password_protected: unknown;
    is_private: unknown;
    text_layers: unknown;
    thumbnail_url: unknown;
    updated_at: unknown;
}

function IsRecord(Value: unknown): Value is Record<string, unknown>
{
    return typeof Value === 'object' && Value !== null;
}

function IsCurrentWritingContent(Value: unknown): boolean
{
    if(typeof Value !== 'string')
    {
        return false;
    }

    try
    {
        const Parsed = JSON.parse(Value) as unknown;
        return IsRecord(Parsed) && Parsed.version === 1;
    }
    catch
    {
        return false;
    }
}

function IsDeletedWritingContent(Value: unknown): boolean
{
    if(typeof Value !== 'string')
    {
        return false;
    }

    try
    {
        const Parsed = JSON.parse(Value) as unknown;
        return IsRecord(Parsed) && Parsed.is_deleted === true;
    }
    catch
    {
        return false;
    }
}

function SerializeWritingPostContent(Post: WritingSavedPost): string
{
    return JSON.stringify({
        version: 1,
        image: Post.Image,
        enabled_view_modes: Post.EnabledViewModes,
        page_number_color: Post.PageNumberColor,
        page_number_opacity: Post.PageNumberOpacity,
        pages: Post.Pages.map((Page) => ({
            forward_direction: Page.ForwardDirection,
            heading: Page.Heading,
            paragraphs: Page.Paragraphs,
        })),
        text_layers: Post.TextLayers,
    });
}

async function DeleteWritingPostAssets(
    PublicUrls: readonly string[],
): Promise<void>
{
    const { data, error } = await GetSupabaseBrowserClient()
        .from('writing_posts')
        .select('is_deleted, thumbnail_url');

    if(error)
    {
        // Never delete when the active reference set cannot be verified.
        return;
    }

    const Posts = data as {
        is_deleted: boolean;
        thumbnail_url: string;
    }[];
    const RetainedPublicUrls = new Set(
        Posts
            .filter((Post) => Post.is_deleted !== true)
            .map((Post) => Post.thumbnail_url),
    );
    await DeleteStoragePublicUrls(
        'writing-post-assets',
        PublicUrls.filter(
            (PublicUrl) => RetainedPublicUrls.has(PublicUrl) === false,
        ),
    );
}

function NormalizePages(Value: unknown, Title: string): WritingPage[]
{
    if(Array.isArray(Value))
    {
        const Pages = Value.flatMap((Candidate) =>
        {
            if(IsRecord(Candidate) === false)
            {
                return [];
            }

            const Heading = typeof Candidate.heading === 'string'
                ? Candidate.heading.trim().slice(0, 160)
                : '';
            const Paragraphs = Array.isArray(Candidate.paragraphs)
                ? Candidate.paragraphs.flatMap((Paragraph) =>
                    typeof Paragraph === 'string'
                    && Paragraph.trim() !== ''
                        ? [Paragraph.trim().slice(0, 5000)]
                        : [],
                )
                : [];

            return Heading === '' && Paragraphs.length === 0
                ? []
                : [{
                    ForwardDirection:
                        IsPhotoPageDirection(
                            Candidate.forward_direction,
                        )
                            ? Candidate.forward_direction
                            : null,
                    Heading: Heading || Title,
                    Paragraphs,
                }];
        });

        if(Pages.length > 0)
        {
            const LimitedPages = Pages.slice(0, 100);
            const Directions = NormalizePhotoPageDirectionSequence(
                LimitedPages.map(
                    (Page) => Page.ForwardDirection,
                ),
            );

            return LimitedPages.map((Page, PageIndex) => ({
                ...Page,
                ForwardDirection: Directions[PageIndex],
            }));
        }
    }

    return [{
        ForwardDirection: null,
        Heading: Title,
        Paragraphs: ['아직 작성된 본문이 없습니다.'],
    }];
}

function NormalizeEnabledViewModes(
    Value: unknown,
): WritingEnabledViewMode[]
{
    if(Array.isArray(Value))
    {
        const Modes = Value.filter(
            (Candidate): Candidate is WritingEnabledViewMode =>
                Candidate === 'book' || Candidate === 'scroll',
        );

        if(Modes.length > 0)
        {
            return [...new Set(Modes)];
        }
    }

    return ['book', 'scroll'];
}

function NormalizePageNumberColor(Value: unknown)
{
    return typeof Value === 'string' && /^#[0-9a-f]{6}$/i.test(Value)
        ? Value
        : '#222222';
}

function NormalizePageNumberOpacity(Value: unknown)
{
    return typeof Value === 'number' && Number.isFinite(Value)
        ? Math.min(1, Math.max(0, Value))
        : .58;
}

function ParseContent(
    Value: unknown,
    Title: string,
    ThumbnailUrl: unknown,
    StoredTextLayers: unknown,
)
{
    const StoredImage =
        typeof ThumbnailUrl === 'string'
        && ThumbnailUrl.trim() !== ''
            ? ThumbnailUrl
            : '/images/journal-01.webp';
    const DatabaseTextLayers = NormalizePhotoCardTextLayers(
        StoredTextLayers,
    );

    if(typeof Value !== 'string')
    {
        return {
            EnabledViewModes: NormalizeEnabledViewModes(null),
            Image: StoredImage,
            PageNumberColor: NormalizePageNumberColor(null),
            PageNumberOpacity: NormalizePageNumberOpacity(null),
            Pages: NormalizePages(null, Title),
            TextLayers: DatabaseTextLayers,
        };
    }

    try
    {
        const Parsed = JSON.parse(Value) as unknown;

        if(IsRecord(Parsed))
        {
            return {
                EnabledViewModes: NormalizeEnabledViewModes(
                    Parsed.enabled_view_modes,
                ),
                Image:
                    StoredImage !== '/images/journal-01.webp'
                        ? StoredImage
                        : typeof Parsed.image === 'string'
                    && Parsed.image.trim() !== ''
                        ? Parsed.image
                        : '/images/journal-01.webp',
                PageNumberColor: NormalizePageNumberColor(
                    Parsed.page_number_color,
                ),
                PageNumberOpacity: NormalizePageNumberOpacity(
                    Parsed.page_number_opacity,
                ),
                Pages: NormalizePages(Parsed.pages, Title),
                TextLayers: DatabaseTextLayers.length > 0
                    ? DatabaseTextLayers
                    : NormalizePhotoCardTextLayers(
                        Parsed.text_layers,
                    ),
            };
        }
    }
    catch
    {
        const Text = Value
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();

        return {
            EnabledViewModes: NormalizeEnabledViewModes(null),
            Image: StoredImage,
            PageNumberColor: NormalizePageNumberColor(null),
            PageNumberOpacity: NormalizePageNumberOpacity(null),
            Pages: [{
                ForwardDirection: null,
                Heading: Title,
                Paragraphs: Text === ''
                    ? ['아직 작성된 본문이 없습니다.']
                    : Text.split(/\n{2,}/).map((Item) => Item.trim()),
            }],
            TextLayers: DatabaseTextLayers,
        };
    }

    return {
        EnabledViewModes: NormalizeEnabledViewModes(null),
        Image: StoredImage,
        PageNumberColor: NormalizePageNumberColor(null),
        PageNumberOpacity: NormalizePageNumberOpacity(null),
        Pages: NormalizePages(null, Title),
        TextLayers: DatabaseTextLayers,
    };
}

export function NormalizeWritingPosts(Value: unknown): WritingSavedPost[]
{
    if(Array.isArray(Value) === false)
    {
        return [];
    }

    return Value.flatMap((Candidate) =>
    {
        const Row = Candidate as WritingPostRow;
        const IsDeleted = IsDeletedWritingContent(Row.content_html);

        if(
            typeof Row.id !== 'string'
            || typeof Row.title !== 'string'
            || typeof Row.category !== 'string'
            || (
                IsDeleted === false
                && IsCurrentWritingContent(Row.content_html) === false
                && Row.is_content_locked !== true
            )
        )
        {
            return [];
        }

        const Title = Row.title.trim().slice(0, 160);
        const Content = ParseContent(
            Row.content_html,
            Title,
            Row.thumbnail_url,
            Row.text_layers,
        );
        const UpdatedAt = typeof Row.updated_at === 'string'
            ? new Date(Row.updated_at)
            : new Date();
        const CharacterCount = Content.Pages.reduce(
            (Total, Page) => Total + Page.Paragraphs.join('').length,
            0,
        );

        return [{
            Id: Row.id,
            Category: Row.category.trim().slice(0, 20),
            Title,
            ShortTitle: Title.slice(0, 10),
            Summary: typeof Row.summary === 'string'
                ? Row.summary.trim().slice(0, 320)
                : '',
            Date: Number.isNaN(UpdatedAt.getTime())
                ? ''
                : new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }).format(UpdatedAt),
            ReadTime: `${Math.max(1, Math.ceil(CharacterCount / 500))} min read`,
            Image: Content.Image,
            Pages: Content.Pages,
            EnabledViewModes: Content.EnabledViewModes,
            IsContentLocked: Row.is_content_locked === true,
            IsDeleted,
            IsPasswordProtected:
                Row.is_password_protected === true,
            IsPrivate: Row.is_private === true,
            PageNumberColor: Content.PageNumberColor,
            PageNumberOpacity: Content.PageNumberOpacity,
            TextLayers: Content.TextLayers,
        }];
    });
}

export async function LoadWritingPosts(): Promise<WritingSavedPost[]>
{
    const { data, error } = await GetSupabaseBrowserClient()
        .rpc('load_writing_posts');

    if(error)
    {
        throw error;
    }

    return NormalizeWritingPosts(data);
}

export async function SaveWritingPost(
    Post: WritingSavedPost,
    PasswordUpdate: string | null,
    PreviousImageUrl: string | null,
): Promise<WritingSavedPost>
{
    const Password = PasswordUpdate?.trim() ?? null;

    if(
        Password !== null
        && Password !== ''
        && (Password.length < 4 || Password.length > 72)
    )
    {
        throw new Error('invalid_writing_password');
    }

    const { data, error } = await GetSupabaseBrowserClient()
        .from('writing_posts')
        .upsert({
            id: Post.Id,
            category: Post.Category.trim().slice(0, 20),
            title: Post.Title.trim().slice(0, 160),
            summary: Post.Summary.trim().slice(0, 320),
            content_html: SerializeWritingPostContent(Post),
            is_deleted: false,
            is_private: Post.IsPrivate,
            thumbnail_url: Post.Image,
            text_layers: Post.TextLayers,
            updated_at: new Date().toISOString(),
        })
        .select('id, category, title, summary, content_html, is_private, is_password_protected, thumbnail_url, text_layers, updated_at')
        .single();

    if(error)
    {
        if(Post.Image !== PreviousImageUrl)
        {
            await DeleteWritingPostAssets([Post.Image]);
        }
        throw error;
    }

    try
    {
        const IsPasswordProtected = Password === null
            ? Post.IsPasswordProtected
            : await SetWritingPostPassword(Post.Id, Password);
        const Saved = NormalizeWritingPosts([{
            ...data,
            is_content_locked: false,
            is_password_protected: IsPasswordProtected,
        }])[0];

        if(Saved === undefined)
        {
            throw new Error('invalid_saved_writing_post');
        }

        return Saved;
    }
    finally
    {
        if(
            PreviousImageUrl !== null
            && PreviousImageUrl !== Post.Image
        )
        {
            await DeleteWritingPostAssets([PreviousImageUrl]);
        }
    }
}

export async function DeleteWritingPost(Post: WritingSavedPost): Promise<void>
{
    const { error } = await GetSupabaseBrowserClient()
        .from('writing_posts')
        .upsert({
            id: Post.Id,
            category: Post.Category.trim().slice(0, 20),
            title: Post.Title.trim().slice(0, 160),
            summary: Post.Summary.trim().slice(0, 320),
            content_html: SerializeWritingPostContent(Post),
            is_deleted: true,
            is_private: Post.IsPrivate,
            thumbnail_url: Post.Image,
            text_layers: Post.TextLayers,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    await DeleteWritingPostAssets([Post.Image]);
}

export async function UnlockWritingPost(
    PostId: string,
    Password: string,
): Promise<WritingSavedPost>
{
    const { data, error } = await GetSupabaseBrowserClient()
        .rpc('unlock_writing_post', {
            candidate_password: Password,
            target_post_id: PostId,
        })
        .maybeSingle();

    if(error)
    {
        throw error;
    }

    const Post = NormalizeWritingPosts([data])[0];

    if(Post === undefined)
    {
        throw new Error('invalid_writing_password');
    }

    return Post;
}

export async function SetWritingPostPassword(
    PostId: string,
    Password: string,
): Promise<boolean>
{
    const { data, error } = await GetSupabaseBrowserClient().rpc(
        'set_writing_post_password',
        {
            next_password: Password,
            target_post_id: PostId,
        },
    );

    if(error)
    {
        throw error;
    }

    return data === true;
}

export async function LoadWritingPostPassword(
    PostId: string,
): Promise<string | null>
{
    const { data, error } = await GetSupabaseBrowserClient().rpc(
        'get_writing_post_password',
        { target_post_id: PostId },
    );

    if(error)
    {
        throw error;
    }

    return typeof data === 'string' ? data : null;
}

export async function UploadWritingCover(File: File): Promise<string>
{
    if(File.size > 25 * 1024 * 1024)
    {
        throw new Error('file_too_large');
    }

    const Extension = File.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const SafeExtension = /^[a-z0-9]{1,10}$/.test(Extension)
        ? Extension
        : 'bin';
    const Path = `covers/${CreateUniqueId()}.${SafeExtension}`;
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase.storage
        .from('writing-post-assets')
        .upload(Path, File, {
            cacheControl: '31536000',
            contentType: File.type || undefined,
            upsert: false,
        });

    if(error)
    {
        throw error;
    }

    return Supabase.storage
        .from('writing-post-assets')
        .getPublicUrl(Path)
        .data.publicUrl;
}
