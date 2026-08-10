'use client';

import Image from 'next/image';
import {
    forwardRef,
    useEffect,
    useRef,
    useState,
} from 'react';
import type {
    MouseEvent as ReactMouseEvent,
    PointerEvent as ReactPointerEvent,
    ReactNode,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ArchiveStrings } from '@/core/localization/ArchiveStrings';
import { FormatArchiveIndex } from '@/core/date/ArchiveYearRange';
import type {
    MemoPage,
} from '@/panels/base/MemoBasePanel/controller/MemoBasePanelTypes';
import Styles from '@/panels/base/MemoBasePanel/MemoBasePanel.module.css';

interface MemoBookSectionProps
{
    ActivePage: MemoPage;
    ActivePageIndex: number;
    CurrentListPage: number;
    Pages: MemoPage[];
    TotalListPages: number;
    OnAddPage: () => void;
    OnChangeContent: (Content: string) => void;
    OnChangeListPage: (Page: number) => void;
    OnChangeTitle: (Title: string) => void;
    OnSelectPage: (PageIndex: number) => void;
}

interface FlipPageProps
{
    Children: ReactNode;
    ClassName: string;
    Density?: 'hard' | 'soft';
    OnClick?: (Event: ReactMouseEvent<HTMLDivElement>) => void;
}

interface PageFlipApi
{
    flip: (PageIndex: number, Corner?: 'top' | 'bottom') => void;
    flipNext: (Corner?: 'top' | 'bottom') => void;
    getCurrentPageIndex: () => number;
    turnToPage: (PageIndex: number) => void;
}

interface FlipBookHandle
{
    pageFlip: () => PageFlipApi | undefined;
}

interface PageFlipEvent
{
    data: number;
    object: PageFlipApi;
}

interface PageFlipInitEvent
{
    object: PageFlipApi;
}

type PageFlipState = 'user_fold' | 'fold_corner' | 'flipping' | 'read';

interface PageFlipStateEvent
{
    data: PageFlipState;
}

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
    function FlipPageComponent(Props, Reference)
    {
        return (
            <div
                ref={Reference}
                className={Props.ClassName}
                data-density={Props.Density ?? 'soft'}
                onClick={Props.OnClick}
            >
                {Props.Children}
            </div>
        );
    },
);

function StopPageGesture(Event: ReactPointerEvent)
{
    Event.stopPropagation();
}

function StopMousePageGesture(Event: ReactMouseEvent)
{
    Event.stopPropagation();
}

function MemoAttachment({ Page }: { Page: MemoPage })
{
    if(Page.AttachmentPath === undefined)
    {
        return null;
    }

    return (
        <figure className={Styles.Attachment}>
            <Image
                src={Page.AttachmentPath}
                alt={Page.AttachmentAlt ?? ''}
                fill
                sizes="(max-width: 760px) 42vw, 360px"
                unoptimized={Page.AttachmentPath.endsWith('.gif')}
            />
        </figure>
    );
}

