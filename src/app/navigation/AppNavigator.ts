export type AppRouteIntent = {
    PanelId: string;
    Payload?: unknown;
};

export interface AppRouterAdapter
{
    Push: (Route: string) => void;
}

export class AppNavigator
{
    public constructor(
        private readonly Router?: AppRouterAdapter,
    )
    {
    }

    public Navigate(intent: AppRouteIntent): void
    {
        const Routes: Record<string, string> = {
            GalleryIndexBasePanel: '/gallery',
            CommunityBasePanel: '/community',
            MediaBasePanel: '/media',
            WritingBasePanel: '/writing',
            MemoBasePanel: '/memo',
            GalleryBasePanel: '/',
        };
        const Route = Routes[intent.PanelId];

        if(Route !== undefined)
        {
            if(this.Router !== undefined)
            {
                this.Router.Push(Route);
                return;
            }

            window.location.assign(Route);
        }
    }
}
