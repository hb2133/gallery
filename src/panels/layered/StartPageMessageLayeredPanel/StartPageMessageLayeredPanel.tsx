'use client';

import { useEffect, useRef } from 'react';
import type { StartPageMessageLayeredPanelProps } from './StartPageMessageLayeredPanelInterface';
import Styles from './StartPageMessageLayeredPanel.module.css';

export function StartPageMessageLayeredPanel(
    Props: StartPageMessageLayeredPanelProps,
)
{
    const AddButtonReference = useRef<HTMLButtonElement>(null);
    const InputReferences = useRef<
        Array<HTMLInputElement | null>
    >([]);
    const InitialMessageCountReference = useRef(
        Props.Messages.length,
    );
    const IsSavingReference = useRef(Props.IsSaving);
    const OnRequestCloseReference = useRef(
        Props.OnRequestClose,
    );
    const ShouldFocusLastInputReference = useRef(false);

    useEffect(() =>
    {
        IsSavingReference.current = Props.IsSaving;
        OnRequestCloseReference.current =
            Props.OnRequestClose;
    }, [Props.IsSaving, Props.OnRequestClose]);

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        if(InitialMessageCountReference.current > 0)
        {
            InputReferences.current[0]?.focus();
        }
        else
        {
            AddButtonReference.current?.focus();
        }

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(
                Event.key === 'Escape'
                && IsSavingReference.current === false
            )
            {
                OnRequestCloseReference.current();
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, []);

    useEffect(() =>
    {
        if(ShouldFocusLastInputReference.current === false)
        {
            return;
        }

        ShouldFocusLastInputReference.current = false;
        InputReferences.current[
            Props.Messages.length - 1
        ]?.focus();
    }, [Props.Messages.length]);

    return (
        <div
            className={Styles.Backdrop}
            role="presentation"
            onMouseDown={(Event) =>
            {
                if(
                    Event.target === Event.currentTarget
                    && Props.IsSaving === false
                )
                {
                    Props.OnRequestClose();
                }
            }}
        >
            <section
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="start-message-title"
                data-ue-component="StartPageMessageLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <span>START PAGE CUSTOMIZE</span>
                        <h2 id="start-message-title">한마디</h2>
                        <p>
                            저장한 문장이 설정한 시간마다
                            순서대로 표시됩니다.
                        </p>
                    </div>
                    <div className={Styles.HeaderActions}>
                        <button
                            type="button"
                            className={Styles.BackButton}
                            onClick={Props.OnBack}
                            disabled={Props.IsSaving}
                        >
                            ← 설정 목록
                        </button>
                        <button
                            type="button"
                            className={Styles.CloseButton}
                            onClick={Props.OnRequestClose}
                            disabled={Props.IsSaving}
                            aria-label="한마디 설정 창 닫기"
                        >
                            <span>Close</span>
                            <b aria-hidden="true">×</b>
                        </button>
                    </div>
                </header>

                <label className={Styles.RotationSetting}>
                    <span>
                        <strong>로테이션 시간</strong>
                        <small>3초~3600초</small>
                    </span>
                    <input
                        type="number"
                        min="3"
                        max="3600"
                        step="1"
                        value={Props.RotationSeconds}
                        disabled={Props.IsSaving}
                        onChange={(Event) =>
                        {
                            const Seconds = Number(
                                Event.currentTarget.value,
                            );

                            if(Number.isFinite(Seconds))
                            {
                                Props.OnChangeRotationSeconds(
                                    Seconds,
                                );
                            }
                        }}
                    />
                    <b>초</b>
                </label>

                <div className={Styles.ListHeader}>
                    <div>
                        <strong>표시할 문장</strong>
                        <span>{Props.Messages.length}개</span>
                    </div>
                    <button
                        ref={AddButtonReference}
                        type="button"
                        onClick={() =>
                        {
                            ShouldFocusLastInputReference.current =
                                true;
                            Props.OnAddMessage();
                        }}
                        disabled={Props.IsSaving}
                    >
                        <b aria-hidden="true">＋</b>
                        문장 추가
                    </button>
                </div>

                <form
                    onSubmit={(Event) =>
                    {
                        Event.preventDefault();
                        Props.OnSave();
                    }}
                >
                    {Props.Messages.length === 0 ? (
                        <div className={Styles.EmptyState}>
                            <strong>표시할 문장이 없습니다.</strong>
                            <p>
                                이 상태로 저장하면 A 로고 옆
                                말풍선도 표시되지 않습니다.
                            </p>
                        </div>
                    ) : (
                        <ol className={Styles.MessageList}>
                            {Props.Messages.map(
                                (Message, MessageIndex) => (
                                    <li key={MessageIndex}>
                                        <span>
                                            {String(
                                                MessageIndex + 1,
                                            ).padStart(2, '0')}
                                        </span>
                                        <input
                                            ref={(Element) =>
                                            {
                                                InputReferences.current[
                                                    MessageIndex
                                                ] = Element;
                                            }}
                                            type="text"
                                            value={Message}
                                            maxLength={120}
                                            disabled={Props.IsSaving}
                                            aria-label={`한마디 ${MessageIndex + 1}`}
                                            onChange={(Event) =>
                                                Props.OnChangeMessage(
                                                    MessageIndex,
                                                    Event.currentTarget
                                                        .value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                Props.OnRemoveMessage(
                                                    MessageIndex,
                                                )
                                            }
                                            disabled={Props.IsSaving}
                                            aria-label={`한마디 ${MessageIndex + 1} 삭제`}
                                        >
                                            −
                                        </button>
                                    </li>
                                ),
                            )}
                        </ol>
                    )}

                    <footer className={Styles.Footer}>
                        <p aria-live="polite">
                            {Props.Notice}
                        </p>
                        <div>
                            <button
                                type="submit"
                                disabled={Props.IsSaving}
                            >
                                {Props.IsSaving
                                    ? '저장 중...'
                                    : '변경사항 저장'}
                            </button>
                        </div>
                    </footer>
                </form>
            </section>
        </div>
    );
}
