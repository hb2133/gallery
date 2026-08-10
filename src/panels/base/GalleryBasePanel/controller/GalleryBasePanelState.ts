import type {
    GalleryCategory,
    GalleryCategoryOption,
    GalleryProject,
    StartPageCustomization,
} from './GalleryBasePanelTypes';

export const GalleryDailyMessages = [
    '오늘은 서두르지 않아도 괜찮아요.',
    '천천히 본 장면은 오래 남습니다.',
    '좋아하는 기록부터 열어보세요.',
    '오늘의 한 장면을 가볍게 남겨보세요.',
];

export function NormalizeDailyMessageRotationSeconds(
    Value: unknown,
): number
{
    return typeof Value === 'number' && Number.isFinite(Value)
        ? Math.min(3600, Math.max(3, Math.round(Value)))
        : 10;
}

export const DefaultStartPageCustomization: StartPageCustomization = {
    CategoryBoxLayouts: {
        architecture: [13, 8, 14, 18, 12],
        portraits: [13, 12, 14, 15, 18],
        journeys: [13, 9, 17, 19, 7],
        journal: [13, 12, 14, 15, 11],
    },
    CategoryLabels: {
        architecture: '로맨스',
        portraits: '스릴러',
        journeys: '다큐',
        journal: 'SF',
    },
    CategoryImages: {
        architecture: '/images/architecture-01.webp',
        portraits: '/images/portrait-01.webp',
        journeys: '/images/journey-01.webp',
        journal: '/images/journal-01.webp',
    },
    CategoryCenterTextStyles: {
        architecture: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
        portraits: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
        journeys: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
        journal: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
    },
    CategoryTextStyles: {
        architecture: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
        portraits: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
        journeys: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
        journal: {
            Color: '#777777',
            Font: 'sans',
            Size: 20,
        },
    },
    DailyMessages: [
        ...GalleryDailyMessages,
    ],
    DailyMessageRotationSeconds: 10,
    DestinationLabels: {
        architecture: '02. 영상·음악',
        portraits: '01. 사진',
        journeys: '03. 긴 글',
        journal: '04. 한 줄 메모',
    },
    DestinationTextStyles: {
        architecture: {
            Color: '#ffffff',
            Font: 'sans',
            Size: 10,
        },
        portraits: {
            Color: '#ffffff',
            Font: 'sans',
            Size: 10,
        },
        journeys: {
            Color: '#ffffff',
            Font: 'sans',
            Size: 10,
        },
        journal: {
            Color: '#ffffff',
            Font: 'sans',
            Size: 10,
        },
    },
    HeaderLink: {
        Text: 'Instagram',
        Url: 'https://www.instagram.com/',
    },
};

export function IsGalleryBoxLayout(
    Value: unknown,
): Value is number[]
{
    return (
        Array.isArray(Value)
        && Value.length === 5
        && Value.includes(13)
        && new Set(Value).size === 5
        && Value.every(
            (Cell) =>
                Number.isInteger(Cell)
                && Cell >= 1
                && Cell <= 25,
        )
    );
}

export function MoveGalleryBoxLayout(
    Layout: number[],
    FromCell: number,
    ToCell: number,
): number[]
{
    if(
        IsGalleryBoxLayout(Layout) === false
        || FromCell === 13
        || ToCell === 13
        || ToCell < 1
        || ToCell > 25
        || Layout.includes(FromCell) === false
        || Layout.includes(ToCell)
    )
    {
        return Layout;
    }

    return Layout.map((Cell) =>
        Cell === FromCell ? ToCell : Cell,
    );
}

