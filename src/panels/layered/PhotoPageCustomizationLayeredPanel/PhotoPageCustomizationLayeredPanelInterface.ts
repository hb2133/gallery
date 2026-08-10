export interface PageTextCustomization
{
    Color: string | null;
    Size: number;
    Text: string;
}

export interface PhotoPageCustomizationLayeredPanelProps
{
    Categories?: string[];
    Description: PageTextCustomization;
    Heading: PageTextCustomization;
    IsSaving: boolean;
    Kind?: 'media' | 'photo';
    Notice: string;
    OnChange: (
        Update: Partial<PageTextCustomization>,
    ) => void;
    OnChangeDescription: (
        Update: Partial<PageTextCustomization>,
    ) => void;
    OnChangeCategories?: (Categories: string[]) => void;
    OnBack?: () => void;
    OnRequestClose: () => void;
    OnSave: () => void;
}
