import type {
    GalleryDetailViewMode,
    GalleryScrollDirection,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import type { PhotoPageDirection } from '@/core/navigation/PhotoPageDirection';

export type GalleryTitlePosition =
    | 'top-left'
    | 'center'
    | 'bottom-left';

export interface GalleryImageLayoutItem
{
    ForwardDirection: PhotoPageDirection | null;
    ImagePath: string;
    X: number;
    Y: number;
}

export interface GalleryIndexItem
{
    Id: string;
    Title: string;
    Category: string;
    Date: string;
    Description: string;
    ImagePaths: string[];
    ImageLayout?: GalleryImageLayoutItem[];
    CoverImagePath: string;
    Alt: string;
    DetailCategory: string;
    TitlePosition: GalleryTitlePosition;
    DefaultViewMode: GalleryDetailViewMode;
    EnabledViewModes: GalleryDetailViewMode[];
    ScrollDirection: GalleryScrollDirection;
    SortOrder?: number;
    IsPasswordProtected?: boolean;
}
