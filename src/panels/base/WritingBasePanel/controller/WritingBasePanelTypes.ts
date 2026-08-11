export interface WritingPage
{
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
}

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
