export type GalleryIndexFilter =
    | 'All'
    | 'Architecture'
    | 'Portraits'
    | 'Journeys'
    | 'Journal';

export interface GalleryIndexItem
{
    Id: string;
    Title: string;
    Category: Exclude<GalleryIndexFilter, 'All'>;
    Date: string;
    Description: string;
    ImagePath: string;
    Alt: string;
    Orientation: 'portrait' | 'landscape';
}
