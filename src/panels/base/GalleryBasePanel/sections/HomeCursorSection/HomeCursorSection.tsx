'use client';

import { useEffect, useRef } from 'react';
import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';

export function HomeCursorSection()
{
    const CursorReference = useRef<HTMLDivElement>(null);
    const CursorBodyReference = useRef<HTMLDivElement>(null);
    const LabelReference = useRef<HTMLSpanElement>(null);

    useEffect(() =>
    {
        const Cursor = CursorReference.current;
        const CursorBody = CursorBodyReference.current;
        const Label = LabelReference.current;

        if(
            Cursor === null
            || CursorBody === null
            || Label === null
        )
        {
            return;
        }

        let HasPreviousPosition = false;
        let PreviousX = 0;
        let PreviousY = 0;
        let SettleTimer: number | null = null;

        const HideCursor = () =>
        {
            HasPreviousPosition = false;
            CursorBody.style.transform = 'rotate(0deg)';
            Cursor.removeAttribute('data-visible');

            if(SettleTimer !== null)
            {
                window.clearTimeout(SettleTimer);
                SettleTimer = null;
            }
        };

        const MoveCursor = (Event: PointerEvent) =>
        {
            const Target = Event.target;

            if(
                Event.pointerType === 'touch'
                || Target instanceof Element === false
            )
            {
                HideCursor();
                return;
            }

            const LabelTarget = Target.closest<HTMLElement>(
                '[data-cursor-label], button[aria-label], a[aria-label], input[aria-label], textarea[aria-label], select[aria-label], [role="button"][aria-label], [title]',
            );
            const DeltaX = HasPreviousPosition
                ? Event.clientX - PreviousX
                : 0;
            const DeltaY = HasPreviousPosition
                ? Event.clientY - PreviousY
                : 0;
            const Tilt = Math.max(
                -14,
                Math.min(14, (DeltaX + DeltaY * .35) * .7),
            );

            PreviousX = Event.clientX;
            PreviousY = Event.clientY;
            HasPreviousPosition = true;
            Cursor.style.transform =
                `translate3d(${Event.clientX}px, ${Event.clientY}px, 0)`;
            CursorBody.style.transform = `rotate(${Tilt}deg)`;
            Label.textContent =
                LabelTarget?.dataset.cursorLabel
                || LabelTarget?.getAttribute('aria-label')
                || LabelTarget?.getAttribute('title')
                || '';
            Cursor.setAttribute('data-visible', 'true');

            if(SettleTimer !== null)
            {
                window.clearTimeout(SettleTimer);
            }

            SettleTimer = window.setTimeout(() =>
            {
                CursorBody.style.transform = 'rotate(0deg)';
                SettleTimer = null;
            }, 90);
        };

        document.addEventListener('pointermove', MoveCursor);
        document.documentElement.addEventListener(
            'pointerleave',
            HideCursor,
        );
        window.addEventListener('blur', HideCursor);

        return () =>
        {
            document.removeEventListener('pointermove', MoveCursor);
            document.documentElement.removeEventListener(
                'pointerleave',
                HideCursor,
            );
            window.removeEventListener('blur', HideCursor);

            if(SettleTimer !== null)
            {
                window.clearTimeout(SettleTimer);
            }
        };
    }, []);

    return (
        <div
            ref={CursorReference}
            className={Styles.HomeCursor}
            aria-hidden="true"
            data-ue-component="HomeCursorSection"
            data-ue-root
        >
            <div
                ref={CursorBodyReference}
                className={Styles.HomeCursorBody}
            >
                <span ref={LabelReference} />
            </div>
        </div>
    );
}
