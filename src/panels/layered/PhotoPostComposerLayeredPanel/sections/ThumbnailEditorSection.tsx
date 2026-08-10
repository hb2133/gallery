'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import {
    useRef,
    useState,
    type PointerEvent,
} from 'react';
import { CreateUniqueId } from '@/core/identity/UniqueId';
import type {
    PhotoCardFontWeight,
    PhotoCardTextLayer,
} from '@/managers/PhotoCardCustomizationManager';
import Styles from '../PhotoPostComposerLayeredPanel.module.css';

const FontOptions = [
    {
        Label: 'Sans',
        Value: 'Arial, sans-serif',
    },
    {
        Label: 'Korean Sans',
        Value: '"Noto Sans KR", sans-serif',
    },
    {
        Label: 'Serif',
        Value: 'Georgia, serif',
    },
    {
        Label: 'Mono',
        Value: '"Courier New", monospace',
    },
];
const FontWeightOptions: Array<{
    Label: string;
    Value: PhotoCardFontWeight;
}> = [
    { Label: 'Bold · 700', Value: 700 },
    { Label: 'Medium · 500', Value: 500 },
    { Label: 'Regular · 400', Value: 400 },
    { Label: 'Light · 300', Value: 300 },
    { Label: 'Thin · 100', Value: 100 },
];
const SnapThreshold = 1.25;

interface DragState
{
    LayerId: string;
    OffsetX: number;
    OffsetY: number;
}

interface SnapGuides
{
    X: number | null;
    Y: number | null;
}

interface SnapResult
{
    Guide: number | null;
    Position: number;
}

interface ThumbnailEditorSectionProps
{
    Categories: string[];
    Category: string | null;
    FallbackPreviewUrl: string | null;
    IsPrivate: boolean;
    IsSaving: boolean;
    Password: string;
    OnChangeCategory: (Category: string | null) => void;
    OnChangePrivate: (IsPrivate: boolean) => void;
    OnChangePassword: (Password: string) => void;
    OnChangeTextLayers: (
        TextLayers: PhotoCardTextLayer[],
    ) => void;
    OnSelectThumbnail: (File: File | null) => void;
    TextLayers: PhotoCardTextLayer[];
    ThumbnailPreviewUrl: string | null;
}

function Clamp(
    Value: number,
    Minimum: number,
    Maximum: number,
)
{
    return Math.min(
        Maximum,
        Math.max(Minimum, Value),
    );
}

function FindSnapPosition(
    Position: number,
    Size: number,
    Targets: number[],
): SnapResult
{
    const AnchorOffsets = [
        0,
        Size / 2,
        Size,
    ];
    let ClosestDistance = SnapThreshold + 1;
    let Result: SnapResult = {
        Guide: null,
        Position,
    };

    for(const AnchorOffset of AnchorOffsets)
    {
        const Anchor = Position + AnchorOffset;

        for(const Target of Targets)
        {
            const Distance = Math.abs(Anchor - Target);

            if(
                Distance <= SnapThreshold
                && Distance < ClosestDistance
            )
            {
                ClosestDistance = Distance;
                Result = {
                    Guide: Target,
                    Position: Target - AnchorOffset,
                };
            }
        }
    }

    return Result;
}

function ReadNumber(
    Value: string,
): number | null
{
    if(Value.trim() === '')
    {
        return null;
    }

    const NumberValue = Number(Value);

    return Number.isFinite(NumberValue)
        ? NumberValue
        : null;
}

