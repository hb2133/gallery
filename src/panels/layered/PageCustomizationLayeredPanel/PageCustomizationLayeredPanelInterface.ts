export type PageCustomizationKind = 'start' | 'photo' | 'media' | 'writing';

export interface PageCustomizationLayeredPanelProps
{
    Kind: PageCustomizationKind;
    OnRequestClose: () => void;
    OnSelectOption?: (OptionIndex: number) => void;
}
