import type {
    GalleryCategory,
    GalleryTextStyle,
    StartPageCustomization,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

export interface StartPageCustomizationLayeredPanelProps
{
    Customization: StartPageCustomization;
    IsSaving: boolean;
    Notice: string;
    UploadingCategory: GalleryCategory | null;
    OnChangeLabel: (
        Category: GalleryCategory,
        Label: string,
    ) => void;
    OnChangeCategoryTextStyle: (
        Category: GalleryCategory,
        TextStyle: GalleryTextStyle,
    ) => void;
    OnChangeCategoryCenterTextStyle: (
        Category: GalleryCategory,
        TextStyle: GalleryTextStyle,
    ) => void;
    OnMoveBoxLayoutCell: (
        FromCell: number,
        ToCell: number,
        Category: GalleryCategory,
    ) => void;
    OnChangeDestinationLabel: (
        Category: GalleryCategory,
        Label: string,
    ) => void;
    OnChangeDestinationTextStyle: (
        Category: GalleryCategory,
        TextStyle: GalleryTextStyle,
    ) => void;
    OnBack: () => void;
    OnRequestClose: () => void;
    OnSave: () => void;
    OnSelectImage: (
        Category: GalleryCategory,
        File: File,
    ) => void;
}
