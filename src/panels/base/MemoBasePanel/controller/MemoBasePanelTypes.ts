export type MemoCoverTheme = 'ink' | 'mint' | 'rose' | 'sky';
export type MemoFlipDirection = 'next' | 'previous' | null;
export type MemoBookPhase =
    | 'closed'
    | 'opening'
    | 'open'
    | 'closing';
export type MemoTurnPhase =
    | 'idle'
    | 'dragging'
    | 'closing'
    | 'opening';

export interface MemoPage
{
    Id: string;
    Title: string;
    Content: string;
    Date: string;
    CoverTheme: MemoCoverTheme;
    AttachmentPath?: string;
    AttachmentAlt?: string;
}
