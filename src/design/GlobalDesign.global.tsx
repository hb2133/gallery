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

                html {
                    scroll-behavior: smooth;
                }

                body {
                    background: var(--canvas);
                    color: var(--ink);
                }

                ::selection {
                    background: var(--ink);
                    color: var(--surface);
                }

                :focus-visible {
                    outline: 2px solid var(--ink);
                    outline-offset: 3px;
                }
            `}
        </style>
    );
}
