export type AppRouteIntent = {
    PanelId: string;
    Payload?: unknown;
};

export class AppNavigator
{
    public Navigate(intent: AppRouteIntent): void
    {
        const Routes: Record<string, string> = {
            GalleryIndexBasePanel: '/gallery',
            CommunityBasePanel: '/community',
            GalleryBasePanel: '/',
        };
        const Route = Routes[intent.PanelId];

        if(Route !== undefined)
        {
            window.location.assign(Route);
        }
    }
}
