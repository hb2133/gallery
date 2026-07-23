export type GalleryCategory =
    | 'architecture'
    | 'portraits'
    | 'journeys'
    | 'journal';

export type GalleryFilter = GalleryCategory | 'all';

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
}

export interface GalleryCategoryOption
{
    Id: GalleryCategory;
    Label: string;
    Number: string;
    Direction: 'top' | 'right' | 'bottom' | 'left';
}
