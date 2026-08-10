import type { MediaArchiveItem } from './MediaBasePanelTypes';

interface MediaPostRow
{
    category?: unknown;
    content?: unknown;
    id?: unknown;
    title?: unknown;
    studio?: unknown;
    source_type?: unknown;
    sort_order?: unknown;
    video_url?: unknown;
    youtube_id?: unknown;
    created_at?: unknown;
}

interface MediaPageSettingsRow
{
    categories?: unknown;
    description_color?: unknown;
    description_size?: unknown;
    description_text?: unknown;
    heading_color?: unknown;
    heading_size?: unknown;
    heading_text?: unknown;
    grid_columns?: unknown;
}

export interface MediaPageTextCustomization
{
    Color: string | null;
    Size: number;
    Text: string;
}

export interface MediaPageCustomization
{
    Categories: string[];
    Description: MediaPageTextCustomization;
    GridColumns: number;
    Heading: MediaPageTextCustomization;
}

export const DefaultMediaPageCustomization: MediaPageCustomization = {
    Categories: [
        '기록',
        '작업',
        '여행',
    ],
    Description: {
        Color: null,
        Size: 11,
        Text: '움직이는 이미지와 짧은 기록을 모은 영상 아카이브.',
    },
    GridColumns: 3,
    Heading: {
        Color: null,
        Size: 76,
        Text: 'Motion Archive',
    },
};

export function NormalizeMediaCategories(Value: unknown): string[]
{
    if(Array.isArray(Value) === false)
    {
        return [...DefaultMediaPageCustomization.Categories];
    }

    const Categories: string[] = [];

    for(const Candidate of Value)
    {
        if(typeof Candidate !== 'string')
        {
            continue;
        }

        const Category = Candidate.trim().slice(0, 20);

        if(Category === '' || Categories.includes(Category))
        {
            continue;
        }

        Categories.push(Category);

        if(Categories.length >= 20)
        {
            break;
        }
    }

    return Categories.length > 0
        ? Categories
        : [...DefaultMediaPageCustomization.Categories];
}

function NormalizeMediaPageText(
    Text: unknown,
    Size: unknown,
    Color: unknown,
    Fallback: MediaPageTextCustomization,
    MaximumTextLength: number,
    MinimumSize: number,
    MaximumSize: number,
): MediaPageTextCustomization
{
    return {
        Color:
            typeof Color === 'string'
            && /^#[0-9a-f]{6}$/i.test(Color)
                ? Color
                : null,
        Size:
            typeof Size === 'number'
            && Number.isFinite(Size)
                ? Math.min(MaximumSize, Math.max(MinimumSize, Size))
                : Fallback.Size,
        Text:
            typeof Text === 'string'
            && Text.trim() !== ''
                ? Text.trim().slice(0, MaximumTextLength)
                : Fallback.Text,
    };
}

export function NormalizeMediaPageCustomization(
    Value: unknown,
): MediaPageCustomization
{
    const Row =
        typeof Value === 'object' && Value !== null
            ? Value as MediaPageSettingsRow
            : {};

    return {
        Categories: NormalizeMediaCategories(Row.categories),
        Description: NormalizeMediaPageText(
            Row.description_text,
            Row.description_size,
            Row.description_color,
            DefaultMediaPageCustomization.Description,
            240,
            8,
            64,
        ),
        GridColumns:
            typeof Row.grid_columns === 'number'
            && Number.isFinite(Row.grid_columns)
                ? Math.min(
                    10,
                    Math.max(1, Math.round(Row.grid_columns)),
                )
                : DefaultMediaPageCustomization.GridColumns,
        Heading: NormalizeMediaPageText(
            Row.heading_text,
            Row.heading_size,
            Row.heading_color,
            DefaultMediaPageCustomization.Heading,
            120,
            24,
            160,
        ),
    };
}