export function NormalizeCategoryBoxLayouts(
    Value: unknown,
): StartPageCustomization['CategoryBoxLayouts']
{
    const Candidate =
        typeof Value === 'object' && Value !== null
            ? Value as Record<string, unknown>
            : {};
    const Categories: GalleryCategory[] = [
        'architecture',
        'portraits',
        'journeys',
        'journal',
    ];

    return Categories.reduce<
        StartPageCustomization['CategoryBoxLayouts']
    >(
        (Layouts, Category) =>
        {
            const Layout = Candidate[Category];
            Layouts[Category] = IsGalleryBoxLayout(Layout)
                ? [
                    13,
                    ...Layout.filter((Cell) => Cell !== 13),
                ]
                : [
                    ...DefaultStartPageCustomization
                        .CategoryBoxLayouts[Category],
                ];
            return Layouts;
        },
        {
            architecture: [],
            portraits: [],
            journeys: [],
            journal: [],
        },
    );
}

export function CloneStartPageCustomization(
    Customization: StartPageCustomization,
): StartPageCustomization
{
    return {
        CategoryBoxLayouts: {
            architecture: [
                ...Customization.CategoryBoxLayouts.architecture,
            ],
            portraits: [
                ...Customization.CategoryBoxLayouts.portraits,
            ],
            journeys: [
                ...Customization.CategoryBoxLayouts.journeys,
            ],
            journal: [
                ...Customization.CategoryBoxLayouts.journal,
            ],
        },
        CategoryLabels: {
            ...Customization.CategoryLabels,
        },
        CategoryImages: {
            ...Customization.CategoryImages,
        },
        CategoryCenterTextStyles: {
            architecture: {
                ...Customization.CategoryCenterTextStyles
                    .architecture,
            },
            portraits: {
                ...Customization.CategoryCenterTextStyles
                    .portraits,
            },
            journeys: {
                ...Customization.CategoryCenterTextStyles
                    .journeys,
            },
            journal: {
                ...Customization.CategoryCenterTextStyles.journal,
            },
        },
        CategoryTextStyles: {
            architecture: {
                ...Customization.CategoryTextStyles.architecture,
            },
            portraits: {
                ...Customization.CategoryTextStyles.portraits,
            },
            journeys: {
                ...Customization.CategoryTextStyles.journeys,
            },
            journal: {
                ...Customization.CategoryTextStyles.journal,
            },
        },
        DailyMessages: [
            ...Customization.DailyMessages,
        ],
        DailyMessageRotationSeconds:
            Customization.DailyMessageRotationSeconds,
        DestinationLabels: {
            ...Customization.DestinationLabels,
        },
        DestinationTextStyles: {
            architecture: {
                ...Customization.DestinationTextStyles.architecture,
            },
            portraits: {
                ...Customization.DestinationTextStyles.portraits,
            },
            journeys: {
                ...Customization.DestinationTextStyles.journeys,
            },
            journal: {
                ...Customization.DestinationTextStyles.journal,
            },
        },
        HeaderLink: {
            ...Customization.HeaderLink,
        },
    };
}

export const GalleryCategories: GalleryCategoryOption[] = [
    {
        Id: 'architecture',
        Label: 'Architecture',
        Number: '01',
        Direction: 'top',
    },
    {
        Id: 'journeys',
        Label: 'Journeys',
        Number: '02',
        Direction: 'right',
    },
    {
        Id: 'journal',
        Label: 'Journal',
        Number: '03',
        Direction: 'bottom',
    },
    {
        Id: 'portraits',
        Label: 'Portraits',
        Number: '04',
        Direction: 'left',
    },
];

