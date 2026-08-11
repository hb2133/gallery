'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { UseAuthSession } from '@/app/shell/AuthSessionProvider';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import { RenameArchiveCategory } from '@/managers/ArchiveCategoryManager';
import {
    LoadWritingPageCategories,
    SaveWritingArticleOrder,
    SaveWritingPageCategories,
} from '@/managers/WritingPageCategoryManager';
import {
    LoadWritingPosts,
    SaveWritingPost,
    UploadWritingCover,
    type WritingSavedPost,
} from '@/managers/WritingPostManager';
import {
    DefaultWritingReaderPreferences,
    SaveWritingReaderPreferences,
} from '@/managers/WritingReaderPreferenceManager';
import type { WritingPostDraft } from '@/panels/layered/WritingPostEditorLayeredPanel/WritingPostEditorLayeredPanel';
import { WritingArticles } from './WritingBasePanelState';
import type {
    WritingArticle,
    WritingReaderAlignment,
    WritingReaderFont,
    WritingReaderTone,
    WritingViewMode,
} from './WritingBasePanelTypes';

const ArticlesPerPage = 7;

function FindReaderMatches(Article: WritingArticle | null, Query: string)
{
    const NormalizedQuery = Query.trim().toLocaleLowerCase('ko-KR');

    if(Article === null || NormalizedQuery === '')
    {
        return [];
    }

    return Article.Pages.flatMap((Page, PageIndex) =>
    {
        const Text = [Page.Heading, ...Page.Paragraphs]
            .join(' ')
            .toLocaleLowerCase('ko-KR');
        const Matches = [];
        let Offset = 0;

        while((Offset = Text.indexOf(NormalizedQuery, Offset)) >= 0)
        {
            Matches.push({ PageIndex, Offset });
            Offset += Math.max(1, NormalizedQuery.length);
        }

        return Matches;
    });
}