export function MemoBookSection(Props: MemoBookSectionProps)
{
    const PagesPerListPage = 8;
    const FlipBookReference = useRef<FlipBookHandle | null>(null);
    const RequestedMemoIndexReference = useRef<number | null>(null);
    const CoverSettleTimerReference = useRef<number | null>(null);
    const [InitializedPageCount, SetInitializedPageCount] = useState(
        Props.Pages.length,
    );
    const [CurrentFlipPage, SetCurrentFlipPage] = useState(0);
    const [IsFlipAnimating, SetIsFlipAnimating] = useState(false);
    const [IsCoverSettling, SetIsCoverSettling] = useState(false);
    const LastMemoFlipPage = Props.Pages.length + 1;
    const LastSpreadPage =
        LastMemoFlipPage % 2 === 0
            ? LastMemoFlipPage - 1
            : LastMemoFlipPage;
    const IsAddingPage = Props.Pages.length > InitializedPageCount;
    const AddedPageStart = LastMemoFlipPage;
    const EffectiveFlipPage = IsAddingPage
        ? AddedPageStart
        : CurrentFlipPage;
    const IsCoverClosed = EffectiveFlipPage === 0;
    const IsLastSpread = EffectiveFlipPage >= LastSpreadPage;

    useEffect(() =>
    {
        return () =>
        {
            if(CoverSettleTimerReference.current !== null)
            {
                window.clearTimeout(
                    CoverSettleTimerReference.current,
                );
            }
        };
    }, []);

    function SelectPage(PageIndex: number)
    {
        RequestedMemoIndexReference.current = PageIndex;
        Props.OnSelectPage(PageIndex);
        FlipBookReference.current
            ?.pageFlip()
            ?.flip(PageIndex + 2, 'bottom');
    }

    function ChangeListPage(Page: number)
    {
        const SafePage = Math.min(
            Math.max(Page, 1),
            Props.TotalListPages,
        );
        const FirstPageIndex =
            (SafePage - 1) * PagesPerListPage;

        RequestedMemoIndexReference.current = FirstPageIndex;
        Props.OnChangeListPage(SafePage);
        FlipBookReference.current
            ?.pageFlip()
            ?.flip(FirstPageIndex + 2, 'bottom');
    }

    function HandleFlip(Event: PageFlipEvent)
    {
        const PageNumber = Number(Event.data);

        if(PageNumber > LastSpreadPage)
        {
            Event.object.turnToPage(LastSpreadPage);
            return;
        }

        const RequestedMemoIndex =
            RequestedMemoIndexReference.current;
        const RequestedFlipPage =
            RequestedMemoIndex === null
                ? null
                : RequestedMemoIndex + 2;
        const RequestedSpreadPage =
            RequestedFlipPage === null
                ? null
                : RequestedFlipPage % 2 === 0
                    ? RequestedFlipPage - 1
                    : RequestedFlipPage;
        const MemoIndex =
            RequestedMemoIndex !== null &&
            RequestedSpreadPage === PageNumber
                ? RequestedMemoIndex
                : Math.min(
                    Math.max(PageNumber - 2, 0),
                    Props.Pages.length - 1,
                );

        RequestedMemoIndexReference.current = null;

        SetCurrentFlipPage(PageNumber);
        Props.OnSelectPage(MemoIndex);

        if(PageNumber === 0)
        {
            SetIsCoverSettling(true);

            if(CoverSettleTimerReference.current !== null)
            {
                window.clearTimeout(
                    CoverSettleTimerReference.current,
                );
            }

            CoverSettleTimerReference.current = window.setTimeout(
                () =>
                {
                    SetIsCoverSettling(false);
                    CoverSettleTimerReference.current = null;
                },
                180,
            );
        }
    }

    function HandleChangeState(Event: PageFlipStateEvent)
    {
        SetIsFlipAnimating(Event.data === 'flipping');
    }

    function HandleInit(Event: PageFlipInitEvent)
    {
        SetInitializedPageCount(Props.Pages.length);
        SetCurrentFlipPage(Event.object.getCurrentPageIndex());
    }

    function HandleStagePointerDown(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        if(!IsLastSpread)
        {
            return;
        }

        const Target = Event.target as HTMLElement;

        if(Target.closest('input, textarea, button, label') !== null)
        {
            return;
        }

        const BookElement = Event.currentTarget.querySelector<HTMLElement>(
            '.stf__parent',
        );

        if(BookElement === null)
        {
            return;
        }

        const BookBounds = BookElement.getBoundingClientRect();
        const IsRightPage =
            Event.clientX >= BookBounds.left + BookBounds.width / 2 &&
            Event.clientX <= BookBounds.right &&
            Event.clientY >= BookBounds.top &&
            Event.clientY <= BookBounds.bottom;

        if(IsRightPage)
        {
            Event.preventDefault();
            Event.stopPropagation();
        }
    }

    return (
        <section
            className={Styles.BookSection}
            data-ue-component="MemoBookSection"
            data-ue-root
        >
            <div className={Styles.Intro}>
                <p>
                    {FormatArchiveIndex(
                        Props.Pages.map((Page) => Page.Date),
                    )}
                </p>
                <h1>
                    {ArchiveStrings.Memo.Title.split('\n').map((Line) => (
                        <span key={Line}>{Line}</span>
                    ))}
                </h1>
                <p>{ArchiveStrings.Memo.Description}</p>
            </div>

            <div className={Styles.Workspace}>
                <aside className={Styles.PageRail}>
                    <div>
                        <span>Pages</span>
                        <button type="button" onClick={Props.OnAddPage}>
                            + 새 메모
                        </button>
                    </div>
                    <ol>
                        {Props.Pages.slice(
                            (Props.CurrentListPage - 1) *
                                PagesPerListPage,
                            Props.CurrentListPage * PagesPerListPage,
                        ).map((Page, Index) =>
                        {
                            const PageIndex =
                                (Props.CurrentListPage - 1) *
                                    PagesPerListPage +
                                Index;

                            return (
                                <li key={Page.Id}>
                                    <button
                                        type="button"
                                        className={
                                            PageIndex ===
                                            Props.ActivePageIndex
                                                ? Styles.PageActive
                                                : ''
                                        }
                                        onClick={() =>
                                            SelectPage(PageIndex)
                                        }
                                    >
                                        <span>
                                            {String(
                                                PageIndex + 1,
                                            ).padStart(2, '0')}
                                        </span>
                                        <strong>{Page.Title}</strong>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                    {Props.TotalListPages > 1 ? (
                        <nav
                            className={Styles.MemoPagination}
                            aria-label="짧은 글 목록 페이지"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    ChangeListPage(
                                        Props.CurrentListPage - 1,
                                    )
                                }
                                disabled={Props.CurrentListPage === 1}
                                aria-label="이전 페이지"
                            >
                                ←
                            </button>
                            {Array.from(
                                { length: Props.TotalListPages },
                                (_, Index) => Index + 1,
                            ).map((Page) => (
                                <button
                                    key={Page}
                                    type="button"
                                    className={
                                        Page === Props.CurrentListPage
                                            ? Styles.PageActive
                                            : ''
                                    }
                                    onClick={() =>
                                        ChangeListPage(Page)
                                    }
                                    aria-current={
                                        Page === Props.CurrentListPage
                                            ? 'page'
                                        : undefined
                                    }
                                >
                                    {Page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    ChangeListPage(
                                        Props.CurrentListPage + 1,
                                    )
                                }
                                disabled={
                                    Props.CurrentListPage ===
                                    Props.TotalListPages
                                }
                                aria-label="다음 페이지"
                            >
                                →
                            </button>
                        </nav>
                    ) : null}
                </aside>

                <div
                    className={Styles.FlipBookStage}
                    data-book-initializing={IsAddingPage}
                    data-cover-closed={IsCoverClosed}
                    data-last-spread={IsLastSpread}
                    data-cover-settling={IsCoverSettling}
                    onPointerDownCapture={HandleStagePointerDown}
                >
                    <HTMLFlipBook
                        key={Props.Pages.length}
                        ref={FlipBookReference}
                        className={Styles.FlipBook}
                        style={{}}
                        width={430}
                        height={610}
                        size="stretch"
                        minWidth={280}
                        maxWidth={520}
                        minHeight={398}
                        maxHeight={740}
                        startPage={
                            IsAddingPage ? AddedPageStart : 0
                        }
                        drawShadow
                        flippingTime={920}
                        usePortrait
                        startZIndex={10}
                        autoSize
                        maxShadowOpacity={0.16}
                        showCover
                        mobileScrollSupport={false}
                        clickEventForward
                        useMouseEvents
                        swipeDistance={24}
                        showPageCorners={false}
                        disableFlipByClick
                        renderOnlyPageLengthChange
                        onFlip={HandleFlip}
                        onInit={HandleInit}
                        onChangeState={HandleChangeState}
                    >
                        <FlipPage
                            ClassName={`${Styles.EnginePage} ${Styles.EngineCover}`}
                            Density="hard"
                            Children={
                                <div
                                    className={Styles.EngineCoverFace}
                                    data-cover={
                                        Props.ActivePage.CoverTheme
                                    }
                                >
                                    <small>ONE-LINE ARCHIVE</small>
                                    <strong>
                                        {Props.ActivePage.Title}
                                    </strong>
                                    <span>DRAG THE CORNER TO OPEN</span>
                                </div>
                            }
                        />
                        <FlipPage
                            ClassName={`${Styles.EnginePage} ${Styles.EnginePaper}`}
                            Children={
                                <div className={Styles.EngineTitlePage}>
                                    <small>ONE-LINE ARCHIVE</small>
                                    <strong>
                                        Notes for
                                        <br />
                                        quiet moments.
                                    </strong>
                                    <span>
                                        VOL. 01 · PERSONAL EDITION
                                    </span>
                                </div>
                            }
                        />
                        {Props.Pages.map((Page, Index) => (
                            <FlipPage
                                key={Page.Id}
                                ClassName={`${Styles.EnginePage} ${Styles.EnginePaper} ${
                                    (Index + 2) % 2 === 0
                                        ? Styles.EngineRecto
                                        : Styles.EngineVerso
                                }`}
                                Children={
                                    <article
                                        className={
                                            Styles.EngineMemoPage
                                        }
                                        data-has-attachment={
                                            Page.AttachmentPath !==
                                            undefined
                                        }
                                    >
                                        <div
                                            className={Styles.PageMeta}
                                        >
                                            <span>{Page.Date}</span>
                                            <span>
                                                {Index + 1} /{' '}
                                                {Props.Pages.length}
                                            </span>
                                        </div>
                                        {Index ===
                                        Props.ActivePageIndex ? (
                                            <>
                                                <input
                                                    className={
                                                        Styles.TitleInput
                                                    }
                                                    value={Page.Title}
                                                    onPointerDown={
                                                        StopPageGesture
                                                    }
                                                    onMouseDown={
                                                        StopMousePageGesture
                                                    }
                                                    onMouseDownCapture={
                                                        StopMousePageGesture
                                                    }
                                                    onChange={(Event) =>
                                                        Props.OnChangeTitle(
                                                            Event.target
                                                                .value,
                                                        )
                                                    }
                                                    aria-label="메모 제목"
                                                />
                                                <textarea
                                                    className={
                                                        Styles.ContentInput
                                                    }
                                                    value={
                                                        Page.Content
                                                    }
                                                    onPointerDown={
                                                        StopPageGesture
                                                    }
                                                    onMouseDown={
                                                        StopMousePageGesture
                                                    }
                                                    onMouseDownCapture={
                                                        StopMousePageGesture
                                                    }
                                                    onChange={(Event) =>
                                                        Props.OnChangeContent(
                                                            Event.target
                                                                .value,
                                                        )
                                                    }
                                                    aria-label="메모 내용"
                                                />
                                                <MemoAttachment
                                                    Page={Page}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <h2
                                                    className={
                                                        Styles.EnginePageTitle
                                                    }
                                                >
                                                    {Page.Title}
                                                </h2>
                                                <p
                                                    className={
                                                        Styles.EnginePageContent
                                                    }
                                                >
                                                    {Page.Content}
                                                </p>
                                                <MemoAttachment
                                                    Page={Page}
                                                />
                                            </>
                                        )}
                                    </article>
                                }
                            />
                        ))}
                        {Props.Pages.length % 2 === 0
                            ? [
                                <FlipPage
                                    key="memo-filler"
                                    ClassName={`${Styles.EnginePage} ${Styles.EnginePaper}`}
                                    Children={<span aria-hidden="true" />}
                                />,
                            ]
                            : []}
                        <FlipPage
                            ClassName={`${Styles.EnginePage} ${Styles.EngineBackCover}`}
                            Density="hard"
                            Children={<span>ONE-LINE ARCHIVE</span>}
                        />
                    </HTMLFlipBook>
                    {IsLastSpread ? (
                        <span
                            className={Styles.LastPageGuard}
                            aria-hidden="true"
                        />
                    ) : null}
                    {IsFlipAnimating ? (
                        <span
                            className={Styles.FlipInputGuard}
                            aria-hidden="true"
                        />
                    ) : null}
                </div>

            </div>
        </section>
    );
}
