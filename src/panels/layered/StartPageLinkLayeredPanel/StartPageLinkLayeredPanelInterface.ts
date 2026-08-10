import type { HeaderLinkCustomization } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

export interface StartPageLinkLayeredPanelProps
{
    IsSaving: boolean;
    Link: HeaderLinkCustomization;
    Notice: string;
    OnBack: () => void;
    OnChangeText: (Text: string) => void;
    OnChangeUrl: (Url: string) => void;
    OnRequestClose: () => void;
    OnSave: () => void;
}
