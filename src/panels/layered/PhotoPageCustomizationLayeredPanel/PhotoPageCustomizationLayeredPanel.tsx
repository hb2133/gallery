'use client';

import {
    useEffect,
    useRef,
} from 'react';
import type {
    PageTextCustomization,
    PhotoPageCustomizationLayeredPanelProps,
} from './PhotoPageCustomizationLayeredPanelInterface';
import Styles from './PhotoPageCustomizationLayeredPanel.module.css';

interface TextControlsProps
{
    IsDisabled: boolean;
    Label: string;
    MaximumSize: number;
    MaximumTextLength: number;
    MinimumSize: number;
    OnChange: (
        Update: Partial<PageTextCustomization>,
    ) => void;
    Value: PageTextCustomization;
}

function TextControls(Props: TextControlsProps)
{
    return (
        <section className={Styles.SettingSection}>
            <div className={Styles.SectionHeading}>
                <strong>{Props.Label}</strong>
                <span>문구 · 크기 · 색상</span>
            </div>
            <label className={Styles.TextField}>
                <span>문구</span>
                <textarea
                    value={Props.Value.Text}
                    maxLength={Props.MaximumTextLength}
                    disabled={Props.IsDisabled}
                    rows={2}
                    onChange={(Event) =>
                        Props.OnChange({
                            Text: Event.currentTarget.value,
                        })
                    }
                />
            </label>
            <div className={Styles.StyleGrid}>
                <label>
                    <span>크기</span>
                    <input
                        type="number"
                        min={Props.MinimumSize}
                        max={Props.MaximumSize}
                        defaultValue={Props.Value.Size}
                        disabled={Props.IsDisabled}
                        onChange={(Event) =>
                        {
                            if(Event.currentTarget.value === '')
                            {
                                return;
                            }

                            const Size = Number(
                                Event.currentTarget.value,
                            );

                            if(Number.isFinite(Size))
                            {
                                Props.OnChange({
                                    Size,
                                });
                            }
                        }}
                        onBlur={(Event) =>
                        {
                            const Size = Math.min(
                                Props.MaximumSize,
                                Math.max(
                                    Props.MinimumSize,
                                    Number(
                                        Event.currentTarget.value,
                                    ) || Props.Value.Size,
                                ),
                            );
                            Event.currentTarget.value =
                                String(Size);
                            Props.OnChange({
                                Size,
                            });
                        }}
                    />
                </label>
                <label>
                    <span>색상</span>
                    <input
                        type="color"
                        value={
                            Props.Value.Color ?? '#111111'
                        }
                        disabled={Props.IsDisabled}
                        onChange={(Event) =>
                            Props.OnChange({
                                Color:
                                    Event.currentTarget.value,
                            })
                        }
                    />
                </label>
            </div>
        </section>
    );
}

