'use client';

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { UseAuthSession } from '@/app/shell/AuthSessionProvider';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import { RenameArchiveCategory } from '@/managers/ArchiveCategoryManager';
import {
    LoadWritingArticleOrder,
    LoadWritingPageCategories,
    SaveWritingArticleOrder,
    SaveWritingPageCategories,
    NormalizeWritingArticleOrder,
} from '@/managers/WritingPageCategoryManager';
import {
    LoadWritingPosts,
    SaveWritingPost,
    UploadWritingAsset,
    type WritingPost,
} from '@/managers/WritingPostManager';
import {
    InsertWritingEditorAssets,
    MoveWritingArticleOrder,
    WritingArticles,
} from './WritingBasePanelState';
import type {
    WritingArticle,
    WritingReaderAlignment,
    WritingReaderFont,
    WritingReaderTone,
} from './WritingBasePanelTypes';

const ArticlesPerPage = 10;

function EscapeHtml(Value: string): string
{
    return Value.replace(/[&<>"']/g, (Character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    })[Character] ?? Character);
}

function GetArticleContentHtml(Article: WritingArticle): string
{
    return (
        Article.ContentHtml
        ?? Article.Body.map(
            (Paragraph) => `<p>${EscapeHtml(Paragraph)}</p>`,
        ).join('')
    );
}

function FilterArticles(
    Articles: WritingArticle[],
    SearchQuery: string,
    Category: string,
)
{
    const NormalizedQuery = SearchQuery.trim().toLocaleLowerCase('ko-KR');

    return Articles.filter((Article) =>
    {
        const MatchesCategory =
            Category === 'all' || Article.Category === Category;
        const MatchesSearch =
            NormalizedQuery.length === 0 ||
            Article.Title.toLocaleLowerCase('ko-KR').includes(
                NormalizedQuery,
            ) ||
            Article.Summary.toLocaleLowerCase('ko-KR').includes(
                NormalizedQuery,
            );

        return MatchesCategory && MatchesSearch;
    });
}

export function useWritingBasePanelController()
{
    const InitialAppState = UseInitialAppState();
    const { IsAuthenticated } = UseAuthSession();
    const [ActiveArticleId, SetActiveArticleId] = useState(
        WritingArticles[0].Id,
    );
    const [SearchQuery, SetSearchQuery] = useState('');
    const [ActiveCategory, SetActiveCategory] = useState('all');
    const [CurrentPage, SetCurrentPage] = useState(1);
    const [Categories, SetCategories] = useState<string[]>(
        InitialAppState.WritingPageCategories,
    );
    const [IsCategoryEditorOpen, SetIsCategoryEditorOpen] =
        useState(false);
    const [IsCategorySaving, SetIsCategorySaving] =
        useState(false);
    const [NewCategoryName, SetNewCategoryName] = useState('');
    const [CategoryNotice, SetCategoryNotice] = useState('');
    const [ArticleOrder, SetArticleOrder] = useState(
        InitialAppState.WritingArticleOrder,
    );
    const [DraggedArticleId, SetDraggedArticleId] =
        useState<string | null>(null);
    const [IsArticleOrderSaving, SetIsArticleOrderSaving] =
        useState(false);
    const [ArticleOrderNotice, SetArticleOrderNotice] =
        useState('');
    const DraggedArticleIdReference =
        useRef<string | null>(null);
    const DragStartOrderReference =
        useRef<string[] | null>(null);
    const ArticleOrderReference =
        useRef(InitialAppState.WritingArticleOrder);
    const [SavedWritingPosts, SetSavedWritingPosts] =
        useState<WritingPost[]>(InitialAppState.WritingPosts);
    const [IsEditing, SetIsEditing] = useState(false);
    const [IsEditorInsertOpen, SetIsEditorInsertOpen] =
        useState(false);
    const [IsPostSaving, SetIsPostSaving] = useState(false);
    const [EditorNotice, SetEditorNotice] = useState('');
    const [DraftTitle, SetDraftTitle] = useState('');
    const [DraftSummary, SetDraftSummary] = useState('');
    const [DraftCategory, SetDraftCategory] = useState('');
    const [DraftContentHtml, SetDraftContentHtml] =
        useState('');
    const [DraftIsPrivate, SetDraftIsPrivate] =
        useState(false);
    const [IsListCollapsed, SetIsListCollapsed] =
        useState(false);
    const [IsViewSettingsOpen, SetIsViewSettingsOpen] =
        useState(true);
    const [ReaderFont, SetReaderFont] =
        useState<WritingReaderFont>('gothic');
    const [ReaderTone, SetReaderTone] =
        useState<WritingReaderTone>('light');
    const [ReaderAlignment, SetReaderAlignment] =
        useState<WritingReaderAlignment>('left');
    const [ReaderFontSize, SetReaderFontSize] = useState(18);
    const AllArticles = useMemo<WritingArticle[]>(() =>
    {
        return [
            ...WritingArticles.map((Article) =>
            {
                const SavedPost = SavedWritingPosts.find(
                    (Post) => Post.Id === Article.Id,
                );

                return SavedPost === undefined
                    ? Article
                    : {
                        ...SavedPost,
                        Body: [],
                    };
            }),
            ...SavedWritingPosts
                .filter((Post) =>
                    WritingArticles.some(
                        (Article) => Article.Id === Post.Id,
                    ) === false,
                )
                .map((Post) => ({
                    ...Post,
                    Body: [],
                })),
        ].filter(
            (Article) =>
                Article.IsPrivate !== true
                || IsAuthenticated,
        );
    }, [IsAuthenticated, SavedWritingPosts]);
    const CompleteArticleOrder = useMemo(
        () => NormalizeWritingArticleOrder(
            ArticleOrder,
            AllArticles.map((Article) => Article.Id),
        ),
        [AllArticles, ArticleOrder],
    );
    const OrderedArticles = useMemo(
        () => CompleteArticleOrder.flatMap((ArticleId) =>
        {
            const Article = AllArticles.find(
                (Candidate) => Candidate.Id === ArticleId,
            );
            return Article === undefined ? [] : [Article];
        }),
        [AllArticles, CompleteArticleOrder],
    );
    const FilteredArticles = useMemo(
        () => FilterArticles(
            OrderedArticles,
            SearchQuery,
            ActiveCategory,
        ),
        [ActiveCategory, OrderedArticles, SearchQuery],
    );
    const TotalPages = Math.max(
        1,
        Math.ceil(FilteredArticles.length / ArticlesPerPage),
    );
    const ActiveArticle =
        FilteredArticles.find(
            (Article) => Article.Id === ActiveArticleId,
        ) ??
        FilteredArticles[0] ??
        WritingArticles[0];

    useEffect(() =>
    {
        let IsMounted = true;

        void Promise.all([
            LoadWritingPageCategories(),
            LoadWritingPosts(),
        ])
            .then(async ([LoadedCategories, LoadedPosts]) =>
            {
                const LoadedArticleOrder =
                    await LoadWritingArticleOrder([
                        ...WritingArticles.map(
                            (Article) => Article.Id,
                        ),
                        ...LoadedPosts
                            .filter((Post) =>
                                WritingArticles.some(
                                    (Article) =>
                                        Article.Id === Post.Id,
                                ) === false,
                            )
                            .map((Post) => Post.Id),
                    ]);

                if(IsMounted)
                {
                    SetCategories(LoadedCategories);
                    SetSavedWritingPosts(LoadedPosts);
                    ArticleOrderReference.current =
                        LoadedArticleOrder;
                    SetArticleOrder(LoadedArticleOrder);
                }
            })
            .catch(() =>
            {
                if(IsMounted && IsAuthenticated)
                {
                    SetCategoryNotice(
                        '카테고리를 불러오지 못했습니다.',
                    );
                }
            });

        return () =>
        {
            IsMounted = false;
        };
    }, [IsAuthenticated]);

    function SelectArticle(ArticleId: string)
    {
        SetActiveArticleId(ArticleId);
    }

    function ChangeSearchQuery(Query: string)
    {
        const NextArticles = FilterArticles(
            OrderedArticles,
            Query,
            ActiveCategory,
        );

        SetSearchQuery(Query);
        SetCurrentPage(1);

        if(NextArticles.length > 0)
        {
            SetActiveArticleId(NextArticles[0].Id);
        }
    }

    function ChangeCategory(Category: string)
    {
        const NextArticles = FilterArticles(
            OrderedArticles,
            SearchQuery,
            Category,
        );

        SetActiveCategory(Category);
        SetCurrentPage(1);

        if(NextArticles.length > 0)
        {
            SetActiveArticleId(NextArticles[0].Id);
        }
    }

    function ChangePage(Page: number)
    {
        const SafePage = Math.min(Math.max(Page, 1), TotalPages);

        SetCurrentPage(SafePage);
    }

    function ChangeReaderFontSize(Delta: -1 | 1)
    {
        SetReaderFontSize((Current) =>
            Math.min(Math.max(Current + Delta, 15), 22),
        );
    }

    function OpenCategoryEditor()
    {
        if(IsAuthenticated === false || IsCategorySaving)
        {
            return;
        }

        SetNewCategoryName('');
        SetCategoryNotice('');
        SetIsCategoryEditorOpen(true);
    }

    function CloseCategoryEditor()
    {
        SetNewCategoryName('');
        SetIsCategoryEditorOpen(false);
    }

    async function PersistCategories(
        NextCategories: string[],
    ): Promise<boolean>
    {
        if(IsAuthenticated === false)
        {
            return false;
        }

        SetIsCategorySaving(true);
        SetCategoryNotice('');

        try
        {
            SetCategories(
                await SaveWritingPageCategories(
                    NextCategories,
                ),
            );
            return true;
        }
        catch
        {
            SetCategoryNotice(
                '카테고리 변경사항을 저장하지 못했습니다.',
            );
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

        if(Category === '')
        {
            SetCategoryNotice('카테고리 이름을 입력해주세요.');
            return;
        }

        if(Category === '전체')
        {
            SetCategoryNotice('전체는 고정 카테고리입니다.');
            return;
        }

        if(Categories.includes(Category))
        {
            SetCategoryNotice('이미 같은 카테고리가 있습니다.');
            return;
        }

        if(Categories.length >= 20)
        {
            SetCategoryNotice(
                '카테고리는 최대 20개까지 만들 수 있습니다.',
            );
            return;
        }

        if(await PersistCategories([...Categories, Category]))
        {
            CloseCategoryEditor();
        }
    }

    async function DeleteCategory(Category: string)
    {
        if(IsCategorySaving)
        {
            return;
        }

        if(
            await PersistCategories(
                Categories.filter(
                    (Candidate) => Candidate !== Category,
                ),
            )
            && ActiveCategory === Category
        )
        {
            ChangeCategory('all');
        }
    }

    async function RenameCategory(
        CurrentName: string,
        NextName: string,
    ): Promise<boolean>
    {
        const Category = NextName.trim();

        if(
            IsAuthenticated === false
            || IsCategorySaving
        )
        {
            return false;
        }

        if(Category === '' || Category === '전체')
        {
            SetCategoryNotice('올바른 카테고리 이름을 입력해주세요.');
            return false;
        }

        if(
            Category !== CurrentName
            && Categories.includes(Category)
        )
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
            const RenamedPosts = await Promise.all(
                AllArticles
                    .filter(
                        (Article) =>
                            Article.Category === CurrentName,
                    )
                    .map((Article) =>
                        SaveWritingPost({
                            Id: Article.Id,
                            Category,
                            Title: Article.Title,
                            Summary: Article.Summary,
                            Date: Article.Date,
                            ReadTime: Article.ReadTime,
                            ContentHtml:
                                GetArticleContentHtml(Article),
                            IsPrivate:
                                Article.IsPrivate === true,
                        }),
                    ),
            );
            await RenameArchiveCategory(
                'writing',
                CurrentName,
                Category,
            );
            SetCategories((Current) =>
                Current.map((Name) =>
                    Name === CurrentName ? Category : Name,
                ),
            );
            SetSavedWritingPosts((Current) => [
                ...Current.filter(
                    (Post) =>
                        RenamedPosts.some(
                            (Renamed) => Renamed.Id === Post.Id,
                        ) === false,
                ),
                ...RenamedPosts,
            ]);
            SetActiveCategory(Category);
            SetCurrentPage(1);
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

    function StartArticleDrag(ArticleId: string)
    {
        if(
            IsAuthenticated === false
            || IsArticleOrderSaving
        )
        {
            return;
        }

        SetArticleOrderNotice('');
        DraggedArticleIdReference.current = ArticleId;
        DragStartOrderReference.current = [
            ...ArticleOrderReference.current,
        ];
        SetDraggedArticleId(ArticleId);
    }

    function MoveArticleDrag(TargetArticleId: string)
    {
        const DraggedId = DraggedArticleIdReference.current;

        if(
            DraggedId === null
            || DraggedId === TargetArticleId
            || IsArticleOrderSaving
        )
        {
            return;
        }

        const CurrentOrder = ArticleOrderReference.current;
        const NextOrder = MoveWritingArticleOrder(
            CurrentOrder,
            DraggedId,
            TargetArticleId,
        );

        if(NextOrder === CurrentOrder)
        {
            return;
        }

        ArticleOrderReference.current = NextOrder;
        SetArticleOrder(NextOrder);
    }

    async function DropArticle(TargetArticleId: string)
    {
        MoveArticleDrag(TargetArticleId);

        const DraggedId = DraggedArticleIdReference.current;
        const PreviousOrder = DragStartOrderReference.current;

        if(
            DraggedId === null
            || PreviousOrder === null
            || IsArticleOrderSaving
        )
        {
            return;
        }

        const NextOrder = ArticleOrderReference.current;
        DraggedArticleIdReference.current = null;
        DragStartOrderReference.current = null;
        SetDraggedArticleId(null);
        OpenArticleEditor(DraggedId);
        SetIsArticleOrderSaving(true);
        SetArticleOrderNotice('');

        try
        {
            SetArticleOrder(
                await SaveWritingArticleOrder(
                    NextOrder,
                    AllArticles.map(
                        (Article) => Article.Id,
                    ),
                ),
            );
            ArticleOrderReference.current = NextOrder;
        }
        catch
        {
            ArticleOrderReference.current = PreviousOrder;
            SetArticleOrder(PreviousOrder);
            SetArticleOrderNotice(
                '글 순서를 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsArticleOrderSaving(false);
        }
    }

    function EndArticleDrag()
    {
        if(DraggedArticleIdReference.current !== null)
        {
            const PreviousOrder =
                DragStartOrderReference.current;

            if(PreviousOrder !== null)
            {
                ArticleOrderReference.current = PreviousOrder;
                SetArticleOrder(PreviousOrder);
            }
        }

        DraggedArticleIdReference.current = null;
        DragStartOrderReference.current = null;
        SetDraggedArticleId(null);
    }

    function OpenArticleEditor(ArticleId: string)
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        const Article = AllArticles.find(
            (Candidate) => Candidate.Id === ArticleId,
        );

        if(Article === undefined)
        {
            return;
        }

        SetActiveArticleId(Article.Id);
        SetDraftTitle(Article.Title);
        SetDraftSummary(Article.Summary);
        SetDraftCategory(Article.Category);
        SetDraftContentHtml(
            GetArticleContentHtml(Article),
        );
        SetDraftIsPrivate(
            Article.IsPrivate === true,
        );
        SetEditorNotice('');
        SetIsEditorInsertOpen(false);
        SetIsEditing(true);
    }

    function OpenEditor()
    {
        OpenArticleEditor(ActiveArticle.Id);
    }

    function CloseEditor()
    {
        if(IsPostSaving)
        {
            return;
        }

        SetEditorNotice('');
        SetIsEditorInsertOpen(false);
        SetIsEditing(false);
    }

    function ExecuteEditorCommand(
        Command: string,
        Value?: string,
    )
    {
        const WasApplied = document.execCommand(
            Command,
            false,
            Value,
        );

        if(
            Command === 'formatBlock'
            && Value !== undefined
            && WasApplied === false
        )
        {
            document.execCommand(
                Command,
                false,
                `<${Value.replace(/[<>]/g, '')}>`,
            );
        }

        if(Command === 'insertLineBreak' && WasApplied === false)
        {
            document.execCommand('insertHTML', false, '<br>');
        }
    }

    function InsertExternalLink()
    {
        const Url = window.prompt('연결할 주소를 입력해주세요.');

        if(Url === null || /^https?:\/\//i.test(Url) === false)
        {
            return;
        }

        ExecuteEditorCommand('createLink', Url);
        SetIsEditorInsertOpen(false);
    }

    async function UploadEditorAssets(
        Files: File[],
        ContentHtml: string,
    )
    {
        if(IsPostSaving)
        {
            return;
        }

        SetIsPostSaving(true);
        SetEditorNotice('');

        try
        {
            let UploadedHtml = '';

            for(const File of Files)
            {
                const Url = await UploadWritingAsset(
                    ActiveArticle.Id,
                    File,
                );
                const SafeUrl = EscapeHtml(Url);
                const SafeName = EscapeHtml(File.name);

                if(File.type.startsWith('image/'))
                {
                    UploadedHtml +=
                        `<figure><img src="${SafeUrl}" alt="${SafeName}"></figure>`;
                }
                else if(File.type.startsWith('video/'))
                {
                    UploadedHtml +=
                        `<figure><video src="${SafeUrl}" controls preload="metadata"></video></figure>`;
                }
                else
                {
                    UploadedHtml +=
                        `<p><a href="${SafeUrl}" target="_blank" rel="noopener noreferrer">${SafeName}</a></p>`;
                }
            }

            const NextContentHtml = InsertWritingEditorAssets(
                ContentHtml,
                UploadedHtml,
            );

            SetDraftContentHtml(NextContentHtml);
            SetIsEditorInsertOpen(false);
        }
        catch
        {
            SetEditorNotice(
                '첨부 파일을 업로드하지 못했습니다.',
            );
        }
        finally
        {
            SetIsPostSaving(false);
        }
    }

    async function SaveEditor(ContentHtml: string)
    {
        if(
            IsAuthenticated === false
            || IsPostSaving
        )
        {
            return;
        }

        if(DraftTitle.trim() === '')
        {
            SetEditorNotice('제목을 입력해주세요.');
            return;
        }

        if(DraftCategory.trim() === '')
        {
            SetEditorNotice('카테고리를 선택해주세요.');
            return;
        }

        SetIsPostSaving(true);
        SetEditorNotice('');

        try
        {
            const SavedPost = await SaveWritingPost({
                Id: ActiveArticle.Id,
                Category: DraftCategory,
                Title: DraftTitle,
                Summary: DraftSummary,
                Date: ActiveArticle.Date,
                ReadTime: ActiveArticle.ReadTime,
                ContentHtml,
                IsPrivate: DraftIsPrivate,
            });

            SetSavedWritingPosts((Current) => [
                ...Current.filter(
                    (Post) => Post.Id !== SavedPost.Id,
                ),
                SavedPost,
            ]);
            SetIsEditing(false);
        }
        catch
        {
            SetEditorNotice(
                '글을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsPostSaving(false);
        }
    }

    return {
        AllArticles,
        ActiveArticle,
        Articles: FilteredArticles,
        Categories,
        SearchQuery,
        ActiveCategory,
        CurrentPage,
        TotalPages,
        TotalResults: FilteredArticles.length,
        IsListCollapsed,
        IsViewSettingsOpen,
        ReaderFont,
        ReaderTone,
        ReaderAlignment,
        ReaderFontSize,
        IsAuthenticated,
        IsCategoryEditorOpen,
        IsCategorySaving,
        NewCategoryName,
        CategoryNotice,
        DraggedArticleId,
        IsArticleOrderSaving,
        ArticleOrderNotice,
        IsEditing,
        IsEditorInsertOpen,
        IsPostSaving,
        EditorNotice,
        DraftTitle,
        DraftSummary,
        DraftCategory,
        DraftContentHtml,
        DraftIsPrivate,
        SelectArticle,
        ChangeSearchQuery,
        ChangeCategory,
        ChangePage,
        ToggleList: () =>
            SetIsListCollapsed((Current) => !Current),
        ToggleViewSettings: () =>
            SetIsViewSettingsOpen((Current) => !Current),
        ChangeReaderFont: SetReaderFont,
        ChangeReaderTone: SetReaderTone,
        ChangeReaderAlignment: SetReaderAlignment,
        ChangeReaderFontSize,
        OpenCategoryEditor,
        CloseCategoryEditor,
        SetNewCategoryName,
        CreateCategory,
        DeleteCategory,
        RenameCategory,
        StartArticleDrag,
        MoveArticleDrag,
        DropArticle,
        EndArticleDrag,
        OpenEditor,
        CloseEditor,
        SaveEditor,
        SetDraftTitle,
        SetDraftSummary,
        SetDraftCategory,
        SetDraftContentHtml,
        SetDraftIsPrivate,
        ToggleEditorInsert: () =>
            SetIsEditorInsertOpen((Current) => !Current),
        ExecuteEditorCommand,
        InsertExternalLink,
        UploadEditorAssets,
    };
}
