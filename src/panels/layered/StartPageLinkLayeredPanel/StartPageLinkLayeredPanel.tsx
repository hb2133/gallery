'use client';

import { useEffect, useRef } from 'react';
import type { StartPageLinkLayeredPanelProps } from './StartPageLinkLayeredPanelInterface';
import Styles from './StartPageLinkLayeredPanel.module.css';

export function StartPageLinkLayeredPanel(
    Props: StartPageLinkLayeredPanelProps,
)
{
    const TextInputReference = useRef<HTMLInputElement>(null);
    const IsSavingReference = useRef(Props.IsSaving);
    const OnRequestCloseReference = useRef(
        Props.OnRequestClose,
    );
    const LinkText = Props.Link.Text.trim();
    const LinkUrl = Props.Link.Url.trim();
    const HasLinkText = LinkText.length > 0;
    const HasLinkUrl = LinkUrl.length > 0;

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
        TextInputReference.current?.focus();

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
                aria-labelledby="start-link-title"
                data-ue-component="StartPageLinkLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <span>START PAGE CUSTOMIZE</span>
                        <h2 id="start-link-title">링크 변경</h2>
                        <p>
                            오른쪽 상단 이동 버튼의 텍스트와
                            연결 주소를 설정합니다.
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
                            aria-label="링크 변경 설정 창 닫기"
                        >
                            <span>Close</span>
                            <b aria-hidden="true">×</b>
                        </button>
                    </div>
                </header>

                <form
                    onSubmit={(Event) =>
                    {
                        Event.preventDefault();
                        Props.OnSave();
                    }}
                >
                    <div className={Styles.FieldGrid}>
                        <label>
                            <span>TEXT</span>
                            <input
                                ref={TextInputReference}
                                type="text"
                                value={Props.Link.Text}
                                maxLength={40}
                                disabled={Props.IsSaving}
                                placeholder="Instagram"
                                onChange={(Event) =>
                                    Props.OnChangeText(
                                        Event.currentTarget.value,
                                    )
                                }
                            />
                            <small>
                                비워두고 URL만 입력하면 화살표
                                아이콘만 표시됩니다.
                            </small>
                        </label>

                        <label>
                            <span>URL</span>
                            <input
                                type="url"
                                value={Props.Link.Url}
                                maxLength={500}
                                disabled={Props.IsSaving}
                                placeholder="https://example.com/"
                                onChange={(Event) =>
                                    Props.OnChangeUrl(
                                        Event.currentTarget.value,
                                    )
                                }
                            />
                            <small>
                                비워두면 텍스트 버튼이 비활성
                                상태로 표시됩니다.
                            </small>
                        </label>
                    </div>

                    <div className={Styles.Preview}>
                        <span>PREVIEW</span>
                        <div>
                            {HasLinkUrl ? (
                                <span className={Styles.PreviewButton}>
                                    {HasLinkText ? LinkText : null}
                                    <b aria-hidden="true">↗</b>
                                </span>
                            ) : HasLinkText ? (
                                <span
                                    className={`${Styles.PreviewButton} ${Styles.PreviewDisabled}`}
                                >
                                    {LinkText}
                                    <b aria-hidden="true">↗</b>
                                </span>
                            ) : (
                                <p>텍스트와 URL이 모두 비어 있어 숨겨집니다.</p>
                            )}
                        </div>
                    </div>

                    <footer className={Styles.Footer}>
                        <p aria-live="polite">
                            {Props.Notice}
                        </p>
                        <button
                            type="submit"
                            disabled={Props.IsSaving}
                        >
                            {Props.IsSaving
                                ? '저장 중...'
                                : '변경사항 저장'}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
