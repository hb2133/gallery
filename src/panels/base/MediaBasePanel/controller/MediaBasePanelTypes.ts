export type MediaSourceType = 'upload' | 'youtube';

export interface MediaArchiveItem
{
    Category: string;
    Content: string;
    Id: string;
    Title: string;
    Studio: string;
    SourceType: MediaSourceType;
    SortOrder: number;
    VideoUrl: string;
    YouTubeId: string | null;
    Date: string;
}

export interface CreateMediaPostInput
{
    Category: string;
    Content: string;
    Title: string;
    Studio: string;
    SourceType: MediaSourceType;
    YouTubeUrl: string;
}
