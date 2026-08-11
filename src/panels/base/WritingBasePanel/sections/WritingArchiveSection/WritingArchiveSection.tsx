'use client';

import {
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from 'react';
import type { useWritingBasePanelController } from '../../controller/WritingBasePanelController';
import type {
    WritingArticle,
    WritingPage,
    WritingViewMode,
} from '../../controller/WritingBasePanelTypes';
import Styles from '../../WritingBasePanel.module.css';

interface WritingArchiveSectionProps
{
    Controller: ReturnType<typeof useWritingBasePanelController>;
}

function SearchIcon()
{
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
        </svg>
    );
}

function ListIcon()
{
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 6h13M8 12h13M8 18h13" />
            <circle cx="3" cy="6" r="1" />
            <circle cx="3" cy="12" r="1" />
            <circle cx="3" cy="18" r="1" />
        </svg>
    );
}

function FullscreenIcon()
{
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" />
        </svg>
    );
}

function BookmarkIcon()
{
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4z" />
            <path d="m9 8 6 6M15 8l-6 6" />
        </svg>
    );
}

function ViewStyleIcon({ Mode }: { Mode: WritingViewMode })
{
    return (
        <svg
            className={Styles.ViewStyleIcon}
            data-mode={Mode}
            viewBox="0 0 30 26"
            aria-hidden="true"
        >
            {Mode === 'single' ? (
                <>
                    <rect x="8" y="2" width="14" height="22" />
                    <path d="M11 6h8M11 9h8" />
                </>
            ) : Mode === 'spread' ? (
                <>
                    <path d="M2 3h12v20H2zM16 3h12v20H16z" />
                    <path d="M14 3v20M5 7h6M19 7h6" />
                </>
            ) : (
                <>
                    <rect x="7" y="2" width="16" height="22" />
                    <path d="m15 6-3 3m3-3 3 3M15 20l-3-3m3 3 3-3M15 6v14" />
                </>
            )}
        </svg>
    );
}

function GetViewModeLabel(Mode: WritingViewMode): string
{
    if(Mode === 'single')
    {
        return '한 페이지 보기';
    }

    return Mode === 'spread' ? '양면 보기' : '스크롤 보기';
}

function HighlightText(Text: string, Query: string): ReactNode
{
    const NormalizedQuery = Query.trim();

    if(NormalizedQuery === '')
    {
        return Text;
    }

    const EscapedQuery = NormalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const Parts = Text.split(new RegExp(`(${EscapedQuery})`, 'gi'));

    return Parts.map((Part, Index) =>
        Part.toLocaleLowerCase('ko-KR')
            === NormalizedQuery.toLocaleLowerCase('ko-KR')
            ? <mark key={`${Part}-${Index}`}>{Part}</mark>
            : Part,
    );
}

function CreatePaperEdge(Value: string): string
{
    let Seed = 2166136261;

    for(const Character of Value)
    {
        Seed ^= Character.charCodeAt(0);
        Seed = Math.imul(Seed, 16777619);
    }

    function Random()
    {
        Seed += 0x6d2b79f5;
        let Number = Seed;
        Number = Math.imul(Number ^ (Number >>> 15), Number | 1);
        Number ^= Number + Math.imul(Number ^ (Number >>> 7), Number | 61);
        return ((Number ^ (Number >>> 14)) >>> 0) / 4294967296;
    }

    function EdgeOffset(MaximumDepth: number)
    {
        return Random() < .84
            ? .04 + Random() * .24
            : .34 + Random() * MaximumDepth;
    }

    function EdgeStep()
    {
        return .8 + Random() * 2.8;
    }

    const Points: string[] = [];
    let Position = 0;

    while(Position < 100)
    {
        Points.push(`${Position.toFixed(1)}% ${EdgeOffset(.72).toFixed(2)}%`);
        Position = Math.min(100, Position + EdgeStep());
    }

    Position = 0;
    while(Position < 100)
    {
        Points.push(`${(100 - EdgeOffset(1.9)).toFixed(2)}% ${Position.toFixed(1)}%`);
        Position = Math.min(100, Position + EdgeStep());
    }

    Position = 100;
    while(Position > 0)
    {
        Points.push(`${Position.toFixed(1)}% ${(100 - EdgeOffset(.72)).toFixed(2)}%`);
        Position = Math.max(0, Position - EdgeStep());
    }

    Position = 100;
    while(Position > 0)
    {
        Points.push(`${EdgeOffset(1.9).toFixed(2)}% ${Position.toFixed(1)}%`);
        Position = Math.max(0, Position - EdgeStep());
    }

    return `polygon(${Points.join(',')})`;
}