export function ThumbnailEditorSection(
    Props: ThumbnailEditorSectionProps,
)
{
    const [SelectedLayerId, SetSelectedLayerId] =
        useState<string | null>(
            Props.TextLayers[0]?.Id ?? null,
        );
    const [ActiveSnapGuides, SetActiveSnapGuides] =
        useState<SnapGuides>({
            X: null,
            Y: null,
        });
    const [IsCategoryOpen, SetIsCategoryOpen] = useState(false);
    const [IsPasswordVisible, SetIsPasswordVisible] =
        useState(false);
    const [IsLayerSelectionMode, SetIsLayerSelectionMode] =
        useState(false);
    const [SelectedLayerIds, SetSelectedLayerIds] =
        useState<string[]>([]);
    const [IsLayerSettingsOpen, SetIsLayerSettingsOpen] =
        useState(false);
    const [LayerSettingsPosition, SetLayerSettingsPosition] =
        useState<{
            Left: number;
            MaxHeight: number;
            Placement: 'above' | 'below';
            Top: number;
        } | null>(null);
    const CanvasReference = useRef<HTMLDivElement>(null);
    const DragReference = useRef<DragState | null>(null);
    const SelectedLayer =
        Props.TextLayers.find(
            (Layer) => Layer.Id === SelectedLayerId,
        ) ?? null;
    const DisplayPreviewUrl =
        Props.ThumbnailPreviewUrl ?? Props.FallbackPreviewUrl;
    const IsUsingFallback =
        Props.ThumbnailPreviewUrl === null
        && Props.FallbackPreviewUrl !== null;

    function UpdateLayer(
        LayerId: string,
        Update: Partial<PhotoCardTextLayer>,
    )
    {
        Props.OnChangeTextLayers(
            Props.TextLayers.map((Layer) =>
                Layer.Id === LayerId
                    ? {
                        ...Layer,
                        ...Update,
                    }
                    : Layer,
            ),
        );
    }

    function AddTextLayer()
    {
        const Layer: PhotoCardTextLayer = {
            Id: CreateUniqueId(),
            Text: '',
            FontFamily: 'Arial, sans-serif',
            FontSize: 32,
            FontWeight: 400,
            Color: '#ffffff',
            X: 12,
            Y: 12,
        };

        Props.OnChangeTextLayers([
            ...Props.TextLayers,
            Layer,
        ]);
        SetSelectedLayerId(Layer.Id);
    }

    function ToggleLayerSelectionMode()
    {
        SetIsLayerSelectionMode((Current) => !Current);
        SetSelectedLayerIds([]);
        SetIsLayerSettingsOpen(false);
        SetLayerSettingsPosition(null);
    }

    function ToggleLayerSelection(LayerId: string)
    {
        SetSelectedLayerIds((Current) =>
            Current.includes(LayerId)
                ? Current.filter((Id) => Id !== LayerId)
                : [...Current, LayerId],
        );
    }

    function DeleteSelectedLayers()
    {
        if(SelectedLayerIds.length === 0)
        {
            return;
        }

        Props.OnChangeTextLayers(
            Props.TextLayers.filter(
                (Layer) =>
                    SelectedLayerIds.includes(Layer.Id) === false,
            ),
        );
        if(
            SelectedLayerId !== null
            && SelectedLayerIds.includes(SelectedLayerId)
        )
        {
            SetSelectedLayerId(null);
        }
        SetSelectedLayerIds([]);
        SetIsLayerSelectionMode(false);
    }

    function BeginLayerDrag(
        Event: PointerEvent<HTMLButtonElement>,
        Layer: PhotoCardTextLayer,
    )
    {
        const Canvas = CanvasReference.current;

        if(Canvas === null || Props.IsSaving)
        {
            return;
        }

        const Bounds = Canvas.getBoundingClientRect();
        DragReference.current = {
            LayerId: Layer.Id,
            OffsetX:
                Event.clientX
                - Bounds.left
                - (Layer.X / 100) * Bounds.width,
            OffsetY:
                Event.clientY
                - Bounds.top
                - (Layer.Y / 100) * Bounds.height,
        };
        Event.currentTarget.setPointerCapture(
            Event.pointerId,
        );
        SetActiveSnapGuides({
            X: null,
            Y: null,
        });
        SetSelectedLayerId(Layer.Id);
    }

    function MoveLayer(
        Event: PointerEvent<HTMLButtonElement>,
    )
    {
        const Canvas = CanvasReference.current;
        const Drag = DragReference.current;

        if(Canvas === null || Drag === null)
        {
            return;
        }

        const Bounds = Canvas.getBoundingClientRect();
        const ElementBounds =
            Event.currentTarget.getBoundingClientRect();
        const ElementWidth =
            ElementBounds.width / Bounds.width * 100;
        const ElementHeight =
            ElementBounds.height / Bounds.height * 100;
        const RawX = Clamp(
            (
                Event.clientX
                - Bounds.left
                - Drag.OffsetX
            ) / Bounds.width * 100,
            0,
            Math.max(0, 100 - ElementWidth),
        );
        const RawY = Clamp(
            (
                Event.clientY
                - Bounds.top
                - Drag.OffsetY
            ) / Bounds.height * 100,
            0,
            Math.max(0, 100 - ElementHeight),
        );
        const XTargets = [50];
        const YTargets = [50];
        const LayerElements =
            Canvas.querySelectorAll<HTMLElement>(
                '[data-text-layer-id]',
            );

        LayerElements.forEach((Element) =>
        {
            if(
                Element.dataset.textLayerId
                === Drag.LayerId
            )
            {
                return;
            }

            const LayerBounds =
                Element.getBoundingClientRect();
            const Left =
                (
                    LayerBounds.left - Bounds.left
                ) / Bounds.width * 100;
            const Top =
                (
                    LayerBounds.top - Bounds.top
                ) / Bounds.height * 100;
            const Width =
                LayerBounds.width / Bounds.width * 100;
            const Height =
                LayerBounds.height / Bounds.height * 100;

            XTargets.push(
                Left,
                Left + Width / 2,
                Left + Width,
            );
            YTargets.push(
                Top,
                Top + Height / 2,
                Top + Height,
            );
        });

        const XSnap = FindSnapPosition(
            RawX,
            ElementWidth,
            XTargets,
        );
        const YSnap = FindSnapPosition(
            RawY,
            ElementHeight,
            YTargets,
        );

        SetActiveSnapGuides({
            X: XSnap.Guide,
            Y: YSnap.Guide,
        });
        UpdateLayer(Drag.LayerId, {
            X: Clamp(
                XSnap.Position,
                0,
                Math.max(0, 100 - ElementWidth),
            ),
            Y: Clamp(
                YSnap.Position,
                0,
                Math.max(0, 100 - ElementHeight),
            ),
        });
    }

    function EndLayerDrag(
        Event: PointerEvent<HTMLButtonElement>,
    )
    {
        DragReference.current = null;
        SetActiveSnapGuides({
            X: null,
            Y: null,
        });

        if(
            Event.currentTarget.hasPointerCapture(
                Event.pointerId,
            )
        )
        {
            Event.currentTarget.releasePointerCapture(
                Event.pointerId,
            );
        }
    }

    function RenderLayerSettings(Layer: PhotoCardTextLayer)
    {
        if(
            LayerSettingsPosition === null
            || typeof document === 'undefined'
        )
        {
            return null;
        }

        return createPortal(
            <>
                <div
                    className={Styles.LayerSettingsBackdrop}
                    role="presentation"
                    onMouseDown={() =>
                    {
                        SetIsLayerSettingsOpen(false);
                        SetLayerSettingsPosition(null);
                    }}
                />
                <div
                    className={`${Styles.TextControls} ${Styles.LayerSettingsBox}`}
                    style={{
                        left: LayerSettingsPosition.Left,
                        maxHeight: LayerSettingsPosition.MaxHeight,
                        top: LayerSettingsPosition.Top,
                        transform:
                            LayerSettingsPosition.Placement === 'above'
                                ? 'translateY(-100%)'
                                : undefined,
                    }}
                    data-placement={LayerSettingsPosition.Placement}
                    role="dialog"
                    aria-label="텍스트 설정"
                >
                    <label>
                        <span>텍스트</span>
                        <input
                            type="text"
                            value={Layer.Text}
                            maxLength={120}
                            disabled={Props.IsSaving}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    Text: Event.currentTarget.value,
                                })
                            }
                        />
                    </label>
                    <label>
                        <span>폰트</span>
                        <select
                            value={Layer.FontFamily}
                            disabled={Props.IsSaving}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    FontFamily:
                                        Event.currentTarget.value,
                                })
                            }
                        >
                            {FontOptions.map((Option) => (
                                <option
                                    key={Option.Value}
                                    value={Option.Value}
                                >
                                    {Option.Label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>글자 굵기</span>
                        <select
                            className={Styles.WeightSelect}
                            size={5}
                            value={Layer.FontWeight}
                            disabled={Props.IsSaving}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    FontWeight: Number(
                                        Event.currentTarget.value,
                                    ) as PhotoCardFontWeight,
                                })
                            }
                        >
                            {FontWeightOptions.map((Option) => (
                                <option
                                    key={Option.Value}
                                    value={Option.Value}
                                >
                                    {Option.Label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className={Styles.TextControlRow}>
                        <label>
                            <span>크기</span>
                            <input
                                type="number"
                                min={8}
                                max={96}
                                value={Layer.FontSize}
                                disabled={Props.IsSaving}
                                onChange={(Event) =>
                                {
                                    const Value = ReadNumber(
                                        Event.currentTarget.value,
                                    );

                                    if(Value !== null)
                                    {
                                        UpdateLayer(Layer.Id, {
                                            FontSize: Clamp(
                                                Value,
                                                8,
                                                96,
                                            ),
                                        });
                                    }
                                }}
                            />
                        </label>
                        <label>
                            <span>색상</span>
                            <input
                                type="color"
                                value={Layer.Color}
                                disabled={Props.IsSaving}
                                onChange={(Event) =>
                                    UpdateLayer(Layer.Id, {
                                        Color:
                                            Event.currentTarget.value,
                                    })
                                }
                            />
                        </label>
                    </div>
                    <div className={Styles.TextControlRow}>
                        <label>
                            <span>가로 위치</span>
                            <input
                                type="number"
                                min={0}
                                max={95}
                                value={Math.round(Layer.X)}
                                disabled={Props.IsSaving}
                                onChange={(Event) =>
                                {
                                    const Value = ReadNumber(
                                        Event.currentTarget.value,
                                    );

                                    if(Value !== null)
                                    {
                                        UpdateLayer(Layer.Id, {
                                            X: Clamp(Value, 0, 95),
                                        });
                                    }
                                }}
                            />
                        </label>
                        <label>
                            <span>세로 위치</span>
                            <input
                                type="number"
                                min={0}
                                max={95}
                                value={Math.round(Layer.Y)}
                                disabled={Props.IsSaving}
                                onChange={(Event) =>
                                {
                                    const Value = ReadNumber(
                                        Event.currentTarget.value,
                                    );

                                    if(Value !== null)
                                    {
                                        UpdateLayer(Layer.Id, {
                                            Y: Clamp(Value, 0, 95),
                                        });
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </>,
            document.body,
        );
    }

    return (
        <div className={Styles.ThumbnailWorkspace}>
            <div className={Styles.ThumbnailCanvasColumn}>
                <div
                    ref={CanvasReference}
                    className={Styles.ThumbnailCanvas}
                    data-empty={DisplayPreviewUrl === null}
                >
                    {DisplayPreviewUrl !== null ? (
                        <Image
                            src={DisplayPreviewUrl}
                            alt=""
                            fill
                            sizes="(max-width: 760px) 90vw, 480px"
                            unoptimized
                        />
                    ) : (
                        <label
                            className={
                                Styles.EmptyThumbnailCanvas
                            }
                        >
                            <strong>썸네일 이미지 선택</strong>
                            <span>
                                선택하지 않으면 첫 내용 이미지를
                                사용합니다.
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                disabled={Props.IsSaving}
                                onChange={(Event) =>
                                {
                                    const File =
                                        Event.currentTarget.files?.[0];

                                    if(File !== undefined)
                                    {
                                        Props.OnSelectThumbnail(File);
                                    }

                                    Event.currentTarget.value = '';
                                }}
                            />
                        </label>
                    )}

                    {ActiveSnapGuides.X !== null ? (
                        <span
                            className={Styles.VerticalSnapGuide}
                            style={{
                                left: `${ActiveSnapGuides.X}%`,
                            }}
                            aria-hidden="true"
                        />
                    ) : null}
                    {ActiveSnapGuides.Y !== null ? (
                        <span
                            className={Styles.HorizontalSnapGuide}
                            style={{
                                top: `${ActiveSnapGuides.Y}%`,
                            }}
                            aria-hidden="true"
                        />
                    ) : null}

                    {Props.TextLayers.map((Layer) => (
                        <button
                            key={Layer.Id}
                            data-text-layer-id={Layer.Id}
                            type="button"
                            className={`${Styles.ThumbnailCanvasText} ${
                                Layer.Id === SelectedLayerId
                                    ? Styles.ThumbnailCanvasTextSelected
                                    : ''
                            }`}
                            style={{
                                color: Layer.Color,
                                fontFamily: Layer.FontFamily,
                                fontSize: `${Layer.FontSize}px`,
                                fontWeight: Layer.FontWeight,
                                left: `${Layer.X}%`,
                                top: `${Layer.Y}%`,
                            }}
                            disabled={Props.IsSaving}
                            onPointerDown={(Event) =>
                                BeginLayerDrag(Event, Layer)
                            }
                            onPointerMove={MoveLayer}
                            onPointerUp={EndLayerDrag}
                            onPointerCancel={EndLayerDrag}
                        >
                            {Layer.Text || '텍스트'}
                        </button>
                    ))}

                    {IsUsingFallback ? (
                        <span className={Styles.FallbackBadge}>
                            첫 내용 이미지 미리보기
                        </span>
                    ) : null}
                </div>

                <p className={Styles.ThumbnailHelp}>
                    중앙 또는 다른 텍스트에 가까워지면
                    자동으로 정렬됩니다.
                </p>
            </div>

            <aside className={Styles.ThumbnailInspector}>
                <div className={Styles.ThumbnailControl}>
                    <div>
                        <strong>썸네일</strong>
                        <small>
                            JPG · PNG · WebP · GIF, 최대 10MB
                        </small>
                    </div>
                    <label
                        className={Styles.ThumbnailMiniPreview}
                        data-empty={DisplayPreviewUrl === null}
                    >
                        {DisplayPreviewUrl !== null ? (
                            <Image
                                src={DisplayPreviewUrl}
                                alt="현재 썸네일"
                                fill
                                sizes="58px"
                                unoptimized
                            />
                        ) : null}
                        <span aria-hidden="true">
                            {DisplayPreviewUrl === null ? '선택' : '수정'}
                        </span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            aria-label="썸네일 이미지 변경"
                            disabled={Props.IsSaving}
                            onChange={(Event) =>
                            {
                                const File =
                                    Event.currentTarget.files?.[0];

                                if(File !== undefined)
                                {
                                    Props.OnSelectThumbnail(File);
                                }

                                Event.currentTarget.value = '';
                                Event.currentTarget.blur();
                            }}
                        />
                    </label>
                </div>

                <div className={Styles.CategoryControl}>
                    <span>카테고리</span>
                    <button
                        type="button"
                        className={Styles.CategoryToggle}
                        aria-haspopup="listbox"
                        aria-expanded={IsCategoryOpen}
                        disabled={Props.IsSaving}
                        onClick={() =>
                            SetIsCategoryOpen(
                                (Current) => !Current,
                            )
                        }
                    >
                        <span>
                            {Props.Category ?? '카테고리 없음'}
                        </span>
                        <svg
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                            data-open={IsCategoryOpen}
                        >
                            <path d="m4 6 4 4 4-4" />
                        </svg>
                    </button>
                    {IsCategoryOpen ? (
                        <div
                            className={Styles.CategoryOptions}
                            role="listbox"
                            aria-label="사진 카테고리"
                        >
                            {[null, ...Props.Categories].map(
                                (CategoryName) => (
                            <button
                                key={CategoryName ?? 'none'}
                                type="button"
                                role="option"
                                aria-selected={
                                    Props.Category === CategoryName
                                }
                                onClick={() =>
                                {
                                    Props.OnChangeCategory(CategoryName);
                                    SetIsCategoryOpen(false);
                                }}
                            >
                                {CategoryName ?? '카테고리 없음'}
                            </button>
                                ),
                            )}
                        </div>
                    ) : null}
                </div>

                <section className={Styles.PublishSettings}>
                    <h3>공개 상태</h3>
                    <div className={Styles.VisibilityControl}>
                        <div>
                            <strong>게시 상태</strong>
                            <span>
                                {Props.IsPrivate
                                    ? '관리자에게만 표시됩니다.'
                                    : '모든 방문자에게 표시됩니다.'}
                            </span>
                        </div>
                        <button
                            type="button"
                            data-private={Props.IsPrivate}
                            aria-pressed={Props.IsPrivate === false}
                            disabled={Props.IsSaving}
                            onClick={() =>
                            {
                                const NextIsPrivate =
                                    Props.IsPrivate === false;
                                Props.OnChangePrivate(NextIsPrivate);

                                if(NextIsPrivate)
                                {
                                    Props.OnChangePassword('');
                                    SetIsPasswordVisible(false);
                                }
                            }
                            }
                        >
                            <i aria-hidden="true" />
                            {Props.IsPrivate ? '비공개' : '공개'}
                        </button>
                    </div>

                    {Props.IsPrivate === false ? (
                        <div className={Styles.PasswordControl}>
                            <div>
                                <strong>제한 공개</strong>
                                <span>
                                    비밀번호를 아는 방문자만 내용을 볼 수 있습니다.
                                </span>
                            </div>
                            <div className={Styles.PasswordField}>
                                <input
                                    type={
                                        IsPasswordVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={Props.Password}
                                    minLength={4}
                                    maxLength={72}
                                    autoComplete="new-password"
                                    disabled={Props.IsSaving}
                                    placeholder="Password"
                                    onChange={(Event) =>
                                        Props.OnChangePassword(
                                            Event.currentTarget.value,
                                        )
                                    }
                                />
                                <button
                                    type="button"
                                    className={
                                        Styles.PasswordVisibilityButton
                                    }
                                    aria-label={
                                        IsPasswordVisible
                                            ? '비밀번호 숨기기'
                                            : '비밀번호 보기'
                                    }
                                    aria-pressed={IsPasswordVisible}
                                    disabled={Props.IsSaving}
                                    onClick={() =>
                                        SetIsPasswordVisible(
                                            (Current) => !Current,
                                        )
                                    }
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="2.5"
                                        />
                                        {IsPasswordVisible ? null : (
                                            <path d="m4 4 16 16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : null}
                </section>

                <div className={Styles.LayerHeading}>
                    <strong>텍스트</strong>
                    <div>
                        <button
                            type="button"
                            disabled={
                                Props.IsSaving
                                || Props.TextLayers.length >= 20
                            }
                            onClick={AddTextLayer}
                        >
                            추가
                        </button>
                        <button
                            type="button"
                            data-active={IsLayerSelectionMode}
                            disabled={
                                Props.IsSaving
                                || Props.TextLayers.length === 0
                            }
                            onClick={ToggleLayerSelectionMode}
                        >
                            선택
                        </button>
                        <button
                            type="button"
                            disabled={
                                Props.IsSaving
                                || SelectedLayerIds.length === 0
                            }
                            onClick={DeleteSelectedLayers}
                        >
                            삭제
                        </button>
                    </div>
                </div>

                <div className={Styles.LayerList}>
                    {Props.TextLayers.map((Layer, Index) => (
                        <div
                            key={Layer.Id}
                            className={`${Styles.LayerRow} ${
                                Layer.Id === SelectedLayerId
                                    ? Styles.LayerActive
                                    : ''
                            }`}
                        >
                            <p>
                                {IsLayerSelectionMode ? (
                                    <input
                                        type="checkbox"
                                        checked={
                                            SelectedLayerIds.includes(
                                                Layer.Id,
                                            )
                                        }
                                        aria-label={`${Layer.Text || '텍스트'} 선택`}
                                        onChange={() =>
                                            ToggleLayerSelection(Layer.Id)
                                        }
                                    />
                                ) : (
                                    <span>
                                        {String(Index + 1).padStart(2, '0')}
                                    </span>
                                )}
                                {Layer.Text || '텍스트'}
                            </p>
                            <div>
                                <button
                                    type="button"
                                    className={Styles.LayerSettingsButton}
                                    data-active={
                                        Layer.Id === SelectedLayerId
                                        && IsLayerSettingsOpen
                                    }
                                    disabled={Props.IsSaving}
                                    onClick={(Event) =>
                                    {
                                        const ShouldClose =
                                            Layer.Id === SelectedLayerId
                                            && IsLayerSettingsOpen;
                                        SetSelectedLayerId(Layer.Id);
                                        SetIsLayerSelectionMode(false);
                                        SetSelectedLayerIds([]);
                                        const Bounds =
                                            Event.currentTarget
                                                .getBoundingClientRect();
                                        const MenuWidth = Math.min(
                                            288,
                                            window.innerWidth - 24,
                                        );
                                        const Left = Math.min(
                                            Math.max(
                                                12,
                                                Bounds.right - MenuWidth,
                                            ),
                                            window.innerWidth
                                            - MenuWidth
                                            - 12,
                                        );
                                        const AvailableBelow =
                                            window.innerHeight
                                            - Bounds.bottom
                                            - 12;
                                        const AvailableAbove =
                                            Bounds.top - 12;
                                        const Placement =
                                            AvailableBelow >= 430
                                            || AvailableBelow
                                            >= AvailableAbove
                                                ? 'below'
                                                : 'above';
                                        const MaxHeight = Math.max(
                                            180,
                                            (Placement === 'below'
                                                ? AvailableBelow
                                                : AvailableAbove) - 8,
                                        );
                                        SetIsLayerSettingsOpen(
                                            !ShouldClose,
                                        );
                                        SetLayerSettingsPosition(
                                            ShouldClose
                                                ? null
                                                : {
                                                    Left,
                                                    MaxHeight,
                                                    Placement,
                                                    Top:
                                                        Placement === 'below'
                                                            ? Bounds.bottom + 8
                                                            : Bounds.top - 8,
                                                },
                                        );
                                    }}
                                    aria-label="텍스트 설정"
                                    title="텍스트 설정"
                                >
                                    ::
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {SelectedLayer !== null && IsLayerSettingsOpen
                    ? RenderLayerSettings(SelectedLayer)
                    : null}
            </aside>
        </div>
    );
}
