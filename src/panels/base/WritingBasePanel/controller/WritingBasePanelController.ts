'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { UseAuthSession } from '@/app/shell/AuthSessionProvider';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import { RenameArchiveCategory } from '@/managers/ArchiveCategoryManager';
import {
    LoadWritingPageCategories,
    SaveWritingArticleOrder,
    SaveWritingPageCategories,
    SaveWritingPageIntroduction,
    type WritingPageTextCustomization,
} from '@/managers/WritingPageCategoryManager';
import {
    DeleteWritingPost,
    LoadWritingPostPassword,
    LoadWritingPosts,
    SaveWritingPost,
    UnlockWritingPost,
    UploadWritingCover,
    type WritingSavedPost,
} from '@/managers/WritingPostManager';
import {
    DefaultWritingReaderPreferences,
    SaveWritingReaderPreferences,
} from '@/managers/WritingReaderPreferenceManager';
import type {
    WritingPostCopyData,
    WritingPostDraft,
} from '@/panels/layered/WritingPostEditorLayeredPanel/WritingPostEditorLayeredPanel';
import {
    ShouldPromptForWritingPassword,
    WritingArticles,
} from './WritingBasePanelState';
import type {
    WritingArticle,
    WritingReaderAlignment,
    WritingReaderFont,
    WritingReaderTone,
    WritingViewMode,
} from './WritingBasePanelTypes';

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
    const [WritingPageHeading, SetWritingPageHeading] =
        useState<WritingPageTextCustomization>(
            InitialState.WritingPageHeading,
        );
    const [WritingPageDescription, SetWritingPageDescription] =
        useState<WritingPageTextCustomization>(
            InitialState.WritingPageDescription,
        );
    const [DraftWritingPageHeading, SetDraftWritingPageHeading] =
        useState<WritingPageTextCustomization>({
            ...InitialState.WritingPageHeading,
        });
    const [DraftWritingPageDescription, SetDraftWritingPageDescription] =
        useState<WritingPageTextCustomization>({
            ...InitialState.WritingPageDescription,
        });
    const [CustomizationView, SetCustomizationView] =
        useState<'menu' | 'heading' | null>(null);
    const [IsWritingPageHeadingSaving, SetIsWritingPageHeadingSaving] =
        useState(false);
    const [WritingPageHeadingNotice, SetWritingPageHeadingNotice] =
        useState('');
    const [PreviewArticleId, SetPreviewArticleId] =
        useState<string | null>(null);
    const [ReaderArticleId, SetReaderArticleId] =
        useState<string | null>(null);
    const [ReaderPage, SetReaderPage] = useState(0);
    const [ViewMode, SetViewMode] = useState<WritingViewMode>(
        InitialState.WritingReaderPreferences.ViewMode,
    );
    const [IsContentsOpen, SetIsContentsOpen] = useState(false);
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
    const [CopiedWritingPost, SetCopiedWritingPost] =
        useState<WritingPostCopyData | null>(null);
    const [EditingPassword, SetEditingPassword] =
        useState<string | null>(null);
    const [PasswordPromptArticle, SetPasswordPromptArticle] =
        useState<WritingArticle | null>(null);
    const [UnlockedArticleIds, SetUnlockedArticleIds] =
        useState<string[]>([]);
    const [IsPasswordUnlocking, SetIsPasswordUnlocking] = useState(false);
    const [PasswordUnlockNotice, SetPasswordUnlockNotice] = useState('');
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
        const DeletedArticleIds = new Set(
            SavedPosts
                .filter((Post) => Post.IsDeleted)
                .map((Post) => Post.Id),
        );
        const AvailableSavedPosts = SavedPosts.filter(
            (Post) => Post.IsDeleted === false,
        );
        const StaticArticles = WritingArticles
            .filter((Article) => DeletedArticleIds.has(Article.Id) === false)
            .map((Article) =>
            {
                const Saved = AvailableSavedPosts.find(
                    (Post) => Post.Id === Article.Id,
                );
                const Resolved = Saved ?? Article;

                return {
                    ...Resolved,
                    Category: MapCategory(Resolved.Category),
                };
            });
        const AddedArticles = AvailableSavedPosts
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
            const Saved = AvailableSavedPosts.find(
                (Post) => Post.Id === Article.Id,
            );
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
    const VisibleArticles = FilteredArticles;
    const ReaderArticle = AllArticles.find(
        (Article) => Article.Id === ReaderArticleId,
    ) ?? null;
    const EditingArticle = AllArticles.find(
        (Article) => Article.Id === EditingArticleId,
    ) ?? null;
    const MaximumReaderPage = Math.max(
        0,
        (ReaderArticle?.Pages.length ?? 1) - 1,
    );
    const ReaderSearchMatches = useMemo(
        () => FindReaderMatches(ReaderArticle, ReaderSearchQuery),
        [ReaderArticle, ReaderSearchQuery],
    );

    useEffect(() =>
    {
        let IsMounted = true;
        queueMicrotask(() =>
        {
            if(IsMounted)
            {
                SetUnlockedArticleIds([]);
            }
        });

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
        const Article = AllArticles.find(
            (Candidate) => Candidate.Id === ArticleId,
        );

        if(
            Article !== undefined
            && ShouldPromptForWritingPassword(
                Article.IsPasswordProtected === true,
                IsAuthenticated,
                UnlockedArticleIds.includes(ArticleId),
            )
        )
        {
            SetPasswordUnlockNotice('');
            SetPasswordPromptArticle(Article);
            return;
        }

        ShowArticle(ArticleId);
    }

    function ShowArticle(ArticleId: string)
    {
        const Article = AllArticles.find(
            (Candidate) => Candidate.Id === ArticleId,
        );
        const EnabledViewModes = Article?.EnabledViewModes
            ?? ['book', 'scroll'];
        const PreferredViewMode = ViewMode === 'scroll'
            ? 'scroll'
            : 'book';

        if(EnabledViewModes.includes(PreferredViewMode) === false)
        {
            SetViewMode(
                EnabledViewModes.includes('book')
                    ? 'spread'
                    : 'scroll',
            );
        }

        SetReaderArticleId(ArticleId);
        SetReaderPage(0);
        SetIsContentsOpen(false);
        SetIsSettingsOpen(false);
        SetIsReaderSearchOpen(false);
        SetReaderSearchQuery('');
        SetReaderSearchMatchIndex(0);
    }

    function ClosePasswordPrompt()
    {
        if(IsPasswordUnlocking)
        {
            return;
        }

        SetPasswordPromptArticle(null);
        SetPasswordUnlockNotice('');
    }

    async function UnlockProtectedWritingPost(Password: string)
    {
        if(PasswordPromptArticle === null || IsPasswordUnlocking)
        {
            return;
        }

        SetIsPasswordUnlocking(true);
        SetPasswordUnlockNotice('');

        try
        {
            const Unlocked = await UnlockWritingPost(
                PasswordPromptArticle.Id,
                Password,
            );
            SetSavedPosts((Current) => Current.map((Post) =>
                Post.Id === Unlocked.Id ? Unlocked : Post,
            ));
            SetUnlockedArticleIds((Current) => [
                ...Current.filter((Id) => Id !== Unlocked.Id),
                Unlocked.Id,
            ]);
            SetPasswordPromptArticle(null);
            ShowArticle(Unlocked.Id);
        }
        catch
        {
            SetPasswordUnlockNotice('비밀번호가 올바르지 않습니다.');
        }
        finally
        {
            SetIsPasswordUnlocking(false);
        }
    }

    function ChangeCategory(Category: string)
    {
        if(Category === ActiveCategory)
        {
            return;
        }

        const ApplyCategory = () =>
        {
            SetActiveCategory(Category);
            SetPreviewArticleId(null);
        };

        if(
            typeof document.startViewTransition !== 'function'
            || window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
        {
            ApplyCategory();
            return;
        }

        document.startViewTransition(() => flushSync(ApplyCategory));
    }

    function ChangeSearchQuery(Query: string)
    {
        SetSearchQuery(Query);
        SetPreviewArticleId(null);
    }

    function OpenCustomization()
    {
        SetWritingPageHeadingNotice('');
        SetCustomizationView('menu');
    }

    function OpenCustomizationOption(OptionIndex: number)
    {
        if(OptionIndex !== 0)
        {
            return;
        }

        SetDraftWritingPageHeading({ ...WritingPageHeading });
        SetDraftWritingPageDescription({ ...WritingPageDescription });
        SetWritingPageHeadingNotice('');
        SetCustomizationView('heading');
    }

    function CloseCustomization()
    {
        if(IsWritingPageHeadingSaving === false)
        {
            SetCustomizationView(null);
        }
    }

    function ReturnToCustomizationMenu()
    {
        if(IsWritingPageHeadingSaving === false)
        {
            SetCustomizationView('menu');
        }
    }

    function UpdateWritingPageHeading(
        Update: Partial<WritingPageTextCustomization>,
    )
    {
        SetDraftWritingPageHeading((Current) => ({
            ...Current,
            ...Update,
        }));
    }

    function UpdateWritingPageDescription(
        Update: Partial<WritingPageTextCustomization>,
    )
    {
        SetDraftWritingPageDescription((Current) => ({
            ...Current,
            ...Update,
        }));
    }

    async function SaveWritingPageHeadingCustomization()
    {
        if(IsAuthenticated === false || IsWritingPageHeadingSaving)
        {
            return;
        }

        SetIsWritingPageHeadingSaving(true);
        SetWritingPageHeadingNotice('');

        try
        {
            const Saved = await SaveWritingPageIntroduction(
                DraftWritingPageHeading,
                DraftWritingPageDescription,
            );
            SetWritingPageHeading(Saved.Heading);
            SetWritingPageDescription(Saved.Description);
            SetDraftWritingPageHeading({ ...Saved.Heading });
            SetDraftWritingPageDescription({ ...Saved.Description });
            SetCustomizationView(null);
        }
        catch
        {
            SetWritingPageHeadingNotice(
                '글 페이지 제목 설정을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsWritingPageHeadingSaving(false);
        }
    }

    function ChangeViewMode(Mode: WritingViewMode)
    {
        const EnabledViewModes = ReaderArticle?.EnabledViewModes
            ?? ['book', 'scroll'];

        if(
            (Mode === 'scroll' && !EnabledViewModes.includes('scroll'))
            || (Mode !== 'scroll' && !EnabledViewModes.includes('book'))
        )
        {
            return;
        }

        SetViewMode(Mode);
        SetReaderPage((Current) => Math.min(
            Current,
            Math.max(
                0,
                (ReaderArticle?.Pages.length ?? 1)
                    - 1,
            ),
        ));
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
        const EnabledViewModes = ReaderArticle?.EnabledViewModes
            ?? ['book', 'scroll'];
        const ResetViewMode = Defaults.ViewMode === 'scroll'
            && EnabledViewModes.includes('scroll')
                ? Defaults.ViewMode
                : EnabledViewModes.includes('book')
                    ? 'spread'
                    : 'scroll';
        SetViewMode(ResetViewMode);
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

    async function OpenPostEditor(Article: WritingArticle | null = null)
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetPostEditorNotice('');
        SetEditingPassword(null);

        if(Article?.IsPasswordProtected === true)
        {
            try
            {
                SetEditingPassword(
                    await LoadWritingPostPassword(Article.Id),
                );
            }
            catch
            {
                SetPostEditorNotice(
                    '기존 비밀번호를 불러오지 못했습니다.',
                );
            }
        }

        SetEditingArticleId(Article?.Id ?? null);
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
                IsContentLocked: false,
                IsDeleted: false,
                IsPasswordProtected:
                    Draft.PasswordUpdate === null
                        ? Draft.IsPrivate === false
                            && EditingArticle?.IsPasswordProtected === true
                        : Draft.PasswordUpdate !== '',
                EnabledViewModes: Draft.EnabledViewModes,
                PageNumberColor: Draft.PageNumberColor,
                PageNumberOpacity: Draft.PageNumberOpacity,
                TextLayers: Draft.TextLayers,
                Pages: Draft.Pages.map((Page) => ({
                    ForwardDirection: Page.ForwardDirection,
                    Heading: Page.Heading.trim() || Draft.Title,
                    Paragraphs: Page.Content
                        .split(/\n{2,}/)
                        .map((Paragraph) => Paragraph.trim())
                        .filter(Boolean),
                })),
            }, Draft.PasswordUpdate, EditingArticle?.Image ?? null);

            SetSavedPosts((Current) => [
                Saved,
                ...Current.filter((Post) => Post.Id !== Saved.Id),
            ]);
            SetIsPostEditorOpen(false);
            SetEditingArticleId(null);
            SetEditingPassword(null);
            SetPreviewArticleId(null);
        }
        catch(CaughtError)
        {
            SetPostEditorNotice(
                CaughtError instanceof Error
                && CaughtError.message === 'file_too_large'
                    ? '표지 이미지는 25MB 이하만 업로드할 수 있습니다.'
                    : CaughtError instanceof Error
                    && CaughtError.message === 'invalid_writing_password'
                        ? 'Password는 4자 이상 72자 이하로 입력해주세요.'
                    : '글을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsPostSaving(false);
        }
    }

    function CopyPost(CopyData: WritingPostCopyData)
    {
        SetCopiedWritingPost({
            CoverFile: CopyData.CoverFile,
            Draft: {
                ...CopyData.Draft,
                Pages: CopyData.Draft.Pages.map((Page) => ({ ...Page })),
                TextLayers: CopyData.Draft.TextLayers.map(
                    (Layer) => ({ ...Layer }),
                ),
            },
        });
        SetPostEditorNotice('복사했습니다. 새 글에서 붙여넣을 수 있습니다.');
    }

    async function DeletePost()
    {
        if(
            IsAuthenticated === false
            || IsPostSaving
            || EditingArticle === null
        )
        {
            return;
        }

        const Post = SavedPosts.find(
            (Candidate) => Candidate.Id === EditingArticle.Id,
        ) ?? {
            ...EditingArticle,
            EnabledViewModes: EditingArticle.EnabledViewModes
                ?? ['book', 'scroll'],
            IsContentLocked: false,
            IsDeleted: false,
            IsPasswordProtected: false,
            IsPrivate: false,
            PageNumberColor: EditingArticle.PageNumberColor ?? '#222222',
            PageNumberOpacity: EditingArticle.PageNumberOpacity ?? .58,
            TextLayers: EditingArticle.TextLayers ?? [],
        };

        SetIsPostSaving(true);
        SetPostEditorNotice('');

        try
        {
            await DeleteWritingPost(Post);
            SetSavedPosts((Current) => [
                { ...Post, IsDeleted: true },
                ...Current.filter((Item) => Item.Id !== Post.Id),
            ]);
            SetIsPostEditorOpen(false);
            SetEditingArticleId(null);
            SetEditingPassword(null);
            SetPreviewArticleId(null);
        }
        catch
        {
            SetPostEditorNotice('글을 삭제하지 못했습니다.');
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

        if(
            typeof document.startViewTransition === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches
                === false
        )
        {
            document.documentElement.dataset.writingReordering = 'true';
        }
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
        const ApplyOrder = () =>
        {
            DraggedArticleOrderReference.current = NextOrder;
            SetArticleOrder(NextOrder);
        };

        if(
            typeof document.startViewTransition !== 'function'
            || window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
        {
            ApplyOrder();
            return;
        }

        document.startViewTransition(() => flushSync(ApplyOrder));
    }

    async function EndArticleDrag()
    {
        delete document.documentElement.dataset.writingReordering;

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
        ArchiveDates: AllArticles.map((Article) => Article.Date),
        ArticleOrderNotice,
        Categories,
        CategoryNotice,
        CopiedWritingPost,
        CustomizationView,
        DraftWritingPageDescription,
        DraftWritingPageHeading,
        EditingArticle,
        EditingPassword,
        DraggedArticleId,
        IsAuthenticated,
        IsArticleOrderSaving,
        IsCategoryEditorOpen,
        IsCategorySaving,
        IsContentsOpen,
        IsIndented,
        IsPasswordUnlocking,
        IsPostEditorOpen,
        IsPostSaving,
        IsReaderSearchOpen,
        IsSettingsOpen,
        IsWritingPageHeadingSaving,
        MaximumReaderPage,
        NewCategoryName,
        PasswordPromptArticle,
        PasswordUnlockNotice,
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
        WritingPageDescription,
        WritingPageHeading,
        WritingPageHeadingNotice,
        ChangeReaderSearchQuery,
        ChangeViewMode,
        ClosePasswordPrompt,
        CloseCustomization,
        ClosePostEditor: () =>
        {
            SetIsPostEditorOpen(false);
            SetEditingPassword(null);
        },
        CloseReader: () => SetReaderArticleId(null),
        CreateCategory,
        DeleteCategory,
        DeletePost,
        EndArticleDrag,
        MoveReaderSearchMatch,
        MoveArticleDrag,
        NextReaderPage: () => SetReaderPage((Current) =>
            Math.min(MaximumReaderPage, Current + 1)),
        OpenArticle,
        OpenCustomization,
        OpenCustomizationOption,
        OpenPostEditor,
        PreviousReaderPage: () => SetReaderPage((Current) =>
            Math.max(0, Current - 1)),
        RenameCategory,
        ReturnToCustomizationMenu,
        ResetSettings,
        SaveReaderSettings,
        SavePost,
        SaveWritingPageHeadingCustomization,
        SetActiveCategory: ChangeCategory,
        SetIsCategoryEditorOpen,
        SetIsContentsOpen,
        SetIsIndented,
        SetIsReaderSearchOpen,
        SetIsSettingsOpen,
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
        UpdateWritingPageDescription,
        UpdateWritingPageHeading,
        SetSearchQuery: ChangeSearchQuery,
        StartArticleDrag,
        CopyPost,
        UnlockProtectedWritingPost,
    };
}
