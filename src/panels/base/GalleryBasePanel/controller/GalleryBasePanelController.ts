'use client';

import {
    useEffect,
    useRef,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { AppNavigator } from '@/app/navigation/AppNavigator';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import {
    ApplyTheme,
    ReadStoredTheme,
} from '@/managers/ThemeManager';
import {
    CacheStartPageCustomization,
    DeleteStartPageCategoryImages,
    LoadStartPageCustomization,
    SaveStartPageCustomization,
    UploadStartPageCategoryImage,
} from '@/managers/StartPageCustomizationManager';
import {
    CloneStartPageCustomization,
    IsGalleryBoxLayout,
    MoveGalleryBoxLayout,
    NormalizeDailyMessageRotationSeconds,
} from './GalleryBasePanelState';
import type {
    GalleryCategory,
    ArchiveDestination,
    GalleryCategoryMap,
    GalleryTextStyle,
} from './GalleryBasePanelTypes';

type StartCustomizationView =
    | 'menu'
    | 'categories'
    | 'messages'
    | 'link';

function IsValidHeaderLinkUrl(Url: string)
{
    if(Url.length === 0)
    {
        return true;
    }

    try
    {
        const ParsedUrl = new URL(Url);

        return (
            ParsedUrl.protocol === 'http:'
            || ParsedUrl.protocol === 'https:'
        );
    }
    catch
    {
        return false;
    }
}

function NormalizeTextStyleMapForSave(
    TextStyles: GalleryCategoryMap<GalleryTextStyle>,
): GalleryCategoryMap<GalleryTextStyle>
{
    const Normalize = (
        TextStyle: GalleryTextStyle,
    ): GalleryTextStyle =>
    {
        return {
            ...TextStyle,
            Font: TextStyle.Font.trim() || 'sans',
            Size: Math.min(
                64,
                Math.max(8, Math.round(TextStyle.Size)),
            ),
        };
    };

    return {
        architecture: Normalize(TextStyles.architecture),
        portraits: Normalize(TextStyles.portraits),
        journeys: Normalize(TextStyles.journeys),
        journal: Normalize(TextStyles.journal),
    };
}

export function useGalleryBasePanelController()
{
    const InitialAppState = UseInitialAppState();
    const Router = useRouter();
    const [ActiveHeroCategory, SetActiveHeroCategory] =
        useState<GalleryCategory | null>(null);
    const [IsHeroClosing, SetIsHeroClosing] = useState(false);
    const [EditingBoxLayoutCategory, SetEditingBoxLayoutCategory] =
        useState<GalleryCategory | null>(null);
    const [SelectedBoxLayoutCell, SetSelectedBoxLayoutCell] =
        useState<number | null>(null);
    const HeroCloseTimerReference = useRef<number | null>(null);
    const [IsDarkTheme, SetIsDarkTheme] = useState(false);
    const [CustomizationView, SetCustomizationView] =
        useState<StartCustomizationView | null>(null);
    const [StartCustomization, SetStartCustomization] = useState(
        CloneStartPageCustomization(
            InitialAppState.StartPageCustomization,
        ),
    );
    const [DraftCustomization, SetDraftCustomization] = useState(
        CloneStartPageCustomization(
            InitialAppState.StartPageCustomization,
        ),
    );
    const [IsCustomizationSaving, SetIsCustomizationSaving] =
        useState(false);
    const [UploadingCategory, SetUploadingCategory] =
        useState<GalleryCategory | null>(null);
    const [CustomizationNotice, SetCustomizationNotice] =
        useState('');
    const [
        IsStartCustomizationLoaded,
        SetIsStartCustomizationLoaded,
    ] = useState(true);

    useEffect(() =>
    {
        return () =>
        {
            if(HeroCloseTimerReference.current !== null)
            {
                window.clearTimeout(
                    HeroCloseTimerReference.current,
                );
            }
        };
    }, []);

    useEffect(() =>
    {
        const StoredTheme = ReadStoredTheme();
        const SyncTimer = window.setTimeout(() =>
        {
            SetIsDarkTheme(StoredTheme === 'dark');
        }, 0);

        return () =>
        {
            window.clearTimeout(SyncTimer);
        };
    }, []);

    useEffect(() =>
    {
        let IsMounted = true;

        void LoadStartPageCustomization().then(
            (Customization) =>
            {
                if(IsMounted === false)
                {
                    return;
                }

                CacheStartPageCustomization(Customization);
                SetStartCustomization(
                    CloneStartPageCustomization(Customization),
                );
                SetDraftCustomization(
                    CloneStartPageCustomization(Customization),
                );
                SetIsStartCustomizationLoaded(true);
            },
        );

        return () =>
        {
            IsMounted = false;
        };
    }, []);

    function SelectHeroCategory(Category: GalleryCategory)
    {
        if(IsHeroClosing)
        {
            return;
        }

        SetActiveHeroCategory(Category);
    }

    function ResetHeroCategory()
    {
        if(
            ActiveHeroCategory === null
            || IsHeroClosing
        )
        {
            return;
        }

        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        {
            SetActiveHeroCategory(null);
            return;
        }

        SetIsHeroClosing(true);
        HeroCloseTimerReference.current = window.setTimeout(
            () =>
            {
                SetActiveHeroCategory(null);
                SetIsHeroClosing(false);
                HeroCloseTimerReference.current = null;
            },
            620,
        );
    }

    function OpenBoxDestination(Destination: ArchiveDestination)
    {
        const Navigator = new AppNavigator({
            Push: (Route) => Router.push(Route),
        });
        const PanelByDestination: Record<ArchiveDestination, string> = {
            gallery: 'GalleryIndexBasePanel',
            media: 'MediaBasePanel',
            writing: 'WritingBasePanel',
            memo: 'MemoBasePanel',
        };

        Navigator.Navigate({
            PanelId: PanelByDestination[Destination],
        });
    }

    function ToggleTheme()
    {
        const NextTheme =
            ReadStoredTheme() === 'dark' ? 'light' : 'dark';

        SetIsDarkTheme(NextTheme === 'dark');
        ApplyTheme(NextTheme);
    }

    function OpenCustomization()
    {
        SetEditingBoxLayoutCategory(null);
        SetSelectedBoxLayoutCell(null);
        SetCustomizationNotice('');
        SetCustomizationView('menu');
    }

    function CloseCustomization()
    {
        if(
            IsCustomizationSaving
            || UploadingCategory !== null
        )
        {
            return;
        }

        void DeleteStartPageCategoryImages(
            Object.values(DraftCustomization.CategoryImages),
        );
        SetDraftCustomization(
            CloneStartPageCustomization(StartCustomization),
        );
        SetCustomizationView(null);
    }

    function OpenCustomizationOption(OptionIndex: number)
    {
        if(
            OptionIndex !== 0
            && OptionIndex !== 1
            && OptionIndex !== 2
        )
        {
            return;
        }

        SetDraftCustomization(
            CloneStartPageCustomization(StartCustomization),
        );
        SetCustomizationNotice('');
        const ViewByOption = [
            'categories',
            'messages',
            'link',
        ] as const;

        SetCustomizationView(ViewByOption[OptionIndex]);
    }

    function ReturnToCustomizationMenu()
    {
        if(
            IsCustomizationSaving
            || UploadingCategory !== null
        )
        {
            return;
        }

        SetCustomizationView('menu');
    }

    function UpdateCategoryLabel(
        Category: GalleryCategory,
        Label: string,
    )
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                CategoryLabels: {
                    ...Current.CategoryLabels,
                    [Category]: Label,
                },
            };
        });
        SetCustomizationNotice('');
    }

    function UpdateCategoryTextStyle(
        Category: GalleryCategory,
        TextStyle: GalleryTextStyle,
    )
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                CategoryTextStyles: {
                    ...Current.CategoryTextStyles,
                    [Category]: TextStyle,
                },
            };
        });
        SetCustomizationNotice('');
    }

    function UpdateCategoryCenterTextStyle(
        Category: GalleryCategory,
        TextStyle: GalleryTextStyle,
    )
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                CategoryCenterTextStyles: {
                    ...Current.CategoryCenterTextStyles,
                    [Category]: TextStyle,
                },
            };
        });
        SetCustomizationNotice('');
    }

    function OpenBoxLayoutEditor(Category: GalleryCategory)
    {
        if(HeroCloseTimerReference.current !== null)
        {
            window.clearTimeout(HeroCloseTimerReference.current);
            HeroCloseTimerReference.current = null;
        }

        SetIsHeroClosing(false);
        SetActiveHeroCategory(Category);
        SetEditingBoxLayoutCategory(Category);
        SetSelectedBoxLayoutCell(null);
        SetCustomizationNotice('');
        SetCustomizationView(null);
    }

    function SelectBoxLayoutCell(Cell: number)
    {
        if(
            EditingBoxLayoutCategory === null
            || Cell === 13
            || DraftCustomization.CategoryBoxLayouts[
                EditingBoxLayoutCategory
            ].includes(Cell) === false
        )
        {
            return;
        }

        SetSelectedBoxLayoutCell((Current) =>
            Current === Cell ? null : Cell,
        );
    }

    function MoveBoxLayoutCell(
        FromCell: number,
        ToCell: number,
        Category: GalleryCategory | null =
            EditingBoxLayoutCategory,
    )
    {
        if(Category === null)
        {
            return;
        }

        SetDraftCustomization((Current) =>
        {
            const Layout = Current.CategoryBoxLayouts[Category];
            const NextLayout = MoveGalleryBoxLayout(
                Layout,
                FromCell,
                ToCell,
            );

            if(NextLayout === Layout)
            {
                return Current;
            }

            return {
                ...Current,
                CategoryBoxLayouts: {
                    ...Current.CategoryBoxLayouts,
                    [Category]: NextLayout,
                },
            };
        });
        SetSelectedBoxLayoutCell(null);
        SetCustomizationNotice('');
    }

    function FinishBoxLayoutEditing()
    {
        SetEditingBoxLayoutCategory(null);
        SetSelectedBoxLayoutCell(null);
        SetActiveHeroCategory(null);
        SetIsHeroClosing(false);
        SetCustomizationView('categories');
    }

    function UpdateDestinationLabel(
        Category: GalleryCategory,
        Label: string,
    )
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                DestinationLabels: {
                    ...Current.DestinationLabels,
                    [Category]: Label,
                },
            };
        });
        SetCustomizationNotice('');
    }

    function UpdateDestinationTextStyle(
        Category: GalleryCategory,
        TextStyle: GalleryTextStyle,
    )
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                DestinationTextStyles: {
                    ...Current.DestinationTextStyles,
                    [Category]: TextStyle,
                },
            };
        });
        SetCustomizationNotice('');
    }

    function AddDailyMessage()
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                DailyMessages: [
                    ...Current.DailyMessages,
                    '',
                ],
            };
        });
        SetCustomizationNotice('');
    }

    function RemoveDailyMessage(MessageIndex: number)
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                DailyMessages: Current.DailyMessages.filter(
                    (_Message, Index) => Index !== MessageIndex,
                ),
            };
        });
        SetCustomizationNotice('');
    }

    function UpdateDailyMessage(
        MessageIndex: number,
        Message: string,
    )
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                DailyMessages: Current.DailyMessages.map(
                    (CurrentMessage, Index) =>
                        Index === MessageIndex
                            ? Message
                            : CurrentMessage,
                ),
            };
        });
        SetCustomizationNotice('');
    }

    function UpdateDailyMessageRotationSeconds(Seconds: number)
    {
        SetDraftCustomization((Current) => ({
            ...Current,
            DailyMessageRotationSeconds:
                NormalizeDailyMessageRotationSeconds(Seconds),
        }));
        SetCustomizationNotice('');
    }

    function UpdateHeaderLinkText(Text: string)
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                HeaderLink: {
                    ...Current.HeaderLink,
                    Text,
                },
            };
        });
        SetCustomizationNotice('');
    }

    function UpdateHeaderLinkUrl(Url: string)
    {
        SetDraftCustomization((Current) =>
        {
            return {
                ...Current,
                HeaderLink: {
                    ...Current.HeaderLink,
                    Url,
                },
            };
        });
        SetCustomizationNotice('');
    }

    async function UploadCategoryImage(
        Category: GalleryCategory,
        File: File,
    )
    {
        SetUploadingCategory(Category);
        SetCustomizationNotice('');

        try
        {
            const PreviousImageUrl =
                DraftCustomization.CategoryImages[Category];
            const ImageUrl =
                await UploadStartPageCategoryImage(
                    Category,
                    File,
                );

            SetDraftCustomization((Current) =>
            {
                return {
                    ...Current,
                    CategoryImages: {
                        ...Current.CategoryImages,
                        [Category]: ImageUrl,
                    },
                };
            });
            await DeleteStartPageCategoryImages([PreviousImageUrl]);
        }
        catch
        {
            SetCustomizationNotice(
                '이미지 업로드에 실패했습니다. 10MB 이하 이미지인지 확인해 주세요.',
            );
        }
        finally
        {
            SetUploadingCategory(null);
        }
    }

    async function SaveCustomization()
    {
        const NormalizedCustomization = {
            ...DraftCustomization,
            CategoryCenterTextStyles:
                NormalizeTextStyleMapForSave(
                    DraftCustomization
                        .CategoryCenterTextStyles,
                ),
            CategoryLabels: {
                architecture:
                    DraftCustomization.CategoryLabels
                        .architecture.trim(),
                portraits:
                    DraftCustomization.CategoryLabels
                        .portraits.trim(),
                journeys:
                    DraftCustomization.CategoryLabels
                        .journeys.trim(),
                journal:
                    DraftCustomization.CategoryLabels
                        .journal.trim(),
            },
            DailyMessages: DraftCustomization.DailyMessages
                .map((Message) => Message.trim())
                .filter((Message) => Message.length > 0),
            DailyMessageRotationSeconds:
                NormalizeDailyMessageRotationSeconds(
                    DraftCustomization
                        .DailyMessageRotationSeconds,
                ),
            CategoryTextStyles: NormalizeTextStyleMapForSave(
                DraftCustomization.CategoryTextStyles,
            ),
            HeaderLink: {
                Text: DraftCustomization.HeaderLink.Text.trim(),
                Url: DraftCustomization.HeaderLink.Url.trim(),
            },
            DestinationLabels: {
                architecture:
                    DraftCustomization.DestinationLabels
                        .architecture.trim(),
                portraits:
                    DraftCustomization.DestinationLabels
                        .portraits.trim(),
                journeys:
                    DraftCustomization.DestinationLabels
                        .journeys.trim(),
                journal:
                    DraftCustomization.DestinationLabels
                        .journal.trim(),
            },
            DestinationTextStyles:
                NormalizeTextStyleMapForSave(
                    DraftCustomization
                        .DestinationTextStyles,
                ),
        };
        const HasEmptyLabel = Object.values(
            NormalizedCustomization.CategoryLabels,
        ).some((Label) => Label.length === 0);
        const HasEmptyDestinationLabel = Object.values(
            NormalizedCustomization.DestinationLabels,
        ).some((Label) => Label.length === 0);
        const HasInvalidBoxLayout = Object.values(
            NormalizedCustomization.CategoryBoxLayouts,
        ).some(
            (Layout) => IsGalleryBoxLayout(Layout) === false,
        );

        if(HasEmptyLabel || HasEmptyDestinationLabel)
        {
            SetCustomizationNotice(
                '카테고리와 게시판 이동 글자를 모두 입력해 주세요.',
            );
            return;
        }

        if(HasInvalidBoxLayout)
        {
            SetCustomizationNotice(
                '각 카테고리의 박스를 중앙 포함 5개로 설정해 주세요.',
            );
            return;
        }

        if(
            IsValidHeaderLinkUrl(
                NormalizedCustomization.HeaderLink.Url,
            ) === false
        )
        {
            SetCustomizationNotice(
                'URL은 http:// 또는 https://로 시작하는 올바른 주소를 입력해 주세요.',
            );
            return;
        }

        SetIsCustomizationSaving(true);
        SetCustomizationNotice('');

        try
        {
            await SaveStartPageCustomization(
                NormalizedCustomization,
            );
            CacheStartPageCustomization(
                NormalizedCustomization,
            );
            SetStartCustomization(
                CloneStartPageCustomization(
                    NormalizedCustomization,
                ),
            );
            SetDraftCustomization(
                CloneStartPageCustomization(
                    NormalizedCustomization,
                ),
            );
            SetCustomizationNotice('시작 페이지 설정을 저장했습니다.');
        }
        catch
        {
            SetCustomizationNotice(
                '설정을 저장하지 못했습니다. 다시 로그인한 뒤 시도해 주세요.',
            );
        }
        finally
        {
            SetIsCustomizationSaving(false);
        }
    }

    return {
        ActiveHeroCategory,
        AddDailyMessage,
        CustomizationNotice,
        CustomizationView,
        DraftCustomization,
        EditingBoxLayoutCategory,
        IsCustomizationSaving,
        IsDarkTheme,
        IsHeroClosing,
        IsStartCustomizationLoaded,
        SelectedBoxLayoutCell,
        StartCustomization,
        UploadingCategory,
        SelectHeroCategory,
        ResetHeroCategory,
        FinishBoxLayoutEditing,
        MoveBoxLayoutCell,
        OpenBoxDestination,
        OpenBoxLayoutEditor,
        OpenCustomization,
        OpenCustomizationOption,
        CloseCustomization,
        ReturnToCustomizationMenu,
        RemoveDailyMessage,
        SaveCustomization,
        ToggleTheme,
        SelectBoxLayoutCell,
        UpdateCategoryLabel,
        UpdateCategoryCenterTextStyle,
        UpdateCategoryTextStyle,
        UpdateDailyMessage,
        UpdateDailyMessageRotationSeconds,
        UpdateDestinationLabel,
        UpdateDestinationTextStyle,
        UpdateHeaderLinkText,
        UpdateHeaderLinkUrl,
        UploadCategoryImage,
    };
}
