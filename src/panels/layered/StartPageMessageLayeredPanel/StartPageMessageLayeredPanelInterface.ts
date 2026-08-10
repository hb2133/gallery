export interface StartPageMessageLayeredPanelProps
{
    IsSaving: boolean;
    Messages: string[];
    Notice: string;
    RotationSeconds: number;
    OnAddMessage: () => void;
    OnBack: () => void;
    OnChangeMessage: (
        MessageIndex: number,
        Message: string,
    ) => void;
    OnChangeRotationSeconds: (Seconds: number) => void;
    OnRemoveMessage: (MessageIndex: number) => void;
    OnRequestClose: () => void;
    OnSave: () => void;
}
