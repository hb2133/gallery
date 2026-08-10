export type GalleryCategory =
    | 'architecture'
    | 'portraits'
    | 'journeys'
    | 'journal';

export type GalleryCategoryMap<TValue> = Record<
    GalleryCategory,
    TValue
>;

export interface StartPageCustomization
{
    CategoryBoxLayouts: GalleryCategoryMap<number[]>;
    CategoryLabels: GalleryCategoryMap<string>;
    CategoryCenterTextStyles: GalleryCategoryMap<GalleryTextStyle>;
    CategoryTextStyles: GalleryCategoryMap<GalleryTextStyle>;
    CategoryImages: GalleryCategoryMap<string>;
    DailyMessageRotationSeconds: number;
    DailyMessages: string[];
    DestinationLabels: GalleryCategoryMap<string>;
    DestinationTextStyles: GalleryCategoryMap<GalleryTextStyle>;
    HeaderLink: HeaderLinkCustomization;
}

export interface GalleryTextStyle
{
    Color: string;
    Font: string;
    Size: number;
}

export interface HeaderLinkCustomization
{
    Text: string;
    Url: string;
}

export type GalleryFilter = GalleryCategory | 'all';

export type ArchiveDestination =
    | 'gallery'
    | 'media'
    | 'writing'
    | 'memo';

export type GalleryDetailViewMode = 'scroll' | 'book';

export type GalleryScrollDirection = 'horizontal' | 'vertical';

export interface GalleryProjectImage
{
    ImagePath: string;
    Alt: string;
    CreditName: string;
    CreditUrl: string;
    ForwardDirection?: PhotoPageDirection | null;
    X?: number;
    Y?: number;
}

export interface GalleryBookCoverTextLayer
{
    Id: string;
    Text: string;
    FontFamily: string;
    FontSize: number;
    Color: string;
    X: number;
    Y: number;
}

export interface GalleryProject
{
    Id: string;
    Category: GalleryCategory;
    CategoryLabel: string;
    Title: string;
    Location: string;
    Year: string;
    ImagePath: string;
    Alt: string;
    Orientation: 'portrait' | 'landscape';
    Note: string;
    CreditName: string;
    CreditUrl: string;
    Images?: GalleryProjectImage[];
    BookCoverImagePath?: string;
    BookCoverTextLayers?: GalleryBookCoverTextLayer[];
    BookPageNumberColor?: string;
    BookPageNumberOpacity?: number;
    DefaultViewMode?: GalleryDetailViewMode;
    EnabledViewModes?: GalleryDetailViewMode[];
    ScrollDirection?: GalleryScrollDirection;
}

export interface GalleryCategoryOption
{
    Id: GalleryCategory;
    Label: string;
    Number: string;
    Direction: 'top' | 'right' | 'bottom' | 'left';
}
import type { PhotoPageDirection } from '@/core/navigation/PhotoPageDirection';
