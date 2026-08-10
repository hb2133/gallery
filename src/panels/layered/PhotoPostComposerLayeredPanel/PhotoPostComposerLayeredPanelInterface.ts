import type {
    CreatePhotoPostInput,
    PhotoPostContentImage,
    PhotoPostCopyData,
} from '@/managers/PhotoPostManager';

export interface PhotoPostComposerLayeredPanelProps
{
    Categories: string[];
    CopyData: PhotoPostCopyData | null;
    IsSaving: boolean;
    Notice: string;
    OnRequestClose: () => void;
    OnSubmit: (
        Input: CreatePhotoPostInput,
        ContentImages: PhotoPostContentImage[],
        ThumbnailSource: string | File | null,
    ) => void;
}
