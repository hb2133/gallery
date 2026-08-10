import type { GalleryIndexItem } from './GalleryIndexBasePanelTypes';

export const GalleryIndexItems: GalleryIndexItem[] = [
    {
        Id: 'architecture-archive',
        Title: 'Architecture Archive',
        Category: 'Architecture',
        Date: '2024—2025',
        Description: '빛과 구조가 만드는 조용한 공간의 기록.',
        ImagePaths: [
            '/images/architecture-01.webp',
            '/images/architecture-02.webp',
            '/images/journey-01.webp',
            '/images/journey-02.webp',
            '/images/portrait-01.webp',
            '/images/portrait-02.webp',
            '/images/journal-01.webp',
            '/images/journal-02.webp',
            '/images/architecture-01.webp',
            '/images/architecture-02.webp',
            '/images/journey-01.webp',
            '/images/journey-02.webp',
            '/images/portrait-01.webp',
            '/images/portrait-02.webp',
            '/images/journal-01.webp',
            '/images/journal-02.webp',
            '/images/architecture-01.webp',
            '/images/architecture-02.webp',
            '/images/journey-01.webp',
            '/images/journey-02.webp',
        ],
        CoverImagePath: '/images/architecture-02.webp',
        Alt: '빛과 그림자가 교차하는 콘크리트 건축',
        DetailCategory: '공간',
        TitlePosition: 'bottom-left',
        DefaultViewMode: 'book',
        EnabledViewModes: ['book'],
        ScrollDirection: 'horizontal',
    },
    {
        Id: 'journey-notes',
        Title: 'Journey Notes',
        Category: 'Journeys',
        Date: '2023—2025',
        Description: '길 위에서 오래 남은 풍경과 온도.',
        ImagePaths: [
            '/images/journey-01.webp',
            '/images/journey-02.webp',
        ],
        CoverImagePath: '/images/journey-02.webp',
        Alt: '붉은 협곡 사이로 이어진 여행길',
        DetailCategory: '여행',
        TitlePosition: 'top-left',
        DefaultViewMode: 'book',
        EnabledViewModes: ['book'],
        ScrollDirection: 'vertical',
    },
    {
        Id: 'portrait-studies',
        Title: 'Portrait Studies',
        Category: 'Portraits',
        Date: '2022—2025',
        Description: '표정과 색 사이의 작은 움직임.',
        ImagePaths: [
            '/images/portrait-01.webp',
            '/images/portrait-02.webp',
        ],
        CoverImagePath: '/images/portrait-02.webp',
        Alt: '검은 배경 앞의 인물 사진',
        DetailCategory: '인물',
        TitlePosition: 'center',
        DefaultViewMode: 'book',
        EnabledViewModes: ['book'],
        ScrollDirection: 'horizontal',
    },
    {
        Id: 'table-journal',
        Title: 'Table Journal',
        Category: 'Journal',
        Date: '2024—2025',
        Description: '한 잔의 온기와 계절을 담은 일상의 기록.',
        ImagePaths: [
            '/images/journal-01.webp',
            '/images/journal-02.webp',
        ],
        CoverImagePath: '/images/journal-02.webp',
        Alt: '여러 사람이 커피 잔을 맞대는 장면',
        DetailCategory: '일상',
        TitlePosition: 'bottom-left',
        DefaultViewMode: 'book',
        EnabledViewModes: ['book'],
        ScrollDirection: 'horizontal',
    },
];

export function MoveGalleryIndexItem(
    Items: GalleryIndexItem[],
    SourceId: string,
    TargetId: string,
): GalleryIndexItem[]
{
    const SourceIndex = Items.findIndex(
        (Item) => Item.Id === SourceId,
    );
    const TargetIndex = Items.findIndex(
        (Item) => Item.Id === TargetId,
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
    const [Moved] = Next.splice(SourceIndex, 1);

    if(Moved === undefined)
    {
        return Items;
    }

    Next.splice(TargetIndex, 0, Moved);
    return Next;
}
