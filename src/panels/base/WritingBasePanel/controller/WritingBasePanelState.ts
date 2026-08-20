import type { WritingArticle } from './WritingBasePanelTypes';

export type WritingPageDirection = 'left' | 'right' | 'up' | 'down';

const WritingPageDirections: readonly WritingPageDirection[] = [
    'right',
    'down',
    'left',
    'up',
];

export function GetWritingPageTransitionDirection(
    FromPage: number,
    ToPage: number,
    ForwardDirections: readonly (
        WritingPageDirection | null | undefined
    )[] = [],
): WritingPageDirection
{
    const Page = Math.max(0, Math.min(FromPage, ToPage));
    const Direction = ForwardDirections[Page]
        ?? WritingPageDirections[
            Page % WritingPageDirections.length
        ];

    if(ToPage > FromPage)
    {
        return Direction;
    }

    if(Direction === 'left')
    {
        return 'right';
    }

    if(Direction === 'right')
    {
        return 'left';
    }

    if(Direction === 'up')
    {
        return 'down';
    }

    return 'up';
}

export function IsWritingContentsPageVisible(
    PageIndex: number,
    CurrentPage: number,
    IsBookView: boolean,
): boolean
{
    return PageIndex === CurrentPage
        || (IsBookView && PageIndex === CurrentPage + 1);
}

export function ShouldPromptForWritingPassword(
    IsPasswordProtected: boolean,
    IsAuthenticated: boolean,
    IsUnlocked: boolean,
): boolean
{
    return IsPasswordProtected && !IsAuthenticated && !IsUnlocked;
}

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
        ForwardDirection:
            Index === SharedPages.length - 1
                ? null
                : WritingPageDirections[
                    Index % WritingPageDirections.length
                ],
        Heading: Index === 0 ? Subject : Page.Heading,
    }));
}