export const GalleryProjects: GalleryProject[] = [
    {
        Id: 'thresholds-of-light',
        Category: 'architecture',
        CategoryLabel: 'Architecture',
        Title: 'Thresholds of Light',
        Location: 'Lisbon, Portugal',
        Year: '2025',
        ImagePath: '/images/architecture-01.webp',
        Alt: '강한 빛과 그림자가 교차하는 콘크리트 건축 공간',
        Orientation: 'portrait',
        Note: '빛이 구조를 지나며 잠깐의 방이 되는 순간.',
        CreditName: 'Edgar',
        CreditUrl:
            'https://unsplash.com/photos/modern-architecture-with-strong-shadows-and-geometric-patterns-D65d_X1st-c',
    },
    {
        Id: 'concrete-silence',
        Category: 'architecture',
        CategoryLabel: 'Architecture',
        Title: 'Concrete Silence',
        Location: 'Basel, Switzerland',
        Year: '2024',
        ImagePath: '/images/architecture-02.webp',
        Alt: '흑백의 기하학적 콘크리트 벽과 깊은 그림자',
        Orientation: 'portrait',
        Note: '재료가 가장 적은 말로 공간을 설명하는 방식.',
        CreditName: 'Pascal Meier',
        CreditUrl:
            'https://unsplash.com/photos/white-and-black-concrete-building-WotyTSGl91k',
    },
    {
        Id: 'red-mile',
        Category: 'journeys',
        CategoryLabel: 'Journeys',
        Title: 'The Red Mile',
        Location: 'Nevada, USA',
        Year: '2023',
        ImagePath: '/images/journey-01.webp',
        Alt: '붉은 협곡 사이로 길게 이어진 도로',
        Orientation: 'portrait',
        Note: '목적지보다 오래 남은 길 위의 온도.',
        CreditName: 'Dino Reichmuth',
        CreditUrl: 'https://unsplash.com/photos/A5rCN8626Ck',
    },
    {
        Id: 'morning-lake',
        Category: 'journeys',
        CategoryLabel: 'Journeys',
        Title: 'Morning, Still',
        Location: 'Braies, Italy',
        Year: '2024',
        ImagePath: '/images/journey-02.webp',
        Alt: '산과 숲이 잔잔한 호수에 비치는 이른 아침 풍경',
        Orientation: 'landscape',
        Note: '아무 일도 일어나지 않아 완벽했던 아침.',
        CreditName: 'Luca Bravo',
        CreditUrl: 'https://unsplash.com/photos/ny6qxqv_m04',
    },
    {
        Id: 'quiet-gaze',
        Category: 'portraits',
        CategoryLabel: 'Portraits',
        Title: 'Quiet Gaze',
        Location: 'New York, USA',
        Year: '2022',
        ImagePath: '/images/portrait-01.webp',
        Alt: '검은 배경 앞에서 카메라를 바라보는 남성 인물',
        Orientation: 'portrait',
        Note: '표정과 표정 사이, 가장 작은 움직임을 기다린다.',
        CreditName: 'Christopher Campbell',
        CreditUrl: 'https://unsplash.com/photos/rDEOVtE7vOs',
    },
    {
        Id: 'blue-hour',
        Category: 'portraits',
        CategoryLabel: 'Portraits',
        Title: 'Blue Hour',
        Location: 'Studio 07',
        Year: '2025',
        ImagePath: '/images/portrait-02.webp',
        Alt: '푸른 조명 아래 정면을 바라보는 여성 인물',
        Orientation: 'portrait',
        Note: '색이 인물의 또 다른 목소리가 되는 시간.',
        CreditName: 'Chandri Anggara',
        CreditUrl: 'https://unsplash.com/photos/7fF0iei80AQ',
    },
    {
        Id: 'shared-table',
        Category: 'journal',
        CategoryLabel: 'Journal',
        Title: 'Shared Table',
        Location: 'Seoul, Korea',
        Year: '2025',
        ImagePath: '/images/journal-01.webp',
        Alt: '세 사람이 함께 커피 잔을 맞대는 장면',
        Orientation: 'landscape',
        Note: '일상의 기록은 대개 한 잔의 온기에서 시작된다.',
        CreditName: 'Nathan Dumlao',
        CreditUrl: 'https://unsplash.com/photos/6VhPY27jdps',
    },
    {
        Id: 'summer-plate',
        Category: 'journal',
        CategoryLabel: 'Journal',
        Title: 'Summer Plate',
        Location: 'Home',
        Year: '2024',
        ImagePath: '/images/journal-02.webp',
        Alt: '밝은 식탁 위에 놓인 채소와 연어 요리',
        Orientation: 'landscape',
        Note: '계절을 기억하는 가장 직접적인 방법.',
        CreditName: 'Ella Olsson',
        CreditUrl: 'https://unsplash.com/photos/KPDbRyFOTnE',
    },
];