function ReaderPage({
    Page,
    PageNumber,
    SearchQuery,
}: {
    Page: WritingPage;
    PageNumber: number;
    SearchQuery: string;
})
{
    return (
        <article
            className={Styles.ReaderPage}
            data-reader-page-index={PageNumber - 1}
        >
            <span className={Styles.ReaderPageNumber}>
                {String(PageNumber).padStart(2, '0')}
            </span>
            <h2>{HighlightText(Page.Heading, SearchQuery)}</h2>
            {Page.Paragraphs.map((Paragraph) => (
                <p key={Paragraph}>{HighlightText(Paragraph, SearchQuery)}</p>
            ))}
        </article>
    );
}

function ContentsDrawer({
    Article,
    CurrentPage,
    OnClose,
    OnSelectPage,
}: {
    Article: WritingArticle;
    CurrentPage: number;
    OnClose: () => void;
    OnSelectPage: (Page: number) => void;
})
{
    return (
        <aside className={Styles.ContentsDrawer}>
            <header>
                <strong>목차</strong>
                <button type="button" onClick={OnClose} aria-label="목차 닫기">×</button>
            </header>
            <div className={Styles.ContentsBook}>
                <span style={{ backgroundImage: `url(${Article.Image})` }} />
                <strong>{Article.Title}</strong>
            </div>
            <ol className={Styles.ContentsPages} aria-label="전체 글 페이지">
                {Article.Pages.map((Page, Index) => (
                    <li key={`${Page.Heading}-${Index}`}>
                        <button
                            type="button"
                            className={Index === CurrentPage ? Styles.ContentsPageActive : ''}
                            onClick={() => OnSelectPage(Index)}
                        >
                            <small>{Math.round(((Index + 1) / Article.Pages.length) * 100)}%</small>
                            <strong>{Index + 1} {Page.Heading}</strong>
                        </button>
                    </li>
                ))}
            </ol>
        </aside>
    );
}