export function useWritingBasePanelController()
{
    const InitialState = UseInitialAppState();
    const { IsAuthenticated } = UseAuthSession();
    const [SavedPosts, SetSavedPosts] = useState<WritingSavedPost[]>(
        InitialState.WritingPosts,
    );
    const [Categories, SetCategories] = useState([
        '전체',
        ...InitialState.WritingPageCategories,
    ]);
    const [ActiveCategory, SetActiveCategory] = useState('전체');
    const [SearchQuery, SetSearchQuery] = useState('');
    const [ArchivePage, SetArchivePage] = useState(1);
    const [PreviewArticleId, SetPreviewArticleId] =
        useState<string | null>(null);
    const [ReaderArticleId, SetReaderArticleId] =
        useState<string | null>(null);
    const [ReaderPage, SetReaderPage] = useState(0);
    const [ViewMode, SetViewMode] = useState<WritingViewMode>(
        InitialState.WritingReaderPreferences.ViewMode,
    );
    const [IsContentsOpen, SetIsContentsOpen] = useState(false);
    const [IsViewMenuOpen, SetIsViewMenuOpen] = useState(false);
    const [IsSettingsOpen, SetIsSettingsOpen] = useState(false);
    const [IsReaderSearchOpen, SetIsReaderSearchOpen] = useState(false);
    const [ReaderSearchQuery, SetReaderSearchQuery] = useState('');
    const [ReaderSearchMatchIndex, SetReaderSearchMatchIndex] = useState(0);
    const [ReaderFont, SetReaderFont] = useState<WritingReaderFont>(
        InitialState.WritingReaderPreferences.Font,
    );
    const [ReaderTone, SetReaderTone] = useState<WritingReaderTone>(
        InitialState.WritingReaderPreferences.Tone,
    );
    const [ReaderAlignment, SetReaderAlignment] =
        useState<WritingReaderAlignment>(
            InitialState.WritingReaderPreferences.Alignment,
        );
    const [ReaderFontSize, SetReaderFontSize] = useState(
        InitialState.WritingReaderPreferences.FontSize,
    );
    const [ReaderLineHeight, SetReaderLineHeight] = useState(
        InitialState.WritingReaderPreferences.LineHeight,
    );
    const [ReaderParagraphGap, SetReaderParagraphGap] = useState(
        InitialState.WritingReaderPreferences.ParagraphGap,
    );
    const [ReaderPadding, SetReaderPadding] = useState(
        InitialState.WritingReaderPreferences.Padding,
    );
    const [ReaderVerticalPadding, SetReaderVerticalPadding] = useState(
        InitialState.WritingReaderPreferences.VerticalPadding,
    );
    const [IsIndented, SetIsIndented] = useState(
        InitialState.WritingReaderPreferences.IsIndented,
    );
    const [ReaderSettingsNotice, SetReaderSettingsNotice] = useState('');
    const [IsCategoryEditorOpen, SetIsCategoryEditorOpen] = useState(false);
    const [IsCategorySaving, SetIsCategorySaving] = useState(false);
    const [NewCategoryName, SetNewCategoryName] = useState('');
    const [CategoryNotice, SetCategoryNotice] = useState('');
    const [IsPostEditorOpen, SetIsPostEditorOpen] = useState(false);
    const [EditingArticleId, SetEditingArticleId] =
        useState<string | null>(null);
    const [IsPostSaving, SetIsPostSaving] = useState(false);
    const [PostEditorNotice, SetPostEditorNotice] = useState('');
    const [ArticleOrder, SetArticleOrder] = useState(
        InitialState.WritingArticleOrder,
    );
    const [DraggedArticleId, SetDraggedArticleId] =
        useState<string | null>(null);
    const [IsArticleOrderSaving, SetIsArticleOrderSaving] = useState(false);
    const [ArticleOrderNotice, SetArticleOrderNotice] = useState('');
    const ArticleOrderBeforeDragReference = useRef<string[]>([]);
    const DraggedArticleOrderReference = useRef<string[]>([]);

    const EditableCategories = Categories.slice(1);
    const AllArticles = useMemo<WritingArticle[]>(() =>
    {
        const AvailableCategories = Categories.slice(1);
        const FallbackCategory = AvailableCategories[0] ?? '생각';
        const MapCategory = (Category: string) =>
            AvailableCategories.includes(Category)
                ? Category
                : FallbackCategory;
        const StaticArticles = WritingArticles.map((Article) =>
        {
            const Saved = SavedPosts.find((Post) => Post.Id === Article.Id);
            const Resolved = Saved ?? Article;

            return {
                ...Resolved,
                Category: MapCategory(Resolved.Category),
            };
        });
        const AddedArticles = SavedPosts
            .filter((Post) => WritingArticles.some(
                (Article) => Article.Id === Post.Id,
            ) === false)
            .map((Post) => ({
                ...Post,
                Category: MapCategory(Post.Category),
            }));

        const OrderIndexes = new Map(
            ArticleOrder.map((Id, Index) => [Id, Index]),
        );

        return [...StaticArticles, ...AddedArticles].filter((Article) =>
        {
            const Saved = SavedPosts.find((Post) => Post.Id === Article.Id);
            return Saved?.IsPrivate !== true || IsAuthenticated;
        }).sort((Left, Right) =>
            (OrderIndexes.get(Left.Id) ?? Number.MAX_SAFE_INTEGER)
            - (OrderIndexes.get(Right.Id) ?? Number.MAX_SAFE_INTEGER),
        );
    }, [ArticleOrder, Categories, IsAuthenticated, SavedPosts]);
    const FilteredArticles = useMemo(() =>
    {
        const Query = SearchQuery.trim().toLocaleLowerCase('ko-KR');

        return AllArticles.filter((Article) =>
            (ActiveCategory === '전체'
                || Article.Category === ActiveCategory)
            && (Query === ''
                || `${Article.Title} ${Article.Summary}`
                    .toLocaleLowerCase('ko-KR')
                    .includes(Query)),
        );
    }, [ActiveCategory, AllArticles, SearchQuery]);
    const ArchivePages = Math.max(
        1,
        Math.ceil(FilteredArticles.length / ArticlesPerPage),
    );
    const VisibleArticles = FilteredArticles.slice(
        (ArchivePage - 1) * ArticlesPerPage,
        ArchivePage * ArticlesPerPage,
    );
    const ReaderArticle = AllArticles.find(
        (Article) => Article.Id === ReaderArticleId,
    ) ?? null;
    const EditingArticle = AllArticles.find(
        (Article) => Article.Id === EditingArticleId,
    ) ?? null;
    const VisiblePageCount = ViewMode === 'spread' ? 2 : 1;
    const MaximumReaderPage = Math.max(
        0,
        (ReaderArticle?.Pages.length ?? 1) - VisiblePageCount,
    );
    const ReaderSearchMatches = useMemo(
        () => FindReaderMatches(ReaderArticle, ReaderSearchQuery),
        [ReaderArticle, ReaderSearchQuery],
    );

    useEffect(() =>
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        let IsMounted = true;

        void Promise.all([
            LoadWritingPosts(),
            LoadWritingPageCategories(),
        ]).then(([Posts, LoadedCategories]) =>
        {
            if(IsMounted)
            {
                SetSavedPosts(Posts);
                SetCategories(['전체', ...LoadedCategories]);
            }
        }).catch(() => undefined);

        return () =>
        {
            IsMounted = false;
        };
    }, [IsAuthenticated]);

    useEffect(() =>
    {
        function HandleKeyboard(Event: KeyboardEvent)
        {
            if(ReaderArticleId === null)
            {
                return;
            }

            if(Event.key === 'Escape')
            {
                SetReaderArticleId(null);
            }
            else if(Event.key === 'ArrowLeft')
            {
                SetReaderPage((Current) => Math.max(0, Current - 1));
            }
            else if(Event.key === 'ArrowRight')
            {
                SetReaderPage((Current) =>
                    Math.min(MaximumReaderPage, Current + 1),
                );
            }
        }

        window.addEventListener('keydown', HandleKeyboard);
        return () => window.removeEventListener('keydown', HandleKeyboard);
    }, [MaximumReaderPage, ReaderArticleId]);

    function OpenArticle(ArticleId: string)
    {
        SetReaderArticleId(ArticleId);
        SetReaderPage(0);
        SetIsContentsOpen(false);
        SetIsViewMenuOpen(false);
        SetIsSettingsOpen(false);
        SetIsReaderSearchOpen(false);
        SetReaderSearchQuery('');
        SetReaderSearchMatchIndex(0);
    }

    function ChangeCategory(Category: string)
    {
        SetActiveCategory(Category);
        SetArchivePage(1);
        SetPreviewArticleId(null);
    }

    function ChangeSearchQuery(Query: string)
    {
        SetSearchQuery(Query);
        SetArchivePage(1);
        SetPreviewArticleId(null);
    }

    function ChangeViewMode(Mode: WritingViewMode)
    {
        SetViewMode(Mode);
        SetReaderPage((Current) => Math.min(
            Current,
            Math.max(
                0,
                (ReaderArticle?.Pages.length ?? 1)
                    - (Mode === 'spread' ? 2 : 1),
            ),
        ));
        SetIsViewMenuOpen(false);
    }

    function ChangeReaderSearchQuery(Query: string)
    {
        const Matches = FindReaderMatches(ReaderArticle, Query);

        SetReaderSearchQuery(Query);
        SetReaderSearchMatchIndex(0);

        if(Matches.length > 0)
        {
            SetReaderPage(Matches[0].PageIndex);
            return Matches[0].PageIndex;
        }

        return null;
    }

    function MoveReaderSearchMatch(Direction: -1 | 1)
    {
        if(ReaderSearchMatches.length === 0)
        {
            return null;
        }

        const NextIndex = (
            ReaderSearchMatchIndex
            + Direction
            + ReaderSearchMatches.length
        ) % ReaderSearchMatches.length;

        SetReaderSearchMatchIndex(NextIndex);
        SetReaderPage(ReaderSearchMatches[NextIndex].PageIndex);
        return ReaderSearchMatches[NextIndex].PageIndex;
    }

    function ResetSettings()
    {
        const Defaults = DefaultWritingReaderPreferences;

        SetReaderFont(Defaults.Font);
        SetReaderTone(Defaults.Tone);
        SetReaderAlignment(Defaults.Alignment);
        SetReaderFontSize(Defaults.FontSize);
        SetReaderLineHeight(Defaults.LineHeight);
        SetReaderParagraphGap(Defaults.ParagraphGap);
        SetReaderPadding(Defaults.Padding);
        SetReaderVerticalPadding(Defaults.VerticalPadding);
        SetIsIndented(Defaults.IsIndented);
        SetViewMode(Defaults.ViewMode);
        SaveWritingReaderPreferences(Defaults);
        SetReaderSettingsNotice('기본 설정으로 초기화했습니다.');
    }

    function SaveReaderSettings()
    {
        SaveWritingReaderPreferences({
            Alignment: ReaderAlignment,
            Font: ReaderFont,
            FontSize: ReaderFontSize,
            IsIndented,
            LineHeight: ReaderLineHeight,
            Padding: ReaderPadding,
            ParagraphGap: ReaderParagraphGap,
            Tone: ReaderTone,
            VerticalPadding: ReaderVerticalPadding,
            ViewMode,
        });
        SetReaderSettingsNotice('현재 보기 설정을 저장했습니다.');
    }

    async function PersistCategories(NextCategories: string[])
    {
        if(IsAuthenticated === false)
        {
            return false;
        }

        SetIsCategorySaving(true);
        SetCategoryNotice('');

        try
        {
            const Saved = await SaveWritingPageCategories(NextCategories);
            SetCategories(['전체', ...Saved]);
            return true;
        }
        catch
        {
            SetCategoryNotice('카테고리 변경사항을 저장하지 못했습니다.');
            return false;
        }
        finally
        {
            SetIsCategorySaving(false);
        }
    }

    async function CreateCategory()
    {
        const Category = NewCategoryName.trim();

        if(Category === '' || Category === '전체')
        {
            SetCategoryNotice('올바른 카테고리 이름을 입력해주세요.');
            return;
        }

        if(EditableCategories.includes(Category))
        {
            SetCategoryNotice('이미 같은 카테고리가 있습니다.');
            return;
        }

        if(await PersistCategories([...EditableCategories, Category]))
        {
            SetNewCategoryName('');
            SetIsCategoryEditorOpen(false);
        }
    }

    async function DeleteCategory(Category: string)
    {
        if(Category === '전체' || IsCategorySaving)
        {
            return;
        }

        const Saved = await PersistCategories(
            EditableCategories.filter((Item) => Item !== Category),
        );

        if(Saved && ActiveCategory === Category)
        {
            SetActiveCategory('전체');
        }
    }

    async function RenameCategory(CurrentName: string, NextName: string)
    {
        const Category = NextName.trim();

        if(
            IsAuthenticated === false
            || IsCategorySaving
            || Category === ''
            || Category === '전체'
        )
        {
            return false;
        }

        if(Category !== CurrentName && Categories.includes(Category))
        {
            SetCategoryNotice('이미 같은 카테고리가 있습니다.');
            return false;
        }

        if(Category === CurrentName)
        {
            return true;
        }

        SetIsCategorySaving(true);
        SetCategoryNotice('');

        try
        {
            await RenameArchiveCategory('writing', CurrentName, Category);
            SetCategories((Current) => Current.map((Item) =>
                Item === CurrentName ? Category : Item,
            ));
            SetSavedPosts((Current) => Current.map((Post) =>
                Post.Category === CurrentName
                    ? { ...Post, Category }
                    : Post,
            ));
            SetActiveCategory(Category);
            return true;
        }
        catch
        {
            SetCategoryNotice('카테고리 이름을 변경하지 못했습니다.');
            return false;
        }
        finally
        {
            SetIsCategorySaving(false);
        }
    }

    function OpenPostEditor(Article: WritingArticle | null = null)
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetEditingArticleId(Article?.Id ?? null);
        SetPostEditorNotice('');
        SetIsPostEditorOpen(true);
    }

    async function SavePost(Draft: WritingPostDraft, CoverFile: File | null)
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetIsPostSaving(true);
        SetPostEditorNotice('');

        try
        {
            const Image = CoverFile === null
                ? Draft.Image
                : await UploadWritingCover(CoverFile);
            const Saved = await SaveWritingPost({
                Id: Draft.Id,
                Category: Draft.Category,
                Title: Draft.Title,
                ShortTitle: Draft.Title.slice(0, 10),
                Summary: Draft.Summary,
                Date: '',
                ReadTime: '',
                Image,
                IsPrivate: Draft.IsPrivate,
                Pages: Draft.Pages.map((Page) => ({
                    Heading: Page.Heading.trim() || Draft.Title,
                    Paragraphs: Page.Content
                        .split(/\n{2,}/)
                        .map((Paragraph) => Paragraph.trim())
                        .filter(Boolean),
                })),
            });

            SetSavedPosts((Current) => [
                Saved,
                ...Current.filter((Post) => Post.Id !== Saved.Id),
            ]);
            SetIsPostEditorOpen(false);
            SetEditingArticleId(null);
            SetPreviewArticleId(null);
        }
        catch(CaughtError)
        {
            SetPostEditorNotice(
                CaughtError instanceof Error
                && CaughtError.message === 'file_too_large'
                    ? '표지 이미지는 25MB 이하만 업로드할 수 있습니다.'
                    : '글을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsPostSaving(false);
        }
    }

    function StartArticleDrag(ArticleId: string)
    {
        if(IsAuthenticated === false || IsArticleOrderSaving)
        {
            return;
        }

        const CurrentOrder = AllArticles.map((Article) => Article.Id);
        ArticleOrderBeforeDragReference.current = CurrentOrder;
        DraggedArticleOrderReference.current = CurrentOrder;
        SetPreviewArticleId(null);
        SetDraggedArticleId(ArticleId);
        SetArticleOrderNotice('');
    }

    function MoveArticleDrag(TargetArticleId: string)
    {
        if(
            DraggedArticleId === null
            || DraggedArticleId === TargetArticleId
        )
        {
            return;
        }

        const CurrentOrder = DraggedArticleOrderReference.current;
        const FromIndex = CurrentOrder.indexOf(DraggedArticleId);
        const ToIndex = CurrentOrder.indexOf(TargetArticleId);

        if(FromIndex < 0 || ToIndex < 0)
        {
            return;
        }

        const NextOrder = [...CurrentOrder];
        const [MovedId] = NextOrder.splice(FromIndex, 1);
        NextOrder.splice(ToIndex, 0, MovedId);
        DraggedArticleOrderReference.current = NextOrder;
        SetArticleOrder(NextOrder);
    }

    async function EndArticleDrag()
    {
        if(DraggedArticleId === null)
        {
            return;
        }

        const NextOrder = DraggedArticleOrderReference.current;
        SetDraggedArticleId(null);
        SetIsArticleOrderSaving(true);

        try
        {
            SetArticleOrder(await SaveWritingArticleOrder(NextOrder));
            SetArticleOrderNotice('게시글 순서를 저장했습니다.');
        }
        catch
        {
            SetArticleOrder(ArticleOrderBeforeDragReference.current);
            SetArticleOrderNotice('게시글 순서를 저장하지 못했습니다.');
        }
        finally
        {
            SetIsArticleOrderSaving(false);
        }
    }

    return {
        ActiveCategory,
        ArticleOrderNotice,
        ArchivePage,
        ArchivePages,
        Categories,
        CategoryNotice,
        EditingArticle,
        DraggedArticleId,
        IsAuthenticated,
        IsArticleOrderSaving,
        IsCategoryEditorOpen,
        IsCategorySaving,
        IsContentsOpen,
        IsIndented,
        IsPostEditorOpen,
        IsPostSaving,
        IsReaderSearchOpen,
        IsSettingsOpen,
        IsViewMenuOpen,
        MaximumReaderPage,
        NewCategoryName,
        PostEditorNotice,
        PreviewArticleId,
        ReaderAlignment,
        ReaderArticle,
        ReaderFont,
        ReaderFontSize,
        ReaderLineHeight,
        ReaderPadding,
        ReaderPage,
        ReaderParagraphGap,
        ReaderSearchMatchIndex,
        ReaderSearchMatches,
        ReaderSearchQuery,
        ReaderSettingsNotice,
        ReaderTone,
        ReaderVerticalPadding,
        SearchQuery,
        ViewMode,
        VisibleArticles,
        VisiblePageCount,
        ChangeReaderSearchQuery,
        ChangeViewMode,
        ClosePostEditor: () => SetIsPostEditorOpen(false),
        CloseReader: () => SetReaderArticleId(null),
        CreateCategory,
        DeleteCategory,
        EndArticleDrag,
        MoveReaderSearchMatch,
        MoveArticleDrag,
        NextReaderPage: () => SetReaderPage((Current) =>
            Math.min(MaximumReaderPage, Current + 1)),
        OpenArticle,
        OpenPostEditor,
        PreviousReaderPage: () => SetReaderPage((Current) =>
            Math.max(0, Current - 1)),
        RenameCategory,
        ResetSettings,
        SaveReaderSettings,
        SavePost,
        SetActiveCategory: ChangeCategory,
        SetArchivePage,
        SetIsCategoryEditorOpen,
        SetIsContentsOpen,
        SetIsIndented,
        SetIsReaderSearchOpen,
        SetIsSettingsOpen,
        SetIsViewMenuOpen,
        SetNewCategoryName,
        SetPreviewArticleId,
        SetReaderAlignment,
        SetReaderFont,
        SetReaderFontSize,
        SetReaderLineHeight,
        SetReaderPadding,
        SetReaderPage,
        SetReaderParagraphGap,
        SetReaderTone,
        SetReaderVerticalPadding,
        SetSearchQuery: ChangeSearchQuery,
        StartArticleDrag,
    };
}
