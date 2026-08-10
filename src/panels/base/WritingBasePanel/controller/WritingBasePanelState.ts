import type { WritingArticle } from './WritingBasePanelTypes';

export const WritingEditorDropMarkerHtml =
    '<hr data-editor-drop-target="true">';

export function InsertWritingEditorAssets(
    ContentHtml: string,
    UploadedHtml: string,
): string
{
    return ContentHtml.includes(WritingEditorDropMarkerHtml)
        ? ContentHtml.replace(
            WritingEditorDropMarkerHtml,
            UploadedHtml,
        )
        : ContentHtml + UploadedHtml;
}

export function GetWritingSlashQuery(
    Text: string,
    Offset: number,
): string | null
{
    return Text
        .slice(0, Offset)
        .match(/(?:^|\s)\/([^\s/]*)$/u)?.[1]
        ?? null;
}

export function NormalizeWritingSlashSearchText(
    Value: string,
): string
{
    return Value
        .replace(/\s+/gu, '')
        .toLocaleLowerCase('ko-KR');
}

export function GetWritingBlockShortcut(
    Text: string,
): string | null
{
    return ({
        '---': 'insertHorizontalRule',
        '-': 'insertUnorderedList',
        '1.': 'insertOrderedList',
    } as Record<string, string>)[Text] ?? null;
}

export function GetWritingEnterBehavior(
    BlockTag: string | null,
    IsShiftKey: boolean,
): { Command: string; ShouldExitBlock: boolean }
{
    const IsCodeBlock = BlockTag === 'PRE';

    return {
        Command: IsCodeBlock
            ? IsShiftKey
                ? 'insertParagraph'
                : 'insertLineBreak'
            : IsShiftKey
                ? 'insertLineBreak'
                : 'insertParagraph',
        ShouldExitBlock:
            BlockTag !== null
            && (
                IsCodeBlock
                    ? IsShiftKey
                    : IsShiftKey === false
            ),
    };
}

export function MoveWritingArticleOrder(
    CurrentOrder: string[],
    DraggedArticleId: string,
    TargetArticleId: string,
): string[]
{
    const DraggedIndex =
        CurrentOrder.indexOf(DraggedArticleId);
    const TargetIndex =
        CurrentOrder.indexOf(TargetArticleId);

    if(
        DraggedIndex < 0
        || TargetIndex < 0
        || DraggedIndex === TargetIndex
    )
    {
        return CurrentOrder;
    }

    const NextOrder = CurrentOrder.filter(
        (ArticleId) => ArticleId !== DraggedArticleId,
    );
    NextOrder.splice(TargetIndex, 0, DraggedArticleId);
    return NextOrder;
}

