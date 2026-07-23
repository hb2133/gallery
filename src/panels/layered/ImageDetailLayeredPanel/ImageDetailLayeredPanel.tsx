'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { GalleryProject } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import Styles from './ImageDetailLayeredPanel.module.css';

interface ImageDetailLayeredPanelProps
{
    Project: GalleryProject;
    OnRequestClose: () => void;
}

export function ImageDetailLayeredPanel(
    Props: ImageDetailLayeredPanelProps,
)
{
    const CloseButtonReference = useRef<HTMLButtonElement>(null);

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        CloseButtonReference.current?.focus();

        function HandleKeyDown(Event: KeyboardEvent)
        {
            if(Event.key === 'Escape')
            {
                Props.OnRequestClose();
            }
        }

        window.addEventListener('keydown', HandleKeyDown);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener('keydown', HandleKeyDown);
        };
    }, [Props]);

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
                aria-labelledby="image-detail-title"
                data-ue-component="ImageDetailLayeredPanel"
                data-ue-root
            >
                <button
                    ref={CloseButtonReference}
                    className={Styles.Close}
                    type="button"
                    onClick={Props.OnRequestClose}
                    aria-label="상세 이미지 닫기"
                >
                    Close <span aria-hidden="true">×</span>
                </button>

                <div className={Styles.ImageFrame}>
                    <Image
                        src={Props.Project.ImagePath}
                        alt={Props.Project.Alt}
                        fill
                        sizes="(max-width: 800px) 100vw, 72vw"
                        priority
                    />
                </div>

                <div className={Styles.Details}>
                    <p>
                        {Props.Project.CategoryLabel} · {Props.Project.Year}
                    </p>
                    <h2 id="image-detail-title">{Props.Project.Title}</h2>
                    <div>
                        <p>{Props.Project.Note}</p>
                        <span>{Props.Project.Location}</span>
                        <a
                            href={Props.Project.CreditUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Photo: {Props.Project.CreditName} ↗
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