const LongFormPages = [
    {
        Heading: '아침의 첫 번째 소리',
        Paragraphs: [
            '도시는 눈을 뜨기 전에 먼저 소리를 냅니다. 멀리서 지나가는 첫 버스와 골목의 셔터가 올라가는 소리가 어둠 속에서 하루의 윤곽을 천천히 그립니다.',
            '창문을 조금 열면 밤새 식은 공기가 방 안으로 들어옵니다. 어제 남겨 둔 생각은 아직 책상 위에 있지만, 아침의 빛을 받으면 전혀 다른 문장처럼 보입니다.',
            '물을 끓이고 잔을 데우는 짧은 시간에는 아무것도 결정하지 않습니다. 서둘러 계획을 세우지 않아도 하루는 이미 조용히 시작되고 있습니다.',
            '익숙한 풍경을 오래 바라보면 매일 같은 것은 없다는 사실을 알게 됩니다. 빛의 각도와 구름의 높이, 길을 건너는 사람의 속도까지 조금씩 달라집니다.',
            '오늘의 기록은 특별한 사건보다 그 작은 차이를 알아차리는 일에서 시작합니다. 대단하지 않은 장면이기 때문에 오히려 오래 곁에 남습니다.',
        ],
    },
    {
        Heading: '골목을 천천히 걷는 법',
        Paragraphs: [
            '목적지를 정하지 않고 걷는 날에는 평소 지나치던 골목이 길의 중심이 됩니다. 빠르게 통과할 때 보이지 않던 창문과 화분, 오래된 간판이 차례로 눈에 들어옵니다.',
            '모퉁이를 돌 때마다 다음 장면을 미리 예상하지 않으려 합니다. 낯선 방향을 선택하는 작은 망설임이 산책을 여행에 가깝게 바꾸어 줍니다.',
            '담장 위로 뻗은 나뭇가지는 집 안의 계절을 바깥으로 알립니다. 바람이 불면 잎의 그림자가 벽을 따라 움직이고, 멈추면 잠시 한 장의 사진이 됩니다.',
            '좋은 길은 가장 빠른 길이 아니라 자꾸 뒤를 돌아보게 하는 길인지도 모릅니다. 지나온 풍경이 조금씩 멀어지는 모습을 보며 걸음의 속도를 다시 고릅니다.',
            '돌아갈 때는 처음과 다른 쪽 인도를 걷습니다. 같은 길도 바라보는 방향이 달라지면 전혀 다른 기억으로 남는다는 것을 알고 있기 때문입니다.',
        ],
    },
    {
        Heading: '낮의 빈 의자',
        Paragraphs: [
            '점심이 지난 카페에는 잠시 빈 시간이 생깁니다. 사람들이 떠난 자리에는 반쯤 밀린 의자와 컵이 놓였던 둥근 자국만 남아 있습니다.',
            '창가의 빈 의자는 누군가를 기다리는 것처럼 보이지만 사실은 빛이 머무는 자리입니다. 해가 움직일 때마다 등받이의 그림자도 바닥 위에서 천천히 방향을 바꿉니다.',
            '나는 그 자리에 앉아 메모장을 펼치고 오전에 본 장면을 적습니다. 정확한 설명보다 그때 느낀 온도와 소리를 먼저 붙잡으려 합니다.',
            '기억은 사실의 목록보다 감각의 순서에 가깝습니다. 빵 냄새 뒤에 문이 닫히는 소리가 오고, 그 뒤에 늦게 도착한 사람의 표정이 이어집니다.',
            '한 문장을 완성한 뒤에는 잠시 펜을 내려놓습니다. 비워 둔 시간이 있어야 다음 문장이 앞의 문장을 밀어내지 않고 나란히 앉을 수 있습니다.',
        ],
    },
    {
        Heading: '비가 지나간 자리',
        Paragraphs: [
            '짧은 비가 그친 뒤의 길은 이전보다 많은 것을 비춥니다. 작은 웅덩이 안에는 건물의 창과 신호등, 서둘러 지나가는 우산 끝이 함께 담깁니다.',
            '젖은 아스팔트 냄새를 맡으면 오래전 여름의 장면이 예고 없이 돌아옵니다. 기억은 날짜보다 냄새와 빛에 더 정확한 주소를 남기는 듯합니다.',
            '처마 아래에서 비를 피하던 사람들은 하나둘 다시 길로 나섭니다. 잠시 같은 방향을 바라보던 낯선 사람들이 각자의 속도로 흩어집니다.',
            '나무 잎에 남은 물방울은 바람이 올 때까지 자리를 지킵니다. 아주 작은 흔들림 뒤에 떨어지는 순간을 보고 있으면 기다림에도 끝나는 방식이 있다는 생각이 듭니다.',
            '비가 지나간 자리는 금세 마르지만, 그때 적어 둔 문장은 남습니다. 기록은 사라지는 장면에 오래 머물 수 있는 시간을 조금 더 건네는 일입니다.',
        ],
    },
    {
        Heading: '오후 네 시의 빛',
        Paragraphs: [
            '오후 네 시가 되면 방 안의 사물들이 갑자기 선명해집니다. 낮 동안 평평하던 책과 화병에 긴 그림자가 생기며 각자의 부피를 되찾습니다.',
            '그 빛은 오래 머물지 않기 때문에 더 자세히 보게 됩니다. 커튼의 주름과 종이의 가장자리처럼 평소에는 배경이던 것들이 잠시 장면의 중심으로 나옵니다.',
            '사진을 찍기 전에 눈으로 먼저 충분히 바라봅니다. 카메라를 드는 순간 장면을 고르기 시작하고, 고르는 동안 놓치는 것들도 생기기 때문입니다.',
            '한 장을 남긴 뒤에는 화면을 확인하지 않습니다. 잘 찍혔는지 판단하는 일보다 지금의 빛이 어디로 이동하는지 따라가는 일이 더 중요합니다.',
            '해가 건물 뒤로 숨으면 방은 다시 익숙한 표정으로 돌아갑니다. 다만 조금 전의 빛을 본 사람에게는 같은 공간이 이전과 완전히 같을 수 없습니다.',
        ],
    },
    {
        Heading: '작은 가게의 저녁',
        Paragraphs: [
            '저녁 무렵 작은 가게들은 저마다 다른 색의 불을 켭니다. 낮에는 보이지 않던 내부의 깊이가 유리창 위로 드러나고 거리는 잠시 긴 전시장처럼 변합니다.',
            '주인은 문 앞의 물건을 안으로 옮기며 하루의 순서를 거꾸로 되짚습니다. 아침에 펼쳤던 것들을 하나씩 접는 손에는 반복에서 생긴 정확함이 있습니다.',
            '늦게 들어온 손님은 천천히 선반을 살핍니다. 문을 닫을 시간이 가까워도 누구도 재촉하지 않는 몇 분이 가게의 인상을 오래 남깁니다.',
            '계산대 옆에는 읽다 만 책과 식은 차가 놓여 있습니다. 일과 생활을 완전히 나누지 않은 흔적이 공간을 더 따뜻하고 실제적으로 만듭니다.',
            '불이 꺼진 뒤에도 간판의 잔상이 잠시 눈에 남습니다. 하루를 마친다는 것은 모든 것을 지우는 일이 아니라 다음 날 다시 펼칠 모양으로 정돈하는 일입니다.',
        ],
    },
    {
        Heading: '돌아오는 버스 안에서',
        Paragraphs: [
            '집으로 돌아오는 버스에서는 창밖의 풍경이 일정한 속도로 뒤로 흐릅니다. 걷는 동안 가까이 보았던 장소들이 한 장의 긴 배경처럼 이어집니다.',
            '정류장마다 사람들이 내리고 타면서 좌석의 빈자리도 옮겨 갑니다. 잠시 서로의 하루에 등장했던 사람들은 이름을 모른 채 다른 방향으로 사라집니다.',
            '유리에 비친 얼굴과 바깥 풍경이 겹치면 지금 있는 곳과 지나온 곳을 동시에 보는 기분이 듭니다. 이동은 두 장소 사이보다 두 시간 사이에 놓인 상태인지도 모릅니다.',
            '휴대전화를 꺼내기보다 오늘 적은 메모를 머릿속으로 다시 읽습니다. 빠진 장면이 떠오르면 짧은 단어 하나만 덧붙이고 다시 창밖을 봅니다.',
            '익숙한 정류장 안내가 들리면 생각도 천천히 현재로 돌아옵니다. 여행처럼 길었던 하루는 문이 열리는 순간 평범한 저녁의 일부가 됩니다.',
        ],
    },
    {
        Heading: '책상 위에 남은 것들',
        Paragraphs: [
            '밤의 책상에는 하루 동안 사용한 물건들이 작은 지도처럼 흩어져 있습니다. 영수증과 연필, 접힌 안내지가 오늘 움직인 경로를 대신 설명합니다.',
            '모든 것을 바로 정리하지 않고 먼저 한 번 바라봅니다. 필요 없어 보이는 조각 안에 나중에 문장이 될 만한 구체적인 시간이 숨어 있을 수 있습니다.',
            '메모를 옮겨 적을 때는 문장을 매끄럽게 고치지 않습니다. 처음 적은 단어의 거친 모양이 그 순간의 속도와 마음을 더 정확하게 품고 있기 때문입니다.',
            '사진에는 짧은 설명만 붙입니다. 보이는 것을 반복하는 대신 사진 밖에서 들렸던 소리나 프레임에 들어오지 못한 사람의 움직임을 적습니다.',
            '정리를 마치면 남길 것과 버릴 것이 분명해집니다. 기록은 많이 모으는 기술보다 무엇을 오래 곁에 둘지 결정하는 태도에 가깝습니다.',
        ],
    },
    {
        Heading: '조용히 이어지는 문장',
        Paragraphs: [
            '며칠 뒤 메모를 다시 읽으면 그날에는 보이지 않던 연결이 나타납니다. 서로 다른 장소에서 적은 문장들이 같은 질문을 향하고 있었다는 사실을 뒤늦게 알게 됩니다.',
            '연결을 발견했다고 해서 모든 틈을 설명으로 채우지는 않습니다. 독자가 자신의 기억을 놓을 수 있는 여백이 있을 때 글은 한 사람의 기록을 넘어갑니다.',
            '문장의 길이도 조금씩 다르게 둡니다. 짧은 문장은 걸음을 멈추게 하고, 긴 문장은 하나의 풍경 안에 더 오래 머물게 합니다.',
            '소리 내어 읽으면 눈으로만 볼 때 지나쳤던 리듬이 들립니다. 숨이 차는 곳은 나누고, 너무 빨리 끝나는 곳에는 구체적인 장면을 하나 더 놓습니다.',
            '완성에 가까워질수록 새로운 말을 더하기보다 겹치는 말을 덜어냅니다. 남은 문장들이 서로를 가리지 않을 때 기록의 목소리도 또렷해집니다.',
        ],
    },
    {
        Heading: '다음 날을 위한 빈칸',
        Paragraphs: [
            '마지막 페이지를 쓸 때에도 하루가 완전히 끝났다고 생각하지 않습니다. 오늘의 결론은 내일 다른 빛과 장소를 만나면 얼마든지 달라질 수 있습니다.',
            '그래서 기록의 끝에는 작은 빈칸을 남겨 둡니다. 덧붙일 문장이 생기지 않더라도 그 여백은 아직 보지 못한 장면이 있다는 사실을 기억하게 합니다.',
            '창밖의 불이 하나씩 꺼지고 방 안의 시계 소리가 선명해집니다. 조용해진 시간 속에서 오늘 지나온 길이 실제 거리보다 조금 길게 느껴집니다.',
            '노트를 덮기 전에 내일의 할 일 대신 내일 보고 싶은 것을 한 줄 적습니다. 해야 하는 일보다 바라볼 대상을 정하면 하루의 시작이 조금 가벼워집니다.',
            '기록은 지나간 시간을 붙잡아 두는 일이 아니라 다음 시간을 더 잘 바라보게 하는 연습입니다. 그렇게 한 페이지의 끝은 자연스럽게 새로운 첫 문장으로 이어집니다.',
        ],
    },
].map((Page, Index) => ({
    ...Page,
    ForwardDirection:
        Index === 9
            ? null
            : WritingPageDirections[Index % WritingPageDirections.length],
}));

export const WritingArticles: WritingArticle[] = [
    {
        Id: 'a-day-collected-slowly',
        Category: '생각',
        Title: '천천히 모은 하루의 장면들',
        ShortTitle: '하루의 장면들',
        Summary: '아침의 첫 소리부터 밤의 빈칸까지, 평범한 하루를 열 페이지에 나누어 기록했습니다.',
        Date: '19 Aug 2026',
        ReadTime: '18 min read',
        Image: '/images/journal-01.webp',
        Pages: LongFormPages,
    },
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
