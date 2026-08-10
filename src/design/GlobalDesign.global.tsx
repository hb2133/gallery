export function GlobalDesign()
{
    return (
        <style>
            {`
                :root {
                    --canvas: #f7f7f5;
                    --surface: #ffffff;
                    --ink: #111111;
                    --muted: #6f6f6b;
                    --soft: #a4a49f;
                    --line: #deded9;
                    --line-strong: #b8b8b2;
                    --radius-sm: 6px;
                    --radius-md: 12px;
                    --radius-pill: 999px;
                    --page-gutter: clamp(20px, 4.8vw, 78px);
                    --ease-out: cubic-bezier(.2, .75, .25, 1);
                }

                html[data-theme='dark'] {
                    --background: #111111;
                    --foreground: #f5f5f2;
                    --canvas: #111111;
                    --surface: #1b1b1a;
                    --ink: #f5f5f2;
                    --muted: #c4c4bf;
                    --soft: #92928d;
                    --line: #383836;
                    --line-strong: #5a5a56;
                    color-scheme: dark;
                }

                html {
                    scroll-behavior: smooth;
                }

                body {
                    background: var(--canvas);
                    color: var(--ink);
                }

                body > main {
                    animation:
                        RoutePanelEnter
                        360ms
                        cubic-bezier(.2, .75, .25, 1)
                        both;
                }

                @keyframes RoutePanelEnter {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                ::selection {
                    background: var(--ink);
                    color: var(--surface);
                }

                :focus-visible {
                    outline: 2px solid var(--ink);
                    outline-offset: 3px;
                }

                @media (prefers-reduced-motion: reduce) {
                    body > main {
                        animation: none;
                    }
                }
            `}
        </style>
    );
}
