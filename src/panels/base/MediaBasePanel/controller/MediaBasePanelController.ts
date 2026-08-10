'use client';

import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { UseAuthSession } from '@/app/shell/AuthSessionProvider';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import { RenameArchiveCategory } from '@/managers/ArchiveCategoryManager';
import {
    CreateMediaPost,
    DeleteMediaPost,
    SaveMediaPostOrder,
    SaveMediaPageCustomization,
    UpdateMediaPost,
} from './actions/MediaPostActions';
import { MoveMediaItem } from './MediaBasePanelState';
import type {
    MediaPageTextCustomization,
} from './MediaBasePanelState';
import type {
    CreateMediaPostInput,
    MediaArchiveItem,
} from './MediaBasePanelTypes';

type MediaCustomizationView = 'menu' | 'heading' | 'grid' | null;

export function useMediaBasePanelController()
{
    const InitialAppState = UseInitialAppState();
    const { IsAuthenticated } = UseAuthSession();
    const [Items, SetItems] = useState(
        InitialAppState.MediaPosts,
    );
    const [ActiveCategory, SetActiveCategory] =
        useState('전체');
    const [PageCustomization, SetPageCustomization] =
        useState(InitialAppState.MediaPageCustomization);
    const [DraftPageCustomization, SetDraftPageCustomization] =
        useState(InitialAppState.MediaPageCustomization);
    const [OpenItem, SetOpenItem] =
        useState<MediaArchiveItem | null>(null);
    const [EditingItem, SetEditingItem] =
        useState<MediaArchiveItem | null>(null);
    const [IsComposerOpen, SetIsComposerOpen] = useState(false);
    const [IsCategoryEditorOpen, SetIsCategoryEditorOpen] =
        useState(false);
    const [IsCategorySaving, SetIsCategorySaving] =
        useState(false);
    const [CustomizationView, SetCustomizationView] =
        useState<MediaCustomizationView>(null);
    const [IsCustomizationSaving, SetIsCustomizationSaving] =
        useState(false);
    const IsManaging = IsAuthenticated;
    const [IsSaving, SetIsSaving] = useState(false);
    const [IsOrderSaving, SetIsOrderSaving] = useState(false);
    const [DraggedItemId, SetDraggedItemId] =
        useState<string | null>(null);
    const [CategoryNotice, SetCategoryNotice] = useState('');
    const [NewCategoryName, SetNewCategoryName] = useState('');
    const [Notice, SetNotice] = useState('');
    const [ManagementNotice, SetManagementNotice] = useState('');
    const [CustomizationNotice, SetCustomizationNotice] =
        useState('');
    const OrderBeforeDragReference =
        useRef<MediaArchiveItem[]>(Items);
    const DragOrderReference = useRef<MediaArchiveItem[]>(Items);
    const VisibleItems =
        ActiveCategory === '전체'
            ? Items
            : Items.filter(
                (Item) => Item.Category === ActiveCategory,
            );

    function SelectCategory(Category: string)
    {
        if(Category === ActiveCategory)
        {
            return;
        }

        SetCategoryNotice('');

        if(
            typeof document.startViewTransition !== 'function'
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
            flushSync(() => SetActiveCategory(Category));
        });
    }

    async function PersistCategories(
        Categories: string[],
    ): Promise<boolean>
    {
        if(IsAuthenticated === false || IsCategorySaving)
        {
            return false;
        }

        SetIsCategorySaving(true);
        SetCategoryNotice('');

        try
        {
            const Saved = await SaveMediaPageCustomization({
                ...PageCustomization,
                Categories,
            });
            SetPageCustomization(Saved);
            SetDraftPageCustomization(Saved);

            if(
                ActiveCategory !== '전체'
                && Saved.Categories.includes(ActiveCategory) === false
            )
            {
                SetActiveCategory('전체');
            }

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
        const Categories = PageCustomization.Categories;

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
            SetNewCategoryName('');
            SetIsCategoryEditorOpen(false);
        }
    }

    async function DeleteCategory(Category: string)
    {
        if(
            IsCategorySaving
            || PageCustomization.Categories.length <= 1
        )
        {
            return;
        }

        await PersistCategories(
            PageCustomization.Categories.filter(
                (Candidate) => Candidate !== Category,
            ),
        );
    }

    async function RenameCategory(
        CurrentName: string,
        NextName: string,
    ): Promise<boolean>
    {
        const Category = NextName.trim();
        const Categories = PageCustomization.Categories;

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
                'media',
                CurrentName,
                Category,
            );
            const NextCustomization = {
                ...PageCustomization,
                Categories: Categories.map((Name) =>
                    Name === CurrentName ? Category : Name,
                ),
            };
            SetPageCustomization(NextCustomization);
            SetDraftPageCustomization(NextCustomization);
            SetItems((Current) =>
                Current.map((Item) =>
                    Item.Category === CurrentName
                        ? { ...Item, Category }
                        : Item,
                ),
            );
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

    function OpenCategoryEditor()
    {
        SetCategoryNotice('');
        SetIsCategoryEditorOpen(true);
    }

    function CloseCategoryEditor()
    {
        SetNewCategoryName('');
        SetIsCategoryEditorOpen(false);
    }

    function OpenComposer()
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetEditingItem(null);
        SetNotice('');
        SetIsComposerOpen(true);
    }

    function OpenCustomization()
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetCustomizationNotice('');
        SetCustomizationView('menu');
    }

    function OpenCustomizationOption(OptionIndex: number)
    {
        if(OptionIndex !== 0 && OptionIndex !== 1)
        {
            return;
        }

        SetDraftPageCustomization({
            Categories: [
                ...PageCustomization.Categories,
            ],
            Description: {
                ...PageCustomization.Description,
            },
            GridColumns: PageCustomization.GridColumns,
            Heading: {
                ...PageCustomization.Heading,
            },
        });
        SetCustomizationNotice('');
        SetCustomizationView(
            OptionIndex === 0 ? 'heading' : 'grid',
        );
    }

    function ReturnToCustomizationMenu()
    {
        if(IsCustomizationSaving === false)
        {
            SetCustomizationView('menu');
        }
    }

    function CloseCustomization()
    {
        if(IsCustomizationSaving === false)
        {
            SetCustomizationView(null);
        }
    }

    function UpdatePageCustomization(
        Key: 'Description' | 'Heading',
        Update: Partial<MediaPageTextCustomization>,
    )
    {
        SetDraftPageCustomization((Current) => ({
            ...Current,
            [Key]: {
                ...Current[Key],
                ...Update,
            },
        }));
    }

    function UpdateGridColumns(GridColumns: number)
    {
        SetDraftPageCustomization((Current) => ({
            ...Current,
            GridColumns: Math.min(
                10,
                Math.max(1, Math.round(GridColumns)),
            ),
        }));
    }

    async function SavePageCustomization()
    {
        if(IsAuthenticated === false || IsCustomizationSaving)
        {
            return;
        }

        SetIsCustomizationSaving(true);
        SetCustomizationNotice('');

        try
        {
            const Saved = await SaveMediaPageCustomization(
                DraftPageCustomization,
            );
            SetPageCustomization(Saved);
            SetDraftPageCustomization(Saved);

            if(
                ActiveCategory !== '전체'
                && Saved.Categories.includes(ActiveCategory) === false
            )
            {
                SetActiveCategory('전체');
            }

            SetCustomizationView(null);
        }
        catch
        {
            SetCustomizationNotice(
                '영상 페이지 제목 설정을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsCustomizationSaving(false);
        }
    }

    function OpenEditor(Item: MediaArchiveItem)
    {
        if(IsAuthenticated === false)
        {
            return;
        }

        SetEditingItem(Item);
        SetNotice('');
        SetIsComposerOpen(true);
    }

    function CloseComposer()
    {
        if(IsSaving === false)
        {
            SetIsComposerOpen(false);
            SetEditingItem(null);
        }
    }

    function OpenDetail(Item: MediaArchiveItem)
    {
        SetOpenItem(Item);
    }

    function CloseDetail()
    {
        SetOpenItem(null);
    }

    function StartItemDrag(ItemId: string)
    {
        if(IsManaging === false || IsOrderSaving)
        {
            return;
        }

        OrderBeforeDragReference.current = Items;
        DragOrderReference.current = Items;
        SetDraggedItemId(ItemId);
    }

    function MoveItemDrag(TargetItemId: string)
    {
        if(DraggedItemId === null || DraggedItemId === TargetItemId)
        {
            return;
        }

        SetItems((Current) =>
        {
            const Next = MoveMediaItem(
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
            await SaveMediaPostOrder(DragOrderReference.current);
            const OrderedItems = DragOrderReference.current.map(
                (Item, Index) => ({
                    ...Item,
                    SortOrder: Index,
                }),
            );
            DragOrderReference.current = OrderedItems;
            SetItems(OrderedItems);
            SetManagementNotice('순서를 저장했습니다.');
        }
        catch
        {
            SetItems(OrderBeforeDragReference.current);
            DragOrderReference.current =
                OrderBeforeDragReference.current;
            SetManagementNotice('순서를 저장하지 못했습니다.');
        }
        finally
        {
            SetIsOrderSaving(false);
        }
    }

    async function PublishPost(
        Input: CreateMediaPostInput,
        File: File | null,
    )
    {
        if(IsSaving)
        {
            return;
        }

        SetIsSaving(true);
        SetNotice('');

        try
        {
            if(EditingItem === null)
            {
                const CreatedPost =
                    await CreateMediaPost(Input, File);
                SetItems((Current) => [CreatedPost, ...Current]);
            }
            else
            {
                const UpdatedPost = await UpdateMediaPost(
                    EditingItem,
                    Input,
                    File,
                );
                SetItems((Current) =>
                    Current.map((Item) =>
                        Item.Id === UpdatedPost.Id
                            ? UpdatedPost
                            : Item,
                    ),
                );
            }

            SetEditingItem(null);
            SetIsComposerOpen(false);
        }
        catch(CaughtError)
        {
            const Code =
                CaughtError instanceof Error
                    ? CaughtError.message
                    : '';
            const MessageByCode: Record<string, string> = {
                category_required: '카테고리를 선택해 주세요.',
                content_required: '내용을 입력해 주세요.',
                title_required: '제목을 입력해 주세요.',
                video_required: '영상 파일을 선택해 주세요.',
                invalid_video_file:
                    '50MB 이하의 영상 파일을 선택해 주세요.',
                invalid_youtube_url:
                    '올바른 YouTube 영상 링크를 입력해 주세요.',
            };
            SetNotice(
                MessageByCode[Code]
                ?? '영상 게시글을 저장하지 못했습니다.',
            );
        }
        finally
        {
            SetIsSaving(false);
        }
    }

    async function DeleteEditingPost()
    {
        if(EditingItem === null || IsSaving)
        {
            return;
        }

        SetIsSaving(true);
        SetNotice('');

        try
        {
            await DeleteMediaPost(EditingItem);
            SetItems((Current) =>
                Current.filter((Item) => Item.Id !== EditingItem.Id),
            );
            SetEditingItem(null);
            SetIsComposerOpen(false);
        }
        catch
        {
            SetNotice('영상 게시글을 삭제하지 못했습니다.');
        }
        finally
        {
            SetIsSaving(false);
        }
    }

    return {
        ActiveCategory,
        CategoryNotice,
        CustomizationView,
        DraggedItemId,
        CustomizationNotice,
        DraftPageCustomization,
        EditingItem,
        IsAuthenticated,
        IsCategoryEditorOpen,
        IsCategorySaving,
        IsComposerOpen,
        IsCustomizationSaving,
        IsManaging,
        IsOrderSaving,
        IsSaving,
        Items,
        ManagementNotice,
        NewCategoryName,
        Notice,
        OpenItem,
        PageCustomization,
        CloseCategoryEditor,
        CloseComposer,
        CloseCustomization,
        CloseDetail,
        CreateCategory,
        DeleteCategory,
        RenameCategory,
        DeleteEditingPost,
        EndItemDrag,
        MoveItemDrag,
        OpenCategoryEditor,
        OpenComposer,
        OpenCustomization,
        OpenCustomizationOption,
        OpenDetail,
        OpenEditor,
        PublishPost,
        ReturnToCustomizationMenu,
        SavePageCustomization,
        StartItemDrag,
        SelectCategory,
        SetNewCategoryName,
        UpdatePageCustomization,
        UpdateGridColumns,
        VisibleItems,
    };
}
