'use client';

import { useEffect, useRef } from 'react';
import { ArchiveStrings } from '@/core/localization/ArchiveStrings';
import type {
    PageCustomizationKind,
    PageCustomizationLayeredPanelProps,
} from './PageCustomizationLayeredPanelInterface';
import Styles from './PageCustomizationLayeredPanel.module.css';

const ContentByKind = {
    start: ArchiveStrings.Customization.Start,
    photo: ArchiveStrings.Customization.Photo,
    media: ArchiveStrings.Customization.Media,
} as const satisfies Record<PageCustomizationKind, object>;

export function PageCustomizationLayeredPanel(
    Props: PageCustomizationLayeredPanelProps,
)
{
    const CloseButtonReference = useRef<HTMLButtonElement>(null);
    const Content = ContentByKind[Props.Kind];
    const { OnRequestClose } = Props;

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        CloseButtonReference.current?.focus();

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(Event.key === 'Escape')
            {
                OnRequestClose();
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, [OnRequestClose]);

    return (
        <div
            className={Styles.Backdrop}
            role="presentation"
            onMouseDown={(Event) =>
            {
                if(Event.target === Event.currentTarget)
                {
                    Props.OnRequestClose();
                }
            }}
        >
            <section
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`customization-${Props.Kind}-title`}
                data-ue-component="PageCustomizationLayeredPanel"
                data-ue-root
                data-kind={Props.Kind}
            >
                <header className={Styles.Header}>
                    <div>
                        <span>{ArchiveStrings.Customization.Eyebrow}</span>
                        <h2 id={`customization-${Props.Kind}-title`}>
                            {Content.Title}
                        </h2>
                        <p>{Content.Description}</p>
                    </div>
                    <button
                        ref={CloseButtonReference}
                        type="button"
                        className={Styles.CloseButton}
                        onClick={Props.OnRequestClose}
                        aria-label={ArchiveStrings.Customization.Close}
                    >
                        <span>Close</span>
                        <b aria-hidden="true">×</b>
                    </button>
                </header>

                <div className={Styles.OptionGrid}>
                    {Content.Options.map((Option, Index) => (
                        <button
                            key={Option.Title}
                            type="button"
                            className={Styles.Option}
                            disabled={
                                Props.OnSelectOption === undefined
                            }
                            onClick={() =>
                                Props.OnSelectOption?.(Index)
                            }
                        >
                            <span>
                                {String(Index + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h3>{Option.Title}</h3>
                                <p>{Option.Description}</p>
                            </div>
                            <small>{Option.CurrentValue}</small>
                            <b aria-hidden="true">→</b>
                        </button>
                    ))}
                </div>

                <footer className={Styles.Footer}>
                    <span>{Content.Footer}</span>
                </footer>
            </section>
        </div>
    );
}