function ReaderSettings({ Controller }: WritingArchiveSectionProps)
{
    return (
        <aside className={Styles.ReaderSettings}>
            <header>
                <strong>보기설정</strong>
                <button
                    type="button"
                    onClick={() => Controller.SetIsSettingsOpen(false)}
                    aria-label="보기 설정 닫기"
                >
                    ×
                </button>
            </header>
            <fieldset>
                <legend>글꼴</legend>
                <div className={Styles.FontChoices}>
                    {([
                        ['sans', '고딕'],
                        ['serif', '바탕'],
                        ['rounded', '둥근고딕'],
                        ['mono', '고정폭'],
                    ] as const).map(([Value, Label]) => (
                        <button
                            type="button"
                            key={Value}
                            data-font={Value}
                            data-active={Controller.ReaderFont === Value}
                            onClick={() => Controller.SetReaderFont(Value)}
                        >
                            {Label}
                        </button>
                    ))}
                </div>
            </fieldset>
            <label className={Styles.StepSetting}>
                <span>글자크기</span>
                <output>{Controller.ReaderFontSize}</output>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderFontSize(Math.max(14, Controller.ReaderFontSize - 1))}
                >−</button>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderFontSize(Math.min(24, Controller.ReaderFontSize + 1))}
                >＋</button>
            </label>
            <label className={Styles.StepSetting}>
                <span>줄간격</span>
                <output>{Controller.ReaderLineHeight.toFixed(1)}</output>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderLineHeight(Math.max(1.4, Controller.ReaderLineHeight - .1))}
                >−</button>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderLineHeight(Math.min(2.4, Controller.ReaderLineHeight + .1))}
                >＋</button>
            </label>
            <label className={Styles.StepSetting}>
                <span>문단간격</span>
                <output>{Controller.ReaderParagraphGap}</output>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderParagraphGap(Math.max(12, Controller.ReaderParagraphGap - 2))}
                >−</button>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderParagraphGap(Math.min(40, Controller.ReaderParagraphGap + 2))}
                >＋</button>
            </label>
            <label className={Styles.StepSetting}>
                <span>좌우여백</span>
                <output>{Controller.ReaderPadding}</output>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderPadding(Math.max(24, Controller.ReaderPadding - 4))}
                >−</button>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderPadding(Math.min(80, Controller.ReaderPadding + 4))}
                >＋</button>
            </label>
            <label className={Styles.StepSetting}>
                <span>상하여백</span>
                <output>{Controller.ReaderVerticalPadding}</output>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderVerticalPadding(Math.max(20, Controller.ReaderVerticalPadding - 4))}
                >−</button>
                <button
                    type="button"
                    onClick={() => Controller.SetReaderVerticalPadding(Math.min(100, Controller.ReaderVerticalPadding + 4))}
                >＋</button>
            </label>
            <label className={Styles.ToggleSetting}>
                <span>들여쓰기</span>
                <button
                    type="button"
                    data-active={Controller.IsIndented}
                    onClick={() => Controller.SetIsIndented(!Controller.IsIndented)}
                >
                    {Controller.IsIndented ? 'ON' : 'OFF'}
                </button>
            </label>
            <fieldset>
                <legend>배경</legend>
                <div className={Styles.ToneChoices}>
                    {([
                        ['light', '화이트'],
                        ['night', '다크'],
                        ['black', '블랙'],
                        ['teal', '딥 틸'],
                        ['brown', '브라운'],
                        ['gray', '그레이'],
                        ['rose', '로즈'],
                        ['lavender', '라벤더'],
                        ['sage', '세이지'],
                        ['paper', '크림'],
                    ] as const).map(([Tone, Label]) => (
                        <button
                            type="button"
                            key={Tone}
                            aria-label={`${Label} 배경`}
                            title={Label}
                            data-tone={Tone}
                            data-active={Controller.ReaderTone === Tone}
                            onClick={() => Controller.SetReaderTone(Tone)}
                        />
                    ))}
                </div>
            </fieldset>
            <div className={Styles.AlignmentChoices}>
                <button
                    type="button"
                    data-active={Controller.ReaderAlignment === 'left'}
                    onClick={() => Controller.SetReaderAlignment('left')}
                >
                    왼쪽 정렬
                </button>
                <button
                    type="button"
                    data-active={Controller.ReaderAlignment === 'justify'}
                    onClick={() => Controller.SetReaderAlignment('justify')}
                >
                    양쪽 정렬
                </button>
            </div>
            <footer className={Styles.SettingsFooter}>
                <p role="status">{Controller.ReaderSettingsNotice}</p>
                <button type="button" onClick={Controller.SaveReaderSettings}>
                    설정 저장
                </button>
                <button type="button" onClick={Controller.ResetSettings}>
                    설정 초기화
                </button>
            </footer>
        </aside>
    );
}

