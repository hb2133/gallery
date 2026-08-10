'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { UseAuthSession } from '@/app/shell/AuthSessionProvider';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import { GetOppositePhotoPageDirection } from '@/core/navigation/PhotoPageDirection';
import { RenameArchiveCategory } from '@/managers/ArchiveCategoryManager';
import {
    LoadPhotoPageCategories,
    LoadPhotoPageDescription,
    LoadPhotoPageHeading,
    SavePhotoPageHeading,
    SavePhotoPageCategories,
    type PhotoPageDescriptionCustomization,
    type PhotoPageHeadingCustomization,
} from '@/managers/PhotoPageCategoryManager';
import {
    LoadPhotoPostPassword,
    LoadPhotoCardCustomizations,
    SavePhotoCardCustomization,
    SetPhotoPostPassword,
    type PhotoCardCustomization,
} from '@/managers/PhotoCardCustomizationManager';
import {
    CreatePhotoPost,
    LoadPhotoPosts,
    SavePhotoPostOrder,
    SavePhotoPostContentImages,
    UnlockPhotoPost,
    type CreatePhotoPostInput,
    type PhotoPostContentImage,
    type PhotoPostCopyData,
} from '@/managers/PhotoPostManager';
import { GalleryProjects } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelState';
import type {
    GalleryDetailViewMode,
    GalleryProject,
    GalleryProjectImage,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import {
    GalleryIndexItems,
    MoveGalleryIndexItem,
} from './GalleryIndexBasePanelState';
import type { GalleryIndexItem } from './GalleryIndexBasePanelTypes';

type PhotoCustomizationView =
    'menu'
    | 'heading'
    | null;

function CreateDefaultCardCustomization(
    Item: GalleryIndexItem,
): PhotoCardCustomization
{
    const PositionByTitle = {
        'top-left': {
            X: 5,
            Y: 5,
        },
        center: {
            X: 20,
            Y: 47,
        },
        'bottom-left': {
            X: 5,
            Y: 88,
        },
    };
    const Position = PositionByTitle[Item.TitlePosition];

    return {
        CardId: Item.Id,
        Category: Item.DetailCategory,
        IsDeleted: false,
        IsPasswordProtected:
            Item.IsPasswordProtected === true,
        IsPrivate: false,
        PageNumberColor: '#ffffff',
        PageNumberOpacity: .86,
        ThumbnailUrl: Item.CoverImagePath,
        TextLayers: [{
            Id: `${Item.Id}-title`,
            Text: Item.Title,
            FontFamily: 'Arial, sans-serif',
            FontSize: 34,
            FontWeight: 400,
            Color: '#ffffff',
            X: Position.X,
            Y: Position.Y,
        }],
    };
}

export function useGalleryIndexBasePanelController()
{
    const InitialAppState = UseInitialAppState();
    const { IsAuthenticated } = UseAuthSession();
    const [OpenProject, SetOpenProject] = useState<GalleryProject | null>(null);
    const [PasswordPromptItem, SetPasswordPromptItem] =
        useState<GalleryIndexItem | null>(null);
    const [IsPasswordUnlocking, SetIsPasswordUnlocking] =
        useState(false);
    const [PasswordUnlockNotice, SetPasswordUnlockNotice] =
        useState('');
    const [ActiveImageIndex, SetActiveImageIndex] = useState(0);
    const [
        ImageNavigationDirection,
        SetImageNavigationDirection,
    ] = useState<'left' | 'right' | 'up' | 'down'>(
        'right',
    );
    const [ActiveCategory, SetActiveCategory] = useState('전체');
    const [Categories, SetCategories] = useState<string[]>([
        '전체',
        ...InitialAppState.PhotoPageCategories,
    ]);
    const [IsCategoryEditorOpen, SetIsCategoryEditorOpen] =
        useState(false);
    const [IsCategorySaving, SetIsCategorySaving] =
        useState(false);
    const [NewCategoryName, SetNewCategoryName] = useState('');
    const [CategoryNotice, SetCategoryNotice] = useState('');
    const [PhotoPageHeading, SetPhotoPageHeading] =
        useState<PhotoPageHeadingCustomization>(
            InitialAppState.PhotoPageHeading,
        );
    const [PhotoPageDescription, SetPhotoPageDescription] =
        useState<PhotoPageDescriptionCustomization>(
            InitialAppState.PhotoPageDescription,
        );
    const [
        DraftPhotoPageHeading,
        SetDraftPhotoPageHeading,
    ] = useState<PhotoPageHeadingCustomization>({
        ...InitialAppState.PhotoPageHeading,
    });
    const [
        DraftPhotoPageDescription,
        SetDraftPhotoPageDescription,
    ] = useState<PhotoPageDescriptionCustomization>({
        ...InitialAppState.PhotoPageDescription,
    });
    const [IsPhotoPageHeadingSaving, SetIsPhotoPageHeadingSaving] =
        useState(false);
    const [PhotoPageHeadingNotice, SetPhotoPageHeadingNotice] =
        useState('');
    const [
        CardCustomizations,
        SetCardCustomizations,
    ] = useState<Record<string, PhotoCardCustomization>>(
        InitialAppState.PhotoCardCustomizations,
    );
    const [PhotoPosts, SetPhotoPosts] =
        useState<GalleryIndexItem[]>(
            InitialAppState.PhotoPosts,
        );
    const [DraggedItemId, SetDraggedItemId] =
        useState<string | null>(null);
    const IsManaging = IsAuthenticated;
    const [IsOrderSaving, SetIsOrderSaving] = useState(false);
    const [ManagementNotice, SetManagementNotice] = useState('');
    const [IsPostComposerOpen, SetIsPostComposerOpen] =
        useState(false);
    const [IsPostSaving, SetIsPostSaving] =
        useState(false);
    const [PostComposerNotice, SetPostComposerNotice] =
        useState('');
    const [CopiedPhotoPost, SetCopiedPhotoPost] =
        useState<PhotoPostCopyData | null>(null);
    const [EditingItem, SetEditingItem] =
        useState<GalleryIndexItem | null>(null);
    const [EditingPassword, SetEditingPassword] =
        useState<string | null>(null);
    const [IsEditingPasswordLoading, SetIsEditingPasswordLoading] =
        useState(false);
    const [IsCardSaving, SetIsCardSaving] =
        useState(false);
    const [CardEditorNotice, SetCardEditorNotice] =
        useState('');
    const [CustomizationView, SetCustomizationView] =
        useState<PhotoCustomizationView>(null);
    const [ActiveViewMode, SetActiveViewMode] =
        useState<GalleryDetailViewMode>('book');
    const OrderBeforeDragReference =
        useRef<GalleryIndexItem[]>(PhotoPosts);
    const DragOrderReference =
        useRef<GalleryIndexItem[]>(PhotoPosts);
    const AllItems = [
        ...PhotoPosts,
        ...GalleryIndexItems.filter(
            (Item) =>
                PhotoPosts.some(
                    (PhotoPost) => PhotoPost.Id === Item.Id,
                ) === false,
        ),
    ];
    const VisibleItems = AllItems.filter(
        (Item) =>
        {
            const SavedCustomization =
                CardCustomizations[Item.Id];

            if(SavedCustomization?.IsDeleted === true)
            {
                return false;
            }

            if(
                SavedCustomization?.IsPrivate === true
                && IsAuthenticated === false
            )
            {
                return false;
            }

            if(ActiveCategory === '전체')
            {
                return true;
            }

            const Category =
                SavedCustomization === undefined
                    ? Item.DetailCategory
                    : SavedCustomization.Category;

            return (
                Category === ActiveCategory
                && Categories.includes(ActiveCategory)
            );
        },
    );

    useEffect(() =>
    {
        let IsMounted = true;

        void LoadPhotoPageCategories()
            .then((LoadedCategories) =>
            {
                if(IsMounted === false)
                {
                    return;
                }

                SetCategories([
                    '전체',
                    ...LoadedCategories,
                ]);
            })
            .catch(() =>
            {
                if(
                    IsMounted
                    && IsAuthenticated
                )
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

    useEffect(() =>
    {
        let IsMounted = true;

        void LoadPhotoPosts()
            .then((LoadedPosts) =>
            {
                if(IsMounted)
                {
                    SetPhotoPosts(LoadedPosts);
                }
            })
            .catch(() =>
            {
                if(IsMounted && IsAuthenticated)
                {
                    SetPostComposerNotice(
                        '사진 게시글을 불러오지 못했습니다.',
                    );
                }
            });

        return () =>
        {
            IsMounted = false;
        };
    }, [IsAuthenticated]);

    useEffect(() =>
    {
        let IsMounted = true;

        void LoadPhotoPageDescription()
            .then((Description) =>
            {
                if(IsMounted)
                {
                    SetPhotoPageDescription(Description);
                }
            })
            .catch(() =>
            {
                if(
                    IsMounted
                    && IsAuthenticated
                )
                {
                    SetPhotoPageHeadingNotice(
                        '사진 페이지 소개 설정을 불러오지 못했습니다.',
                    );
                }
            });

        return () =>
        {
            IsMounted = false;
        };
    }, [IsAuthenticated]);

    useEffect(() =>
    {
        let IsMounted = true;

        void LoadPhotoPageHeading()
            .then((Heading) =>
            {
                if(IsMounted)
                {
                    SetPhotoPageHeading(Heading);
                }
            })
            .catch(() =>
            {
                if(
                    IsMounted
                    && IsAuthenticated
                )
                {
                    SetPhotoPageHeadingNotice(
                        '사진 페이지 제목 설정을 불러오지 못했습니다.',
                    );
                }
            });

        return () =>
        {
            IsMounted = false;
        };
    }, [IsAuthenticated]);

    useEffect(() =>
    {
        let IsMounted = true;

        void LoadPhotoCardCustomizations()
            .then((LoadedCustomizations) =>
            {
                if(IsMounted)
                {
                    SetCardCustomizations(
                        LoadedCustomizations,
                    );
                }
            })
            .catch(() =>
            {
                if(
                    IsMounted
                    && IsAuthenticated
                )
                {
                    SetCardEditorNotice(
                        '사진 카드 설정을 불러오지 못했습니다.',
                    );
                }
            });

        return () =>
        {
            IsMounted = false;
        };
    }, [IsAuthenticated]);

    function OpenProjectDetail(Item: GalleryIndexItem)
    {
        if(
            Item.IsPasswordProtected === true
            && IsAuthenticated === false
            && Item.ImagePaths.length === 0
        )
        {
            SetPasswordUnlockNotice('');
            SetPasswordPromptItem(Item);
            return;
        }

        ShowProjectDetail(Item);
    }

    function ShowProjectDetail(Item: GalleryIndexItem)
    {
        const CardCustomization =
            GetCardCustomization(Item);
        const MatchedProject = GalleryProjects.find(
            (Candidate) => Candidate.ImagePath === Item.ImagePaths[0],
        );
        const Images = Item.ImagePaths.map(
            (ImagePath, ImageIndex): GalleryProjectImage =>
        {
            const ImageProject = GalleryProjects.find(
                (Candidate) =>
                    Candidate.ImagePath === ImagePath,
            );
            const OrderedLayoutItem =
                Item.ImageLayout?.[ImageIndex];
            const LayoutItem =
                OrderedLayoutItem?.ImagePath === ImagePath
                    ? OrderedLayoutItem
                    : Item.ImageLayout?.find(
                        (Candidate, CandidateIndex) =>
                            CandidateIndex >= ImageIndex
                            && Candidate.ImagePath === ImagePath,
                    )
                    ?? Item.ImageLayout?.find(
                        (Candidate) =>
                            Candidate.ImagePath === ImagePath,
                    );

            return {
                ImagePath,
                Alt: ImageProject?.Alt ?? Item.Alt,
                CreditName:
                    ImageProject?.CreditName ?? '',
                CreditUrl:
                    ImageProject?.CreditUrl ?? '',
                ForwardDirection:
                    LayoutItem?.ForwardDirection
                    ?? (
                        ImageIndex ===
                        Item.ImagePaths.length - 1
                            ? null
                            : 'right'
                    ),
                X: LayoutItem?.X ?? ImageIndex % 5,
                Y:
                    LayoutItem?.Y
                    ?? Math.floor(ImageIndex / 5),
            };
        });
        const Project: GalleryProject =
            MatchedProject ?? {
                Id: Item.Id,
                Category: 'architecture',
                CategoryLabel:
                    Item.DetailCategory || 'Photo',
                Title: Item.Title,
                Location: '',
                Year: Item.Date.slice(-4),
                ImagePath: Item.ImagePaths[0],
                Alt: Item.Alt,
                Orientation: 'portrait',
                Note: Item.Description,
                CreditName: '',
                CreditUrl: '',
            };

        SetOpenProject({
            ...Project,
            Title: Item.Title,
            CategoryLabel: Item.Category,
            Year: Item.Date.slice(-4),
            Note: Item.Description,
            Alt: Item.Alt,
            Location: 'Various places',
            Images,
            BookCoverImagePath:
                CardCustomization.ThumbnailUrl,
            BookCoverTextLayers:
                CardCustomization.TextLayers,
            BookPageNumberColor:
                CardCustomization.PageNumberColor,
            BookPageNumberOpacity:
                CardCustomization.PageNumberOpacity,
            DefaultViewMode: Item.DefaultViewMode,
            EnabledViewModes: [...Item.EnabledViewModes],
            ScrollDirection: Item.ScrollDirection,
        });
        SetActiveImageIndex(0);
        SetImageNavigationDirection('right');
        SetActiveViewMode(
            Item.EnabledViewModes.includes('book')
                ? 'book'
                : 'scroll',
        );
    }

    function ClosePasswordPrompt()
    {
        if(IsPasswordUnlocking)
        {
            return;
        }

        SetPasswordPromptItem(null);
        SetPasswordUnlockNotice('');
    }

    async function UnlockProtectedPhotoPost(Password: string)
    {
        if(
            PasswordPromptItem === null
            || IsPasswordUnlocking
        )
        {
            return;
        }

        SetIsPasswordUnlocking(true);
        SetPasswordUnlockNotice('');

        try
        {
            const UnlockedItem = await UnlockPhotoPost(
                PasswordPromptItem.Id,
                Password,
            );
            SetPhotoPosts((Current) =>
                Current.map((Item) =>
                    Item.Id === UnlockedItem.Id
                        ? UnlockedItem
                        : Item,
                ),
            );
            SetPasswordPromptItem(null);
            ShowProjectDetail(UnlockedItem);
        }
        catch
        {
            SetPasswordUnlockNotice(
                '비밀번호가 올바르지 않습니다.',
            );
        }
        finally
        {
            SetIsPasswordUnlocking(false);
        }
    }

    function CloseProjectDetail()
    {
        SetOpenProject(null);
        SetActiveImageIndex(0);
        SetImageNavigationDirection('right');
        SetActiveViewMode('book');
    }

    function NavigateImage(Direction: -1 | 1)
    {
        if(OpenProject === null)
        {
            return;
        }

        const ImageCount = OpenProject.Images?.length ?? 1;
        const NextIndex = ActiveImageIndex + Direction;

        if(
            NextIndex < 0
            || NextIndex >= ImageCount
        )
        {
            return;
        }

        SetImageNavigationDirection(
            Direction > 0
                ? OpenProject.Images?.[
                    ActiveImageIndex
                ]?.ForwardDirection ?? 'right'
                : GetOppositePhotoPageDirection(
                    OpenProject.Images?.[
                        NextIndex
                    ]?.ForwardDirection ?? 'right',
                ),
        );
        SetActiveImageIndex(NextIndex);
    }

    function OpenPreviousImage()
    {
        NavigateImage(-1);
    }

    function OpenNextImage()
    {
        NavigateImage(1);
    }

    function SelectImage(ImageIndex: number)
    {
        if(ImageIndex === ActiveImageIndex)
        {
            return;
        }

        const CurrentImage =
            OpenProject?.Images?.[ActiveImageIndex];
        const PreviousImage =
            OpenProject?.Images?.[ImageIndex];
        SetImageNavigationDirection(
            ImageIndex === ActiveImageIndex + 1
                ? CurrentImage?.ForwardDirection ?? 'right'
                : ImageIndex === ActiveImageIndex - 1
                    ? GetOppositePhotoPageDirection(
                        PreviousImage?.ForwardDirection
                        ?? 'right',
                    )
                    : ImageIndex > ActiveImageIndex
                        ? 'right'
                        : 'left',
        );
        SetActiveImageIndex(ImageIndex);
    }

    function ChangeViewMode(
        ViewMode: GalleryDetailViewMode,
    )
    {
        if(
            OpenProject?.EnabledViewModes?.includes(ViewMode)
            === false
        )
        {
            return;
        }

        SetActiveViewMode(ViewMode);

        if(ViewMode === 'scroll')
        {
            SetActiveImageIndex(0);
            SetImageNavigationDirection(
                OpenProject?.Images?.[0]
                    ?.ForwardDirection ?? 'right',
            );
        }
    }

    function OpenCustomization()
    {
        SetPhotoPageHeadingNotice('');
        SetCustomizationView('menu');
    }

    function OpenCustomizationOption(OptionIndex: number)
    {
        if(OptionIndex !== 0)
        {
            return;
        }

        SetDraftPhotoPageHeading({
            ...PhotoPageHeading,
        });
        SetDraftPhotoPageDescription({
            ...PhotoPageDescription,
        });
        SetPhotoPageHeadingNotice('');
        SetCustomizationView('heading');
    }

    function ReturnToCustomizationMenu()
    {
        if(
            IsPhotoPageHeadingSaving
        )
        {
            return;
        }

        SetCustomizationView('menu');
    }

    function CloseCustomization()
    {
        if(
            IsPhotoPageHeadingSaving
        )
        {
            return;
        }

        SetCustomizationView(null);
    }

    function UpdatePhotoPageHeading(
        Update: Partial<PhotoPageHeadingCustomization>,
    )
    {
        SetDraftPhotoPageHeading((Current) => ({
            ...Current,
            ...Update,
        }));
    }

    function UpdatePhotoPageDescription(
        Update: Partial<PhotoPageDescriptionCustomization>,
    )
    {
        SetDraftPhotoPageDescription((Current) => ({
            ...Current,
            ...Update,
        }));
    }

    async function SavePhotoPageHeadingCustomization()
    {
        if(
            IsAuthenticated === false
            || IsPhotoPageHeadingSaving
        )
        {
            return;
        }

        SetIsPhotoPageHeadingSaving(true);
        SetPhotoPageHeadingNotice('');

        try
        {
            const SavedIntroduction =
                await SavePhotoPageHeading(
                    DraftPhotoPageHeading,
                    DraftPhotoPageDescription,
                );
            SetPhotoPageHeading(
                SavedIntroduction.Heading,
            );
            SetPhotoPageDescription(
                SavedIntroduction.Description,
            );
            SetDraftPhotoPageHeading({
                ...SavedIntroduction.Heading,
            });
            SetDraftPhotoPageDescription({
                ...SavedIntroduction.Description,
            });
            SetCustomizationView(null);
        }
        catch
        {
            SetPhotoPageHeadingNotice(
                '사진 페이지 제목 설정을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsPhotoPageHeadingSaving(false);
        }
    }

    function SelectCategory(Category: string)
    {
        if(Category === ActiveCategory)
        {
            return;
        }

        SetCategoryNotice('');

        if(
            typeof document.startViewTransition
            !== 'function'
            || window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches
        )
        {
            SetActiveCategory(Category);
            return;
        }

        document.startViewTransition(() =>
        {
            flushSync(() =>
            {
                SetActiveCategory(Category);
            });
        });
    }

    function OpenCategoryEditor()
    {
        if(
            IsAuthenticated === false
            || IsCategorySaving
        )
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
            const SavedCategories =
                await SavePhotoPageCategories(
                    NextCategories,
                );
            SetCategories([
                '전체',
                ...SavedCategories,
            ]);

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
        const EditableCategories = Categories.slice(1);

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

        if(EditableCategories.includes(Category))
        {
            SetCategoryNotice('이미 같은 카테고리가 있습니다.');
            return;
        }

        if(EditableCategories.length >= 20)
        {
            SetCategoryNotice(
                '카테고리는 최대 20개까지 만들 수 있습니다.',
            );
            return;
        }

        const IsSaved = await PersistCategories([
            ...EditableCategories,
            Category,
        ]);

        if(IsSaved)
        {
            SetNewCategoryName('');
            SetIsCategoryEditorOpen(false);
        }
    }

    async function DeleteCategory(Category: string)
    {
        if(
            Category === '전체'
            || IsCategorySaving
        )
        {
            return;
        }

        const IsSaved = await PersistCategories(
            Categories
                .slice(1)
                .filter((Candidate) => Candidate !== Category),
        );

        if(
            IsSaved
            && ActiveCategory === Category
        )
        {
            SetActiveCategory('전체');
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
            await RenameArchiveCategory(
                'photo',
                CurrentName,
                Category,
            );
            SetCategories((Current) =>
                Current.map((Name) =>
                    Name === CurrentName ? Category : Name,
                ),
            );
            SetActiveCategory(Category);
            SetPhotoPosts((Current) =>
                Current.map((Item) =>
                    Item.DetailCategory === CurrentName
                        ? {
                            ...Item,
                            Category,
                            DetailCategory: Category,
                        }
                        : Item,
                ),
            );
            SetCardCustomizations((Current) =>
                Object.fromEntries(
                    Object.entries(Current).map(([Id, Value]) => [
                        Id,
                        Value.Category === CurrentName
                            ? { ...Value, Category }
                            : Value,
                    ]),
                ),
            );
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

    function GetCardCustomization(
        Item: GalleryIndexItem,
    ): PhotoCardCustomization
    {
        return (
            CardCustomizations[Item.Id]
            ?? CreateDefaultCardCustomization(Item)
        );
    }

    async function OpenCardEditor(Item: GalleryIndexItem)
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetCardEditorNotice('');
        SetEditingPassword(null);
        SetIsEditingPasswordLoading(
            Item.IsPasswordProtected === true,
        );

        if(Item.IsPasswordProtected !== true)
        {
            SetEditingItem(Item);
            return;
        }

        try
        {
            SetEditingPassword(
                await LoadPhotoPostPassword(Item.Id),
            );
        }
        catch
        {
            SetCardEditorNotice(
                '기존 비밀번호를 불러오지 못했습니다.',
            );
        }
        finally
        {
            SetIsEditingPasswordLoading(false);
            SetEditingItem(Item);
        }
    }

    function OpenPostComposer()
    {
        if(
            IsAuthenticated === false
            || IsPostSaving
        )
        {
            return;
        }

        SetPostComposerNotice('');
        SetIsPostComposerOpen(true);
    }

    function CanManageItem(ItemId: string): boolean
    {
        return PhotoPosts.some((Item) => Item.Id === ItemId);
    }

    function StartItemDrag(ItemId: string)
    {
        if(
            IsManaging === false
            || IsOrderSaving
            || CanManageItem(ItemId) === false
        )
        {
            return;
        }

        OrderBeforeDragReference.current = PhotoPosts;
        DragOrderReference.current = PhotoPosts;
        SetDraggedItemId(ItemId);
    }

    function MoveItemDrag(TargetItemId: string)
    {
        if(
            DraggedItemId === null
            || CanManageItem(TargetItemId) === false
        )
        {
            return;
        }

        SetPhotoPosts((Current) =>
        {
            const Next = MoveGalleryIndexItem(
                Current,
                DraggedItemId,
                TargetItemId,
            );
            DragOrderReference.current = Next;
            return Next;
        });
    }

    async function EndItemDrag()
    {
        if(DraggedItemId === null)
        {
            return;
        }

        SetDraggedItemId(null);
        SetIsOrderSaving(true);
        SetManagementNotice('');

        try
        {
            await SavePhotoPostOrder(DragOrderReference.current);
            const Ordered = DragOrderReference.current.map(
                (Item, Index) => ({
                    ...Item,
                    SortOrder: Index,
                }),
            );
            DragOrderReference.current = Ordered;
            SetPhotoPosts(Ordered);
            SetManagementNotice('순서를 저장했습니다.');
        }
        catch
        {
            SetPhotoPosts(OrderBeforeDragReference.current);
            DragOrderReference.current =
                OrderBeforeDragReference.current;
            SetManagementNotice('순서를 저장하지 못했습니다.');
        }
        finally
        {
            SetIsOrderSaving(false);
        }
    }

    function ClosePostComposer()
    {
        if(IsPostSaving)
        {
            return;
        }

        SetPostComposerNotice('');
        SetIsPostComposerOpen(false);
    }

    async function PublishPhotoPost(
        Input: CreatePhotoPostInput,
        ContentImages: PhotoPostContentImage[],
        ThumbnailSource: string | File | null,
    )
    {
        if(
            IsAuthenticated === false
            || IsPostSaving
        )
        {
            return;
        }

        SetIsPostSaving(true);
        SetPostComposerNotice('');

        try
        {
            const Created =
                await CreatePhotoPost(
                    Input,
                    ContentImages,
                    ThumbnailSource,
                );
            SetPhotoPosts((Current) => [
                Created.Item,
                ...Current,
            ]);
            SetCardCustomizations((Current) => ({
                ...Current,
                [Created.Customization.CardId]:
                    Created.Customization,
            }));
            SetActiveCategory('전체');
            SetIsPostComposerOpen(false);
        }
        catch
        {
            SetPostComposerNotice(
                '게시글을 저장하지 못했습니다. 사진 형식과 용량을 확인해주세요.',
            );
        }
        finally
        {
            SetIsPostSaving(false);
        }
    }

    function CopyPhotoPost(
        CopyData: PhotoPostCopyData,
    )
    {
        SetCopiedPhotoPost({
            ...CopyData,
            ContentImages: CopyData.ContentImages.map(
                (ContentImage) => ({
                    ...ContentImage,
                }),
            ),
            TextLayers: CopyData.TextLayers.map(
                (Layer) => ({
                    ...Layer,
                }),
            ),
        });
    }

    function CloseCardEditor()
    {
        if(IsCardSaving)
        {
            return;
        }

        SetEditingItem(null);
        SetEditingPassword(null);
        SetIsEditingPasswordLoading(false);
        SetCardEditorNotice('');
    }

    async function SaveCardCustomization(
        Customization: PhotoCardCustomization,
        ThumbnailFile: File | null,
        ContentImages: PhotoPostContentImage[],
        EnabledViewModes: GalleryDetailViewMode[],
        PasswordUpdate: string | null,
    )
    {
        if(
            IsAuthenticated === false
            || IsCardSaving
            || EditingItem === null
        )
        {
            return;
        }

        SetIsCardSaving(true);
        SetCardEditorNotice('');

        try
        {
            let SavedCustomization =
                await SavePhotoCardCustomization(
                    Customization,
                    ThumbnailFile,
                );
            const SavedItem =
                await SavePhotoPostContentImages(
                    EditingItem,
                    SavedCustomization.Category,
                    SavedCustomization.ThumbnailUrl,
                    ContentImages,
                    EnabledViewModes,
                );
            if(PasswordUpdate !== null)
            {
                const IsPasswordProtected =
                    await SetPhotoPostPassword(
                        SavedCustomization.CardId,
                        PasswordUpdate,
                    );
                SavedCustomization = {
                    ...SavedCustomization,
                    IsPasswordProtected,
                };
            }
            const SavedItemWithAccess = {
                ...SavedItem,
                IsPasswordProtected:
                    SavedCustomization.IsPasswordProtected,
            };
            SetCardCustomizations((Current) => ({
                ...Current,
                [SavedCustomization.CardId]:
                    SavedCustomization,
            }));
            SetPhotoPosts((Current) =>
                Current.some(
                    (Item) => Item.Id === SavedItemWithAccess.Id,
                )
                    ? Current.map((Item) =>
                        Item.Id === SavedItemWithAccess.Id
                            ? SavedItemWithAccess
                            : Item,
                    )
                    : [SavedItemWithAccess, ...Current],
            );
            SetEditingItem(null);
            SetEditingPassword(null);
        }
        catch
        {
            SetCardEditorNotice(
                '사진 카드 변경사항을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsCardSaving(false);
        }
    }

    async function DeleteCard(
        Customization: PhotoCardCustomization,
    )
    {
        if(
            IsAuthenticated === false
            || IsCardSaving
        )
        {
            return;
        }

        SetIsCardSaving(true);
        SetCardEditorNotice('');

        try
        {
            const DeletedCustomization =
                await SavePhotoCardCustomization(
                    {
                        ...Customization,
                        IsDeleted: true,
                    },
                    null,
                );
            SetCardCustomizations((Current) => ({
                ...Current,
                [DeletedCustomization.CardId]:
                    DeletedCustomization,
            }));
            SetEditingItem(null);
        }
        catch
        {
            SetCardEditorNotice(
                '사진 게시글을 삭제하지 못했습니다.',
            );
        }
        finally
        {
            SetIsCardSaving(false);
        }
    }

    return {
        PhotoPosts,
        VisibleItems,
        CanManageItem,
        Categories,
        ActiveCategory,
        IsAuthenticated,
        DraggedItemId,
        IsManaging,
        IsOrderSaving,
        ManagementNotice,
        IsCategoryEditorOpen,
        IsCategorySaving,
        NewCategoryName,
        CategoryNotice,
        PhotoPageHeading,
        PhotoPageDescription,
        DraftPhotoPageHeading,
        DraftPhotoPageDescription,
        IsPhotoPageHeadingSaving,
        PhotoPageHeadingNotice,
        IsPostComposerOpen,
        IsPostSaving,
        PostComposerNotice,
        CopiedPhotoPost,
        EditingItem,
        EditingPassword,
        IsEditingPasswordLoading,
        IsCardSaving,
        CardEditorNotice,
        OpenProject,
        PasswordPromptItem,
        IsPasswordUnlocking,
        PasswordUnlockNotice,
        ActiveImageIndex,
        ImageNavigationDirection,
        ActiveViewMode,
        CustomizationView,
        SelectCategory,
        OpenCategoryEditor,
        CloseCategoryEditor,
        SetNewCategoryName,
        CreateCategory,
        DeleteCategory,
        RenameCategory,
        GetCardCustomization,
        OpenCardEditor,
        OpenPostComposer,
        StartItemDrag,
        MoveItemDrag,
        EndItemDrag,
        ClosePostComposer,
        PublishPhotoPost,
        CopyPhotoPost,
        CloseCardEditor,
        SaveCardCustomization,
        DeleteCard,
        ChangeViewMode,
        OpenProjectDetail,
        ClosePasswordPrompt,
        UnlockProtectedPhotoPost,
        CloseProjectDetail,
        OpenPreviousImage,
        OpenNextImage,
        SelectImage,
        OpenCustomization,
        OpenCustomizationOption,
        ReturnToCustomizationMenu,
        CloseCustomization,
        UpdatePhotoPageHeading,
        UpdatePhotoPageDescription,
        SavePhotoPageHeadingCustomization,
    };
}
