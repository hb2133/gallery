export type PageCustomizationKind = 'start' | 'photo' | 'media';

export interface PageCustomizationLayeredPanelProps
{
    Kind: PageCustomizationKind;
    OnRequestClose: () => void;
    OnSelectOption?: (OptionIndex: number) => void;
}