function Reader({ Controller }: WritingArchiveSectionProps)
{
    const Article = Controller.ReaderArticle;
    const ReaderCanvasReference = useRef<HTMLDivElement>(null);
    const ReaderReference = useRef<HTMLElement>(null);
    const [ViewTransition, SetViewTransition] = useState<{
        Id: number;
        Mode: WritingViewMode;
    } | null>(null);

    if(Article === null)
    {
        return null;
    }

    const Pages = Controller.ViewMode === 'scroll'
        ? Article.Pages
        : Article.Pages.slice(
            Controller.ReaderPage,
            Controller.ReaderPage + Controller.VisiblePageCount,
        );
    const ProgressPageCount = Controller.ViewMode === 'scroll'
        ? 1
        : Pages.length;
    const Progress = Math.min(
        100,
        ((Controller.ReaderPage + ProgressPageCount) / Article.Pages.length) * 100,
    );
    const ReaderStyle = {
        '--reader-font-size': `${Controller.ReaderFontSize}px`,
        '--reader-line-height': Controller.ReaderLineHeight,
        '--reader-paragraph-gap': `${Controller.ReaderParagraphGap}px`,
        '--reader-horizontal-padding': `${Controller.ReaderPadding}px`,
        '--reader-vertical-padding': `${Controller.ReaderVerticalPadding}px`,
    } as CSSProperties;

    async function ToggleFullscreen()
    {
        if(document.fullscreenElement)
        {
            await document.exitFullscreen();
            return;
        }

        await ReaderReference.current?.requestFullscreen();
    }

    function ScrollReaderToPage(Page: number)
    {
        requestAnimationFrame(() =>
        {
            ReaderCanvasReference.current
                ?.querySelector(`[data-reader-page-index="${Page}"]`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function ChangeReaderPage(Page: number)
    {
        Controller.SetReaderPage(Page);

        if(Controller.ViewMode === 'scroll')
        {
            ScrollReaderToPage(Page);
        }
    }

    function ChangeViewMode(Mode: WritingViewMode)
    {
        Controller.ChangeViewMode(Mode);
        SetViewTransition({ Id: Date.now(), Mode });
    }

    function CloseReaderSearch()
    {
        Controller.SetIsReaderSearchOpen(false);
        Controller.ChangeReaderSearchQuery('');
    }

    function ClosePopoversOutside(Event: ReactPointerEvent<HTMLElement>)
    {
        const Target = Event.target;

        if(!(Target instanceof Element))
        {
            return;
        }

        if(Controller.IsContentsOpen
            && Target.closest(`.${Styles.ContentsDrawer}`) === null
            && Target.closest('[data-reader-contents-trigger]') === null)
        {
            Controller.SetIsContentsOpen(false);
        }

        if(Controller.IsViewMenuOpen
            && Target.closest('[data-reader-view-menu]') === null)
        {
            Controller.SetIsViewMenuOpen(false);
        }

        if(Controller.IsSettingsOpen
            && Target.closest(`.${Styles.ReaderSettings}`) === null
            && Target.closest('[data-reader-settings-trigger]') === null)
        {
            Controller.SetIsSettingsOpen(false);
        }

        if(Controller.IsReaderSearchOpen
            && Target.closest(`.${Styles.ReaderSearchPanel}`) === null
            && Target.closest('[data-reader-search-trigger]') === null)
        {
            CloseReaderSearch();
        }
    }

    return (
        <section
            ref={ReaderReference}
            className={Styles.Reader}
            onPointerDown={ClosePopoversOutside}
            data-tone={Controller.ReaderTone}
            data-font={Controller.ReaderFont}
            data-align={Controller.ReaderAlignment}
            data-indent={Controller.IsIndented}
            data-view={Controller.ViewMode}
            style={ReaderStyle}
        >
            <div className={Styles.ReaderToolbar}>
                <button
                    type="button"
                    className={Styles.ContentsButton}
                    data-reader-contents-trigger
                    onClick={() => Controller.SetIsContentsOpen(!Controller.IsContentsOpen)}
                    aria-label="목차 열기"
                >
                    <ListIcon />
                </button>
                <strong>{Article.Title}</strong>
                <div className={Styles.ReaderActions}>
                    <div className={Styles.ViewMenuWrap} data-reader-view-menu>
                        <button
                            type="button"
                            onClick={() => Controller.SetIsViewMenuOpen(!Controller.IsViewMenuOpen)}
                            aria-label="페이지 보기 방식"
                        >
                            <ViewStyleIcon Mode={Controller.ViewMode} />
                        </button>
                        {Controller.IsViewMenuOpen ? (
                            <div className={Styles.ViewMenu}>
                                <button type="button" onClick={() => ChangeViewMode('single')}>
                                    <span><ViewStyleIcon Mode="single" /></span> 한 페이지 보기
                                </button>
                                <button type="button" onClick={() => ChangeViewMode('spread')}>
                                    <span><ViewStyleIcon Mode="spread" /></span> 두 페이지 보기
                                </button>
                                <button type="button" onClick={() => ChangeViewMode('scroll')}>
                                    <span><ViewStyleIcon Mode="scroll" /></span> 스크롤 보기
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        aria-label="전체 화면 전환"
                        onClick={() => void ToggleFullscreen()}
                    >
                        <FullscreenIcon />
                    </button>
                    <button
                        type="button"
                        className={Styles.FontButton}
                        data-reader-settings-trigger
                        onClick={() => Controller.SetIsSettingsOpen(!Controller.IsSettingsOpen)}
                        aria-label="보기 설정"
                    >
                        가<small>가</small>
                    </button>
                    <button
                        type="button"
                        data-reader-search-trigger
                        aria-label="본문 검색"
                        onClick={() => Controller.SetIsReaderSearchOpen(!Controller.IsReaderSearchOpen)}
                    >
                        <SearchIcon />
                    </button>
                    <button
                        type="button"
                        className={Styles.CloseReader}
                        onClick={Controller.CloseReader}
                        aria-label="글 닫기"
                    >
                        <BookmarkIcon />
                    </button>
                </div>
            </div>
            {ViewTransition ? (
                <div
                    key={ViewTransition.Id}
                    className={Styles.ViewTransitionGuide}
                    role="status"
                    onAnimationEnd={() => SetViewTransition(null)}
                >
                    <ViewStyleIcon Mode={ViewTransition.Mode} />
                    <strong>{GetViewModeLabel(ViewTransition.Mode)}</strong>
                </div>
            ) : null}
            {Controller.IsReaderSearchOpen ? (
                <div className={Styles.ReaderSearchPanel} role="search">
                    <SearchIcon />
                    <input
                        type="search"
                        value={Controller.ReaderSearchQuery}
                        onChange={(Event) => {
                            const Page = Controller.ChangeReaderSearchQuery(Event.currentTarget.value);
                            if(typeof Page === 'number')
                            {
                                ScrollReaderToPage(Page);
                            }
                        }}
                        placeholder="본문에서 검색"
                        aria-label="본문 검색어"
                        autoFocus
                    />
                    <span>
                        {Controller.ReaderSearchMatches.length === 0
                            ? '0 / 0'
                            : `${Controller.ReaderSearchMatchIndex + 1} / ${Controller.ReaderSearchMatches.length}`}
                    </span>
                    <button
                        type="button"
                        disabled={Controller.ReaderSearchMatches.length === 0}
                        onClick={() => {
                            const Page = Controller.MoveReaderSearchMatch(-1);
                            if(typeof Page === 'number')
                            {
                                ScrollReaderToPage(Page);
                            }
                        }}
                        aria-label="이전 검색 결과"
                    >↑</button>
                    <button
                        type="button"
                        disabled={Controller.ReaderSearchMatches.length === 0}
                        onClick={() => {
                            const Page = Controller.MoveReaderSearchMatch(1);
                            if(typeof Page === 'number') ScrollReaderToPage(Page);
                        }}
                        aria-label="다음 검색 결과"
                    >↓</button>
                    <button
                        type="button"
                        onClick={CloseReaderSearch}
                        aria-label="본문 검색 닫기"
                    >×</button>
                </div>
            ) : null}
            <div
                ref={ReaderCanvasReference}
                className={Styles.ReaderCanvas}
                onScroll={(Event) => {
                    if(Controller.ViewMode !== 'scroll')
                    {
                        return;
                    }
                    const Element = Event.currentTarget;
                    const ScrollRange = Element.scrollHeight - Element.clientHeight;
                    const Page = ScrollRange <= 0
                        ? 0
                        : Math.round((Element.scrollTop / ScrollRange) * Controller.MaximumReaderPage);
                    Controller.SetReaderPage(Page);
                }}
            >
                {Controller.ViewMode !== 'scroll' ? <button
                    type="button"
                    className={`${Styles.PageArrow} ${Styles.PageArrowPrevious}`}
                    disabled={Controller.ReaderPage === 0}
                    onClick={Controller.PreviousReaderPage}
                    aria-label="이전 페이지"
                >
                    ‹
                </button> : null}
                <div className={Styles.PageSpread}>
                    {Pages.map((Page, Index) => (
                        <ReaderPage
                            key={`${Article.Id}-${Page.Heading}`}
                            Page={Page}
                            PageNumber={
                                Controller.ViewMode === 'scroll'
                                    ? Index + 1
                                    : Controller.ReaderPage + Index + 1
                            }
                            SearchQuery={Controller.ReaderSearchQuery}
                        />
                    ))}
                </div>
                {Controller.ViewMode !== 'scroll' ? <button
                    type="button"
                    className={`${Styles.PageArrow} ${Styles.PageArrowNext}`}
                    disabled={Controller.ReaderPage >= Controller.MaximumReaderPage}
                    onClick={Controller.NextReaderPage}
                    aria-label="다음 페이지"
                >
                    ›
                </button> : null}
            </div>
            <footer className={Styles.ReaderProgress}>
                <input
                    type="range"
                    min="0"
                    max={Controller.MaximumReaderPage}
                    value={Math.min(Controller.ReaderPage, Controller.MaximumReaderPage)}
                    onChange={(Event) => ChangeReaderPage(Number(Event.currentTarget.value))}
                    style={{ '--reader-progress': `${Progress}%` } as CSSProperties}
                    aria-label="읽기 진행 위치"
                />
                <div>
                    <span aria-hidden="true">ⓘ</span>
                    <strong>{Math.round(Progress)}%</strong>
                    <span>/ {Article.Pages.length}장</span>
                </div>
            </footer>
            {Controller.IsContentsOpen ? (
                <ContentsDrawer
                    Article={Article}
                    CurrentPage={Controller.ReaderPage}
                    OnClose={() => Controller.SetIsContentsOpen(false)}
                    OnSelectPage={(Page) => {
                        ChangeReaderPage(Page);
                        Controller.SetIsContentsOpen(false);
                    }}
                />
            ) : null}
            {Controller.IsSettingsOpen ? <ReaderSettings Controller={Controller} /> : null}
        </section>
    );
}

export function WritingArchiveSection({ Controller }: WritingArchiveSectionProps)
{
    const [EditingCategory, SetEditingCategory] =
        useState<string | null>(null);
    const [CategoryDraft, SetCategoryDraft] = useState('');

    async function CommitCategoryRename(Category: string)
    {
        if(await Controller.RenameCategory(Category, CategoryDraft))
        {
            SetEditingCategory(null);
        }
    }

    if(Controller.ReaderArticle !== null)
    {
        return <Reader Controller={Controller} />;
    }

    return (
        <section className={Styles.Archive} data-ue-component="WritingArchiveSection">
            <div className={Styles.ArchiveTools}>
                <nav className={Styles.CategoryTabs} aria-label="글 카테고리">
                    {Controller.Categories.map((Category) => (
                        <div className={Styles.CategoryItem} key={Category}>
                            {EditingCategory === Category ? (
                                <form
                                    className={Styles.CategoryRenameForm}
                                    onSubmit={(Event) => {
                                        Event.preventDefault();
                                        void CommitCategoryRename(Category);
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={CategoryDraft}
                                        maxLength={20}
                                        autoFocus
                                        disabled={Controller.IsCategorySaving}
                                        onChange={(Event) => SetCategoryDraft(Event.currentTarget.value)}
                                        onBlur={() => void CommitCategoryRename(Category)}
                                        onKeyDown={(Event) => {
                                            if(Event.key === 'Escape') SetEditingCategory(null);
                                        }}
                                        aria-label={`${Category} 카테고리 이름 변경`}
                                    />
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    data-active={Controller.ActiveCategory === Category}
                                    onClick={() => Controller.SetActiveCategory(Category)}
                                    onDoubleClick={() => {
                                        if(Controller.IsAuthenticated && Category !== '전체')
                                        {
                                            SetCategoryDraft(Category);
                                            SetEditingCategory(Category);
                                        }
                                    }}
                                    title={Controller.IsAuthenticated && Category !== '전체'
                                        ? '더블클릭하여 이름 변경'
                                        : undefined}
                                >
                                    {Category}
                                </button>
                            )}
                            {Controller.IsAuthenticated && Category !== '전체' ? (
                                <button
                                    type="button"
                                    className={Styles.CategoryDeleteButton}
                                    disabled={Controller.IsCategorySaving}
                                    onClick={() => void Controller.DeleteCategory(Category)}
                                    aria-label={`${Category} 카테고리 삭제`}
                                >×</button>
                            ) : null}
                        </div>
                    ))}
                    {Controller.IsAuthenticated ? (
                        Controller.IsCategoryEditorOpen ? (
                            <form
                                className={Styles.CategoryAddForm}
                                onSubmit={(Event) => {
                                    Event.preventDefault();
                                    void Controller.CreateCategory();
                                }}
                            >
                                <input
                                    type="text"
                                    value={Controller.NewCategoryName}
                                    maxLength={20}
                                    autoFocus
                                    placeholder="새 카테고리"
                                    disabled={Controller.IsCategorySaving}
                                    onChange={(Event) => Controller.SetNewCategoryName(Event.currentTarget.value)}
                                />
                                <button type="submit" disabled={Controller.IsCategorySaving}>추가</button>
                                <button
                                    type="button"
                                    disabled={Controller.IsCategorySaving}
                                    onClick={() => Controller.SetIsCategoryEditorOpen(false)}
                                >×</button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                className={Styles.CategoryAddButton}
                                onClick={() => Controller.SetIsCategoryEditorOpen(true)}
                                aria-label="글 카테고리 추가"
                            >+</button>
                        )
                    ) : null}
                </nav>
                <div className={Styles.ArchiveRightTools}>
                    <label className={Styles.ArchiveSearch}>
                        <SearchIcon />
                        <input
                            type="search"
                            value={Controller.SearchQuery}
                            onChange={(Event) => Controller.SetSearchQuery(Event.currentTarget.value)}
                            placeholder="제목이나 내용 검색"
                        />
                    </label>
                    {Controller.IsAuthenticated ? (
                        <button
                            type="button"
                            className={Styles.NewPostButton}
                            onClick={() => Controller.OpenPostEditor()}
                        >글쓰기</button>
                    ) : null}
                </div>
            </div>
            {Controller.CategoryNotice ? (
                <p className={Styles.CategoryNotice} role="status">
                    {Controller.CategoryNotice}
                </p>
            ) : null}
            {Controller.ArticleOrderNotice ? (
                <p className={Styles.CategoryNotice} role="status">
                    {Controller.ArticleOrderNotice}
                </p>
            ) : null}
            <div
                className={Styles.BookShelf}
                onMouseLeave={() => Controller.SetPreviewArticleId(null)}
            >
                {Controller.VisibleArticles.length > 0 ? (
                    Controller.VisibleArticles.map((Article) => {
                        const IsActive = Controller.PreviewArticleId === Article.Id;

                        return (
                            <article
                                className={Styles.BookCard}
                                key={Article.Id}
                                data-article-id={Article.Id}
                                data-active={IsActive}
                                data-dragging={Controller.DraggedArticleId === Article.Id}
                                draggable={
                                    Controller.IsAuthenticated
                                    && Controller.IsArticleOrderSaving === false
                                }
                                onDragStart={() => Controller.StartArticleDrag(Article.Id)}
                                onDragEnter={() => Controller.MoveArticleDrag(Article.Id)}
                                onDragOver={(Event) => Event.preventDefault()}
                                onDragEnd={() => void Controller.EndArticleDrag()}
                                onMouseEnter={() => {
                                    if(Controller.DraggedArticleId === null)
                                    {
                                        Controller.SetPreviewArticleId(Article.Id);
                                    }
                                }}
                                onFocus={() => Controller.SetPreviewArticleId(Article.Id)}
                                style={{
                                    '--book-random-edge': CreatePaperEdge(Article.Id),
                                    backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 2%), rgb(0 0 0 / 34%)), url(${Article.Image})`,
                                } as CSSProperties}
                            >
                                <button
                                    type="button"
                                    className={Styles.BookOpenButton}
                                    onClick={() => Controller.OpenArticle(Article.Id)}
                                    aria-label={`${Article.Title} 읽기`}
                                />
                                <span className={Styles.BookCategory}>{Article.Category}</span>
                                <div className={Styles.BookDetails}>
                                    <h2>{Article.Title}</h2>
                                    <p>{Article.Summary}</p>
                                    <span>{Article.Date} <i /> {Article.ReadTime}</span>
                                </div>
                                {Controller.IsAuthenticated ? (
                                    <button
                                        type="button"
                                        className={Styles.BookEditButton}
                                        onClick={() => Controller.OpenPostEditor(Article)}
                                    >편집</button>
                                ) : null}
                            </article>
                        );
                    })
                ) : (
                    <p className={Styles.EmptyArchive}>검색 결과가 없습니다.</p>
                )}
            </div>
            <nav className={Styles.ArchivePagination} aria-label="글 목록 페이지">
                {Array.from({ length: Controller.ArchivePages }, (_, Index) => Index + 1).map((Page) => (
                    <button
                        type="button"
                        key={Page}
                        data-active={Controller.ArchivePage === Page}
                        onClick={() => Controller.SetArchivePage(Page)}
                    >
                        {Page}
                    </button>
                ))}
            </nav>
        </section>
    );
}
