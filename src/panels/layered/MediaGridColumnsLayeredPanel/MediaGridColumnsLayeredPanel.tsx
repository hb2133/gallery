'use client';

import { useEffect } from 'react';
import Styles from './MediaGridColumnsLayeredPanel.module.css';

interface MediaGridColumnsLayeredPanelProps
{
    GridColumns: number;
    IsSaving: boolean;
    Notice: string;
    OnBack: () => void;
    OnChange: (GridColumns: number) => void;
    OnRequestClose: () => void;
    OnSave: () => void;
}

export function MediaGridColumnsLayeredPanel(
    Props: MediaGridColumnsLayeredPanelProps,
)
{
    const { IsSaving, OnRequestClose } = Props;

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(Event.key === 'Escape' && IsSaving === false)
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
    }, [IsSaving, OnRequestClose]);

    return (
        <div
            className={Styles.Backdrop}
            onMouseDown={(Event) =>
            {
                if(
                    Event.target === Event.currentTarget
                    && IsSaving === false
                )
                {
                    OnRequestClose();
                }
            }}
        >
            <section
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="media-grid-columns-title"
                data-ue-component="MediaGridColumnsLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <button
                        type="button"
                        onClick={Props.OnBack}
                        disabled={IsSaving}
                    >
                        ← 뒤로
                    </button>
                    <button
                        type="button"
                        onClick={OnRequestClose}
                        disabled={IsSaving}
                        aria-label="영상 행 개수 설정 닫기"
                    >
                        ×
                    </button>
                </header>

                <div className={Styles.Copy}>
                    <span>MEDIA GRID</span>
                    <h2 id="media-grid-columns-title">
                        영상 행 개수
                    </h2>
                    <p>
                        한 줄에 표시할 영상 카드 개수를
                        입력하세요.
                    </p>
                </div>

                <label className={Styles.InputField}>
                    <span>한 줄에 표시할 개수</span>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        inputMode="numeric"
                        value={Props.GridColumns}
                        disabled={IsSaving}
                        onChange={(Event) =>
                            Props.OnChange(
                                Number(Event.currentTarget.value),
                            )
                        }
                    />
                    <small>최소 1 · 최대 10</small>
                </label>

                {Props.Notice ? (
                    <p className={Styles.Notice} role="status">
                        {Props.Notice}
                    </p>
                ) : null}

                <footer className={Styles.Footer}>
                    <button
                        type="button"
                        onClick={Props.OnSave}
                        disabled={IsSaving}
                    >
                        {IsSaving ? '저장 중...' : '저장'}
                    </button>
                </footer>
            </section>
        </div>
    );
}
