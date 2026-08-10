import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from 'react';
import type {
    WritingArticle,
    WritingReaderAlignment,
    WritingReaderFont,
    WritingReaderTone,
} from '@/panels/base/WritingBasePanel/controller/WritingBasePanelTypes';
import { FormatArchiveIndex } from '@/core/date/ArchiveYearRange';
import {
    GetWritingBlockShortcut,
    GetWritingEnterBehavior,
    GetWritingSlashQuery,
    NormalizeWritingSlashSearchText,
    WritingEditorDropMarkerHtml,
} from '@/panels/base/WritingBasePanel/controller/WritingBasePanelState';
import Styles from '@/panels/base/WritingBasePanel/WritingBasePanel.module.css';

interface WritingArchiveSectionProps
{
    ActiveArticle: WritingArticle;
    ArchiveArticles: WritingArticle[];
    Articles: WritingArticle[];
    Categories: string[];
    SearchQuery: string;
    ActiveCategory: string;
    CurrentPage: number;
    TotalPages: number;
    TotalResults: number;
    IsListCollapsed: boolean;
    IsViewSettingsOpen: boolean;
    ReaderFont: WritingReaderFont;
    ReaderTone: WritingReaderTone;
    ReaderAlignment: WritingReaderAlignment;
    ReaderFontSize: number;
    IsAuthenticated: boolean;
    IsCategoryEditorOpen: boolean;
    IsCategorySaving: boolean;
    NewCategoryName: string;
    CategoryNotice: string;
    DraggedArticleId: string | null;
    IsArticleOrderSaving: boolean;
    ArticleOrderNotice: string;
    IsEditing: boolean;
    IsEditorInsertOpen: boolean;
    IsPostSaving: boolean;
    EditorNotice: string;
    DraftTitle: string;
    DraftSummary: string;
    DraftCategory: string;
    DraftContentHtml: string;
    DraftIsPrivate: boolean;
    OnSelectArticle: (ArticleId: string) => void;
    OnChangeSearchQuery: (Query: string) => void;
    OnChangeCategory: (Category: string) => void;
    OnChangePage: (Page: number) => void;
    OnToggleList: () => void;
    OnToggleViewSettings: () => void;
    OnChangeReaderFont: (Font: WritingReaderFont) => void;
    OnChangeReaderTone: (Tone: WritingReaderTone) => void;
    OnChangeReaderAlignment: (
        Alignment: WritingReaderAlignment,
    ) => void;
    OnChangeReaderFontSize: (Delta: -1 | 1) => void;
    OnOpenCategoryEditor: () => void;
    OnCloseCategoryEditor: () => void;
    OnChangeNewCategoryName: (Category: string) => void;
    OnCreateCategory: () => Promise<void>;
    OnDeleteCategory: (Category: string) => Promise<void>;
    OnRenameCategory: (
        CurrentName: string,
        NextName: string,
    ) => Promise<boolean>;
    OnStartArticleDrag: (ArticleId: string) => void;
    OnMoveArticleDrag: (ArticleId: string) => void;
    OnDropArticle: (ArticleId: string) => Promise<void>;
    OnEndArticleDrag: () => void;
    OnOpenEditor: () => void;
    OnCloseEditor: () => void;
    OnSaveEditor: (ContentHtml: string) => Promise<void>;
    OnChangeDraftTitle: (Title: string) => void;
    OnChangeDraftSummary: (Summary: string) => void;
    OnChangeDraftCategory: (Category: string) => void;
    OnChangeDraftIsPrivate: (IsPrivate: boolean) => void;
    OnToggleEditorInsert: () => void;
    OnExecuteEditorCommand: (
        Command: string,
        Value?: string,
    ) => void;
    OnInsertExternalLink: () => void;
    OnUploadEditorAssets: (
        Files: File[],
        ContentHtml: string,
    ) => Promise<void>;
}

const ReaderFonts: Array<{
    Label: string;
    Value: WritingReaderFont;
}> = [
    { Label: '돋움', Value: 'gothic' },
    { Label: '굴림', Value: 'system' },
    { Label: '바탕', Value: 'serif' },
    { Label: '맑은고딕', Value: 'rounded' },
    { Label: '고정폭', Value: 'mono' },
];

const SlashCommands = [
    {
        Label: '본문',
        Description: '일반 텍스트',
        Command: 'formatBlock',
        Value: 'p',
    },
    {
        Label: '제목 1',
        Description: '큰 제목',
        Command: 'formatBlock',
        Value: 'h1',
    },
    {
        Label: '제목 2',
        Description: '중간 제목',
        Command: 'formatBlock',
        Value: 'h2',
    },
    {
        Label: '제목 3',
        Description: '작은 제목',
        Command: 'formatBlock',
        Value: 'h3',
    },
    {
        Label: '글머리 목록',
        Description: '순서 없는 목록',
        Command: 'insertUnorderedList',
    },
    {
        Label: '번호 목록',
        Description: '순서 있는 목록',
        Command: 'insertOrderedList',
    },
    {
        Label: '인용',
        Description: '인용문 블록',
        Command: 'formatBlock',
        Value: 'blockquote',
    },
    {
        Label: '코드',
        Description: '코드 블록',
        Command: 'formatBlock',
        Value: 'pre',
    },
    {
        Label: '구분선',
        Description: '회색 구분선',
        Command: 'insertHorizontalRule',
    },
] as const;

