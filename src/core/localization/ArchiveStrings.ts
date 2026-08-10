export const ArchiveStrings = {
    Home: {
        StageLabel: '아카이브 카테고리 탐색',
        Description: '가운데 선택을 시작으로 네 가지 아카이브를 둘러볼 수 있습니다.',
        IdleStatus: '로맨스, 스릴러, SF, 다큐 중 하나를 선택하세요.',
        ActiveStatus: '가운데 글자를 누르면 처음으로 돌아갑니다.',
    },
    Destinations: {
        Photo: '01. 사진',
        Media: '02. 영상·음악',
        Writing: '03. 긴 글',
        Memo: '04. 한 줄 메모',
    },
    Common: {
        Archive: 'Archive',
        DailyMessage: '오늘은 서두르지 않아도 괜찮아요.',
        BackToIndex: '처음으로',
    },
    Login: {
        Title: '로그인',
        Description: '관리자 계정으로 로그인하세요.',
        Id: '이메일',
        Password: '비밀번호',
        Submit: '로그인',
        Submitting: '확인 중...',
        RequiredNotice: '이메일과 비밀번호를 모두 입력해 주세요.',
        InvalidNotice: '이메일 또는 비밀번호가 올바르지 않습니다.',
        ErrorNotice: '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        SuccessNotice: '관리자로 로그인했습니다.',
        AccountTitle: '관리자 로그인됨',
        AccountDescription: '이 계정으로 홈페이지 관리 기능을 사용할 수 있습니다.',
        SignOut: '로그아웃',
    },
    Customization: {
        Eyebrow: 'PAGE CUSTOMIZE',
        Close: '페이지 설정 창 닫기',
        Start: {
            Title: '시작 페이지 설정',
            Description: '수정할 설정 항목을 선택하세요.',
            Options: [
                {
                    Title: '카테고리 설정',
                    Description: '카테고리와 게시판 이동 글자, 스타일과 선택 이미지를 변경합니다.',
                    CurrentValue: '텍스트 · 글자 스타일 · 이미지',
                },
                {
                    Title: '한마디',
                    Description: 'A 로고 옆 말풍선에 무작위로 표시할 문장을 관리합니다.',
                    CurrentValue: '문장 목록 · 무작위 표시',
                },
                {
                    Title: '링크 변경',
                    Description: '오른쪽 상단 이동 버튼의 텍스트와 URL을 변경합니다.',
                    CurrentValue: '텍스트 · URL',
                },
            ],
            Footer: '추가 설정은 이 목록에 같은 방식으로 확장됩니다.',
        },
        Photo: {
            Title: '사진 페이지 설정',
            Description: '수정할 설정 항목을 선택하세요.',
            Options: [
                {
                    Title: '상단 제목',
                    Description: '사진 페이지의 제목과 오른쪽 소개 문구를 변경합니다.',
                    CurrentValue: '문구 · 글자 스타일',
                },
            ],
            Footer: '추가 설정은 이 목록에 같은 방식으로 확장됩니다.',
        },
        Media: {
            Title: '영상 페이지 설정',
            Description: '수정할 설정 항목을 선택하세요.',
            Options: [
                {
                    Title: '상단 제목',
                    Description: '영상 페이지의 제목과 오른쪽 소개 문구를 변경합니다.',
                    CurrentValue: '문구 · 글자 스타일',
                },
                {
                    Title: '영상 행 개수',
                    Description: '한 줄에 나타나는 영상 카드 개수를 조절합니다.',
                    CurrentValue: '1개 — 10개',
                },
            ],
            Footer: '추가 설정은 이 목록에 같은 방식으로 확장됩니다.',
        },
    },
    Media: {
        Title: 'Motion Archive',
        SelectedWorks: '[SELECTED WORKS]',
        Composer: {
            Eyebrow: 'NEW MOVING IMAGE',
            Title: '영상 게시글 작성',
            Description: '영상 파일 또는 YouTube 링크로 움직이는 썸네일을 만듭니다.',
            Upload: '영상 파일',
            YouTube: 'YouTube 링크',
            TitleLabel: '제목',
            ContentLabel: '내용',
            StudioLabel: '제작사 · 출처',
            FileLabel: '영상 선택 (최대 50MB)',
            LinkLabel: 'YouTube 영상 주소',
            Cancel: '취소',
            Submit: '게시하기',
            Submitting: '업로드 중...',
        },
    },
    Writing: {
        Eyebrow: '03 · Long-form notes',
        Title: '오래 생각한 것은\n긴 문장으로 남깁니다.',
        Description: '일과 생활 사이에서 발견한 생각을 천천히 읽는 공간입니다.',
    },
    Memo: {
        Eyebrow: '04 · One-line memo',
        Title: '한 줄에서\n한 페이지가 시작됩니다.',
        Description: '짧은 문장을 추가하고, 표지를 바꾸고, 사진과 함께 보관하세요.',
    },
} as const;
