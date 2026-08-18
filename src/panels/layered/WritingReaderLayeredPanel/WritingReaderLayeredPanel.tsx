'use client';

import { useEffect, type PropsWithChildren } from 'react';
import Styles from './WritingReaderLayeredPanel.module.css';

interface WritingReaderLayeredPanelProps extends PropsWithChildren
{
    IsBookView: boolean;
    IsBookViewEnabled: boolean;
    IsSpatialViewEnabled: boolean;
    OnRequestClose: () => void;
    OnSelectBookView: () => void;
    OnSelectSpatialView: () => void;
}

export function WritingReaderLayeredPanel(
    Props: WritingReaderLayeredPanelProps,
)
{
    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
        };
    }, []);

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
            <div
                className={Styles.PanelShell}
                data-book-view={Props.IsBookView}
            >
                {Props.IsBookViewEnabled && Props.IsSpatialViewEnabled ? (
                    <div
                        className={Styles.ViewModePicker}
                        role="group"
                        aria-label="글 보기 형식"
                    >
                        <button
                            type="button"
                            data-active={Props.IsBookView}
                            onClick={Props.OnSelectBookView}
                            aria-label="1번 책넘김 보기"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            data-active={Props.IsBookView === false}
                            onClick={Props.OnSelectSpatialView}
                            aria-label="2번 상하좌우 보기"
                        >
                            2
                        </button>
                    </div>
                ) : null}
                <button
                    className={Styles.Close}
                    type="button"
                    onClick={Props.OnRequestClose}
                    aria-label="글 닫기"
                >
                    ×
                </button>
                <section
                    className={Styles.Panel}
                    role="dialog"
                    aria-modal="true"
                    aria-label="글 상세 보기"
                    data-ue-component="WritingReaderLayeredPanel"
                    data-ue-root
                >
                    {Props.children}
                </section>
            </div>
        </div>
    );
}