export function PhotoPageCustomizationLayeredPanel(
    Props: PhotoPageCustomizationLayeredPanelProps,
)
{
    const CloseButtonReference =
        useRef<HTMLButtonElement>(null);
    const IsBusy = Props.IsSaving;
    const IsBusyReference = useRef(IsBusy);
    const OnRequestCloseReference =
        useRef(Props.OnRequestClose);
    const IsMedia = Props.Kind === 'media';
    const PageLabel = IsMedia
        ? '영상'
        : Props.Kind === 'writing'
            ? '글'
            : '사진';

    function AddCategory()
    {
        if(
            Props.Categories === undefined
            || Props.OnChangeCategories === undefined
            || Props.Categories.length >= 20
        )
        {
            return;
        }

        let Suffix = Props.Categories.length + 1;

        while(Props.Categories.includes(`새 카테고리 ${Suffix}`))
        {
            Suffix += 1;
        }

        Props.OnChangeCategories([
            ...Props.Categories,
            `새 카테고리 ${Suffix}`,
        ]);
    }

    useEffect(() =>
    {
        IsBusyReference.current = IsBusy;
        OnRequestCloseReference.current =
            Props.OnRequestClose;
    }, [IsBusy, Props.OnRequestClose]);

    useEffect(() =>
    {
        const PreviousOverflow =
            document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        CloseButtonReference.current?.focus();

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(
                Event.key === 'Escape'
                && IsBusyReference.current === false
            )
            {
                OnRequestCloseReference.current();
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener(
                'keydown',
                CloseOnEscape,
            );
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
                    && IsBusy === false
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
                aria-labelledby="page-heading-customization-title"
                data-ue-component="PhotoPageCustomizationLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <span>
                            {IsMedia
                                ? 'MEDIA PAGE CUSTOMIZE'
                                : Props.Kind === 'writing'
                                    ? 'WRITING PAGE CUSTOMIZE'
                                    : 'PHOTO PAGE CUSTOMIZE'}
                        </span>
                        <h2 id="page-heading-customization-title">
                            상단 제목
                        </h2>
                        <p>
                            {PageLabel} 게시판 상단의 제목과 소개 문구를
                            설정합니다.
                        </p>
                    </div>
                    <div className={Styles.HeaderActions}>
                        {Props.OnBack ? (
                            <button
                                type="button"
                                onClick={Props.OnBack}
                                disabled={IsBusy}
                            >
                                ← 설정 목록
                            </button>
                        ) : null}
                        <button
                            ref={CloseButtonReference}
                            type="button"
                            onClick={Props.OnRequestClose}
                            disabled={IsBusy}
                            aria-label={`${PageLabel} 게시판 설정창 닫기`}
                        >
                            Close <b aria-hidden="true">×</b>
                        </button>
                    </div>
                </header>

                <form
                    className={Styles.Form}
                    onSubmit={(Event) =>
                    {
                        Event.preventDefault();
                        Props.OnSave();
                    }}
                >
                    {Props.Categories !== undefined
                    && Props.OnChangeCategories !== undefined ? (
                        <section className={Styles.SettingSection}>
                            <div className={Styles.SectionHeading}>
                                <strong>영상 카테고리</strong>
                                <span>추가 · 이름 수정 · 삭제</span>
                            </div>
                            <div className={Styles.CategoryList}>
                                {Props.Categories.map(
                                    (Category, CategoryIndex) => (
                                        <div
                                            key={CategoryIndex}
                                            className={Styles.CategoryRow}
                                        >
                                            <input
                                                type="text"
                                                value={Category}
                                                maxLength={20}
                                                disabled={IsBusy}
                                                aria-label={`${CategoryIndex + 1}번 카테고리 이름`}
                                                onChange={(Event) =>
                                                {
                                                    const Next = [
                                                        ...Props.Categories!,
                                                    ];
                                                    Next[CategoryIndex] =
                                                        Event.currentTarget
                                                            .value;
                                                    Props
                                                        .OnChangeCategories!(
                                                            Next,
                                                        );
                                                }}
                                            />
                                            <button
                                                type="button"
                                                disabled={
                                                    IsBusy
                                                    || Props.Categories!
                                                        .length <= 1
                                                }
                                                onClick={() =>
                                                    Props
                                                        .OnChangeCategories!(
                                                            Props.Categories!
                                                                .filter(
                                                                    (
                                                                        _,
                                                                        Index,
                                                                    ) =>
                                                                        Index
                                                                        !== CategoryIndex,
                                                                ),
                                                        )
                                                }
                                                aria-label={`${Category} 카테고리 삭제`}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                            <button
                                type="button"
                                className={Styles.AddCategoryButton}
                                disabled={
                                    IsBusy
                                    || Props.Categories.length >= 20
                                }
                                onClick={AddCategory}
                            >
                                + 카테고리 추가
                            </button>
                        </section>
                    ) : null}
                    <TextControls
                        Label="제목"
                        Value={Props.Heading}
                        MinimumSize={24}
                        MaximumSize={160}
                        MaximumTextLength={120}
                        IsDisabled={IsBusy}
                        OnChange={Props.OnChange}
                    />
                    <TextControls
                        Label="오른쪽 소개 문구"
                        Value={Props.Description}
                        MinimumSize={8}
                        MaximumSize={64}
                        MaximumTextLength={240}
                        IsDisabled={IsBusy}
                        OnChange={Props.OnChangeDescription}
                    />

                    <footer className={Styles.Footer}>
                        <p role="status">{Props.Notice}</p>
                        <button
                            type="submit"
                            disabled={IsBusy}
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
