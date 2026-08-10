'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type {
    GalleryCategory,
    GalleryTextStyle,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import type { StartPageCustomizationLayeredPanelProps } from './StartPageCustomizationLayeredPanelInterface';
import Styles from './StartPageCustomizationLayeredPanel.module.css';

const CategoryFields: Array<{
    Category: GalleryCategory;
    Position: string;
}> = [
    {
        Category: 'architecture',
        Position: '위',
    },
    {
        Category: 'portraits',
        Position: '왼쪽',
    },
    {
        Category: 'journeys',
        Position: '오른쪽',
    },
    {
        Category: 'journal',
        Position: '아래',
    },
];

const FontPresets = [
    'sans',
    'korean',
    'mono',
    'serif',
    'Arial, sans-serif',
    '"Noto Sans KR", sans-serif',
    '"Times New Roman", serif',
    'Georgia, serif',
];

interface TypographyControlsProps
{
    IsDisabled: boolean;
    Label: string;
    OnChange: (TextStyle: GalleryTextStyle) => void;
    TextStyle: GalleryTextStyle;
}

function TypographyControls(
    Props: TypographyControlsProps,
)
{
    return (
        <div className={Styles.TypographyGroup}>
            <strong>{Props.Label}</strong>
            <div className={Styles.TypographyFields}>
                <label>
                    <span>폰트 이름 / CSS font-family</span>
                    <input
                        type="text"
                        list="gallery-font-presets"
                        value={Props.TextStyle.Font}
                        maxLength={120}
                        disabled={Props.IsDisabled}
                        onChange={(Event) =>
                            Props.OnChange({
                                ...Props.TextStyle,
                                Font: Event.currentTarget.value,
                            })
                        }
                    />
                </label>
                <label>
                    <span>크기</span>
                    <input
                        type="number"
                        min={8}
                        max={64}
                        defaultValue={Props.TextStyle.Size}
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
                                    ...Props.TextStyle,
                                    Size,
                                });
                            }
                        }}
                        onBlur={(Event) =>
                        {
                            const Size = Math.min(
                                64,
                                Math.max(
                                    8,
                                    Number(
                                        Event.currentTarget.value,
                                    ) || Props.TextStyle.Size,
                                ),
                            );
                            Event.currentTarget.value = String(Size);
                            Props.OnChange({
                                ...Props.TextStyle,
                                Size,
                            });
                        }}
                    />
                </label>
                <label>
                    <span>색상</span>
                    <input
                        type="color"
                        value={Props.TextStyle.Color}
                        disabled={Props.IsDisabled}
                        onChange={(Event) =>
                            Props.OnChange({
                                ...Props.TextStyle,
                                Color: Event.currentTarget.value,
                            })
                        }
                    />
                </label>
            </div>
        </div>
    );
}