export const DefaultMediaPosts: MediaArchiveItem[] = [
    {
        Category: '기록',
        Content: '빛과 바람이 지나가는 짧은 순간을 천천히 기록한 영상입니다.',
        Id: 'sample-field-note',
        Title: 'A Field Note in Motion',
        Studio: 'ARCHIVE STUDIO',
        SourceType: 'upload',
        SortOrder: 0,
        VideoUrl: '/videos/field-note.mp4',
        YouTubeId: null,
        Date: '07 Aug 2026',
    },
    {
        Category: '작업',
        Content: '웹 플레이어의 움직임과 화면 구성을 살펴보기 위한 테스트 영상입니다.',
        Id: 'sample-youtube-player',
        Title: 'Embedded Player Study',
        Studio: 'YOUTUBE DEVELOPERS',
        SourceType: 'youtube',
        SortOrder: 1,
        VideoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
        YouTubeId: 'M7lc1UVf-VE',
        Date: '06 Aug 2026',
    },
    {
        Category: '여행',
        Content: '넓은 들판과 숲을 배경으로 펼쳐지는 Blender Foundation의 오픈 무비입니다.',
        Id: 'sample-big-buck-bunny',
        Title: 'Big Buck Bunny',
        Studio: 'BLENDER FOUNDATION',
        SourceType: 'youtube',
        SortOrder: 2,
        VideoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        YouTubeId: 'aqz-KE-bpKQ',
        Date: '05 Aug 2026',
    },
    {
        Category: '작업',
        Content: '차가운 산과 기억을 따라가는 짧은 판타지 애니메이션입니다.',
        Id: 'sample-sintel',
        Title: 'Sintel',
        Studio: 'BLENDER FOUNDATION',
        SourceType: 'youtube',
        SortOrder: 3,
        VideoUrl: 'https://www.youtube.com/watch?v=eRsGyueVLvQ',
        YouTubeId: 'eRsGyueVLvQ',
        Date: '04 Aug 2026',
    },
    {
        Category: '기록',
        Content: '영상 게시판의 반복 재생과 상세 팝업을 확인하기 위한 테스트 신호입니다.',
        Id: 'sample-placeholder-motion',
        Title: 'Placeholder Motion',
        Studio: 'TEST SIGNAL',
        SourceType: 'youtube',
        SortOrder: 4,
        VideoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        YouTubeId: 'ScMzIvxBSi4',
        Date: '03 Aug 2026',
    },
];

export function ExtractYouTubeVideoId(
    Value: string,
): string | null
{
    try
    {
        const Candidate = Value.trim();
        const Url = new URL(
            /^https?:\/\//i.test(Candidate)
                ? Candidate
                : `https://${Candidate}`,
        );
        const Host = Url.hostname.toLowerCase();
        let VideoId = '';

        if(Host === 'youtu.be')
        {
            VideoId = Url.pathname.split('/')[1] ?? '';
        }
        else if(
            Host === 'youtube.com'
            || Host.endsWith('.youtube.com')
        )
        {
            if(Url.pathname === '/watch')
            {
                VideoId = Url.searchParams.get('v') ?? '';
            }
            else
            {
                const Parts = Url.pathname.split('/').filter(Boolean);

                if(['embed', 'shorts', 'live'].includes(Parts[0] ?? ''))
                {
                    VideoId = Parts[1] ?? '';
                }
            }
        }

        return /^[A-Za-z0-9_-]{11}$/.test(VideoId)
            ? VideoId
            : null;
    }
    catch
    {
        return null;
    }
}

export function GetMediaPreviewRange(
    Duration: number,
): [number, number]
{
    const SafeDuration =
        Number.isFinite(Duration) && Duration > 0
            ? Duration
            : 8;
    const Start = SafeDuration > 12 ? 3 : 0;

    return [Start, Math.min(SafeDuration, Start + 8)];
}

export function GetYouTubePlaybackState(
    Value: unknown,
): boolean | null
{
    return GetYouTubePlayerInfo(Value)?.IsPlaying ?? null;
}

export interface YouTubePlayerInfo
{
    CurrentTime?: number;
    Duration?: number;
    IsMuted?: boolean;
    IsPlaying?: boolean;
    PlaybackRate?: number;
    Volume?: number;
}

