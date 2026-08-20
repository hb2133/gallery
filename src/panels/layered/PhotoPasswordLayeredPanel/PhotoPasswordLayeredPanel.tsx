'use client';

import { useState } from 'react';
import Styles from './PhotoPasswordLayeredPanel.module.css';

interface PhotoPasswordLayeredPanelProps
{
    IsSubmitting: boolean;
    Notice: string;
    PostTitle: string;
    OnRequestClose: () => void;
    OnSubmit: (Password: string) => Promise<void>;
}

export function PhotoPasswordLayeredPanel(
    Props: PhotoPasswordLayeredPanelProps,
)
{
    const [Password, SetPassword] = useState('');

    return (
        <div
            className={Styles.Backdrop}
            role="presentation"
            onMouseDown={(Event) =>
            {
                if(
                    Event.target === Event.currentTarget
                    && Props.IsSubmitting === false
                )
                {
                    Props.OnRequestClose();
                }
            }}
        >
            <form
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="photo-password-title"
                autoComplete="off"
                onSubmit={(Event) =>
                {
                    Event.preventDefault();
                    void Props.OnSubmit(Password);
                }}
            >
                <span>LIMITED ACCESS</span>
                <h2 id="photo-password-title">
                    비밀번호를 입력해주세요.
                </h2>
                <p>{Props.PostTitle}</p>
                <input
                    type="password"
                    name="post-access-code"
                    value={Password}
                    minLength={4}
                    maxLength={72}
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    disabled={Props.IsSubmitting}
                    placeholder="Password"
                    aria-label="게시글 비밀번호"
                    onChange={(Event) =>
                        SetPassword(Event.currentTarget.value)
                    }
                />
                {Props.Notice ? (
                    <p className={Styles.Notice} role="alert">
                        {Props.Notice}
                    </p>
                ) : null}
                <div>
                    <button
                        type="button"
                        disabled={Props.IsSubmitting}
                        onClick={Props.OnRequestClose}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={
                            Props.IsSubmitting
                            || Password.trim().length < 4
                        }
                    >
                        {Props.IsSubmitting ? '확인 중...' : '내용 보기'}
                    </button>
                </div>
            </form>
        </div>
    );
}
