import { CreateUniqueId } from '@/core/identity/UniqueId';
import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import type {
    WritingArticle,
    WritingPage,
} from '@/panels/base/WritingBasePanel/controller/WritingBasePanelTypes';

export interface WritingSavedPost extends WritingArticle
{
    IsPrivate: boolean;
}

interface WritingPostRow
{
    id: unknown;
    category: unknown;
    title: unknown;
    summary: unknown;
    content_html: unknown;
    is_private: unknown;
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
                : [{ Heading: Heading || Title, Paragraphs }];
        });

        if(Pages.length > 0)
        {
            return Pages.slice(0, 100);
        }
    }

    return [{
        Heading: Title,
        Paragraphs: ['아직 작성된 본문이 없습니다.'],
    }];
}

function ParseContent(Value: unknown, Title: string)
{
    if(typeof Value !== 'string')
    {
        return {
            Image: '/images/journal-01.webp',
            Pages: NormalizePages(null, Title),
        };
    }

    try
    {
        const Parsed = JSON.parse(Value) as unknown;

        if(IsRecord(Parsed))
        {
            return {
                Image:
                    typeof Parsed.image === 'string'
                    && Parsed.image.trim() !== ''
                        ? Parsed.image
                        : '/images/journal-01.webp',
                Pages: NormalizePages(Parsed.pages, Title),
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
            Image: '/images/journal-01.webp',
            Pages: [{
                Heading: Title,
                Paragraphs: Text === ''
                    ? ['아직 작성된 본문이 없습니다.']
                    : Text.split(/\n{2,}/).map((Item) => Item.trim()),
            }],
        };
    }

    return {
        Image: '/images/journal-01.webp',
        Pages: NormalizePages(null, Title),
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

        if(
            typeof Row.id !== 'string'
            || typeof Row.title !== 'string'
            || typeof Row.category !== 'string'
            || IsCurrentWritingContent(Row.content_html) === false
        )
        {
            return [];
        }

        const Title = Row.title.trim().slice(0, 160);
        const Content = ParseContent(Row.content_html, Title);
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
            IsPrivate: Row.is_private === true,
        }];
    });
}

export async function LoadWritingPosts(): Promise<WritingSavedPost[]>
{
    const { data, error } = await GetSupabaseBrowserClient()
        .from('writing_posts')
        .select('id, category, title, summary, content_html, is_private, updated_at')
        .order('updated_at', { ascending: false });

    if(error)
    {
        throw error;
    }

    return NormalizeWritingPosts(data);
}

export async function SaveWritingPost(
    Post: WritingSavedPost,
): Promise<WritingSavedPost>
{
    const { data, error } = await GetSupabaseBrowserClient()
        .from('writing_posts')
        .upsert({
            id: Post.Id,
            category: Post.Category.trim().slice(0, 20),
            title: Post.Title.trim().slice(0, 160),
            summary: Post.Summary.trim().slice(0, 320),
            content_html: JSON.stringify({
                version: 1,
                image: Post.Image,
                pages: Post.Pages.map((Page) => ({
                    heading: Page.Heading,
                    paragraphs: Page.Paragraphs,
                })),
            }),
            is_private: Post.IsPrivate,
            updated_at: new Date().toISOString(),
        })
        .select('id, category, title, summary, content_html, is_private, updated_at')
        .single();

    if(error)
    {
        throw error;
    }

    return NormalizeWritingPosts([data])[0];
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
