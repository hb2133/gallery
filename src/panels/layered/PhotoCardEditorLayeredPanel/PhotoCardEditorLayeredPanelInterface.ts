import type { PhotoCardCustomization } from '@/managers/PhotoCardCustomizationManager';
import type { PhotoPostContentImage } from '@/managers/PhotoPostManager';
import type { PhotoPostCopyData } from '@/managers/PhotoPostManager';
import type { GalleryImageLayoutItem } from '@/panels/base/GalleryIndexBasePanel/controller/GalleryIndexBasePanelTypes';
import type { GalleryDetailViewMode } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

export interface PhotoCardEditorLayeredPanelProps
{
    Categories: string[];
    ContentImageLayout: GalleryImageLayoutItem[];
    Customization: PhotoCardCustomization;
    EnabledViewModes: GalleryDetailViewMode[];
    ExistingPassword: string | null;
    IsPasswordLoading: boolean;
    IsSaving: boolean;
    Notice: string;
    OnCopy: (CopyData: PhotoPostCopyData) => void;
    OnDelete: (
        Customization: PhotoCardCustomization,
    ) => void;
    OnRequestClose: () => void;
    OnSave: (
        Customization: PhotoCardCustomization,
        ThumbnailFile: File | null,
        ContentImages: PhotoPostContentImage[],
        EnabledViewModes: GalleryDetailViewMode[],
        PasswordUpdate: string | null,
    ) => void;
}
