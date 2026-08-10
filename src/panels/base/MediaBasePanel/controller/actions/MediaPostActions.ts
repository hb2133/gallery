import { CreateUniqueId } from '@/core/identity/UniqueId';
import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import {
    ExtractYouTubeVideoId,
    NormalizeMediaPageCustomization,
    NormalizeMediaPosts,
} from '@/panels/base/MediaBasePanel/controller/MediaBasePanelState';
import type { MediaPageCustomization } from '@/panels/base/MediaBasePanel/controller/MediaBasePanelState';
import type {
    CreateMediaPostInput,
    MediaArchiveItem,
} from '@/panels/base/MediaBasePanel/controller/MediaBasePanelTypes';

const MaximumVideoSize = 50 * 1024 * 1024;

export async function SaveMediaPageCustomization(
    Customization: MediaPageCustomization,
): Promise<MediaPageCustomization>
{
    const Normalized = NormalizeMediaPageCustomization({
        categories: Customization.Categories,
        description_color: Customization.Description.Color,
        description_size: Customization.Description.Size,
        description_text: Customization.Description.Text,
        heading_color: Customization.Heading.Color,
        heading_size: Customization.Heading.Size,
        heading_text: Customization.Heading.Text,
        grid_columns: Customization.GridColumns,
    });
    const { error } = await GetSupabaseBrowserClient()
        .from('media_page_settings')
        .upsert({
            categories: Normalized.Categories,
            id: true,
            description_color: Normalized.Description.Color,
            description_size: Normalized.Description.Size,
            description_text: Normalized.Description.Text,
            heading_color: Normalized.Heading.Color,
            heading_size: Normalized.Heading.Size,
            heading_text: Normalized.Heading.Text,
            grid_columns: Normalized.GridColumns,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return Normalized;
}

function NormalizeMediaPostCopy(Input: CreateMediaPostInput)
{
    const Category = Input.Category.trim().slice(0, 20);
    const Title = Input.Title.trim().slice(0, 120);
    const Content = Input.Content.trim().slice(0, 2000);
    const Studio = Input.Studio.trim().slice(0, 80);

    if(Title === '')
    {
        throw new Error('title_required');
    }

    if(Category === '')
    {
        throw new Error('category_required');
    }

    if(Content === '')
    {
        throw new Error('content_required');
    }

    return {
        Category,
        Content,
        Studio: Studio || 'ARCHIVE STUDIO',
        Title,
    };
}

async function UploadMediaVideo(
    PostId: string,
    File: File,
): Promise<string>
{
    if(
        File.type.startsWith('video/') === false
        || File.size === 0
        || File.size > MaximumVideoSize
    )
    {
        throw new Error('invalid_video_file');
    }

    const Extension =
        File.name.split('.').pop()?.toLowerCase() ?? 'mp4';
    const SafeExtension =
        /^[a-z0-9]{1,8}$/.test(Extension)
            ? Extension
            : 'mp4';
    const Path = `${PostId}/${CreateUniqueId()}.${SafeExtension}`;
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase.storage
        .from('media-post-videos')
        .upload(Path, File, {
            cacheControl: '31536000',
            contentType: File.type,
            upsert: false,
        });

    if(error)
    {
        throw error;
    }

    return Supabase.storage
        .from('media-post-videos')
        .getPublicUrl(Path)
        .data.publicUrl;
}

async function DeleteUploadedMediaVideo(VideoUrl: string)
{
    try
    {
        const Pathname = new URL(VideoUrl).pathname;
        const Marker =
            '/storage/v1/object/public/media-post-videos/';
        const MarkerIndex = Pathname.indexOf(Marker);

        if(MarkerIndex < 0)
        {
            return;
        }

        const StoragePath = decodeURIComponent(
            Pathname.slice(MarkerIndex + Marker.length),
        );
        await GetSupabaseBrowserClient().storage
            .from('media-post-videos')
            .remove([StoragePath]);
    }
    catch
    {
        // ponytail: failed storage cleanup is tolerated; add a retry queue only if orphans become measurable.
    }
}

export async function CreateMediaPost(
    Input: CreateMediaPostInput,
    File: File | null,
): Promise<MediaArchiveItem>
{
    const Copy = NormalizeMediaPostCopy(Input);

    const PostId = CreateUniqueId();
    const YouTubeId =
        Input.SourceType === 'youtube'
            ? ExtractYouTubeVideoId(Input.YouTubeUrl)
            : null;

    if(Input.SourceType === 'youtube' && YouTubeId === null)
    {
        throw new Error('invalid_youtube_url');
    }

    if(Input.SourceType === 'upload' && File === null)
    {
        throw new Error('video_required');
    }

    const VideoUrl =
        Input.SourceType === 'upload'
            ? await UploadMediaVideo(PostId, File as File)
            : `https://www.youtube.com/watch?v=${YouTubeId}`;
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('media_posts')
        .insert({
            category: Copy.Category,
            content: Copy.Content,
            id: PostId,
            title: Copy.Title,
            studio: Copy.Studio,
            source_type: Input.SourceType,
            sort_order: -Date.now(),
            video_url: VideoUrl,
            youtube_id: YouTubeId ?? '',
        })
        .select(
            'id, category, title, content, studio, source_type, sort_order, video_url, youtube_id, created_at',
        )
        .single();

    if(error)
    {
        throw error;
    }

    const CreatedPost = NormalizeMediaPosts([data])[0];

    if(CreatedPost === undefined)
    {
        throw new Error('invalid_media_post');
    }

    return CreatedPost;
}

export async function UpdateMediaPost(
    CurrentItem: MediaArchiveItem,
    Input: CreateMediaPostInput,
    File: File | null,
): Promise<MediaArchiveItem>
{
    const Copy = NormalizeMediaPostCopy(Input);
    const YouTubeId =
        Input.SourceType === 'youtube'
            ? ExtractYouTubeVideoId(Input.YouTubeUrl)
            : null;

    if(Input.SourceType === 'youtube' && YouTubeId === null)
    {
        throw new Error('invalid_youtube_url');
    }

    if(
        Input.SourceType === 'upload'
        && File === null
        && CurrentItem.SourceType !== 'upload'
    )
    {
        throw new Error('video_required');
    }

    const UploadedVideoUrl =
        Input.SourceType === 'upload' && File !== null
            ? await UploadMediaVideo(CurrentItem.Id, File)
            : null;
    const VideoUrl =
        Input.SourceType === 'youtube'
            ? `https://www.youtube.com/watch?v=${YouTubeId}`
            : UploadedVideoUrl ?? CurrentItem.VideoUrl;
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('media_posts')
        .update({
            category: Copy.Category,
            content: Copy.Content,
            source_type: Input.SourceType,
            studio: Copy.Studio,
            title: Copy.Title,
            updated_at: new Date().toISOString(),
            video_url: VideoUrl,
            youtube_id: YouTubeId ?? '',
        })
        .eq('id', CurrentItem.Id)
        .select(
            'id, category, title, content, studio, source_type, sort_order, video_url, youtube_id, created_at',
        )
        .single();

    if(error)
    {
        if(UploadedVideoUrl !== null)
        {
            await DeleteUploadedMediaVideo(UploadedVideoUrl);
        }
        throw error;
    }

    const UpdatedPost = NormalizeMediaPosts([data])[0];

    if(UpdatedPost === undefined)
    {
        if(UploadedVideoUrl !== null)
        {
            await DeleteUploadedMediaVideo(UploadedVideoUrl);
        }
        throw new Error('invalid_media_post');
    }

    if(
        CurrentItem.SourceType === 'upload'
        && CurrentItem.VideoUrl !== UpdatedPost.VideoUrl
    )
    {
        await DeleteUploadedMediaVideo(CurrentItem.VideoUrl);
    }

    return UpdatedPost;
}

export async function DeleteMediaPost(
    Item: MediaArchiveItem,
): Promise<void>
{
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase
        .from('media_posts')
        .delete()
        .eq('id', Item.Id);

    if(error)
    {
        throw error;
    }

    if(Item.SourceType === 'upload')
    {
        await DeleteUploadedMediaVideo(Item.VideoUrl);
    }
}

export async function SaveMediaPostOrder(
    Items: MediaArchiveItem[],
): Promise<void>
{
    const Supabase = GetSupabaseBrowserClient();
    const Results = await Promise.all(
        Items.map((Item, Index) =>
            Supabase
                .from('media_posts')
                .update({
                    sort_order: Index,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', Item.Id),
        ),
    );
    const FailedResult = Results.find(
        (Result) => Result.error !== null,
    );

    if(FailedResult?.error)
    {
        throw FailedResult.error;
    }
}