export function StartPageCustomizationLayeredPanel(
    Props: StartPageCustomizationLayeredPanelProps,
)
{
    const FirstInputReference = useRef<HTMLInputElement>(null);
    const [
        HoveredImageCategory,
        SetHoveredImageCategory,
    ] = useState<GalleryCategory | null>(null);
    const [ActiveCategory, SetActiveCategory] =
        useState<GalleryCategory>('architecture');
    const [DraggedCell, SetDraggedCell] =
        useState<number | null>(null);
    const [SelectedCell, SetSelectedCell] =
        useState<number | null>(null);
    const ActiveIndex = CategoryFields.findIndex(
        (Field) => Field.Category === ActiveCategory,
    );
    const ActiveField = CategoryFields[ActiveIndex];
    const ActiveLayout =
        Props.Customization.CategoryBoxLayouts[ActiveCategory];
    const ActiveImage =
        Props.Customization.CategoryImages[ActiveCategory];
    const CategoryTextStyle =
        Props.Customization.CategoryTextStyles[ActiveCategory];
    const CenterTextStyle =
        Props.Customization.CategoryCenterTextStyles[ActiveCategory];
    const DestinationTextStyle =
        Props.Customization.DestinationTextStyles[ActiveCategory];
    const IsUploading =
        Props.UploadingCategory === ActiveCategory;
    const IsBusy =
        Props.IsSaving
        || Props.UploadingCategory !== null;
    const IsBusyReference = useRef(IsBusy);
    const OnRequestCloseReference = useRef(
        Props.OnRequestClose,
    );

    useEffect(() =>
    {
        IsBusyReference.current = IsBusy;
        OnRequestCloseReference.current =
            Props.OnRequestClose;
    }, [IsBusy, Props.OnRequestClose]);

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        FirstInputReference.current?.focus();

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
                aria-labelledby="start-customization-title"
                data-ue-component="StartPageCustomizationLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <span>START PAGE CUSTOMIZE</span>
                        <h2 id="start-customization-title">
                            시작 페이지 설정
                        </h2>
                        <p>
                            카테고리와 게시판 이동 글자의
                            내용·스타일, 선택 이미지를 설정합니다.
                        </p>
                    </div>
                    <div className={Styles.HeaderActions}>
                        <button
                            type="button"
                            className={Styles.BackButton}
                            onClick={Props.OnBack}
                            disabled={IsBusy}
                        >
                            ← 설정 목록
                        </button>
                        <button
                            type="button"
                            className={Styles.CloseButton}
                            onClick={Props.OnRequestClose}
                            disabled={IsBusy}
                            aria-label="시작 페이지 설정 창 닫기"
                        >
                            <span>Close</span>
                            <b aria-hidden="true">×</b>
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
                    <datalist id="gallery-font-presets">
                        {FontPresets.map((Font) => (
                            <option key={Font} value={Font} />
                        ))}
                    </datalist>

                    <nav
                        className={Styles.CategoryTabs}
                        aria-label="편집할 카테고리"
                    >
                        {CategoryFields.map((Field, Index) => (
                            <button
                                key={Field.Category}
                                type="button"
                                data-active={
                                    Field.Category === ActiveCategory
                                }
                                aria-pressed={
                                    Field.Category === ActiveCategory
                                }
                                disabled={IsBusy}
                                onClick={() =>
                                {
                                    SetActiveCategory(Field.Category);
                                    SetSelectedCell(null);
                                }}
                            >
                                <span>
                                    {String(Index + 1).padStart(2, '0')}
                                </span>
                                <strong>
                                    {Props.Customization
                                        .CategoryLabels[Field.Category]}
                                </strong>
                            </button>
                        ))}
                    </nav>

                    <div className={Styles.EditorLayout}>
                        <section className={Styles.PreviewSection}>
                            <div className={Styles.SectionHeading}>
                                <strong>박스 미리보기</strong>
                                <p>5×5 기본 화면 배치</p>
                            </div>
                            <div
                                className={Styles.BoxPreview}
                                aria-label={`${Props.Customization.CategoryLabels[ActiveCategory]} 박스 배치 미리보기`}
                            >
                                {Array.from(
                                    { length: 25 },
                                    (_, CellIndex) =>
                                    {
                                        const Cell = CellIndex + 1;
                                        const Column = CellIndex % 5;
                                        const Row = Math.floor(
                                            CellIndex / 5,
                                        );
                                        const IsFilled =
                                            ActiveLayout.includes(Cell);

                                        return (
                                            <button
                                                key={Cell}
                                                type="button"
                                                className={Styles.PreviewCell}
                                                data-filled={IsFilled}
                                                data-selected={
                                                    SelectedCell === Cell
                                                }
                                                draggable={
                                                    IsFilled
                                                    && Cell !== 13
                                                    && IsBusy === false
                                                }
                                                disabled={
                                                    IsBusy || Cell === 13
                                                }
                                                style={
                                                    IsFilled
                                                        ? {
                                                            backgroundImage:
                                                                `url(${JSON.stringify(ActiveImage)})`,
                                                            backgroundPosition:
                                                                `${Column * 25}% ${Row * 25}%`,
                                                        }
                                                        : undefined
                                                }
                                                onClick={() =>
                                                {
                                                    if(IsFilled)
                                                    {
                                                        if(Cell !== 13)
                                                        {
                                                            SetSelectedCell(
                                                                (Current) =>
                                                                    Current
                                                                    === Cell
                                                                        ? null
                                                                        : Cell,
                                                            );
                                                        }
                                                        return;
                                                    }

                                                    if(SelectedCell !== null)
                                                    {
                                                        Props.OnMoveBoxLayoutCell(
                                                            SelectedCell,
                                                            Cell,
                                                            ActiveCategory,
                                                        );
                                                        SetSelectedCell(null);
                                                    }
                                                }}
                                                onDragStart={() =>
                                                {
                                                    SetDraggedCell(Cell);
                                                    SetSelectedCell(Cell);
                                                }}
                                                onDragOver={(Event) =>
                                                {
                                                    if(
                                                        IsFilled === false
                                                        && DraggedCell !== null
                                                    )
                                                    {
                                                        Event.preventDefault();
                                                    }
                                                }}
                                                onDrop={(Event) =>
                                                {
                                                    Event.preventDefault();

                                                    if(
                                                        IsFilled === false
                                                        && DraggedCell !== null
                                                    )
                                                    {
                                                        Props.OnMoveBoxLayoutCell(
                                                            DraggedCell,
                                                            Cell,
                                                            ActiveCategory,
                                                        );
                                                    }

                                                    SetDraggedCell(null);
                                                    SetSelectedCell(null);
                                                }}
                                                onDragEnd={() =>
                                                {
                                                    SetDraggedCell(null);
                                                    SetSelectedCell(null);
                                                }}
                                                aria-label={
                                                    IsFilled
                                                        ? Cell === 13
                                                            ? '13번 중앙 고정 박스'
                                                            : `${Cell}번 박스 이동`
                                                        : SelectedCell === null
                                                            ? `${Cell}번 빈 칸`
                                                            : `${Cell}번으로 박스 이동`
                                                }
                                            >
                                                <span>{Cell}</span>
                                                {IsFilled ? (
                                                    <small>
                                                        {Cell === 13
                                                            ? Props
                                                                .Customization
                                                                .CategoryLabels[
                                                                    ActiveCategory
                                                                ]
                                                            : Props
                                                                .Customization
                                                                .DestinationLabels[
                                                                    ActiveCategory
                                                                ]}
                                                    </small>
                                                ) : null}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                            <p className={Styles.PreviewHelp}>
                                중앙을 제외한 박스를 빈 칸으로
                                드래그하세요. 클릭해서 이동할
                                박스와 빈 칸을 순서대로
                                선택해도 됩니다.
                            </p>
                        </section>

                        <article className={Styles.CategoryCard}>
                            <div className={Styles.CardTop}>
                                <span>
                                    {String(ActiveIndex + 1)
                                        .padStart(2, '0')}
                                    {' · '}
                                    {ActiveField.Position}
                                </span>
                                <label
                                    className={`${Styles.ImagePicker} ${
                                        HoveredImageCategory
                                        === ActiveCategory
                                            ? Styles.ImagePickerActive
                                            : ''
                                    } ${
                                        IsBusy
                                            ? Styles.ImagePickerDisabled
                                            : ''
                                    }`}
                                    aria-label={`${Props.Customization.CategoryLabels[ActiveCategory]} 카테고리 이미지 수정`}
                                    onPointerEnter={() =>
                                        SetHoveredImageCategory(
                                            ActiveCategory,
                                        )
                                    }
                                    onPointerLeave={() =>
                                        SetHoveredImageCategory(null)
                                    }
                                >
                                    <Image
                                        src={ActiveImage}
                                        alt=""
                                        fill
                                        sizes="96px"
                                        unoptimized
                                    />
                                    <span
                                        className={Styles.ImagePickerOverlay}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M14.7 5.3 18.7 9.3M4 20l4.1-1 10.6-10.6a1.4 1.4 0 0 0 0-2l-1.1-1.1a1.4 1.4 0 0 0-2 0L5 15.9 4 20Z" />
                                        </svg>
                                        <span>
                                            {IsUploading
                                                ? '업로드 중'
                                                : '수정'}
                                        </span>
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        disabled={IsBusy}
                                        onClick={() =>
                                            SetHoveredImageCategory(null)
                                        }
                                        onChange={(Event) =>
                                        {
                                            const File =
                                                Event.currentTarget
                                                    .files?.[0];

                                            if(File)
                                            {
                                                Props.OnSelectImage(
                                                    ActiveCategory,
                                                    File,
                                                );
                                            }

                                            Event.currentTarget.value = '';
                                            Event.currentTarget.blur();
                                        }}
                                    />
                                </label>
                            </div>

                            <label className={Styles.TextField}>
                                <span>카테고리 이름</span>
                                <input
                                    ref={FirstInputReference}
                                    type="text"
                                    value={
                                        Props.Customization
                                            .CategoryLabels[ActiveCategory]
                                    }
                                    maxLength={20}
                                    disabled={IsBusy}
                                    onChange={(Event) =>
                                        Props.OnChangeLabel(
                                            ActiveCategory,
                                            Event.currentTarget.value,
                                        )
                                    }
                                />
                            </label>

                            <TypographyControls
                                Label="박스 밖 글자 스타일"
                                TextStyle={CategoryTextStyle}
                                IsDisabled={IsBusy}
                                OnChange={(TextStyle) =>
                                    Props.OnChangeCategoryTextStyle(
                                        ActiveCategory,
                                        TextStyle,
                                    )
                                }
                            />

                            <TypographyControls
                                Label="선택 후 중앙 글자 스타일"
                                TextStyle={CenterTextStyle}
                                IsDisabled={IsBusy}
                                OnChange={(TextStyle) =>
                                    Props.OnChangeCategoryCenterTextStyle(
                                        ActiveCategory,
                                        TextStyle,
                                    )
                                }
                            />

                            <label className={Styles.TextField}>
                                <span>게시판 이동 글자</span>
                                <input
                                    type="text"
                                    value={
                                        Props.Customization
                                            .DestinationLabels[
                                                ActiveCategory
                                            ]
                                    }
                                    maxLength={30}
                                    disabled={IsBusy}
                                    onChange={(Event) =>
                                        Props.OnChangeDestinationLabel(
                                            ActiveCategory,
                                            Event.currentTarget.value,
                                        )
                                    }
                                />
                            </label>

                            <TypographyControls
                                Label="게시판 이동 글자 스타일"
                                TextStyle={DestinationTextStyle}
                                IsDisabled={IsBusy}
                                OnChange={(TextStyle) =>
                                    Props.OnChangeDestinationTextStyle(
                                        ActiveCategory,
                                        TextStyle,
                                    )
                                }
                            />
                        </article>
                    </div>

                    <footer className={Styles.Footer}>
                        <p aria-live="polite">
                            {Props.Notice}
                        </p>
                        <div>
                            <button
                                type="submit"
                                disabled={IsBusy}
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
