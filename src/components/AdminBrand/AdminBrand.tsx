'use client';

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { UseAuthSession } from '@/app/shell/AuthSessionProvider';
import { UseInitialAppState } from '@/app/shell/InitialAppStateProvider';
import { ArchiveStrings } from '@/core/localization/ArchiveStrings';
import { useStartPageDailyMessages } from '@/managers/StartPageDailyMessageManager';
import Styles from './AdminBrand.module.css';

interface AdminBrandProps
{
    ClassName?: string;
    CustomizationLabel?: string;
    HomeHref?: string;
    MessageRotationSeconds?: number;
    Messages?: readonly string[];
    OnOpenCustomization?: () => void;
}

export function AdminBrand({
    ClassName = '',
    CustomizationLabel = '페이지 설정 열기',
    HomeHref = '/',
    MessageRotationSeconds,
    Messages,
    OnOpenCustomization,
}: AdminBrandProps)
{
    const InitialAppState = UseInitialAppState();
    const ResolvedMessages =
        useStartPageDailyMessages(
            Messages,
            InitialAppState.StartPageCustomization.DailyMessages,
        );
    const {
        IsAuthenticated,
        IsLoading: IsAuthLoading,
        SignIn,
        SignOut,
        UserEmail,
    } = UseAuthSession();
    const [IsLoginOpen, SetIsLoginOpen] = useState(false);
    const [IsSubmitting, SetIsSubmitting] = useState(false);
    const [LoginNotice, SetLoginNotice] = useState('');
    const [DailyMessageIndex, SetDailyMessageIndex] = useState(0);
    const DailyMessage =
        ResolvedMessages[DailyMessageIndex]
        ?? ResolvedMessages[0]
        ?? '';
    const RotationSeconds =
        MessageRotationSeconds
        ?? InitialAppState.StartPageCustomization
            .DailyMessageRotationSeconds;
    const IdInputReference = useRef<HTMLInputElement>(null);

    useEffect(() =>
    {
        if(!IsLoginOpen)
        {
            return;
        }

        IdInputReference.current?.focus();

        function CloseOnEscape(Event: globalThis.KeyboardEvent)
        {
            if(Event.key === 'Escape')
            {
                SetIsLoginOpen(false);
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, [IsLoginOpen]);

    useEffect(() =>
    {
        if(ResolvedMessages.length < 2)
        {
            return;
        }

        const RotationTimer = window.setInterval(() =>
        {
            SetDailyMessageIndex((Current) =>
                (Current + 1) % ResolvedMessages.length,
            );
        }, RotationSeconds * 1000);

        return () =>
        {
            window.clearInterval(RotationTimer);
        };
    }, [ResolvedMessages, RotationSeconds]);

    function OpenLogin()
    {
        SetLoginNotice('');
        SetIsLoginOpen(true);
    }

    function HandleBrandClick(Event: MouseEvent<HTMLAnchorElement>)
    {
        if(!Event.ctrlKey)
        {
            return;
        }

        Event.preventDefault();
        OpenLogin();
    }

    function HandleBrandKeyDown(Event: KeyboardEvent<HTMLAnchorElement>)
    {
        if(Event.ctrlKey && Event.key === 'Enter')
        {
            Event.preventDefault();
            OpenLogin();
        }
    }

    async function HandleLoginSubmit(
        Event: FormEvent<HTMLFormElement>,
    )
    {
        Event.preventDefault();
        const Form = new FormData(Event.currentTarget);
        const Email = String(Form.get('email') ?? '').trim();
        const Password = String(Form.get('password') ?? '');

        if(!Email || !Password)
        {
            SetLoginNotice(ArchiveStrings.Login.RequiredNotice);
            return;
        }

        SetIsSubmitting(true);
        SetLoginNotice('');

        try
        {
            const ErrorCode = await SignIn(Email, Password);

            if(ErrorCode)
            {
                const IsCredentialError =
                    ErrorCode === 'invalid_credentials'
                    || ErrorCode === 'email_not_confirmed';

                SetLoginNotice(
                    IsCredentialError
                        ? ArchiveStrings.Login.InvalidNotice
                        : ArchiveStrings.Login.ErrorNotice,
                );
                return;
            }

            SetLoginNotice(ArchiveStrings.Login.SuccessNotice);
        }
        catch
        {
            SetLoginNotice(ArchiveStrings.Login.ErrorNotice);
        }
        finally
        {
            SetIsSubmitting(false);
        }
    }

    async function HandleSignOut()
    {
        SetIsSubmitting(true);
        SetLoginNotice('');

        try
        {
            await SignOut();
            SetIsLoginOpen(false);
        }
        catch
        {
            SetLoginNotice(ArchiveStrings.Login.ErrorNotice);
        }
        finally
        {
            SetIsSubmitting(false);
        }
    }

    return (
        <>
            <div className={`${Styles.Brand} ${ClassName}`.trim()}>
                <Link
                    className={Styles.BrandLink}
                    href={HomeHref}
                    onClick={HandleBrandClick}
                    onKeyDown={HandleBrandKeyDown}
                    aria-label="홈으로 이동"
                    data-cursor-label="홈으로 이동"
                >
                    <span className={Styles.BrandMark} aria-hidden="true">
                        A
                    </span>
                </Link>
                {DailyMessage ? (
                    <p className={Styles.DailyMessage}>
                        <span key={DailyMessage}>
                            {DailyMessage}
                        </span>
                    </p>
                ) : null}
                {IsAuthenticated && OnOpenCustomization ? (
                    <button
                        type="button"
                        className={Styles.SettingsButton}
                        onClick={OnOpenCustomization}
                        aria-label={CustomizationLabel}
                        data-cursor-label={CustomizationLabel}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm8 4.6v-1.8l-2.1-.8a6.7 6.7 0 0 0-.6-1.4l.9-2-1.3-1.3-2 .9a6.7 6.7 0 0 0-1.4-.6L12.7 4h-1.8l-.8 2.1a6.7 6.7 0 0 0-1.4.6l-2-.9-1.3 1.3.9 2a6.7 6.7 0 0 0-.6 1.4l-2.1.8v1.8l2.1.8c.1.5.3 1 .6 1.4l-.9 2 1.3 1.3 2-.9c.4.3.9.5 1.4.6l.8 2.1h1.8l.8-2.1c.5-.1 1-.3 1.4-.6l2 .9 1.3-1.3-.9-2c.3-.4.5-.9.6-1.4l2.1-.8Z"
                            />
                        </svg>
                    </button>
                ) : null}
            </div>

            {IsLoginOpen
                ? createPortal(
                    <div
                        className={Styles.LoginBackdrop}
                        onMouseDown={(Event) =>
                        {
                            if(Event.target === Event.currentTarget)
                            {
                                SetIsLoginOpen(false);
                            }
                        }}
                    >
                        <section
                            className={Styles.LoginDialog}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="login-title"
                        >
                            <button
                                type="button"
                                className={Styles.CloseButton}
                                onClick={() => SetIsLoginOpen(false)}
                                aria-label="로그인 창 닫기"
                            >
                                ×
                            </button>
                            <span className={Styles.LoginEyebrow}>
                                {IsAuthenticated
                                    ? 'ADMIN SESSION'
                                    : 'SIGN IN'}
                            </span>
                            <h2 id="login-title">
                                {IsAuthenticated
                                    ? ArchiveStrings.Login.AccountTitle
                                    : ArchiveStrings.Login.Title}
                            </h2>
                            <p>
                                {IsAuthenticated
                                    ? ArchiveStrings.Login
                                        .AccountDescription
                                    : ArchiveStrings.Login.Description}
                            </p>

                            {IsAuthenticated ? (
                                <div className={Styles.AccountPanel}>
                                    <span>{UserEmail}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                        {
                                            void HandleSignOut();
                                        }}
                                        disabled={IsSubmitting}
                                    >
                                        {ArchiveStrings.Login.SignOut}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={(Event) =>
                                {
                                    void HandleLoginSubmit(Event);
                                }}>
                                    <label>
                                        <span>
                                            {ArchiveStrings.Login.Id}
                                        </span>
                                        <input
                                            ref={IdInputReference}
                                            type="email"
                                            name="email"
                                            autoComplete="username"
                                            disabled={
                                                IsSubmitting
                                                || IsAuthLoading
                                            }
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>
                                            {
                                                ArchiveStrings.Login
                                                    .Password
                                            }
                                        </span>
                                        <input
                                            type="password"
                                            name="password"
                                            autoComplete="current-password"
                                            disabled={
                                                IsSubmitting
                                                || IsAuthLoading
                                            }
                                            required
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={
                                            IsSubmitting
                                            || IsAuthLoading
                                        }
                                    >
                                        {IsSubmitting
                                            ? ArchiveStrings.Login
                                                .Submitting
                                            : ArchiveStrings.Login
                                                .Submit}
                                    </button>
                                </form>
                            )}

                            {LoginNotice ? (
                                <p
                                    className={Styles.LoginNotice}
                                    aria-live="polite"
                                >
                                    {LoginNotice}
                                </p>
                            ) : null}
                        </section>
                    </div>,
                    document.body,
                )
                : null}
        </>
    );
}