export function WritingArchiveSection(Props: WritingArchiveSectionProps)
{
    const ImageInputReference =
        useRef<HTMLInputElement>(null);
    const FileInputReference =
        useRef<HTMLInputElement>(null);
    const VideoInputReference =
        useRef<HTMLInputElement>(null);
    const EditorContentReference =
        useRef<HTMLDivElement>(null);
    const SlashMenuReference =
        useRef<HTMLDivElement>(null);
    const DropIndicatorReference =
        useRef<HTMLHRElement | null>(null);
    const MediaResizeReference = useRef<{
        Figure: HTMLElement;
        Sibling: HTMLElement | null;
        StartX: number;
        StartWidth: number;
        SiblingStartWidth: number;
        Direction: -1 | 1;
    } | null>(null);
    const DraggedMediaReference =
        useRef<HTMLElement | null>(null);
    const MediaDropReference = useRef<{
        Before: Element | null;
        Target: HTMLElement | null;
        Side: 'left' | 'right' | 'block';
    } | null>(null);
    const ArticleListReference =
        useRef<HTMLElement>(null);
    const ArticleElementReferences =
        useRef(new Map<string, HTMLDivElement>());
    const PreviousArticlePositions =
        useRef(new Map<string, number>());
    const SlashRangeReference =
        useRef<Range | null>(null);
    const SelectionRangeReference =
        useRef<Range | null>(null);
    const IsSelectionMenuInteractingReference =
        useRef(false);
    const [SlashMenuPosition, SetSlashMenuPosition] =
        useState<{
            Left: number;
            Top: number;
            Query: string;
        } | null>(null);
    const [SelectionMenuPosition, SetSelectionMenuPosition] =
        useState<{ Left: number; Top: number } | null>(null);
    const [MediaMenuPosition, SetMediaMenuPosition] =
        useState<{
            Left: number;
            Top: number;
            Alignment: string;
            Gap: string;
            IsSideBySide: boolean;
        } | null>(null);
    const [MediaDropPosition, SetMediaDropPosition] =
        useState<{
            Left: number;
            Top: number;
            Height: number;
            Width: number;
            Side: 'left' | 'right' | 'block';
        } | null>(null);
    const [EditingCategory, SetEditingCategory] =
        useState<string | null>(null);
    const [CategoryDraft, SetCategoryDraft] = useState('');
    const EditorContentMarkup = useMemo(() => ({
        __html: Props.DraftContentHtml,
    }), [Props.DraftContentHtml]);
    const NormalizedSlashQuery =
        NormalizeWritingSlashSearchText(
            SlashMenuPosition?.Query ?? '',
        );
    const VisibleSlashCommands = SlashCommands.filter((Item) =>
        SlashMenuPosition === null
        || NormalizeWritingSlashSearchText(Item.Label).includes(
            NormalizedSlashQuery,
        )
        || NormalizeWritingSlashSearchText(
            Item.Description,
        ).includes(NormalizedSlashQuery)
    );

    async function CommitCategoryRename(Category: string)
    {
        if(await Props.OnRenameCategory(Category, CategoryDraft))
        {
            SetEditingCategory(null);
        }
    }

    function RestoreRange(RangeValue: Range | null)
    {
        const Selection = window.getSelection();

        if(Selection === null || RangeValue === null)
        {
            return false;
        }

        Selection.removeAllRanges();
        Selection.addRange(RangeValue);
        return true;
    }

    function ApplySlashCommand(
        Command: string,
        Value?: string,
    )
    {
        const RangeValue = SlashRangeReference.current;
        const TriggerLength =
            (SlashMenuPosition?.Query.length ?? 0) + 1;

        if(
            RangeValue === null
            || RangeValue.startContainer.nodeType
                !== Node.TEXT_NODE
            || RangeValue.startOffset < TriggerLength
        )
        {
            return;
        }

        const CommandRange = RangeValue.cloneRange();
        CommandRange.setStart(
            CommandRange.startContainer,
            CommandRange.startOffset - TriggerLength,
        );
        CommandRange.deleteContents();
        const StartElement =
            CommandRange.startContainer.nodeType
                === Node.ELEMENT_NODE
                ? CommandRange.startContainer as Element
                : CommandRange.startContainer.parentElement;
        const EmptyBlock =
            StartElement?.closest(
                'p,h1,h2,h3,blockquote,pre,li',
            )
            ?? (
                StartElement === EditorContentReference.current
                    ? StartElement
                    : null
            );

        if(
            EmptyBlock !== null
            && EmptyBlock !== undefined
            && EmptyBlock.textContent === ''
            && EmptyBlock.querySelector('br') === null
        )
        {
            const LineBreak = document.createElement('br');

            CommandRange.insertNode(LineBreak);
            CommandRange.setStartBefore(LineBreak);
        }

        CommandRange.collapse(true);
        RestoreRange(CommandRange);
        Props.OnExecuteEditorCommand(Command, Value);
        SetSlashMenuPosition(null);
        SlashRangeReference.current = null;
    }

    function ApplySelectionCommand(
        Command: string,
        Value?: string,
    )
    {
        if(
            RestoreRange(SelectionRangeReference.current)
        )
        {
            Props.OnExecuteEditorCommand(Command, Value);
            window.requestAnimationFrame(UpdateSelectionMenu);
        }
    }

    function PositionMediaMenu(Figure: HTMLElement)
    {
        const Bounds = Figure.getBoundingClientRect();
        const IsSideBySide =
            GetSameRowAdjacentFigures(Figure).length > 0;

        SetMediaMenuPosition({
            Left: Math.max(
                170,
                Math.min(
                    window.innerWidth - 170,
                    Bounds.left + Bounds.width / 2,
                ),
            ),
            Top: Math.max(12, Bounds.top - 46),
            Alignment: Figure.dataset.align ?? 'left',
            Gap: Figure.dataset.gap ?? 'normal',
            IsSideBySide,
        });
    }

    function GetAdjacentFigure(
        Figure: HTMLElement,
        Direction: -1 | 1,
    ): HTMLElement | null
    {
        const Candidate = Direction === -1
            ? Figure.previousElementSibling
            : Figure.nextElementSibling;

        return Candidate instanceof HTMLElement
            && Candidate.matches('figure')
                ? Candidate
                : null;
    }

    function GetSameRowAdjacentFigures(
        Figure: HTMLElement,
    ): HTMLElement[]
    {
        const Top = Figure.getBoundingClientRect().top;

        return [-1, 1].flatMap((Direction) =>
        {
            const Candidate = GetAdjacentFigure(
                Figure,
                Direction as -1 | 1,
            );

            return Candidate !== null
                && Math.abs(
                    Candidate.getBoundingClientRect().top
                    - Top,
                ) < 8
                    ? [Candidate]
                    : [];
        });
    }

    function DetachMediaFromRow(Figure: HTMLElement)
    {
        GetSameRowAdjacentFigures(Figure).forEach(
            (Sibling) =>
            {
                Sibling.style.width = '100%';
                Sibling.removeAttribute('data-gap');
            },
        );
        Figure.removeAttribute('data-gap');
    }

    function ClearMediaDrop()
    {
        DraggedMediaReference.current = null;
        MediaDropReference.current = null;
        SetMediaDropPosition(null);
    }

    function ApplyMediaAlignment(
        Alignment: 'left' | 'center' | 'right',
    )
    {
        const Figure =
            EditorContentReference.current
                ?.querySelector<HTMLElement>(
                    'figure[data-selected="true"]',
                );

        if(Figure === null || Figure === undefined)
        {
            return;
        }

        DetachMediaFromRow(Figure);
        Figure.dataset.align = Alignment;
        PositionMediaMenu(Figure);
    }

    function ApplyMediaSideBySide()
    {
        const Figure =
            EditorContentReference.current
                ?.querySelector<HTMLElement>(
                    'figure[data-selected="true"]',
                );
        const Sibling = Figure === null || Figure === undefined
            ? null
            : GetAdjacentFigure(Figure, -1)
                ?? GetAdjacentFigure(Figure, 1);

        if(Figure === null || Figure === undefined || Sibling === null)
        {
            return;
        }

        Figure.removeAttribute('data-align');
        Figure.style.width = '48%';
        Figure.dataset.gap = 'tight';
        Sibling.removeAttribute('data-align');
        Sibling.style.width = '48%';
        Sibling.dataset.gap = 'tight';
        PositionMediaMenu(Figure);
    }

    function ApplyMediaGap(Gap: string)
    {
        const Figure =
            EditorContentReference.current
                ?.querySelector<HTMLElement>(
                    'figure[data-selected="true"]',
                );

        if(Figure === null || Figure === undefined)
        {
            return;
        }

        const Siblings = GetSameRowAdjacentFigures(Figure);

        if(Siblings.length === 0)
        {
            return;
        }

        [Figure, ...Siblings].forEach((Media) =>
        {
            Media.removeAttribute('data-align');
            Media.dataset.gap = Gap;
        });
        PositionMediaMenu(Figure);
    }

    function ApplyBlockShortcut(
        AllowedCommands: string[],
    ): boolean
    {
        const Editor = EditorContentReference.current;
        const Selection = window.getSelection();

        if(
            Editor === null
            || Selection === null
            || Selection.rangeCount === 0
            || Selection.isCollapsed === false
        )
        {
            return false;
        }

        const RangeValue = Selection.getRangeAt(0);
        const StartElement =
            RangeValue.startContainer instanceof Element
                ? RangeValue.startContainer
                : RangeValue.startContainer.parentElement;
        let Block = StartElement?.closest<HTMLElement>(
            'p,h1,h2,h3,blockquote',
        );
        const IsRootText =
            RangeValue.startContainer.parentElement === Editor
            && Editor.children.length === 0;
        const TextContainer = Block ?? (
            IsRootText ? Editor : null
        );
        const Command = GetWritingBlockShortcut(
            TextContainer?.textContent ?? '',
        );
        const TextBeforeCaret = RangeValue.cloneRange();

        if(
            TextContainer === null
            || (
                Block !== null
                && Block !== undefined
                && Editor.contains(Block) === false
            )
            || Command === null
            || AllowedCommands.includes(Command) === false
        )
        {
            return false;
        }

        TextBeforeCaret.selectNodeContents(TextContainer);
        TextBeforeCaret.setEnd(
            RangeValue.startContainer,
            RangeValue.startOffset,
        );

        if(
            TextBeforeCaret.toString()
            !== TextContainer.textContent
        )
        {
            return false;
        }

        if(Block === null || Block === undefined)
        {
            Block = document.createElement('p');
            Editor.replaceChildren(Block);
        }

        Block.replaceChildren(document.createElement('br'));
        const CommandRange = document.createRange();

        CommandRange.selectNodeContents(Block);
        CommandRange.collapse(true);
        RestoreRange(CommandRange);
        Props.OnExecuteEditorCommand(Command);
        SetSlashMenuPosition(null);
        SetSelectionMenuPosition(null);
        return true;
    }

    function ScheduleEditorMenuUpdate(
        ShouldUpdateSlashMenu = false,
    )
    {
        window.requestAnimationFrame(() =>
        {
            UpdateSelectionMenu();

            if(ShouldUpdateSlashMenu)
            {
                UpdateSlashMenu();
            }
        });
    }

    function UpdateSelectionMenu()
    {
        const Editor = EditorContentReference.current;
        const Selection = window.getSelection();

        if(
            Editor === null
            || Selection === null
            || Selection.rangeCount === 0
            || Selection.isCollapsed
        )
        {
            if(IsSelectionMenuInteractingReference.current === false)
            {
                SetSelectionMenuPosition(null);
            }
            return;
        }

        const RangeValue = Selection.getRangeAt(0);
        const CommonContainer =
            RangeValue.commonAncestorContainer.nodeType
                === Node.ELEMENT_NODE
                ? RangeValue.commonAncestorContainer as Element
                : RangeValue.commonAncestorContainer.parentElement;

        if(
            CommonContainer === null
            || Editor.contains(CommonContainer) === false
        )
        {
            if(IsSelectionMenuInteractingReference.current === false)
            {
                SetSelectionMenuPosition(null);
            }
            return;
        }

        const Bounds = RangeValue.getBoundingClientRect();

        SelectionRangeReference.current =
            RangeValue.cloneRange();
        SetSelectionMenuPosition({
            Left: Math.max(
                12,
                Math.min(
                    window.innerWidth - 12,
                    Bounds.left + Bounds.width / 2,
                ),
            ),
            Top: Math.max(12, Bounds.top - 48),
        });
    }

    function UpdateSlashMenu()
    {
        const Editor = EditorContentReference.current;
        const Selection = window.getSelection();

        if(
            Editor === null
            || Selection === null
            || Selection.rangeCount === 0
            || Selection.isCollapsed === false
        )
        {
            SetSlashMenuPosition(null);
            return;
        }

        const RangeValue = Selection.getRangeAt(0);

        if(
            RangeValue.startContainer.nodeType
                !== Node.TEXT_NODE
            || RangeValue.startOffset < 1
            || Editor.contains(
                RangeValue.startContainer.parentElement,
            ) === false
        )
        {
            SetSlashMenuPosition(null);
            return;
        }

        const Text =
            RangeValue.startContainer.textContent ?? '';
        const Query = GetWritingSlashQuery(
            Text,
            RangeValue.startOffset,
        );

        if(Query === null)
        {
            SetSlashMenuPosition(null);
            return;
        }

        const SlashBounds = RangeValue.cloneRange();
        SlashBounds.setStart(
            SlashBounds.startContainer,
            SlashBounds.startOffset - Query.length - 1,
        );
        const Bounds = SlashBounds.getBoundingClientRect();

        SlashRangeReference.current =
            RangeValue.cloneRange();
        SetSlashMenuPosition({
            Left: Math.max(
                12,
                Math.min(
                    window.innerWidth - 260,
                    Bounds.left,
                ),
            ),
            Top: Math.max(
                12,
                Math.min(
                    window.innerHeight - 330,
                    Bounds.bottom + 8,
                ),
            ),
            Query,
        });
        SetSelectionMenuPosition(null);
    }

    useEffect(() =>
    {
        if(SlashMenuPosition === null)
        {
            return;
        }

        function CloseOnOutsidePointer(Event: PointerEvent)
        {
            if(
                Event.target instanceof Node
                && SlashMenuReference.current?.contains(Event.target)
            )
            {
                return;
            }

            SetSlashMenuPosition(null);
            SlashRangeReference.current = null;
        }

        function LockPageWheel(Event: WheelEvent)
        {
            if(
                Event.target instanceof Element
                && SlashMenuReference.current?.contains(Event.target)
            )
            {
                return;
            }

            Event.preventDefault();
        }

        document.addEventListener(
            'pointerdown',
            CloseOnOutsidePointer,
        );
        window.addEventListener('wheel', LockPageWheel, {
            passive: false,
        });

        return () =>
        {
            document.removeEventListener(
                'pointerdown',
                CloseOnOutsidePointer,
            );
            window.removeEventListener('wheel', LockPageWheel);
        };
    }, [SlashMenuPosition]);

    useEffect(() =>
    {
        if(
            SelectionMenuPosition === null
            && MediaMenuPosition === null
        )
        {
            return;
        }

        function LockPageScroll(Event: WheelEvent | TouchEvent)
        {
            Event.preventDefault();
        }

        window.addEventListener('wheel', LockPageScroll, {
            passive: false,
        });
        window.addEventListener('touchmove', LockPageScroll, {
            passive: false,
        });

        return () =>
        {
            window.removeEventListener('wheel', LockPageScroll);
            window.removeEventListener('touchmove', LockPageScroll);
        };
    }, [MediaMenuPosition, SelectionMenuPosition]);

    useEffect(() =>
    {
        ArticleListReference.current?.scrollTo({
            top: 0,
        });
    }, [Props.ActiveCategory, Props.SearchQuery]);

    function ScrollToPage(Page: number)
    {
        const List = ArticleListReference.current;
        const Target = List?.querySelector<HTMLElement>(
            `[data-page-start="${Page}"]`,
        );

        if(List === null || Target === null || Target === undefined)
        {
            return;
        }

        const Top =
            List.scrollTop
            + Target.getBoundingClientRect().top
            - List.getBoundingClientRect().top;

        Props.OnChangePage(Page);
        List.scrollTo({
            behavior: 'smooth',
            top: Top,
        });
    }

    function TrackListPage(List: HTMLElement)
    {
        const ListTop = List.getBoundingClientRect().top;
        let Page = 1;

        List.querySelectorAll<HTMLElement>(
            '[data-page-start]',
        ).forEach((Anchor) =>
        {
            if(
                Anchor.getBoundingClientRect().top
                <= ListTop + 4
            )
            {
                Page = Number(
                    Anchor.dataset.pageStart,
                );
            }
        });

        if(
            Props.TotalPages > 1
            && List.scrollTop
            >= List.scrollHeight - List.clientHeight - 4
        )
        {
            Page = Props.TotalPages;
        }

        Props.OnChangePage(Page);
    }

    useLayoutEffect(() =>
    {
        const Elements = ArticleElementReferences.current;
        const PreviousPositions =
            PreviousArticlePositions.current;
        const NextPositions = new Map<string, number>();
        const ShouldAnimate =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches === false;

        Elements.forEach((Element) =>
        {
            Element.getAnimations().forEach(
                (Animation) => Animation.cancel(),
            );
        });
        Elements.forEach((Element, ArticleId) =>
        {
            const NextTop =
                Element.getBoundingClientRect().top;
            const PreviousTop =
                PreviousPositions.get(ArticleId);

            NextPositions.set(ArticleId, NextTop);

            if(
                ShouldAnimate
                && PreviousTop !== undefined
                && PreviousTop !== NextTop
                && ArticleId !== Props.DraggedArticleId
            )
            {
                Element.animate(
                    [
                        {
                            transform:
                                `translateY(${PreviousTop - NextTop}px)`,
                        },
                        { transform: 'translateY(0)' },
                    ],
                    {
                        duration: 180,
                        easing: 'cubic-bezier(.2,.8,.2,1)',
                    },
                );
            }
        });

        PreviousArticlePositions.current = NextPositions;
    }, [Props.Articles, Props.DraggedArticleId]);

    return (
        <section
            className={Styles.Archive}
            data-ue-component="WritingArchiveSection"
            data-ue-root
            data-list-collapsed={Props.IsListCollapsed}
        >
            <div className={Styles.ListColumn}>
                <div className={Styles.ListContent}>
                    <div className={Styles.ListTools}>
                        <p className={Styles.ArchiveIndex}>
                            {FormatArchiveIndex(
                                Props.ArchiveArticles.map(
                                    (Article) => Article.Date,
                                ),
                            )}
                        </p>
                        <div
                            className={Styles.CategoryTabs}
                            role="group"
                            aria-label="글 카테고리"
                        >
                            <button
                                type="button"
                                className={
                                    Props.ActiveCategory === 'all'
                                        ? Styles.CategoryActive
                                        : ''
                                }
                                onClick={() =>
                                    Props.OnChangeCategory('all')
                                }
                            >
                                전체
                            </button>
                            {Props.Categories.map((Category) => (
                                <div
                                    key={Category}
                                    className={Styles.CategoryItem}
                                >
                                    {EditingCategory === Category ? (
                                        <form
                                            className={
                                                Styles.CategoryRenameForm
                                            }
                                            onSubmit={(Event) =>
                                            {
                                                Event.preventDefault();
                                                void CommitCategoryRename(
                                                    Category,
                                                );
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={CategoryDraft}
                                                maxLength={20}
                                                disabled={
                                                    Props.IsCategorySaving
                                                }
                                                autoFocus
                                                aria-label={`${Category} 카테고리 이름 변경`}
                                                onChange={(Event) =>
                                                    SetCategoryDraft(
                                                        Event.currentTarget
                                                            .value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    void CommitCategoryRename(
                                                        Category,
                                                    )
                                                }
                                                onKeyDown={(Event) =>
                                                {
                                                    if(
                                                        Event.key ===
                                                        'Escape'
                                                    )
                                                    {
                                                        SetEditingCategory(
                                                            null,
                                                        );
                                                    }
                                                }}
                                            />
                                        </form>
                                    ) : (
                                        <button
                                            type="button"
                                            className={
                                                Props.ActiveCategory ===
                                                Category
                                                    ? Styles.CategoryActive
                                                    : ''
                                            }
                                            onClick={() =>
                                                Props.OnChangeCategory(
                                                    Category,
                                                )
                                            }
                                            onDoubleClick={() =>
                                            {
                                                if(Props.IsAuthenticated)
                                                {
                                                    Props.OnChangeCategory(
                                                        Category,
                                                    );
                                                    SetCategoryDraft(
                                                        Category,
                                                    );
                                                    SetEditingCategory(
                                                        Category,
                                                    );
                                                }
                                            }}
                                            title={
                                                Props.IsAuthenticated
                                                    ? '더블클릭하여 이름 변경'
                                                    : undefined
                                            }
                                        >
                                            {Category}
                                        </button>
                                    )}
                                    {Props.IsAuthenticated ? (
                                        <button
                                            type="button"
                                            className={
                                                Styles
                                                    .CategoryDeleteButton
                                            }
                                            disabled={
                                                Props.IsCategorySaving
                                            }
                                            onClick={() =>
                                                void Props
                                                    .OnDeleteCategory(
                                                        Category,
                                                    )
                                            }
                                            aria-label={`${Category} 카테고리 삭제`}
                                        >
                                            ×
                                        </button>
                                    ) : null}
                                </div>
                            ))}
                            {Props.IsAuthenticated ? (
                                Props.IsCategoryEditorOpen ? (
                                    <form
                                        className={
                                            Styles.CategoryAddForm
                                        }
                                        onSubmit={(Event) =>
                                        {
                                            Event.preventDefault();
                                            void Props
                                                .OnCreateCategory();
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={
                                                Props.NewCategoryName
                                            }
                                            maxLength={20}
                                            disabled={
                                                Props.IsCategorySaving
                                            }
                                            autoFocus
                                            aria-label="새 긴 글 카테고리 이름"
                                            onChange={(Event) =>
                                                Props
                                                    .OnChangeNewCategoryName(
                                                        Event
                                                            .currentTarget
                                                            .value,
                                                    )
                                            }
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                Props.IsCategorySaving
                                            }
                                        >
                                            추가
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                Props.IsCategorySaving
                                            }
                                            onClick={
                                                Props
                                                    .OnCloseCategoryEditor
                                            }
                                            aria-label="카테고리 추가 취소"
                                        >
                                            ×
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        className={
                                            Styles.CategoryAddButton
                                        }
                                        onClick={
                                            Props.OnOpenCategoryEditor
                                        }
                                        disabled={
                                            Props.IsCategorySaving
                                        }
                                        aria-label="긴 글 카테고리 추가"
                                    >
                                        +
                                    </button>
                                )
                            ) : null}
                        </div>
                        <label className={Styles.Search}>
                            <span>글 검색</span>
                            <input
                                type="search"
                                value={Props.SearchQuery}
                                onChange={(Event) =>
                                    Props.OnChangeSearchQuery(
                                        Event.target.value,
                                    )
                                }
                                placeholder="제목이나 내용 검색"
                            />
                        </label>
                        <p>
                            {Props.TotalResults}개의 글 · {Props.CurrentPage}/
                            {Props.TotalPages} 페이지
                        </p>
                        {Props.CategoryNotice ? (
                            <p
                                className={Styles.CategoryNotice}
                                role="status"
                            >
                                {Props.CategoryNotice}
                            </p>
                        ) : null}
                    </div>

                    <nav
                        ref={ArticleListReference}
                        className={Styles.ArticleList}
                        aria-label="긴 글 목록"
                        onScroll={(Event) =>
                            TrackListPage(Event.currentTarget)
                        }
                        onDragOver={(Event) =>
                        {
                            if(Props.DraggedArticleId === null)
                            {
                                return;
                            }

                            const Bounds =
                                Event.currentTarget
                                    .getBoundingClientRect();
                            const EdgeSize = 54;

                            if(
                                Event.clientY
                                < Bounds.top + EdgeSize
                            )
                            {
                                Event.currentTarget.scrollBy(
                                    0,
                                    -18,
                                );
                            }
                            else if(
                                Event.clientY
                                > Bounds.bottom - EdgeSize
                            )
                            {
                                Event.currentTarget.scrollBy(
                                    0,
                                    18,
                                );
                            }
                        }}
                    >
                        {Props.Articles.map((Article, Index) => (
                            <div
                                key={Article.Id}
                                data-page-start={
                                    Index % 10 === 0
                                        ? Math.floor(Index / 10) + 1
                                        : undefined
                                }
                                ref={(Element) =>
                                {
                                    if(Element === null)
                                    {
                                        ArticleElementReferences
                                            .current.delete(Article.Id);
                                    }
                                    else
                                    {
                                        ArticleElementReferences
                                            .current.set(
                                                Article.Id,
                                                Element,
                                            );
                                    }
                                }}
                                className={Styles.ArticleListItem}
                                data-dragging={
                                    Props.DraggedArticleId ===
                                    Article.Id
                                }
                                onDragOver={(Event) =>
                                {
                                    if(Props.IsAuthenticated)
                                    {
                                        Event.preventDefault();
                                    }
                                }}
                                onDragEnter={() =>
                                    Props.OnMoveArticleDrag(
                                        Article.Id,
                                    )
                                }
                                onDrop={(Event) =>
                                {
                                    Event.preventDefault();
                                    void Props.OnDropArticle(
                                        Article.Id,
                                    );
                                }}
                            >
                                {Props.IsAuthenticated ? (
                                    <button
                                        type="button"
                                        className={
                                            Styles.ArticleDragHandle
                                        }
                                        draggable={
                                            Props
                                                .IsArticleOrderSaving
                                                === false
                                        }
                                        disabled={
                                            Props.IsArticleOrderSaving
                                        }
                                        onDragStart={(Event) =>
                                        {
                                            Event.dataTransfer
                                                .setData(
                                                    'text/plain',
                                                    Article.Id,
                                                );
                                            Event.dataTransfer
                                                .effectAllowed =
                                                'move';
                                            Props.OnStartArticleDrag(
                                                Article.Id,
                                            );
                                        }}
                                        onDragEnd={
                                            Props.OnEndArticleDrag
                                        }
                                        aria-label={`${Article.Title} 순서 이동`}
                                    >
                                        ⠿
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className={
                                        Article.Id ===
                                        Props.ActiveArticle.Id
                                            ? Styles.ArticleActive
                                            : ''
                                    }
                                    onClick={() =>
                                        Props.OnSelectArticle(
                                            Article.Id,
                                        )
                                    }
                                >
                                    <span>
                                        {String(
                                            Index + 1,
                                        ).padStart(2, '0')}
                                    </span>
                                    <strong>{Article.Title}</strong>
                                    <small>{Article.Date}</small>
                                </button>
                            </div>
                        ))}
                        {Props.Articles.length === 0 ? (
                            <p className={Styles.Empty}>
                                검색 조건에 맞는 글이 없습니다.
                            </p>
                        ) : null}
                        {Props.ArticleOrderNotice ? (
                            <p
                                className={Styles.OrderNotice}
                                role="status"
                            >
                                {Props.ArticleOrderNotice}
                            </p>
                        ) : null}
                    </nav>

                    <nav
                        className={Styles.Pagination}
                        aria-label="긴 글 페이지"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                ScrollToPage(Props.CurrentPage - 1)
                            }
                            disabled={Props.CurrentPage === 1}
                            aria-label="이전 페이지"
                        >
                            ←
                        </button>
                        {Array.from(
                            { length: Props.TotalPages },
                            (_, Index) => Index + 1,
                        ).map((Page) => (
                            <button
                                key={Page}
                                type="button"
                                className={
                                    Page === Props.CurrentPage
                                        ? Styles.PageActive
                                        : ''
                                }
                                onClick={() => ScrollToPage(Page)}
                                aria-current={
                                    Page === Props.CurrentPage
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
                                ScrollToPage(Props.CurrentPage + 1)
                            }
                            disabled={
                                Props.CurrentPage === Props.TotalPages
                            }
                            aria-label="다음 페이지"
                        >
                            →
                        </button>
                    </nav>
                </div>
                <button
                    type="button"
                    className={Styles.ListToggle}
                    onClick={Props.OnToggleList}
                    aria-label={
                        Props.IsListCollapsed
                            ? '글 목록 펼치기'
                            : '글 목록 접기'
                    }
                    aria-expanded={!Props.IsListCollapsed}
                >
                    {Props.IsListCollapsed ? '›' : '‹'}
                </button>
            </div>

            <article
                className={Styles.Reader}
                aria-live="polite"
                data-font={Props.ReaderFont}
                data-tone={Props.ReaderTone}
                data-alignment={Props.ReaderAlignment}
                style={{
                    '--reader-font-size':
                        `${Props.ReaderFontSize}px`,
                } as CSSProperties}
            >
                {Props.IsEditing ? (
                    <div className={Styles.Editor}>
                        <div className={Styles.EditorTopBar}>
                            <strong>글 편집</strong>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={Props.DraftIsPrivate}
                                    disabled={Props.IsPostSaving}
                                    onChange={(Event) =>
                                        Props.OnChangeDraftIsPrivate(
                                            Event.currentTarget.checked,
                                        )
                                    }
                                />
                                비공개
                            </label>
                            <button
                                type="button"
                                disabled={Props.IsPostSaving}
                                onClick={Props.OnCloseEditor}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                className={Styles.EditorSaveButton}
                                disabled={Props.IsPostSaving}
                                onClick={() =>
                                    void Props.OnSaveEditor(
                                        EditorContentReference
                                            .current?.innerHTML
                                        ?? Props.DraftContentHtml,
                                    )
                                }
                            >
                                {Props.IsPostSaving ? '저장 중…' : '저장'}
                            </button>
                        </div>

                        <div className={Styles.EditorMeta}>
                            <textarea
                                className={Styles.EditorTitleInput}
                                value={Props.DraftTitle}
                                rows={1}
                                maxLength={160}
                                disabled={Props.IsPostSaving}
                                placeholder="제목"
                                aria-label="글 제목"
                                onChange={(Event) =>
                                    Props.OnChangeDraftTitle(
                                        Event.currentTarget.value,
                                    )
                                }
                            />
                            <textarea
                                className={Styles.EditorSummaryInput}
                                value={Props.DraftSummary}
                                rows={1}
                                maxLength={320}
                                disabled={Props.IsPostSaving}
                                placeholder="글을 소개하는 짧은 설명"
                                aria-label="글 요약"
                                onChange={(Event) =>
                                    Props.OnChangeDraftSummary(
                                        Event.currentTarget.value,
                                    )
                                }
                            />
                            <select
                                value={Props.DraftCategory}
                                disabled={Props.IsPostSaving}
                                aria-label="글 카테고리"
                                onChange={(Event) =>
                                    Props.OnChangeDraftCategory(
                                        Event.currentTarget.value,
                                    )
                                }
                            >
                                {Props.Categories.includes(
                                    Props.DraftCategory,
                                ) === false ? (
                                    <option value={Props.DraftCategory}>
                                        {Props.DraftCategory}
                                    </option>
                                ) : null}
                                {Props.Categories.map((Category) => (
                                    <option
                                        key={Category}
                                        value={Category}
                                    >
                                        {Category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div
                            className={Styles.EditorToolbar}
                            hidden
                            role="toolbar"
                            aria-label="글 서식"
                        >
                            <button
                                type="button"
                                aria-label="뒤로 되돌리기"
                                onMouseDown={(Event) =>
                                    Event.preventDefault()
                                }
                                onClick={() =>
                                    Props.OnExecuteEditorCommand('undo')
                                }
                            >
                                ↶
                            </button>
                            <button
                                type="button"
                                aria-label="앞으로 되돌리기"
                                onMouseDown={(Event) =>
                                    Event.preventDefault()
                                }
                                onClick={() =>
                                    Props.OnExecuteEditorCommand('redo')
                                }
                            >
                                ↷
                            </button>
                            <select
                                defaultValue="p"
                                aria-label="문단 종류"
                                onChange={(Event) =>
                                {
                                    Props.OnExecuteEditorCommand(
                                        'formatBlock',
                                        Event.currentTarget.value,
                                    );
                                    Event.currentTarget.value = 'p';
                                }}
                            >
                                <option value="p">본문</option>
                                <option value="h1">제목 1</option>
                                <option value="h2">제목 2</option>
                                <option value="h3">제목 3</option>
                            </select>
                            {[
                                ['bold', 'B', '굵게'],
                                ['italic', 'I', '기울기'],
                                ['underline', 'U', '밑줄'],
                                ['strikeThrough', 'S', '취소선'],
                            ].map(([Command, Label, Title]) => (
                                <button
                                    key={Command}
                                    type="button"
                                    aria-label={Title}
                                    data-command={Command}
                                    onMouseDown={(Event) =>
                                        Event.preventDefault()
                                    }
                                    onClick={() =>
                                        Props.OnExecuteEditorCommand(
                                            Command,
                                        )
                                    }
                                >
                                    {Label}
                                </button>
                            ))}
                            <label
                                className={Styles.EditorColor}
                                data-cursor-label="글 색상"
                            >
                                A
                                <input
                                    type="color"
                                    defaultValue="#111111"
                                    aria-label="글 색상"
                                    onChange={(Event) =>
                                        Props.OnExecuteEditorCommand(
                                            'foreColor',
                                            Event.currentTarget.value,
                                        )
                                    }
                                />
                            </label>
                            <button
                                type="button"
                                aria-label="인용"
                                onMouseDown={(Event) =>
                                    Event.preventDefault()
                                }
                                onClick={() =>
                                    Props.OnExecuteEditorCommand(
                                        'formatBlock',
                                        'blockquote',
                                    )
                                }
                            >
                                “
                            </button>
                            <button
                                type="button"
                                aria-label="글머리 기호"
                                onMouseDown={(Event) =>
                                    Event.preventDefault()
                                }
                                onClick={() =>
                                    Props.OnExecuteEditorCommand(
                                        'insertUnorderedList',
                                    )
                                }
                            >
                                • 목록
                            </button>
                            <button
                                type="button"
                                aria-label="번호 매기기"
                                onMouseDown={(Event) =>
                                    Event.preventDefault()
                                }
                                onClick={() =>
                                    Props.OnExecuteEditorCommand(
                                        'insertOrderedList',
                                    )
                                }
                            >
                                1. 목록
                            </button>
                            <div className={Styles.EditorInsert}>
                                <button
                                    type="button"
                                    aria-expanded={
                                        Props.IsEditorInsertOpen
                                    }
                                    onMouseDown={(Event) =>
                                        Event.preventDefault()
                                    }
                                    onClick={
                                        Props.OnToggleEditorInsert
                                    }
                                >
                                    ＋ 삽입
                                </button>
                                {Props.IsEditorInsertOpen ? (
                                    <div>
                                        <button
                                            type="button"
                                            onMouseDown={(Event) =>
                                                Event.preventDefault()
                                            }
                                            onClick={() =>
                                                ImageInputReference
                                                    .current?.click()
                                            }
                                        >
                                            이미지
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(Event) =>
                                                Event.preventDefault()
                                            }
                                            onClick={() =>
                                                FileInputReference
                                                    .current?.click()
                                            }
                                        >
                                            파일
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(Event) =>
                                                Event.preventDefault()
                                            }
                                            onClick={() =>
                                                VideoInputReference
                                                    .current?.click()
                                            }
                                        >
                                            영상
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(Event) =>
                                                Event.preventDefault()
                                            }
                                            onClick={
                                                Props
                                                    .OnInsertExternalLink
                                            }
                                        >
                                            링크
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(Event) =>
                                                Event.preventDefault()
                                            }
                                            onClick={() =>
                                            {
                                                Props
                                                    .OnExecuteEditorCommand(
                                                        'formatBlock',
                                                        'pre',
                                                    );
                                                Props
                                                    .OnToggleEditorInsert();
                                            }}
                                        >
                                            코드
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                            <input
                                ref={ImageInputReference}
                                className={Styles.EditorFileInput}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(Event) =>
                                {
                                    const Files = Array.from(
                                        Event.currentTarget.files ?? [],
                                    );
                                    if(Files.length > 0)
                                    {
                                        void Props.OnUploadEditorAssets(
                                            Files,
                                            EditorContentReference
                                                .current?.innerHTML
                                            ?? Props.DraftContentHtml,
                                        );
                                    }
                                    Event.currentTarget.value = '';
                                }}
                            />
                            <input
                                ref={FileInputReference}
                                className={Styles.EditorFileInput}
                                type="file"
                                multiple
                                onChange={(Event) =>
                                {
                                    const Files = Array.from(
                                        Event.currentTarget.files ?? [],
                                    );
                                    if(Files.length > 0)
                                    {
                                        void Props.OnUploadEditorAssets(
                                            Files,
                                            EditorContentReference
                                                .current?.innerHTML
                                            ?? Props.DraftContentHtml,
                                        );
                                    }
                                    Event.currentTarget.value = '';
                                }}
                            />
                            <input
                                ref={VideoInputReference}
                                className={Styles.EditorFileInput}
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={(Event) =>
                                {
                                    const Files = Array.from(
                                        Event.currentTarget.files ?? [],
                                    );
                                    if(Files.length > 0)
                                    {
                                        void Props.OnUploadEditorAssets(
                                            Files,
                                            EditorContentReference
                                                .current?.innerHTML
                                            ?? Props.DraftContentHtml,
                                        );
                                    }
                                    Event.currentTarget.value = '';
                                }}
                            />
                        </div>

                        {SlashMenuPosition !== null ? (
                            <div
                                ref={SlashMenuReference}
                                className={Styles.SlashMenu}
                                style={{
                                    left: SlashMenuPosition.Left,
                                    top: SlashMenuPosition.Top,
                                }}
                                role="menu"
                                aria-label="블록 종류 선택"
                            >
                                <p>기본 블록</p>
                                {VisibleSlashCommands.map((Item) => (
                                    <button
                                        key={Item.Label}
                                        type="button"
                                        role="menuitem"
                                        onMouseDown={(Event) =>
                                            Event.preventDefault()
                                        }
                                        onClick={() =>
                                            ApplySlashCommand(
                                                Item.Command,
                                                'Value' in Item
                                                    ? Item.Value
                                                    : undefined,
                                            )
                                        }
                                    >
                                        <span>
                                            {Item.Command
                                                === 'insertUnorderedList'
                                                ? '• ─\n• ─'
                                                : Item.Command
                                                    === 'insertOrderedList'
                                                    ? '1 ─\n2 ─'
                                                    : Item.Label === '제목 1'
                                                ? 'H1'
                                                : Item.Label === '제목 2'
                                                    ? 'H2'
                                                    : Item.Label === '제목 3'
                                                        ? 'H3'
                                                        : Item.Label
                                                            .slice(0, 1)}
                                        </span>
                                        <span>
                                            <strong>
                                                {Item.Label}
                                            </strong>
                                            <small>
                                                {Item.Description}
                                            </small>
                                        </span>
                                    </button>
                                ))}
                                {VisibleSlashCommands.length === 0 ? (
                                    <p>검색 결과가 없습니다.</p>
                                ) : null}
                            </div>
                        ) : null}

                        {SelectionMenuPosition !== null ? (
                            <div
                                className={Styles.SelectionMenu}
                                style={{
                                    left:
                                        SelectionMenuPosition.Left,
                                    top:
                                        SelectionMenuPosition.Top,
                                }}
                                role="toolbar"
                                aria-label="선택한 텍스트 서식"
                                onPointerDownCapture={() =>
                                {
                                    IsSelectionMenuInteractingReference
                                        .current = true;
                                }}
                            >
                                <select
                                    defaultValue="p"
                                    aria-label="선택 텍스트 종류"
                                    onChange={(Event) =>
                                        ApplySelectionCommand(
                                            'formatBlock',
                                            Event.currentTarget.value,
                                        )
                                    }
                                >
                                    <option value="p">본문</option>
                                    <option value="h1">제목 1</option>
                                    <option value="h2">제목 2</option>
                                    <option value="h3">제목 3</option>
                                    <option value="blockquote">
                                        인용
                                    </option>
                                    <option value="pre">코드</option>
                                </select>
                                {[
                                    ['bold', 'B'],
                                    ['italic', 'I'],
                                    ['underline', 'U'],
                                    ['strikeThrough', 'S'],
                                ].map(([Command, Label]) => (
                                    <button
                                        key={Command}
                                        type="button"
                                        data-command={Command}
                                        onMouseDown={(Event) =>
                                            Event.preventDefault()
                                        }
                                        onClick={() =>
                                            ApplySelectionCommand(
                                                Command,
                                            )
                                        }
                                    >
                                        {Label}
                                    </button>
                                ))}
                                <label data-cursor-label="글 색상">
                                    A
                                    <input
                                        type="color"
                                        defaultValue="#111111"
                                        aria-label="선택 텍스트 색상"
                                        onChange={(Event) =>
                                            ApplySelectionCommand(
                                                'foreColor',
                                                Event.currentTarget
                                                    .value,
                                            )
                                        }
                                    />
                                </label>
                                <button
                                    type="button"
                                    aria-label="링크"
                                    onMouseDown={(Event) =>
                                        Event.preventDefault()
                                    }
                                    onClick={() =>
                                    {
                                        RestoreRange(
                                            SelectionRangeReference
                                                .current,
                                        );
                                        Props.OnInsertExternalLink();
                                    }}
                                >
                                    🔗
                                </button>
                            </div>
                        ) : null}

                        {MediaMenuPosition !== null ? (
                            <div
                                className={Styles.MediaMenu}
                                style={{
                                    left: MediaMenuPosition.Left,
                                    top: MediaMenuPosition.Top,
                                }}
                                role="toolbar"
                                aria-label="미디어 정렬"
                            >
                                {[
                                    ['left', '왼쪽'],
                                    ['center', '가운데'],
                                    ['right', '오른쪽'],
                                ].map(([Alignment, Label]) => (
                                    <button
                                        key={Alignment}
                                        type="button"
                                        data-active={
                                            MediaMenuPosition
                                                .Alignment
                                            === Alignment
                                        }
                                        onMouseDown={(Event) =>
                                            Event.preventDefault()
                                        }
                                        onClick={() =>
                                            ApplyMediaAlignment(
                                                Alignment as
                                                    | 'left'
                                                    | 'center'
                                                    | 'right',
                                            )
                                        }
                                    >
                                        {Label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onMouseDown={(Event) =>
                                        Event.preventDefault()
                                    }
                                    onClick={ApplyMediaSideBySide}
                                >
                                    나란히
                                </button>
                                {MediaMenuPosition.IsSideBySide ? (
                                    <select
                                        value={MediaMenuPosition.Gap}
                                        aria-label="미디어 사이 간격"
                                        onChange={(Event) =>
                                            ApplyMediaGap(
                                                Event.currentTarget
                                                    .value,
                                            )
                                        }
                                    >
                                        <option value="none">
                                            간격 없음
                                        </option>
                                        <option value="tight">
                                            간격 좁게
                                        </option>
                                        <option value="normal">
                                            간격 보통
                                        </option>
                                    </select>
                                ) : null}
                            </div>
                        ) : null}

                        {MediaDropPosition !== null ? (
                            <div
                                className={Styles.MediaDropIndicator}
                                data-side={MediaDropPosition.Side}
                                style={{
                                    height: MediaDropPosition.Height,
                                    left: MediaDropPosition.Left,
                                    top: MediaDropPosition.Top,
                                    width: MediaDropPosition.Width,
                                }}
                                aria-hidden="true"
                            >
                                <span>
                                    {MediaDropPosition.Side === 'block'
                                        ? '새 줄에 배치'
                                        : MediaDropPosition.Side === 'left'
                                            ? '왼쪽에 배치'
                                            : '오른쪽에 배치'}
                                </span>
                            </div>
                        ) : null}

                        <div
                            ref={EditorContentReference}
                            key={Props.ActiveArticle.Id}
                            className={Styles.EditorContent}
                            contentEditable={!Props.IsPostSaving}
                            suppressContentEditableWarning
                            dangerouslySetInnerHTML={EditorContentMarkup}
                            onFocus={() =>
                                Props.OnExecuteEditorCommand(
                                    'defaultParagraphSeparator',
                                    'p',
                                )
                            }
                            onInput={(Event) =>
                            {
                                if(
                                    Event.nativeEvent
                                        instanceof InputEvent
                                    && Event.nativeEvent.data === '-'
                                    && ApplyBlockShortcut([
                                        'insertHorizontalRule',
                                    ])
                                )
                                {
                                    return;
                                }

                                ScheduleEditorMenuUpdate(
                                    SlashMenuPosition !== null
                                    || (
                                        Event.nativeEvent
                                            instanceof InputEvent
                                        && Event.nativeEvent.data === '/'
                                    ),
                                );
                            }}
                            onSelect={() =>
                                ScheduleEditorMenuUpdate()
                            }
                            onPointerUp={(Event) =>
                            {
                                const Resize =
                                    MediaResizeReference.current;

                                if(Resize !== null)
                                {
                                    Resize.Figure.draggable = true;

                                    if(Resize.Sibling !== null)
                                    {
                                        Resize.Sibling.draggable = true;
                                    }
                                }

                                MediaResizeReference.current = null;

                                if(
                                    Event.currentTarget
                                        .hasPointerCapture(
                                            Event.pointerId,
                                        )
                                )
                                {
                                    Event.currentTarget
                                        .releasePointerCapture(
                                            Event.pointerId,
                                        );
                                }

                                ScheduleEditorMenuUpdate();
                            }}
                            onPointerDownCapture={(Event) =>
                            {
                                IsSelectionMenuInteractingReference
                                    .current = false;
                                const Figure = (
                                    Event.target as HTMLElement
                                ).closest<HTMLElement>(
                                    'figure[data-selected="true"]',
                                );

                                if(Figure === null)
                                {
                                    return;
                                }

                                const Bounds =
                                    Figure.getBoundingClientRect();
                                const Direction =
                                    Math.abs(
                                        Event.clientX - Bounds.left,
                                    ) <= 12
                                        ? -1
                                        : Math.abs(
                                            Event.clientX
                                            - Bounds.right,
                                        ) <= 12
                                            ? 1
                                            : null;

                                if(Direction === null)
                                {
                                    return;
                                }

                                Event.preventDefault();
                                Figure.draggable = false;
                                Event.currentTarget.setPointerCapture(
                                    Event.pointerId,
                                );
                                const Adjacent =
                                    GetAdjacentFigure(
                                        Figure,
                                        Direction,
                                    );
                                const Sibling =
                                    Adjacent !== null
                                    && Math.abs(
                                        Adjacent
                                            .getBoundingClientRect()
                                            .top
                                        - Bounds.top,
                                    ) < 8
                                        ? Adjacent
                                        : null;

                                if(Sibling !== null)
                                {
                                    Sibling.draggable = false;
                                }

                                MediaResizeReference.current = {
                                    Figure,
                                    Sibling,
                                    StartX: Event.clientX,
                                    StartWidth: Bounds.width,
                                    SiblingStartWidth:
                                        Sibling
                                            ?.getBoundingClientRect()
                                            .width
                                        ?? 0,
                                    Direction,
                                };
                            }}
                            onPointerMove={(Event) =>
                            {
                                const Resize =
                                    MediaResizeReference.current;

                                if(Resize === null)
                                {
                                    return;
                                }

                                const NextWidth = Math.max(
                                    180,
                                    Math.min(
                                        Resize.Sibling === null
                                            ? Event.currentTarget
                                                .clientWidth
                                            : Resize.StartWidth
                                                + Resize
                                                    .SiblingStartWidth
                                                - 180,
                                        Resize.StartWidth
                                        + (
                                            Event.clientX
                                            - Resize.StartX
                                        ) * Resize.Direction,
                                    ),
                                );

                                Resize.Figure.style.width =
                                    `${NextWidth}px`;

                                if(Resize.Sibling !== null)
                                {
                                    Resize.Sibling.style.width =
                                        `${
                                            Resize.StartWidth
                                            + Resize.SiblingStartWidth
                                            - NextWidth
                                        }px`;
                                }

                                PositionMediaMenu(Resize.Figure);
                            }}
                            onPointerCancel={() =>
                            {
                                const Resize =
                                    MediaResizeReference.current;

                                if(Resize !== null)
                                {
                                    Resize.Figure.draggable = true;

                                    if(Resize.Sibling !== null)
                                    {
                                        Resize.Sibling.draggable = true;
                                    }
                                }

                                MediaResizeReference.current = null;
                            }}
                            onPointerOver={(Event) =>
                            {
                                const Figure = (
                                    Event.target as HTMLElement
                                ).closest<HTMLElement>('figure');

                                if(
                                    Figure !== null
                                    && Event.currentTarget.contains(
                                        Figure,
                                    )
                                )
                                {
                                    Figure.draggable = true;
                                }
                            }}
                            onKeyUp={() =>
                                ScheduleEditorMenuUpdate()
                            }
                            onDragStart={(Event) =>
                            {
                                const Figure = (
                                    Event.target as HTMLElement
                                ).closest<HTMLElement>('figure');

                                if(
                                    Figure === null
                                    || Event.currentTarget.contains(
                                        Figure,
                                    ) === false
                                )
                                {
                                    return;
                                }

                                DraggedMediaReference.current =
                                    Figure;
                                Event.dataTransfer.effectAllowed =
                                    'move';
                                Event.dataTransfer.setData(
                                    'text/plain',
                                    'writing-media',
                                );
                            }}
                            onDragEnd={ClearMediaDrop}
                            onDragOver={(Event) =>
                            {
                                const Dragged =
                                    DraggedMediaReference.current;
                                const Target = (
                                    Event.target as HTMLElement
                                ).closest<HTMLElement>('figure');

                                if(
                                    Dragged !== null
                                    && Target !== null
                                    && Target !== Dragged
                                    && Event.currentTarget.contains(
                                        Target,
                                    )
                                )
                                {
                                    Event.preventDefault();
                                    Event.dataTransfer.dropEffect =
                                        'move';
                                    const Bounds =
                                        Target.getBoundingClientRect();
                                    const Side =
                                        Event.clientX
                                        < Bounds.left
                                            + Bounds.width / 2
                                            ? 'left'
                                            : 'right';

                                    MediaDropReference.current = {
                                        Before: null,
                                        Target,
                                        Side,
                                    };
                                    SetMediaDropPosition({
                                        Height: Bounds.height,
                                        Left: Side === 'left'
                                            ? Bounds.left
                                            : Bounds.right,
                                        Side,
                                        Top: Bounds.top,
                                        Width: 0,
                                    });
                                    return;
                                }

                                if(Dragged !== null)
                                {
                                    Event.preventDefault();
                                    Event.dataTransfer.dropEffect =
                                        'move';
                                    const Editor =
                                        Event.currentTarget;
                                    const Before = Array.from(
                                        Editor.children,
                                    ).find((Element) =>
                                        Element !== Dragged
                                        && Event.clientY
                                            < Element
                                                .getBoundingClientRect()
                                                .top
                                                + Element
                                                    .getBoundingClientRect()
                                                    .height / 2
                                    ) ?? null;
                                    const EditorBounds =
                                        Editor.getBoundingClientRect();
                                    const Top = Before === null
                                        ? Math.min(
                                            EditorBounds.bottom,
                                            Event.clientY,
                                        )
                                        : Before
                                            .getBoundingClientRect()
                                            .top;

                                    MediaDropReference.current = {
                                        Before,
                                        Target: null,
                                        Side: 'block',
                                    };
                                    SetMediaDropPosition({
                                        Height: 0,
                                        Left: EditorBounds.left,
                                        Side: 'block',
                                        Top,
                                        Width: EditorBounds.width,
                                    });
                                    return;
                                }

                                if(
                                    Event.dataTransfer.types.includes(
                                        'Files',
                                    )
                                )
                                {
                                    Event.preventDefault();
                                    Event.dataTransfer.dropEffect =
                                        'copy';
                                    const Editor = Event.currentTarget;
                                    let Indicator =
                                        DropIndicatorReference.current;

                                    if(
                                        Indicator === null
                                        || Indicator.isConnected === false
                                    )
                                    {
                                        Indicator =
                                            document.createElement('hr');
                                        Indicator.setAttribute(
                                            'data-editor-drop-target',
                                            'true',
                                        );
                                        DropIndicatorReference.current =
                                            Indicator;
                                    }

                                    const Target = Array.from(
                                        Editor.children,
                                    ).find((Element) =>
                                        Element !== Indicator
                                        && Event.clientY
                                            < Element
                                                .getBoundingClientRect()
                                                .top
                                                + Element
                                                    .getBoundingClientRect()
                                                    .height / 2
                                    );

                                    Editor.insertBefore(
                                        Indicator,
                                        Target ?? null,
                                    );
                                }
                            }}
                            onDragLeave={(Event) =>
                            {
                                if(
                                    Event.relatedTarget instanceof Node
                                    && Event.currentTarget.contains(
                                        Event.relatedTarget,
                                    )
                                )
                                {
                                    return;
                                }

                                DropIndicatorReference.current?.remove();
                                DropIndicatorReference.current = null;
                                ClearMediaDrop();
                            }}
                            onDrop={(Event) =>
                            {
                                const Dragged =
                                    DraggedMediaReference.current;
                                const Placement =
                                    MediaDropReference.current;

                                if(
                                    Dragged !== null
                                    && Placement !== null
                                )
                                {
                                    Event.preventDefault();
                                    DetachMediaFromRow(Dragged);

                                    if(Placement.Side === 'block')
                                    {
                                        if(Placement.Before === null)
                                        {
                                            Event.currentTarget.append(
                                                Dragged,
                                            );
                                        }
                                        else
                                        {
                                            Placement.Before.before(
                                                Dragged,
                                            );
                                        }

                                        Dragged.dataset.align = 'left';
                                    }
                                    else if(
                                        Placement.Target !== null
                                        && Placement.Side === 'left'
                                    )
                                    {
                                        Placement.Target.before(
                                            Dragged,
                                        );
                                    }
                                    else if(Placement.Target !== null)
                                    {
                                        Placement.Target.after(
                                            Dragged,
                                        );
                                    }

                                    if(Placement.Target !== null)
                                    {
                                        [
                                            Dragged,
                                            Placement.Target,
                                        ].forEach((Media) =>
                                        {
                                            Media.removeAttribute(
                                                'data-align',
                                            );
                                            Media.dataset.gap =
                                                'tight';
                                            Media.style.width = '48%';
                                        });
                                    }

                                    PositionMediaMenu(Dragged);
                                    ClearMediaDrop();
                                    return;
                                }

                                const Files = Array.from(
                                    Event.dataTransfer.files,
                                );

                                if(Files.length === 0)
                                {
                                    return;
                                }

                                Event.preventDefault();
                                const Editor = Event.currentTarget;

                                if(
                                    DropIndicatorReference.current
                                        === null
                                )
                                {
                                    Editor.insertAdjacentHTML(
                                        'beforeend',
                                        WritingEditorDropMarkerHtml,
                                    );
                                    DropIndicatorReference.current =
                                        Editor.querySelector(
                                            '[data-editor-drop-target]',
                                        );
                                }

                                void Props.OnUploadEditorAssets(
                                    Files,
                                    Editor.innerHTML,
                                ).finally(() =>
                                {
                                    DropIndicatorReference.current
                                        ?.remove();
                                    DropIndicatorReference.current = null;
                                });
                            }}
                            onClick={(Event) =>
                            {
                                const Editor = Event.currentTarget;
                                const Media = (
                                    Event.target as HTMLElement
                                ).closest('figure');

                                Editor.querySelectorAll(
                                    'figure[data-selected]',
                                ).forEach((Element) =>
                                    Element.removeAttribute(
                                        'data-selected',
                                    )
                                );

                                if(
                                    Media !== null
                                    && Editor.contains(Media)
                                )
                                {
                                    Media.setAttribute(
                                        'data-selected',
                                        'true',
                                    );
                                    PositionMediaMenu(
                                        Media as HTMLElement,
                                    );
                                }
                                else
                                {
                                    SetMediaMenuPosition(null);
                                }
                            }}
                            onKeyDown={(Event) =>
                            {
                                IsSelectionMenuInteractingReference
                                    .current = false;

                                if(Event.nativeEvent.isComposing)
                                {
                                    return;
                                }

                                if(Event.key === 'Escape')
                                {
                                    SetSlashMenuPosition(null);
                                    SetSelectionMenuPosition(null);
                                    SetMediaMenuPosition(null);
                                    return;
                                }

                                if(Event.key === 'Tab')
                                {
                                    const Selection =
                                        window.getSelection();
                                    const RangeValue =
                                        Selection !== null
                                        && Selection.rangeCount > 0
                                            ? Selection.getRangeAt(0)
                                            : null;
                                    const StartElement =
                                        RangeValue?.startContainer
                                            instanceof Element
                                            ? RangeValue.startContainer
                                            : RangeValue?.startContainer
                                                .parentElement;
                                    const ListItem =
                                        StartElement?.closest('li');

                                    if(
                                        ListItem !== null
                                        && ListItem !== undefined
                                        && Event.currentTarget.contains(
                                            ListItem,
                                        )
                                    )
                                    {
                                        Event.preventDefault();
                                        Props.OnExecuteEditorCommand(
                                            Event.shiftKey
                                                ? 'outdent'
                                                : 'indent',
                                        );
                                        ScheduleEditorMenuUpdate();
                                    }

                                    return;
                                }

                                if(
                                    Event.key === ' '
                                    && ApplyBlockShortcut([
                                        'insertUnorderedList',
                                        'insertOrderedList',
                                    ])
                                )
                                {
                                    Event.preventDefault();
                                    ScheduleEditorMenuUpdate();
                                    return;
                                }

                                if(Event.key === 'Enter')
                                {
                                    Event.preventDefault();

                                    if(
                                        SlashMenuPosition !== null
                                        && VisibleSlashCommands.length > 0
                                    )
                                    {
                                        const Item =
                                            VisibleSlashCommands[0];

                                        ApplySlashCommand(
                                            Item.Command,
                                            'Value' in Item
                                                ? Item.Value
                                                : undefined,
                                        );
                                        return;
                                    }

                                    const Selection =
                                        window.getSelection();
                                    const RangeValue =
                                        Selection !== null
                                        && Selection.rangeCount > 0
                                            ? Selection.getRangeAt(0)
                                            : null;
                                    const StartElement =
                                        RangeValue?.startContainer
                                            instanceof Element
                                            ? RangeValue.startContainer
                                            : RangeValue?.startContainer
                                                .parentElement;
                                    const SpecialBlock =
                                        StartElement?.closest(
                                            'blockquote,pre',
                                        ) ?? null;
                                    const EnterBehavior =
                                        GetWritingEnterBehavior(
                                            SpecialBlock?.tagName
                                                ?? null,
                                            Event.shiftKey,
                                        );

                                    Props.OnExecuteEditorCommand(
                                        EnterBehavior.Command,
                                    );

                                    if(
                                        EnterBehavior.ShouldExitBlock
                                        && SpecialBlock !== null
                                    )
                                    {
                                        Props.OnExecuteEditorCommand(
                                            'formatBlock',
                                            'p',
                                        );

                                        if(SpecialBlock.tagName === 'PRE')
                                        {
                                            const CurrentSelection =
                                                window.getSelection();
                                            const CurrentContainer =
                                                CurrentSelection !== null
                                                && CurrentSelection
                                                    .rangeCount > 0
                                                    ? CurrentSelection
                                                        .getRangeAt(0)
                                                        .startContainer
                                                    : null;
                                            const CurrentElement =
                                                CurrentContainer
                                                    instanceof Element
                                                    ? CurrentContainer
                                                    : CurrentContainer
                                                        ?.parentElement;
                                            const Paragraph =
                                                CurrentElement?.closest(
                                                    'p',
                                                );

                                            if(
                                                Paragraph !== null
                                                && Paragraph !== undefined
                                                && SpecialBlock.contains(
                                                    Paragraph,
                                                )
                                            )
                                            {
                                                SpecialBlock.after(
                                                    Paragraph,
                                                );
                                            }
                                        }
                                    }

                                    SetSlashMenuPosition(null);
                                    SetSelectionMenuPosition(null);
                                    ScheduleEditorMenuUpdate();
                                    return;
                                }

                                if(
                                    Event.key !== 'Delete'
                                    && Event.key !== 'Backspace'
                                )
                                {
                                    return;
                                }

                                const Media =
                                    Event.currentTarget
                                        .querySelector(
                                            'figure[data-selected]',
                                        );

                                if(Media !== null)
                                {
                                    Event.preventDefault();
                                    Media.remove();
                                    SetMediaMenuPosition(null);
                                }
                            }}
                        />
                        {Props.EditorNotice ? (
                            <p
                                className={Styles.EditorNotice}
                                role="status"
                            >
                                {Props.EditorNotice}
                            </p>
                        ) : null}
                    </div>
                ) : (
                    <div className={Styles.ReaderInner}>
                        {Props.IsAuthenticated ? (
                            <button
                                type="button"
                                className={Styles.EditorOpenButton}
                                onClick={Props.OnOpenEditor}
                            >
                                글 편집
                            </button>
                        ) : null}
                        <header>
                            <p>{Props.ActiveArticle.Category}</p>
                            <h2>{Props.ActiveArticle.Title}</h2>
                            <p>{Props.ActiveArticle.Summary}</p>
                            <div>
                                <span>{Props.ActiveArticle.Date}</span>
                                <span>
                                    {Props.ActiveArticle.ReadTime}
                                </span>
                            </div>
                        </header>
                        <div className={Styles.ArticleBody}>
                            {Props.ActiveArticle.ContentHtml !==
                            undefined ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            Props.ActiveArticle
                                                .ContentHtml,
                                    }}
                                />
                            ) : Props.ActiveArticle.Body.map(
                                (Paragraph) => (
                                    <p key={Paragraph}>
                                        {Paragraph}
                                    </p>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </article>

            {!Props.IsEditing ? (
                <aside className={Styles.ViewColumn}>
                <button
                    type="button"
                    className={Styles.ViewSettingsToggle}
                    onClick={Props.OnToggleViewSettings}
                    aria-expanded={Props.IsViewSettingsOpen}
                >
                    보기설정 {Props.IsViewSettingsOpen ? '⌃' : '⌄'}
                </button>
                {Props.IsViewSettingsOpen ? (
                    <div className={Styles.ViewSettings}>
                        <div
                            className={Styles.FontOptions}
                            role="group"
                            aria-label="본문 글꼴"
                        >
                            {ReaderFonts.map((Font) => (
                                <button
                                    key={Font.Value}
                                    type="button"
                                    className={
                                        Props.ReaderFont === Font.Value
                                            ? Styles.OptionActive
                                            : ''
                                    }
                                    onClick={() =>
                                        Props.OnChangeReaderFont(
                                            Font.Value,
                                        )
                                    }
                                >
                                    {Font.Label}
                                </button>
                            ))}
                        </div>
                        <div
                            className={Styles.SizeOptions}
                            role="group"
                            aria-label="본문 글자 크기"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    Props.OnChangeReaderFontSize(-1)
                                }
                                disabled={Props.ReaderFontSize === 15}
                                aria-label="글자 작게"
                            >
                                −
                            </button>
                            <strong>가</strong>
                            <button
                                type="button"
                                onClick={() =>
                                    Props.OnChangeReaderFontSize(1)
                                }
                                disabled={Props.ReaderFontSize === 22}
                                aria-label="글자 크게"
                            >
                                ＋
                            </button>
                        </div>
                        <div
                            className={Styles.ToneOptions}
                            role="group"
                            aria-label="본문 배경색"
                        >
                            {(['light', 'paper', 'dark'] as const)
                                .map((Tone) => (
                                    <button
                                        key={Tone}
                                        type="button"
                                        data-tone={Tone}
                                        className={
                                            Props.ReaderTone === Tone
                                                ? Styles.OptionActive
                                                : ''
                                        }
                                        onClick={() =>
                                            Props.OnChangeReaderTone(Tone)
                                        }
                                        aria-label={
                                            Tone === 'light'
                                                ? '흰색 배경'
                                                : Tone === 'paper'
                                                    ? '종이색 배경'
                                                    : '검은색 배경'
                                        }
                                    />
                                ))}
                        </div>
                        <div
                            className={Styles.AlignmentOptions}
                            role="group"
                            aria-label="본문 정렬"
                        >
                            <button
                                type="button"
                                className={
                                    Props.ReaderAlignment === 'left'
                                        ? Styles.OptionActive
                                        : ''
                                }
                                onClick={() =>
                                    Props.OnChangeReaderAlignment('left')
                                }
                                aria-label="왼쪽 정렬"
                            >
                                ≡
                            </button>
                            <button
                                type="button"
                                className={
                                    Props.ReaderAlignment === 'justify'
                                        ? Styles.OptionActive
                                        : ''
                                }
                                onClick={() =>
                                    Props.OnChangeReaderAlignment(
                                        'justify',
                                    )
                                }
                                aria-label="양쪽 정렬"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                ) : null}
                </aside>
            ) : null}
        </section>
    );
}
