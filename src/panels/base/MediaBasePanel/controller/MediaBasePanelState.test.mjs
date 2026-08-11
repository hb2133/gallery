import assert from 'node:assert/strict';
import {
    ExtractYouTubeVideoId,
    GetMediaPreviewRange,
    GetMediaPostYearMonth,
    GetYouTubePlaybackState,
    GetYouTubePlayerInfo,
    MoveMediaItem,
    NormalizeMediaPageCustomization,
    NormalizeMediaPosts,
} from './MediaBasePanelState.ts';

assert.equal(
    ExtractYouTubeVideoId('https://youtu.be/aqz-KE-bpKQ?t=3'),
    'aqz-KE-bpKQ',
);
assert.equal(
    ExtractYouTubeVideoId(
        'https://www.youtube.com/shorts/M7lc1UVf-VE',
    ),
    'M7lc1UVf-VE',
);
assert.equal(
    ExtractYouTubeVideoId(
        'https://youtube.example.com/watch?v=M7lc1UVf-VE',
    ),
    null,
);
assert.deepEqual(GetMediaPreviewRange(30), [3, 11]);
assert.deepEqual(GetMediaPreviewRange(6), [0, 6]);
assert.equal(
    GetYouTubePlaybackState('{"event":"onStateChange","info":1}'),
    true,
);
assert.equal(
    GetYouTubePlaybackState({
        event: 'infoDelivery',
        info: { playerState: 2 },
    }),
    false,
);
assert.deepEqual(
    GetYouTubePlayerInfo({ event: 'onStateChange', info: 0 }),
    { IsEnded: true, IsPlaying: false },
);
assert.deepEqual(
    GetYouTubePlayerInfo({
        event: 'infoDelivery',
        info: {
            currentTime: 12.5,
            duration: 90,
            muted: true,
            playbackRate: 1.5,
            playerState: 1,
            volume: 35,
        },
    }),
    {
        CurrentTime: 12.5,
        Duration: 90,
        IsMuted: true,
        IsPlaying: true,
        PlaybackRate: 1.5,
        Volume: .35,
    },
);
assert.equal(GetMediaPostYearMonth('07 Aug 2026'), '2026.08.');

const Posts = NormalizeMediaPosts([
    {
        content: 'Local preview content',
        category: ' 작업 ',
        id: 'local',
        title: ' Local clip ',
        studio: '',
        source_type: 'upload',
        sort_order: 7,
        video_url: '/videos/field-note.mp4',
        youtube_id: '',
        created_at: '2026-08-07T00:00:00Z',
    },
    {
        id: 'bad',
        title: 'Bad link',
        source_type: 'youtube',
        video_url: 'https://example.com/video',
    },
]);

assert.equal(Posts.length, 1);
assert.equal(Posts[0].Title, 'Local clip');
assert.equal(Posts[0].Content, 'Local preview content');
assert.equal(Posts[0].Category, '작업');
assert.equal(Posts[0].Studio, 'ARCHIVE STUDIO');
assert.equal(Posts[0].SortOrder, 7);

const Reordered = MoveMediaItem(
    [
        { Id: 'a' },
        { Id: 'b' },
        { Id: 'c' },
    ],
    'a',
    'c',
);
assert.deepEqual(Reordered.map((Item) => Item.Id), ['b', 'c', 'a']);

const MediaPageCustomization = NormalizeMediaPageCustomization({
    categories: [' 기록 ', '작업', '기록', ''],
    description_color: '#334455',
    description_size: 18,
    description_text: ' Moving image notes ',
    heading_color: 'invalid',
    heading_size: 220,
    heading_text: ' Films ',
});
assert.equal(MediaPageCustomization.Heading.Text, 'Films');
assert.deepEqual(MediaPageCustomization.Categories, ['기록', '작업']);
assert.equal(MediaPageCustomization.Heading.Size, 160);
assert.equal(MediaPageCustomization.Heading.Color, null);
assert.equal(MediaPageCustomization.Description.Text, 'Moving image notes');

assert.equal(
    NormalizeMediaPageCustomization({ grid_columns: 10 }).GridColumns,
    10,
);
assert.equal(
    NormalizeMediaPageCustomization({ grid_columns: 11 }).GridColumns,
    10,
);
assert.equal(
    NormalizeMediaPageCustomization({ grid_columns: 0 }).GridColumns,
    1,
);
