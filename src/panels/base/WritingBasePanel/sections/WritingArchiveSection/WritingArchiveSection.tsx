'use client';

import {
    forwardRef,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type DragEvent as ReactDragEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { NoticeToast } from '@/components/NoticeToast/NoticeToast';
import { FormatArchiveIndex } from '@/core/date/ArchiveYearRange';
import type { useWritingBasePanelController } from '../../controller/WritingBasePanelController';
import {
    GetWritingPageTransitionDirection,
    IsWritingContentsPageVisible,
    type WritingPageDirection,
} from '../../controller/WritingBasePanelState';
import type {
    WritingArticle,
    WritingPage,
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

interface WritingFlipPageProps
{
    Children: ReactNode;
}

interface WritingFlipBookApi
{
    flip: (
        PageIndex: number,
        Corner?: 'top' | 'bottom',
    ) => void;
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (PageIndex: number) => void;
}

interface WritingFlipBookHandle
{
    pageFlip: () => WritingFlipBookApi | undefined;
}

interface WritingFlipEvent
{
    data: number;
}

interface WritingFlipStateEvent
{
    data: 'user_fold' | 'fold_corner' | 'flipping' | 'read';
}

interface WritingSpatialPointer
{
    PointerId: number;
    StartTime: number;
    StartX: number;
    StartY: number;
}

interface WritingSpatialTransition
{
    Direction: WritingPageDirection;
    FromPage: number;
    Id: number;
    OffsetX: number;
    OffsetY: number;
    Phase: 'dragging' | 'ready' | 'settling';
    Progress: number;
    TargetPage: number;
}

const WritingSpatialTransitionDuration = 620;

const WritingFlipPage = forwardRef<HTMLDivElement, WritingFlipPageProps>(
    function WritingFlipPageComponent(Props, Reference)
    {
        return (
            <div ref={Reference} className={Styles.WritingFlipPage}>
                {Props.Children}
            </div>
        );
    },
);

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

function ReaderPage({
    Page,
    PageNumber,
    PageNumberColor,
    PageNumberOpacity,
    SearchQuery,
}: {
    Page: WritingPage;
    PageNumber: number;
    PageNumberColor: string;
    PageNumberOpacity: number;
    SearchQuery: string;
})
{
    return (
        <article
            className={Styles.ReaderPage}
            data-reader-page-index={PageNumber - 1}
        >
            <span
                className={Styles.ReaderPageNumber}
                style={{
                    color: PageNumberColor,
                    opacity: PageNumberOpacity,
                }}
            >
                {PageNumber}
            </span>
            <div className={Styles.ReaderPageContent}>
                <h2>{HighlightText(Page.Heading, SearchQuery)}</h2>
                {Page.Paragraphs.map((Paragraph) => (
                    <p key={Paragraph}>
                        {HighlightText(Paragraph, SearchQuery)}
                    </p>
                ))}
            </div>
        </article>
    );
}

function ContentsDrawer({
    Article,
    CurrentPage,
    IsBookView,
    IsOpen,
    OnClose,
    OnSelectPage,
}: {
    Article: WritingArticle;
    CurrentPage: number;
    IsBookView: boolean;
    IsOpen: boolean;
    OnClose: () => void;
    OnSelectPage: (Page: number) => void;
})
{
    return (
        <aside
            className={Styles.ContentsDrawer}
            data-open={IsOpen}
            aria-hidden={IsOpen === false}
            inert={IsOpen === false}
        >
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
                            className={
                                IsWritingContentsPageVisible(
                                    Index,
                                    CurrentPage,
                                    IsBookView,
                                )
                                    ? Styles.ContentsPageActive
                                    : ''
                            }
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

function ReaderSettings({
    Controller,
    IsOpen,
}: WritingArchiveSectionProps & { IsOpen: boolean })
{
    return (
        <aside
            className={Styles.ReaderSettings}
            data-open={IsOpen}
            aria-hidden={IsOpen === false}
            inert={IsOpen === false}
        >
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
                <button type="button" onClick={Controller.SaveReaderSettings}>
                    설정 저장
                </button>
                <button type="button" onClick={Controller.ResetSettings}>
                    설정 초기화
                </button>
            </footer>
            <NoticeToast Message={Controller.ReaderSettingsNotice} />
        </aside>
    );
}

export function WritingReader({ Controller }: WritingArchiveSectionProps)
{
    const Article = Controller.ReaderArticle;
    const ReaderReference = useRef<HTMLElement>(null);
    const WritingFlipBookReference =
        useRef<WritingFlipBookHandle | null>(null);
    const PreviousReaderPageReference = useRef(Controller.ReaderPage);
    const SpatialPointerReference =
        useRef<WritingSpatialPointer | null>(null);
    const SpatialTransitionTimerReference = useRef<number | null>(null);
    const SpatialTransitionFrameReferences = useRef<number[]>([]);
    const [SpatialTransition, SetSpatialTransition] =
        useState<WritingSpatialTransition | null>(null);
    const [IsBookLayoutReady, SetIsBookLayoutReady] = useState(false);
    const [IsFlipAnimating, SetIsFlipAnimating] = useState(false);

    useEffect(() =>
    {
        const Frame = window.requestAnimationFrame(() =>
            SetIsBookLayoutReady(true),
        );

        return () => window.cancelAnimationFrame(Frame);
    }, []);

    useEffect(() => () =>
    {
        if(SpatialTransitionTimerReference.current !== null)
        {
            window.clearTimeout(
                SpatialTransitionTimerReference.current,
            );
        }

        SpatialTransitionFrameReferences.current.forEach(
            (Frame) => window.cancelAnimationFrame(Frame),
        );
    }, []);

    useEffect(() =>
    {
        const PreviousPage = PreviousReaderPageReference.current;

        if(PreviousPage === Controller.ReaderPage)
        {
            return;
        }

        if(Controller.ViewMode !== 'scroll')
        {
            WritingFlipBookReference.current
                ?.pageFlip()
                ?.turnToPage(Controller.ReaderPage);
        }

        PreviousReaderPageReference.current = Controller.ReaderPage;
    }, [Article, Controller.ReaderPage, Controller.ViewMode]);

    if(Article === null)
    {
        return null;
    }

    const ForwardDirection = GetWritingPageTransitionDirection(
        Controller.ReaderPage,
        Controller.ReaderPage + 1,
        Article.Pages.map((Page) => Page.ForwardDirection),
    );
    const BackDirection = Controller.ReaderPage === 0
        ? null
        : GetWritingPageTransitionDirection(
            Controller.ReaderPage,
            Controller.ReaderPage - 1,
            Article.Pages.map((Page) => Page.ForwardDirection),
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

    function CompleteSpatialTransition(
        Transition: WritingSpatialTransition,
    )
    {
        PreviousReaderPageReference.current = Transition.TargetPage;
        Controller.SetReaderPage(Transition.TargetPage);
        SetSpatialTransition(null);
        SpatialPointerReference.current = null;
        SpatialTransitionTimerReference.current = null;
    }

    function FinishSpatialTransition(
        Transition: WritingSpatialTransition,
    )
    {
        const SettlingTransition: WritingSpatialTransition = {
            ...Transition,
            Phase: 'settling',
            Progress: 1,
        };
        SetSpatialTransition(SettlingTransition);

        if(SpatialTransitionTimerReference.current !== null)
        {
            window.clearTimeout(
                SpatialTransitionTimerReference.current,
            );
        }

        SpatialTransitionTimerReference.current = window.setTimeout(
            () => CompleteSpatialTransition(SettlingTransition),
            WritingSpatialTransitionDuration,
        );
    }

    function CancelSpatialTransition(
        Transition: WritingSpatialTransition,
    )
    {
        SetSpatialTransition({
            ...Transition,
            OffsetX: 0,
            OffsetY: 0,
            Phase: 'settling',
            Progress: 0,
        });
        SpatialTransitionTimerReference.current = window.setTimeout(() =>
        {
            SetSpatialTransition(null);
            SpatialTransitionTimerReference.current = null;
        }, WritingSpatialTransitionDuration);
    }

    function StartSpatialTransition(TargetPage: number)
    {
        const FromPage = Controller.ReaderPage;

        if(
            SpatialTransition !== null
            || TargetPage === FromPage
            || TargetPage < 0
            || TargetPage > Controller.MaximumReaderPage
        )
        {
            return;
        }

        const Transition: WritingSpatialTransition = {
            Direction: GetWritingPageTransitionDirection(
                FromPage,
                TargetPage,
                Controller.ReaderArticle?.Pages.map(
                    (Page) => Page.ForwardDirection,
                ) ?? [],
            ),
            FromPage,
            Id: Date.now(),
            OffsetX: 0,
            OffsetY: 0,
            Phase: 'ready',
            Progress: 0,
            TargetPage,
        };
        SetSpatialTransition(Transition);
        const FirstFrame = window.requestAnimationFrame(() =>
        {
            const SecondFrame = window.requestAnimationFrame(() =>
                FinishSpatialTransition(Transition),
            );
            SpatialTransitionFrameReferences.current.push(SecondFrame);
        });
        SpatialTransitionFrameReferences.current.push(FirstFrame);
    }

    function FindSpatialDragTarget(
        DeltaX: number,
        DeltaY: number,
    ): Pick<WritingSpatialTransition, 'Direction' | 'TargetPage'> | null
    {
        const DragDirection: WritingPageDirection =
            Math.abs(DeltaX) >= Math.abs(DeltaY)
                ? DeltaX < 0 ? 'right' : 'left'
                : DeltaY < 0 ? 'down' : 'up';

        if(
            Controller.ReaderPage < Controller.MaximumReaderPage
            && ForwardDirection === DragDirection
        )
        {
            return {
                Direction: DragDirection,
                TargetPage: Controller.ReaderPage + 1,
            };
        }

        if(BackDirection === DragDirection)
        {
            return {
                Direction: DragDirection,
                TargetPage: Controller.ReaderPage - 1,
            };
        }

        return null;
    }

    function HandleSpatialPointerDown(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        if(
            Controller.ViewMode !== 'scroll'
            || SpatialTransition !== null
            || Event.button !== 0
            || (
                Event.target instanceof Element
                && Event.target.closest('button, a') !== null
            )
        )
        {
            return;
        }

        SpatialPointerReference.current = {
            PointerId: Event.pointerId,
            StartTime: performance.now(),
            StartX: Event.clientX,
            StartY: Event.clientY,
        };
        Event.currentTarget.setPointerCapture(Event.pointerId);
    }

    function HandleSpatialPointerMove(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        const Pointer = SpatialPointerReference.current;

        if(
            Pointer === null
            || Pointer.PointerId !== Event.pointerId
        )
        {
            return;
        }

        const DeltaX = Event.clientX - Pointer.StartX;
        const DeltaY = Event.clientY - Pointer.StartY;

        if(
            SpatialTransition === null
            && Math.hypot(DeltaX, DeltaY) < 8
        )
        {
            return;
        }

        const Target = SpatialTransition
            ?? FindSpatialDragTarget(DeltaX, DeltaY);

        if(Target === null)
        {
            return;
        }

        Event.preventDefault();
        const MaximumX = Event.currentTarget.clientWidth * .96;
        const MaximumY = Event.currentTarget.clientHeight * .96;
        const OffsetX =
            Target.Direction === 'right'
                ? Math.max(-MaximumX, Math.min(0, DeltaX))
                : Target.Direction === 'left'
                    ? Math.min(MaximumX, Math.max(0, DeltaX))
                    : 0;
        const OffsetY =
            Target.Direction === 'down'
                ? Math.max(-MaximumY, Math.min(0, DeltaY))
                : Target.Direction === 'up'
                    ? Math.min(MaximumY, Math.max(0, DeltaY))
                    : 0;
        SetSpatialTransition({
            Direction: Target.Direction,
            FromPage: Controller.ReaderPage,
            Id: SpatialTransition?.Id ?? Date.now(),
            OffsetX,
            OffsetY,
            Phase: 'dragging',
            Progress: Math.min(
                1,
                Math.hypot(
                    OffsetX / Event.currentTarget.clientWidth,
                    OffsetY / Event.currentTarget.clientHeight,
                ),
            ),
            TargetPage: Target.TargetPage,
        });
    }

    function HandleSpatialPointerEnd(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        const Pointer = SpatialPointerReference.current;
        const Transition = SpatialTransition;

        if(
            Pointer === null
            || Pointer.PointerId !== Event.pointerId
        )
        {
            return;
        }

        SpatialPointerReference.current = null;

        if(Event.currentTarget.hasPointerCapture(Event.pointerId))
        {
            Event.currentTarget.releasePointerCapture(Event.pointerId);
        }

        if(Transition === null || Transition.Phase !== 'dragging')
        {
            SetSpatialTransition(null);
            return;
        }

        const IsHorizontal =
            Transition.Direction === 'left'
            || Transition.Direction === 'right';
        const Distance = Math.abs(
            IsHorizontal ? Transition.OffsetX : Transition.OffsetY,
        );
        const FrameSize = IsHorizontal
            ? Event.currentTarget.clientWidth
            : Event.currentTarget.clientHeight;
        const Elapsed = Math.max(
            performance.now() - Pointer.StartTime,
            1,
        );

        if(
            Distance >= FrameSize * .16
            || (Distance >= 24 && Distance / Elapsed >= .5)
        )
        {
            FinishSpatialTransition(Transition);
            return;
        }

        CancelSpatialTransition(Transition);
    }

    function ChangeReaderPage(Page: number)
    {
        if(Controller.ViewMode === 'scroll')
        {
            StartSpatialTransition(Page);
            return;
        }

        WritingFlipBookReference.current
            ?.pageFlip()
            ?.flip(Page, 'bottom');
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

        if(Target.closest(`.${Styles.InteractionGuard}`) !== null)
        {
            return;
        }

        if(Controller.IsContentsOpen
            && Target.closest(`.${Styles.ContentsDrawer}`) === null
            && Target.closest('[data-reader-contents-trigger]') === null)
        {
            Controller.SetIsContentsOpen(false);
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
                <div className={Styles.ReaderActions}>
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
                </div>
            </div>
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
                                ChangeReaderPage(Page);
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
                                ChangeReaderPage(Page);
                            }
                        }}
                        aria-label="이전 검색 결과"
                    >↑</button>
                    <button
                        type="button"
                        disabled={Controller.ReaderSearchMatches.length === 0}
                        onClick={() => {
                            const Page = Controller.MoveReaderSearchMatch(1);
                            if(typeof Page === 'number') ChangeReaderPage(Page);
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
                className={Styles.ReaderCanvas}
                data-dragging={
                    SpatialTransition?.Phase === 'dragging'
                }
                onDragStart={(Event) => Event.preventDefault()}
                onPointerDown={HandleSpatialPointerDown}
                onPointerMove={HandleSpatialPointerMove}
                onPointerUp={HandleSpatialPointerEnd}
                onPointerCancel={HandleSpatialPointerEnd}
            >
                {Controller.ViewMode !== 'scroll' && IsBookLayoutReady ? (
                    <div className={Styles.WritingBookStage}>
                        <HTMLFlipBook
                            ref={WritingFlipBookReference}
                            className={Styles.WritingFlipBook}
                            style={{}}
                            width={500}
                            height={640}
                            size="stretch"
                            minWidth={260}
                            maxWidth={505}
                            minHeight={340}
                            maxHeight={645}
                            startPage={Controller.ReaderPage}
                            drawShadow
                            flippingTime={900}
                            usePortrait
                            startZIndex={10}
                            autoSize
                            maxShadowOpacity={0.22}
                            showCover={false}
                            mobileScrollSupport={false}
                            clickEventForward
                            useMouseEvents
                            swipeDistance={24}
                            showPageCorners={false}
                            disableFlipByClick={false}
                            renderOnlyPageLengthChange
                            onFlip={(Event: WritingFlipEvent) =>
                            {
                                PreviousReaderPageReference.current =
                                    Event.data;
                                Controller.SetReaderPage(Event.data);
                            }}
                            onChangeState={(Event: WritingFlipStateEvent) =>
                                SetIsFlipAnimating(
                                    Event.data === 'flipping',
                                )
                            }
                        >
                            {Article.Pages.map((Page, Index) => (
                                <WritingFlipPage
                                    key={`${Article.Id}-${Page.Heading}`}
                                    Children={
                                        <ReaderPage
                                            Page={Page}
                                            PageNumber={Index}
                                            PageNumberColor={Article.PageNumberColor ?? '#222222'}
                                            PageNumberOpacity={Article.PageNumberOpacity ?? .58}
                                            SearchQuery={Controller.ReaderSearchQuery}
                                        />
                                    }
                                />
                            ))}
                        </HTMLFlipBook>
                    </div>
                ) : (
                    SpatialTransition !== null
                    && Controller.ViewMode === 'scroll' ? (
                        <div
                            key={SpatialTransition.Id}
                            className={Styles.SpatialTransitionStage}
                            data-completing={
                                SpatialTransition.Progress === 1
                            }
                            data-direction={SpatialTransition.Direction}
                            data-phase={SpatialTransition.Phase}
                        >
                            <div
                                className={Styles.SpatialTransitionSlide}
                                style={{
                                    opacity:
                                        1 - SpatialTransition.Progress,
                                }}
                            >
                                <div className={Styles.PageSpread}>
                                    <ReaderPage
                                        Page={Article.Pages[
                                            SpatialTransition.FromPage
                                        ]}
                                        PageNumber={SpatialTransition.FromPage}
                                        PageNumberColor={Article.PageNumberColor ?? '#222222'}
                                        PageNumberOpacity={Article.PageNumberOpacity ?? .58}
                                        SearchQuery={Controller.ReaderSearchQuery}
                                    />
                                </div>
                            </div>
                            <div
                                className={Styles.SpatialTransitionSlide}
                                style={{
                                    opacity: SpatialTransition.Progress,
                                }}
                            >
                                <div className={Styles.PageSpread}>
                                    <ReaderPage
                                        Page={Article.Pages[
                                            SpatialTransition.TargetPage
                                        ]}
                                        PageNumber={SpatialTransition.TargetPage}
                                        PageNumberColor={Article.PageNumberColor ?? '#222222'}
                                        PageNumberOpacity={Article.PageNumberOpacity ?? .58}
                                        SearchQuery={Controller.ReaderSearchQuery}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={Styles.PageSpread}>
                            <ReaderPage
                                Page={Article.Pages[Controller.ReaderPage]}
                                PageNumber={Controller.ReaderPage}
                                PageNumberColor={Article.PageNumberColor ?? '#222222'}
                                PageNumberOpacity={Article.PageNumberOpacity ?? .58}
                                SearchQuery={Controller.ReaderSearchQuery}
                            />
                        </div>
                    )
                )}
                {Controller.ViewMode === 'scroll' && BackDirection !== null ? (
                    <button
                        type="button"
                        className={Styles.PageArrow}
                        data-direction={BackDirection}
                        onClick={() => StartSpatialTransition(
                            Controller.ReaderPage - 1,
                        )}
                        aria-label="이전 페이지"
                    />
                ) : null}
                {Controller.ViewMode === 'scroll'
                    && Controller.ReaderPage < Controller.MaximumReaderPage ? (
                        <button
                            type="button"
                            className={Styles.PageArrow}
                            data-direction={ForwardDirection}
                            onClick={() => StartSpatialTransition(
                                Controller.ReaderPage + 1,
                            )}
                            aria-label="다음 페이지"
                        />
                    ) : null}
            </div>
            <footer className={Styles.ReaderProgress}>
                {Controller.ReaderPage} / {Article.Pages.length}
            </footer>
            <ContentsDrawer
                Article={Article}
                CurrentPage={Controller.ReaderPage}
                IsBookView={Controller.ViewMode !== 'scroll'}
                IsOpen={Controller.IsContentsOpen}
                OnClose={() => Controller.SetIsContentsOpen(false)}
                OnSelectPage={ChangeReaderPage}
            />
            <ReaderSettings
                Controller={Controller}
                IsOpen={Controller.IsSettingsOpen}
            />
            {IsFlipAnimating || (
                SpatialTransition?.Phase === 'settling'
                && SpatialTransition.Progress === 1
            ) ? (
                <span
                    className={Styles.InteractionGuard}
                    aria-hidden="true"
                />
            ) : null}
        </section>
    );
}

export function WritingArchiveSection({ Controller }: WritingArchiveSectionProps)
{
    const [EditingCategory, SetEditingCategory] =
        useState<string | null>(null);
    const [CategoryDraft, SetCategoryDraft] = useState('');
    const BookShelfReference = useRef<HTMLDivElement>(null);
    const ArticleDragPreviewReference = useRef<HTMLDivElement>(null);
    const ArticleDragPointReference = useRef({ X: 0, Y: 0 });
    const NativeDragImageReference = useRef<HTMLSpanElement>(null);
    const ShelfWheelFrameReference = useRef<number | null>(null);
    const ShelfWheelTargetReference = useRef(0);
    const ShelfDragReference = useRef<{
        PointerId: number;
        StartX: number;
        StartScrollLeft: number;
    } | null>(null);
    const SuppressBookClickReference = useRef(false);

    useEffect(() =>
    {
        const Shelf = BookShelfReference.current;

        if(Shelf === null)
        {
            return;
        }

        const HandleWheel = (Event: WheelEvent) =>
        {
            const Delta = Math.abs(Event.deltaY) >= Math.abs(Event.deltaX)
                ? Event.deltaY
                : Event.deltaX;
            const MaximumScroll = Shelf.scrollWidth - Shelf.clientWidth;

            Event.preventDefault();

            if(MaximumScroll <= 0)
            {
                return;
            }

            ShelfWheelTargetReference.current = Math.max(
                0,
                Math.min(
                    MaximumScroll,
                    ShelfWheelFrameReference.current === null
                        ? Shelf.scrollLeft + Delta
                        : ShelfWheelTargetReference.current + Delta,
                ),
            );

            if(ShelfWheelFrameReference.current !== null)
            {
                return;
            }

            Shelf.dataset.wheelScrolling = 'true';
            const MoveShelf = () =>
            {
                const Distance =
                    ShelfWheelTargetReference.current - Shelf.scrollLeft;

                if(Math.abs(Distance) < .5)
                {
                    Shelf.scrollLeft = ShelfWheelTargetReference.current;
                    ShelfWheelFrameReference.current = null;
                    delete Shelf.dataset.wheelScrolling;
                    return;
                }

                Shelf.scrollLeft += Distance * .18;
                ShelfWheelFrameReference.current =
                    window.requestAnimationFrame(MoveShelf);
            };

            ShelfWheelFrameReference.current =
                window.requestAnimationFrame(MoveShelf);
        };

        Shelf.addEventListener('wheel', HandleWheel, { passive: false });
        return () =>
        {
            Shelf.removeEventListener('wheel', HandleWheel);
            if(ShelfWheelFrameReference.current !== null)
            {
                window.cancelAnimationFrame(ShelfWheelFrameReference.current);
            }
        };
    }, []);

    useEffect(() =>
    {
        BookShelfReference.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, [Controller.ActiveCategory]);

    function PositionArticleDragPreview(X: number, Y: number)
    {
        const Preview = ArticleDragPreviewReference.current;

        if(Preview === null || (X === 0 && Y === 0))
        {
            return;
        }

        ArticleDragPointReference.current = { X, Y };
        Preview.style.transform =
            `translate3d(${X}px, ${Y}px, 0) translate(-50%, -50%) rotate(1.2deg)`;
    }

    function StartArticleDragPreview(
        Event: ReactDragEvent<HTMLElement>,
        ArticleId: string,
    )
    {
        ArticleDragPointReference.current = {
            X: Event.clientX,
            Y: Event.clientY,
        };
        Event.dataTransfer.effectAllowed = 'move';

        if(NativeDragImageReference.current !== null)
        {
            Event.dataTransfer.setDragImage(
                NativeDragImageReference.current,
                0,
                0,
            );
        }

        Controller.StartArticleDrag(ArticleId);
        window.requestAnimationFrame(() => PositionArticleDragPreview(
            ArticleDragPointReference.current.X,
            ArticleDragPointReference.current.Y,
        ));
    }

    function StartShelfDrag(Event: ReactPointerEvent<HTMLDivElement>)
    {
        if(Controller.IsAuthenticated || Event.button !== 0)
        {
            return;
        }

        ShelfDragReference.current = {
            PointerId: Event.pointerId,
            StartX: Event.clientX,
            StartScrollLeft: Event.currentTarget.scrollLeft,
        };
        SuppressBookClickReference.current = false;
    }

    function MoveShelfDrag(Event: ReactPointerEvent<HTMLDivElement>)
    {
        const Drag = ShelfDragReference.current;

        if(Drag === null || Drag.PointerId !== Event.pointerId)
        {
            return;
        }

        const Distance = Event.clientX - Drag.StartX;

        if(Math.abs(Distance) >= 4)
        {
            SuppressBookClickReference.current = true;
            Event.currentTarget.dataset.panning = 'true';

            if(Event.currentTarget.hasPointerCapture(Event.pointerId) === false)
            {
                Event.currentTarget.setPointerCapture(Event.pointerId);
            }
        }

        Event.currentTarget.scrollLeft = Drag.StartScrollLeft - Distance;
    }

    function EndShelfDrag(Event: ReactPointerEvent<HTMLDivElement>)
    {
        if(ShelfDragReference.current?.PointerId !== Event.pointerId)
        {
            return;
        }

        ShelfDragReference.current = null;
        delete Event.currentTarget.dataset.panning;
        if(Event.currentTarget.hasPointerCapture(Event.pointerId))
        {
            Event.currentTarget.releasePointerCapture(Event.pointerId);
        }
        window.setTimeout(() =>
        {
            SuppressBookClickReference.current = false;
        });
    }

    async function CommitCategoryRename(Category: string)
    {
        if(await Controller.RenameCategory(Category, CategoryDraft))
        {
            SetEditingCategory(null);
        }
    }

    const HeadingStyle: CSSProperties = {
        color: Controller.WritingPageHeading.Color ?? 'var(--writing-ink)',
        fontFamily: Controller.WritingPageHeading.Font,
        fontSize: `${Controller.WritingPageHeading.Size}px`,
    };
    const DescriptionStyle: CSSProperties = {
        color:
            Controller.WritingPageDescription.Color
            ?? 'var(--writing-muted)',
        fontFamily: Controller.WritingPageDescription.Font,
        fontSize: `${Controller.WritingPageDescription.Size}px`,
    };
    const DraggedArticle = Controller.VisibleArticles.find(
        (Article) => Article.Id === Controller.DraggedArticleId,
    );

    return (
        <section className={Styles.Archive} data-ue-component="WritingArchiveSection">
            <div className={Styles.Heading}>
                <p>{FormatArchiveIndex(Controller.ArchiveDates)}</p>
                <h1 style={HeadingStyle}>
                    {Controller.WritingPageHeading.Text}
                </h1>
                <span style={DescriptionStyle}>
                    {Controller.WritingPageDescription.Text}
                </span>
            </div>
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
            <NoticeToast
                Message={
                    Controller.ArticleOrderNotice
                    || Controller.CategoryNotice
                }
            />
            <div
                className={Styles.BookShelf}
                ref={BookShelfReference}
                data-pan-enabled={!Controller.IsAuthenticated}
                data-reordering={Controller.DraggedArticleId !== null}
                onPointerDown={StartShelfDrag}
                onPointerMove={MoveShelfDrag}
                onPointerUp={EndShelfDrag}
                onPointerCancel={EndShelfDrag}
                onClickCapture={(Event) =>
                {
                    if(SuppressBookClickReference.current)
                    {
                        Event.preventDefault();
                        Event.stopPropagation();
                    }
                }}
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
                                data-custom-thumbnail={
                                    Article.TextLayers !== undefined
                                }
                                data-dragging={Controller.DraggedArticleId === Article.Id}
                                draggable={
                                    Controller.IsAuthenticated
                                    && Controller.IsArticleOrderSaving === false
                                }
                                onDragStart={(Event) =>
                                    StartArticleDragPreview(Event, Article.Id)}
                                onDrag={(Event) => PositionArticleDragPreview(
                                    Event.clientX,
                                    Event.clientY,
                                )}
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
                                    viewTransitionName:
                                        Controller.DraggedArticleId === null
                                            ? undefined
                                            : `writing-book-${Article.Id}`,
                                    backgroundImage:
                                        Article.TextLayers === undefined
                                            ? `linear-gradient(180deg, rgb(0 0 0 / 2%), rgb(0 0 0 / 34%)), url(${Article.Image})`
                                            : `url(${Article.Image})`,
                                } as CSSProperties}
                            >
                                <button
                                    type="button"
                                    className={Styles.BookOpenButton}
                                    onClick={() => Controller.OpenArticle(Article.Id)}
                                    aria-label={`${Article.Title} 읽기`}
                                />
                                <span className={Styles.BookCategory}>{Article.Category}</span>
                                {Article.TextLayers?.map((Layer) => (
                                    <span
                                        key={Layer.Id}
                                        className={Styles.BookTextLayer}
                                        style={{
                                            color: Layer.Color,
                                            fontFamily: Layer.FontFamily,
                                            fontSize: `${Layer.FontSize}px`,
                                            fontWeight: Layer.FontWeight,
                                            left: `${Layer.X}%`,
                                            top: `${Layer.Y}%`,
                                        }}
                                    >
                                        {Layer.Text}
                                    </span>
                                ))}
                                <div className={Styles.BookDetails}>
                                    {(Article.TextLayers?.length ?? 0) === 0 ? (
                                        <>
                                            <h2>{Article.Title}</h2>
                                            <p>{Article.Summary}</p>
                                        </>
                                    ) : null}
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
            <span
                ref={NativeDragImageReference}
                className={Styles.NativeDragImage}
                aria-hidden="true"
            />
            {DraggedArticle !== undefined ? (
                <div
                    ref={ArticleDragPreviewReference}
                    className={Styles.ArticleDragPreview}
                    style={{
                        backgroundImage:
                            DraggedArticle.TextLayers === undefined
                                ? `linear-gradient(180deg, rgb(0 0 0 / 2%), rgb(0 0 0 / 34%)), url(${DraggedArticle.Image})`
                                : `url(${DraggedArticle.Image})`,
                    }}
                    aria-hidden="true"
                >
                    {DraggedArticle.TextLayers?.map((Layer) => (
                        <span
                            key={Layer.Id}
                            className={Styles.BookTextLayer}
                            style={{
                                color: Layer.Color,
                                fontFamily: Layer.FontFamily,
                                fontSize: `${Layer.FontSize}px`,
                                fontWeight: Layer.FontWeight,
                                left: `${Layer.X}%`,
                                top: `${Layer.Y}%`,
                            }}
                        >
                            {Layer.Text}
                        </span>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
