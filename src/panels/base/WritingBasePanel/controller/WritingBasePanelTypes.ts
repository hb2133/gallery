import type { PhotoPageDirection } from '@/core/navigation/PhotoPageDirection';
import type { PhotoCardTextLayer } from '@/managers/PhotoCardCustomizationManager';

export interface WritingPage
{
    ForwardDirection?: PhotoPageDirection | null;
    Heading: string;
    Paragraphs: string[];
}

export interface WritingArticle
{
    Id: string;
    Category: string;
    Title: string;
    ShortTitle: string;
    Summary: string;
    Date: string;
    ReadTime: string;
    Image: string;
    Pages: WritingPage[];
    EnabledViewModes?: WritingEnabledViewMode[];
    IsContentLocked?: boolean;
    IsPasswordProtected?: boolean;
    PageNumberColor?: string;
    PageNumberOpacity?: number;
    TextLayers?: PhotoCardTextLayer[];
}

export type WritingEnabledViewMode = 'book' | 'scroll';
export type WritingViewMode = 'single' | 'spread' | 'scroll';
export type WritingReaderTone =
    | 'light'
    | 'paper'
    | 'night'
    | 'black'
    | 'teal'
    | 'brown'
    | 'gray'
    | 'rose'
    | 'lavender'
    | 'sage';
export type WritingReaderFont = 'sans' | 'serif' | 'rounded' | 'mono';
export type WritingReaderAlignment = 'left' | 'justify';
