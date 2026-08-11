import type { WritingArticle } from './WritingBasePanelTypes';

const SharedPages = [
    {
        Heading: '오래 남는 문장을 생각하며',
        Paragraphs: [
            '새로운 플랫폼이 등장할 때마다 우리는 어디에 글을 써야 하는지 다시 묻습니다. 하지만 더 오래 남는 질문은 어떤 문장이 독자를 다시 돌아오게 하는가에 가깝습니다.',
            '검색으로 찾아온 사람과 우연히 링크를 누른 사람은 서로 다른 속도로 글을 읽습니다. 긴 글은 정보를 많이 담는 형식이 아니라, 그 서로 다른 속도를 받아들이는 형식이어야 합니다.',
            '좋은 기록은 모든 것을 보관하지 않습니다. 지금의 나를 설명하는 장면과 생각을 고르고, 나중의 내가 다시 찾을 수 있는 순서로 놓습니다.',
        ],
    },
    {
        Heading: '읽는 사람의 속도',
        Paragraphs: [
            '여백은 비어 있는 공간이 아니라 관계를 읽게 하는 장치입니다. 가까운 것은 함께 이해되고, 멀어진 것은 다음 생각을 위한 단서가 됩니다.',
            '짧은 문장 뒤에 충분한 멈춤을 두면 독자는 자신의 기억을 불러올 수 있습니다. 화면의 리듬은 그 조용한 시간을 방해하지 않아야 합니다.',
            '작은 움직임은 선택이 화면에 도착했다는 사실만 알려 줍니다. 빠르게 반응하되 서두르지 않는 전환이 글을 읽는 태도가 됩니다.',
        ],
    },
    {
        Heading: '하루를 수집하는 방법',
        Paragraphs: [
            '기록을 거창하게 시작하면 오래 이어 가기 어렵습니다. 오늘 본 빛, 들은 말, 잠시 멈춰 선 장소 하나면 충분합니다.',
            '사진은 장면을 붙잡고 문장은 그때의 마음을 붙잡습니다. 둘이 함께 있을 때 기억은 훨씬 구체적인 온도로 돌아옵니다.',
            '매일 완성된 이야기를 만들 필요는 없습니다. 작은 조각을 쌓아 두면 어느 날 그 사이에서 나만의 흐름이 보이기 시작합니다.',
        ],
    },
    {
        Heading: '사라지기 전에 붙잡기',
        Paragraphs: [
            '아이디어는 대개 준비된 책상보다 이동 중인 버스나 잠들기 직전의 방에서 먼저 찾아옵니다. 그 순간에는 전체 구조보다 가장 선명한 문장 하나를 남기는 편이 좋습니다.',
            '짧은 기록은 불완전하기 때문에 다음 생각이 들어올 자리를 남깁니다. 처음부터 완성된 문서처럼 정리하려 하면 중요한 감각을 놓치기 쉽습니다.',
            '서로 다른 시기의 문장들이 만나는 과정에서 처음에는 보이지 않던 작업의 방향이 만들어지기도 합니다.',
        ],
    },
    {
        Heading: '느린 프로젝트의 속도',
        Paragraphs: [
            '모든 프로젝트가 매일 눈에 보이는 결과를 만들지는 않습니다. 조사하고 망설이고 다시 돌아가는 시간도 결과를 지탱하는 중요한 과정입니다.',
            '완료한 항목보다 다음에 확인할 질문을 남기는 것이 도움이 됩니다. 질문이 정확하면 잠시 멈추더라도 다시 시작할 위치를 잃지 않습니다.',
            '속도를 높이는 것보다 리듬을 잃지 않는 것이 더 중요할 때가 있습니다.',
        ],
    },
    {
        Heading: '다시 첫 문장으로',
        Paragraphs: [
            '마지막 단계에서는 새로운 아이디어를 더하기보다 이미 정한 기준과 어긋나는 부분을 찾는 편이 좋습니다. 추가보다 제거가 더 큰 변화를 만들기도 합니다.',
            '완료는 더 이상 고칠 것이 없는 상태가 아닙니다. 지금의 목적을 충분히 전달하며 다음 단계로 넘어가도 되는 상태를 정하는 일입니다.',
            '결국 오래 버티는 콘텐츠는 플랫폼의 기능보다 관찰의 밀도에서 시작됩니다. 작게 발견하고 충분히 생각한 뒤, 읽는 사람이 숨을 고를 수 있게 남깁니다.',
        ],
    },
];