export const WritingArticles: WritingArticle[] = [
    {
        Id: 'long-lasting-content',
        Category: '기타 마케팅 칼럼',
        Title: '플랫폼보다 오래 버틸 콘텐츠를 만드는 일',
        Summary:
            '어디에 쓰는가보다 왜 계속 읽히는가를 먼저 생각해 본 기록입니다.',
        Date: '25 Jun 2026',
        ReadTime: '8 min read',
        Body: [
            '새로운 플랫폼이 등장할 때마다 우리는 어디에 글을 써야 하는지 다시 묻습니다. 하지만 더 오래 남는 질문은 어떤 문장이 독자를 다시 돌아오게 하는가에 가깝습니다.',
            '검색으로 찾아온 사람, 우연히 링크를 누른 사람, 제목만 보고 머무른 사람은 모두 다른 속도로 글을 읽습니다. 그래서 긴 글은 정보를 많이 담는 형식이 아니라 서로 다른 속도를 받아들이는 형식이어야 합니다.',
            '좋은 아카이브는 모든 것을 보관하지 않습니다. 지금의 나를 설명하는 장면과 생각을 고르고, 나중의 내가 다시 찾을 수 있는 순서로 놓습니다.',
            '결국 오래 버티는 콘텐츠는 플랫폼의 기능보다 관찰의 밀도에서 시작됩니다. 작게 발견하고, 충분히 생각하고, 읽는 사람이 숨을 고를 수 있게 남기는 일입니다.',
        ],
    },
    {
        Id: 'quiet-interface',
        Category: '디자인 노트',
        Title: '조용한 인터페이스가 더 많은 것을 말할 때',
        Summary:
            '여백, 속도, 작은 피드백이 화면의 목소리를 만드는 방식에 관하여.',
        Date: '08 Jun 2026',
        ReadTime: '6 min read',
        Body: [
            '인터페이스가 조용하다는 것은 정보가 적다는 뜻이 아닙니다. 무엇을 먼저 보아야 하는지 결정되어 있고, 나머지가 그 결정을 방해하지 않는 상태에 가깝습니다.',
            '작은 움직임은 사용자의 선택이 화면에 도착했다는 사실을 알려 줍니다. 빠르게 반응하되 서두르지 않는 전환은 제품의 태도가 됩니다.',
            '여백은 비어 있는 공간이 아니라 관계를 읽게 하는 장치입니다. 가까운 것은 함께 이해되고, 멀어진 것은 다음 생각을 위한 단서가 됩니다.',
        ],
    },
    {
        Id: 'collecting-days',
        Category: '생활 기록',
        Title: '하루를 수집하는 가장 작은 방법',
        Summary:
            '사진 한 장과 한 문장이 기억을 다시 여는 열쇠가 되는 순간들.',
        Date: '17 May 2026',
        ReadTime: '5 min read',
        Body: [
            '기록을 거창하게 시작하면 오래 이어가기 어렵습니다. 오늘 본 빛, 들은 말, 멈춰 선 장소 하나면 충분합니다.',
            '사진은 장면을 붙잡고 문장은 그때의 마음을 붙잡습니다. 둘이 함께 있을 때 기억은 훨씬 구체적인 온도로 돌아옵니다.',
            '매일 완성된 이야기를 만들 필요는 없습니다. 작은 조각을 쌓아 두면 어느 날 그 사이에서 나만의 흐름이 보이기 시작합니다.',
        ],
    },
    {
        Id: 'ideas-before-they-disappear',
        Category: '작업 기록',
        Title: '사라지기 전에 아이디어를 붙잡는 방법',
        Summary:
            '완성된 기획보다 빠르게 적어 둔 한 문장이 작업을 시작하게 만드는 순간들.',
        Date: '03 May 2026',
        ReadTime: '7 min read',
        Body: [
            '아이디어는 대개 준비된 책상보다 이동 중인 버스나 잠들기 직전의 방에서 먼저 찾아옵니다. 그 순간에는 전체 구조를 설명하려 하지 않고 가장 선명한 문장 하나만 남기는 편이 좋습니다.',
            '짧은 기록은 불완전하기 때문에 다음 생각이 들어올 자리를 남깁니다. 반대로 처음부터 완성된 문서처럼 정리하려 하면 기록 자체가 부담이 되어 중요한 감각을 놓치기 쉽습니다.',
            '나중에 메모를 다시 볼 때는 좋은 아이디어와 나쁜 아이디어를 즉시 구분하지 않습니다. 서로 다른 시기의 문장들이 만나는 과정에서 처음에는 보이지 않던 작업의 방향이 만들어지기도 합니다.',
        ],
    },
    {
        Id: 'pace-of-a-slow-project',
        Category: '작업 기록',
        Title: '느린 프로젝트의 속도를 믿는 일',
        Summary:
            '진행이 보이지 않는 시간에도 작업이 조금씩 형태를 얻고 있다는 믿음에 관하여.',
        Date: '22 Apr 2026',
        ReadTime: '9 min read',
        Body: [
            '모든 프로젝트가 매일 눈에 보이는 결과를 만들지는 않습니다. 조사하고 망설이고 다시 돌아가는 시간도 결과를 지탱하는 중요한 과정입니다.',
            '느린 작업에서는 완료한 항목보다 다음에 확인할 질문을 남기는 것이 도움이 됩니다. 질문이 정확하면 잠시 멈추더라도 다시 시작할 위치를 잃지 않습니다.',
            '속도를 높이는 것보다 리듬을 잃지 않는 것이 더 중요할 때가 있습니다. 작은 단위를 반복해 쌓으면 어느 순간 흩어진 조각들이 하나의 방향을 가리키기 시작합니다.',
        ],
    },
    {
        Id: 'useful-blank-space',
        Category: '디자인 노트',
        Title: '기록의 빈칸이 쓸모 있어지는 순간',
        Summary:
            '모든 영역을 채우지 않을 때 오히려 정보의 관계가 선명해지는 이유.',
        Date: '11 Apr 2026',
        ReadTime: '6 min read',
        Body: [
            '빈칸은 아직 결정하지 못한 공간이 아니라 무엇을 중요하게 볼지 알려 주는 장치가 될 수 있습니다. 밀도가 낮아지면 사용자는 요소 사이의 차이를 더 빠르게 읽습니다.',
            '화면을 채우려는 습관은 종종 같은 중요도를 가진 것처럼 보이는 정보를 늘립니다. 충분한 여백은 중심과 주변을 나누고 다음 행동을 서두르지 않게 합니다.',
            '좋은 빈칸은 무작정 넓지 않습니다. 내용의 길이와 읽는 속도를 고려해 멈춤이 필요한 위치에 배치될 때 비로소 화면의 리듬이 됩니다.',
        ],
    },
    {
        Id: 'small-brand-voice',
        Category: '기타 마케팅 칼럼',
        Title: '작은 브랜드가 자기 목소리를 찾는 과정',
        Summary:
            '더 크게 말하는 대신 같은 태도를 오래 반복하는 브랜드에 대한 생각.',
        Date: '29 Mar 2026',
        ReadTime: '8 min read',
        Body: [
            '작은 브랜드는 모든 사람에게 알려지기보다 어떤 사람에게 정확히 기억되는 편이 중요합니다. 이를 위해서는 유행하는 표현보다 자신이 반복할 수 있는 문장을 먼저 찾아야 합니다.',
            '목소리는 한 번의 캠페인으로 완성되지 않습니다. 제품 설명, 문의 답변, 사진의 색과 여백처럼 사소해 보이는 접점이 같은 태도를 가질 때 점차 선명해집니다.',
            '일관성은 매번 같은 것을 만드는 일이 아닙니다. 상황이 달라져도 무엇을 지키고 무엇을 바꿀지 판단하는 기준을 공유하는 일에 가깝습니다.',
        ],
    },
    {
        Id: 'choosing-one-photograph',
        Category: '생활 기록',
        Title: '많은 사진 사이에서 한 장을 고르는 기준',
        Summary:
            '기술적으로 완벽한 사진보다 오래 머무르게 하는 장면을 선택하는 방법.',
        Date: '14 Mar 2026',
        ReadTime: '5 min read',
        Body: [
            '비슷한 장면을 여러 장 찍고 나면 가장 선명한 사진부터 고르게 됩니다. 하지만 시간이 지난 뒤 다시 찾는 사진은 꼭 기술적으로 완벽한 장면만은 아닙니다.',
            '조금 흔들렸거나 구도가 비어 있어도 그날의 공기와 시선이 남아 있는 사진이 있습니다. 선택의 기준을 완성도에서 기억의 밀도로 옮기면 다른 장면이 보이기 시작합니다.',
            '한 장을 고른다는 것은 나머지를 버리는 일이 아니라 지금 보여 주고 싶은 이야기에 순서를 부여하는 일입니다.',
        ],
    },
    {
        Id: 'repeatable-creative-routine',
        Category: '생활 기록',
        Title: '반복 가능한 창작 습관을 만드는 법',
        Summary:
            '의욕이 충분하지 않은 날에도 작업을 이어 가게 하는 작은 규칙들.',
        Date: '28 Feb 2026',
        ReadTime: '7 min read',
        Body: [
            '좋은 습관은 가장 의욕적인 날이 아니라 아무것도 시작하고 싶지 않은 날을 기준으로 설계해야 합니다. 작게 시작할 수 있어야 오래 반복할 수 있습니다.',
            '매일 한 시간을 확보하는 것이 어렵다면 파일을 열고 어제의 문장을 한 번 읽는 것부터 시작할 수 있습니다. 시작의 마찰이 줄어들면 다음 행동은 자연스럽게 이어집니다.',
            '반복은 작업을 평범하게 만드는 것이 아니라 중요한 판단에 사용할 에너지를 남겨 줍니다. 익숙한 시작점이 있을 때 더 멀리 실험할 수 있습니다.',
        ],
    },
    {
        Id: 'questions-before-tools',
        Category: '디자인 노트',
        Title: '도구를 고르기 전에 질문을 고르는 일',
        Summary:
            '새로운 기능보다 해결하려는 문제를 먼저 선명하게 만드는 디자인 과정.',
        Date: '09 Feb 2026',
        ReadTime: '8 min read',
        Body: [
            '새로운 도구는 시작할 이유를 만들어 주지만 작업의 목적까지 정해 주지는 않습니다. 기능을 살펴보기 전에 누구의 어떤 시간을 바꾸고 싶은지 질문해야 합니다.',
            '질문이 모호하면 도구의 가능성이 곧 프로젝트의 범위가 됩니다. 반대로 문제가 분명하면 필요한 기능과 버려도 되는 기능을 빠르게 구분할 수 있습니다.',
            '좋은 질문은 정답을 즉시 주지 않습니다. 대신 여러 선택지 가운데 무엇을 비교해야 하는지 알려 주고, 팀이 같은 방향으로 대화하게 합니다.',
        ],
    },
    {
        Id: 'last-ten-percent',
        Category: '작업 기록',
        Title: '완성 직전의 마지막 십 퍼센트',
        Summary:
            '작업이 거의 끝났다고 느낀 뒤에야 비로소 보이는 작은 어긋남들.',
        Date: '24 Jan 2026',
        ReadTime: '6 min read',
        Body: [
            '프로젝트의 큰 구조가 완성되면 남은 일은 금방 끝날 것처럼 보입니다. 그러나 실제 인상을 결정하는 것은 마지막에 발견되는 작은 간격과 문장의 어조인 경우가 많습니다.',
            '마지막 단계에서는 새로운 아이디어를 더하기보다 이미 정한 기준과 어긋나는 부분을 찾는 편이 좋습니다. 추가보다 제거가 더 큰 변화를 만들기도 합니다.',
            '완료는 더 이상 고칠 것이 없는 상태가 아닙니다. 지금의 목적을 충분히 전달하며 다음 단계로 넘어가도 되는 상태를 합의하는 일입니다.',
        ],
    },
    {
        Id: 'archive-of-preferences',
        Category: '디자인 노트',
        Title: '좋아하는 것을 모으면 취향이 보일까',
        Summary:
            '서로 관련 없어 보이는 이미지와 문장에서 반복되는 선택을 발견하는 과정.',
        Date: '12 Jan 2026',
        ReadTime: '5 min read',
        Body: [
            '취향을 설명하려 하면 익숙한 장르나 스타일의 이름부터 떠올리게 됩니다. 하지만 실제 취향은 이름보다 반복해서 저장한 장면 사이에 더 구체적으로 남아 있습니다.',
            '이미지의 색, 문장의 길이, 사물 사이의 거리처럼 작은 공통점을 살펴보면 내가 무엇에 반응하는지 알 수 있습니다. 수집은 선택의 흔적을 눈에 보이게 만드는 방법입니다.',
            '취향은 한 번 정한 기준이 아니라 계속 수정되는 지도에 가깝습니다. 새로운 것을 좋아하게 될 때마다 이전의 선택도 다른 의미로 읽힙니다.',
        ],
    },
    {
        Id: 'notes-for-next-season',
        Category: '생활 기록',
        Title: '다음 계절의 나에게 남기는 메모',
        Summary:
            '지금의 감각을 미래의 내가 다시 발견할 수 있도록 보관하는 방법.',
        Date: '31 Dec 2025',
        ReadTime: '6 min read',
        Body: [
            '계절이 바뀔 때마다 비슷한 계획을 세우지만 그때의 마음은 조금씩 다릅니다. 결과만 남기면 왜 그런 선택을 했는지 쉽게 잊게 됩니다.',
            '미래의 나에게 남기는 기록에는 성공한 일뿐 아니라 망설였던 이유와 포기한 선택도 함께 적어 두는 편이 좋습니다. 판단의 배경이 있어야 다음 선택이 쉬워집니다.',
            '기록은 과거를 정확히 복원하기 위한 것이 아닙니다. 다시 시작할 때 필요한 온도와 방향을 건네는 작은 표지판입니다.',
        ],
    },
];