export function GetYouTubePlayerInfo(
    Value: unknown,
): YouTubePlayerInfo | null
{
    let Message = Value;

    if(typeof Message === 'string')
    {
        try
        {
            Message = JSON.parse(Message) as unknown;
        }
        catch
        {
            return null;
        }
    }

    if(typeof Message !== 'object' || Message === null)
    {
        return null;
    }

    const Data = Message as Record<string, unknown>;
    const Info = Data.info;
    const InfoRecord =
        typeof Info === 'object' && Info !== null
            ? Info as Record<string, unknown>
            : {};
    const PlayerState = Data.event === 'onStateChange'
        ? Info
        : InfoRecord.playerState;
    const Result: YouTubePlayerInfo = {};

    if(PlayerState === 1)
    {
        Result.IsPlaying = true;
    }
    else if(PlayerState === 0 || PlayerState === 2)
    {
        Result.IsPlaying = false;
    }

    if(
        typeof InfoRecord.currentTime === 'number'
        && Number.isFinite(InfoRecord.currentTime)
    )
    {
        Result.CurrentTime = Math.max(0, InfoRecord.currentTime);
    }

    if(
        typeof InfoRecord.duration === 'number'
        && Number.isFinite(InfoRecord.duration)
    )
    {
        Result.Duration = Math.max(0, InfoRecord.duration);
    }

    if(typeof InfoRecord.muted === 'boolean')
    {
        Result.IsMuted = InfoRecord.muted;
    }

    if(
        typeof InfoRecord.playbackRate === 'number'
        && Number.isFinite(InfoRecord.playbackRate)
    )
    {
        Result.PlaybackRate = InfoRecord.playbackRate;
    }

    if(
        typeof InfoRecord.volume === 'number'
        && Number.isFinite(InfoRecord.volume)
    )
    {
        Result.Volume = Math.min(
            1,
            Math.max(0, InfoRecord.volume / 100),
        );
    }

    return Object.keys(Result).length > 0 ? Result : null;
}

export function GetMediaPostYearMonth(DateValue: string): string
{
    const DateCandidate = new Date(DateValue);

    if(Number.isNaN(DateCandidate.getTime()))
    {
        return DateValue;
    }

    return `${DateCandidate.getFullYear()}.${String(
        DateCandidate.getMonth() + 1,
    ).padStart(2, '0')}.`;
}

export function MoveMediaItem(
    Items: MediaArchiveItem[],
    SourceItemId: string,
    TargetItemId: string,
): MediaArchiveItem[]
{
    const SourceIndex = Items.findIndex(
        (Item) => Item.Id === SourceItemId,
    );
    const TargetIndex = Items.findIndex(
        (Item) => Item.Id === TargetItemId,
    );

    if(
        SourceIndex < 0
        || TargetIndex < 0
        || SourceIndex === TargetIndex
    )
    {
        return Items;
    }

    const Next = [...Items];
    const [MovedItem] = Next.splice(SourceIndex, 1);

    if(MovedItem === undefined)
    {
        return Items;
    }

    Next.splice(TargetIndex, 0, MovedItem);
    return Next;
}

export function NormalizeMediaPosts(
    Value: unknown,
): MediaArchiveItem[]
{
    if(Array.isArray(Value) === false)
    {
        return [];
    }

    return Value.flatMap((Candidate) =>
    {
        if(
            typeof Candidate !== 'object'
            || Candidate === null
        )
        {
            return [];
        }

        const Row = Candidate as MediaPostRow;
        const SourceType = Row.source_type;
        const VideoUrl =
            typeof Row.video_url === 'string'
                ? Row.video_url.trim().slice(0, 2000)
                : '';
        const YouTubeId =
            typeof Row.youtube_id === 'string'
                ? ExtractYouTubeVideoId(
                    `https://youtu.be/${Row.youtube_id}`,
                )
                : ExtractYouTubeVideoId(VideoUrl);
        const IsValidUploadUrl =
            VideoUrl.startsWith('/')
            || VideoUrl.startsWith('https://');

        if(
            typeof Row.id !== 'string'
            || typeof Row.title !== 'string'
            || Row.title.trim() === ''
            || (SourceType !== 'upload' && SourceType !== 'youtube')
            || (
                SourceType === 'upload'
                && IsValidUploadUrl === false
            )
            || (SourceType === 'youtube' && YouTubeId === null)
        )
        {
            return [];
        }

        const CreatedAt =
            typeof Row.created_at === 'string'
                ? new Date(Row.created_at)
                : new Date();

        return [{
            Category:
                typeof Row.category === 'string'
                && Row.category.trim() !== ''
                    ? Row.category.trim().slice(0, 20)
                    : '기록',
            Content:
                typeof Row.content === 'string'
                    ? Row.content.trim().slice(0, 2000)
                    : '',
            Id: Row.id.slice(0, 120),
            Title: Row.title.trim().slice(0, 120),
            Studio:
                typeof Row.studio === 'string'
                && Row.studio.trim() !== ''
                    ? Row.studio.trim().slice(0, 80)
                    : 'ARCHIVE STUDIO',
            SourceType,
            SortOrder:
                typeof Row.sort_order === 'number'
                && Number.isFinite(Row.sort_order)
                    ? Row.sort_order
                    : 0,
            VideoUrl,
            YouTubeId,
            Date:
                Number.isNaN(CreatedAt.getTime())
                    ? ''
                    : new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    }).format(CreatedAt),
        }];
    });
}
