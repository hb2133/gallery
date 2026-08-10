import SanitizeHtml from 'sanitize-html';
import { CreateUniqueId } from '@/core/identity/UniqueId';
import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

export interface WritingPost
{
    Id: string;
    Category: string;
    Title: string;
    Summary: string;
    Date: string;
    ReadTime: string;
    ContentHtml: string;
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

const AllowedTags = [
    'h1',
    'h2',
    'h3',
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'blockquote',
    'ul',
    'ol',
    'li',
    'pre',
    'code',
    'a',
    'img',
    'video',
    'source',
    'figure',
    'figcaption',
    'hr',
    'span',
];

export function SanitizeWritingHtml(Value: unknown): string
{
    return SanitizeHtml(
        typeof Value === 'string' ? Value : '',
        {
            allowedTags: AllowedTags,
            allowedAttributes: {
                a: ['href', 'target', 'rel'],
                img: ['src', 'alt'],
                video: [
                    'src',
                    'controls',
                    'poster',
                    'preload',
                ],
                source: ['src', 'type'],
                figure: ['style', 'data-align', 'data-gap'],
                span: ['style'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
            allowedStyles: {
                span: {
                    color: [
                        /^#[0-9a-f]{6}$/i,
                        /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/,
                    ],
                },
                figure: {
                    width: [
                        /^\d{1,4}px$/,
                        /^\d{1,3}%$/,
                    ],
                },
            },
            transformTags: {
                a: (_TagName, Attributes) => ({
                    tagName: 'a',
                    attribs: {
                        ...Attributes,
                        rel: 'noopener noreferrer',
                        target: '_blank',
                    },
                }),
            },
        },
    );
}

function EstimateReadTime(ContentHtml: string): string
{
    const Text = SanitizeHtml(ContentHtml, {
        allowedTags: [],
        allowedAttributes: {},
    });
    return `${Math.max(1, Math.ceil(Text.length / 500))} min read`;
}

export function NormalizeWritingPosts(
    Value: unknown,
): WritingPost[]
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
        )
        {
            return [];
        }

        const ContentHtml =
            SanitizeWritingHtml(Row.content_html);
        const DateValue =
            typeof Row.updated_at === 'string'
                ? new Date(Row.updated_at)
                : new Date();

        return [{
            Id: Row.id,
            Category: Row.category.slice(0, 20),
            Title: Row.title.slice(0, 160),
            Summary:
                typeof Row.summary === 'string'
                    ? Row.summary.slice(0, 320)
                    : '',
            Date:
                Number.isNaN(DateValue.getTime())
                    ? ''
                    : new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    }).format(DateValue),
            ReadTime: EstimateReadTime(ContentHtml),
            ContentHtml,
            IsPrivate: Row.is_private === true,
        }];
    });
}

export async function LoadWritingPosts(): Promise<WritingPost[]>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('writing_posts')
        .select(
            'id, category, title, summary, content_html, is_private, updated_at',
        );

    if(error)
    {
        throw error;
    }

    return NormalizeWritingPosts(data);
}

export async function SaveWritingPost(
    Post: WritingPost,
): Promise<WritingPost>
{
    const Supabase = GetSupabaseBrowserClient();
    const ContentHtml =
        SanitizeWritingHtml(Post.ContentHtml);
    const { data, error } = await Supabase
        .from('writing_posts')
        .upsert({
            id: Post.Id,
            category: Post.Category.trim().slice(0, 20),
            title: Post.Title.trim().slice(0, 160),
            summary: Post.Summary.trim().slice(0, 320),
            content_html: ContentHtml,
            is_private: Post.IsPrivate,
            updated_at: new Date().toISOString(),
        })
        .select(
            'id, category, title, summary, content_html, is_private, updated_at',
        )
        .single();

    if(error)
    {
        throw error;
    }

    return NormalizeWritingPosts([data])[0];
}

export async function UploadWritingAsset(
    PostId: string,
    File: File,
): Promise<string>
{
    if(File.size > 25 * 1024 * 1024)
    {
        throw new Error('file_too_large');
    }

    const Extension =
        File.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const SafeExtension =
        /^[a-z0-9]{1,10}$/.test(Extension)
            ? Extension
            : 'bin';
    const Path =
        `${PostId}/${CreateUniqueId()}.${SafeExtension}`;
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
