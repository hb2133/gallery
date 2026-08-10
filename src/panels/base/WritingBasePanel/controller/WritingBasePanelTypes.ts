export interface WritingArticle
{
    Id: string;
    Category: string;
    Title: string;
    Summary: string;
    Date: string;
    ReadTime: string;
    Body: string[];
    ContentHtml?: string;
    IsPrivate?: boolean;
}

export type WritingReaderFont =
    | 'gothic'
    | 'system'
    | 'serif'
    | 'rounded'
    | 'mono';

export type WritingReaderTone = 'light' | 'paper' | 'dark';

export type WritingReaderAlignment = 'left' | 'justify';