function Pages(Subject: string)
{
    return SharedPages.map((Page, Index) => ({
        ...Page,
        Heading: Index === 0 ? Subject : Page.Heading,
    }));
}

export const WritingArticles: WritingArticle[] = [
    {
        Id: 'seasonal-record',
        Category: '공간',
        Title: '계절을 기록하는 가장 작은 방법',
        ShortTitle: '계절의 기록',
        Summary: '빛과 온도가 바뀌는 순간을 한 장면과 한 문장으로 남긴 기록입니다.',
        Date: '28 Jul 2026',
        ReadTime: '6 min read',
        Image: '/images/journal-01.webp',
        Pages: Pages('계절을 기록하는 가장 작은 방법'),
    },
    {
        Id: 'passing-clouds',
        Category: '여행',
        Title: '지나간 구름이 남긴 방향',
        ShortTitle: '지나간 구름',
        Summary: '멀리 떠난 날보다 돌아오는 길에 선명해진 장면들에 관하여.',
        Date: '12 Jul 2026',
        ReadTime: '5 min read',
        Image: '/images/portrait-02.webp',
        Pages: Pages('지나간 구름이 남긴 방향'),
    },
    {
        Id: 'long-lasting-content',
        Category: '생각',
        Title: '플랫폼보다 오래 버틸 콘텐츠를 만드는 일',
        ShortTitle: '오래 버틸 문장',
        Summary: '어디에 쓰는가보다 왜 계속 읽히는가를 먼저 생각해 본 기록입니다.',
        Date: '25 Jun 2026',
        ReadTime: '8 min read',
        Image: '/images/journey-01.webp',
        Pages: Pages('플랫폼보다 오래 버틸 콘텐츠를 만드는 일'),
    },
    {
        Id: 'looking-up',
        Category: '공간',
        Title: '올려다보아야 보이는 것들',
        ShortTitle: '위를 보는 일',
        Summary: '익숙한 길에서 시선을 조금 바꾸어 발견한 장면들.',
        Date: '08 Jun 2026',
        ReadTime: '4 min read',
        Image: '/images/architecture-01.webp',
        Pages: Pages('올려다보아야 보이는 것들'),
    },
    {
        Id: 'slow-path',
        Category: '여행',
        Title: '천천히 걸어야 만나는 길',
        ShortTitle: '느린 길',
        Summary: '목적지보다 그곳까지 이어지는 시간을 기억하는 방식.',
        Date: '17 May 2026',
        ReadTime: '7 min read',
        Image: '/images/journey-02.webp',
        Pages: Pages('천천히 걸어야 만나는 길'),
    },
    {
        Id: 'water-memory',
        Category: '생각',
        Title: '물가에서 오래 남은 생각',
        ShortTitle: '물의 기억',
        Summary: '빠르게 흘러가면서도 같은 자리에 머무는 것들에 관한 메모.',
        Date: '03 May 2026',
        ReadTime: '6 min read',
        Image: '/images/architecture-02.webp',
        Pages: Pages('물가에서 오래 남은 생각'),
    },
    {
        Id: 'clear-morning',
        Category: '여행',
        Title: '맑은 아침에 출발하는 이유',
        ShortTitle: '맑은 아침',
        Summary: '아직 아무 일도 시작되지 않은 시간에만 보이는 풍경.',
        Date: '22 Apr 2026',
        ReadTime: '5 min read',
        Image: '/images/portrait-01.webp',
        Pages: Pages('맑은 아침에 출발하는 이유'),
    },
    {
        Id: 'quiet-interface',
        Category: '생각',
        Title: '조용한 화면이 더 많은 것을 말할 때',
        ShortTitle: '조용한 화면',
        Summary: '여백과 작은 피드백이 화면의 목소리를 만드는 방식.',
        Date: '11 Apr 2026',
        ReadTime: '7 min read',
        Image: '/images/journal-02.webp',
        Pages: Pages('조용한 화면이 더 많은 것을 말할 때'),
    },
    {
        Id: 'one-photograph',
        Category: '공간',
        Title: '많은 사진 사이에서 한 장을 고르는 기준',
        ShortTitle: '한 장의 기준',
        Summary: '완벽한 사진보다 오래 머무르게 하는 장면을 선택하는 방법.',
        Date: '29 Mar 2026',
        ReadTime: '5 min read',
        Image: '/images/memo-eric-cole/about-eric.png',
        Pages: Pages('많은 사진 사이에서 한 장을 고르는 기준'),
    },
];

export const WritingCategories = ['전체', '공간', '여행', '생각'] as const;
