'use client';

import Image from 'next/image';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent,
} from 'react';
import { CreateUniqueId } from '@/core/identity/UniqueId';
import { PhotoViewModeSelector } from '@/components/PhotoViewModeSelector/PhotoViewModeSelector';
import { PhotoPageNumberStyleControl } from '@/components/PhotoPageNumberStyleControl/PhotoPageNumberStyleControl';
import {
    GetOppositePhotoPageDirection,
    NormalizePhotoPageDirectionSequence,
    PhotoPageDirections,
    type PhotoPageDirection,
} from '@/core/navigation/PhotoPageDirection';
import type { PhotoCardTextLayer } from '@/managers/PhotoCardCustomizationManager';
import type { GalleryDetailViewMode } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import type { PhotoPostComposerLayeredPanelProps } from './PhotoPostComposerLayeredPanelInterface';
import { ThumbnailEditorSection } from './sections/ThumbnailEditorSection';
import Styles from './PhotoPostComposerLayeredPanel.module.css';

interface SelectedPhoto
{
    ForwardDirection: PhotoPageDirection | null;
    Id: string;
    PreviewUrl: string;
    Source: string | File;
    X: number;
    Y: number;
}

interface ContentPhotoDragState
{
    LastMoveAt: number;
    LastTargetIndex: number;
    PendingTargetIndex: number;
    PhotoId: string;
    PointerId: number;
}

const ContentDragUpdateInterval = 72;
const DirectionSymbols: Record<PhotoPageDirection, string> = {
    left: '←',
    right: '→',
    up: '↑',
    down: '↓',
};

function CreatePreviewUrl(
    Source: string | File,
)
{
    return typeof Source === 'string'
        ? Source
        : URL.createObjectURL(Source);
}

function RevokePreviewUrl(PreviewUrl: string)
{
    if(PreviewUrl.startsWith('blob:'))
    {
        URL.revokeObjectURL(PreviewUrl);
    }
}

function NormalizeSelectedPhotoSequence(
    Photos: SelectedPhoto[],
): SelectedPhoto[]
{
    const Directions =
        NormalizePhotoPageDirectionSequence(
            Photos.map((Photo) => Photo.ForwardDirection),
        );

    return Photos.map((Photo, PageIndex) => ({
        ...Photo,
        ForwardDirection: Directions[PageIndex],
        X: PageIndex % 5,
        Y: Math.floor(PageIndex / 5),
    }));
}

export function PhotoPostComposerLayeredPanel(
    Props: PhotoPostComposerLayeredPanelProps,
)
{
    const [Category, SetCategory] =
        useState<string | null>(null);
    const [EnabledViewModes, SetEnabledViewModes] =
        useState<GalleryDetailViewMode[]>(['book']);
    const [PageNumberColor, SetPageNumberColor] =
        useState('#ffffff');
    const [PageNumberOpacity, SetPageNumberOpacity] =
        useState(.86);
    const [IsPrivate, SetIsPrivate] = useState(false);
    const [Password, SetPassword] = useState('');
    const [TextLayers, SetTextLayers] =
        useState<PhotoCardTextLayer[]>([]);
    const [ContentPhotos, SetContentPhotos] =
        useState<SelectedPhoto[]>([]);
    const [ThumbnailPhoto, SetThumbnailPhoto] =
        useState<SelectedPhoto | null>(null);
    const [IsThumbnailOpen, SetIsThumbnailOpen] =
        useState(true);
    const [IsContentOpen, SetIsContentOpen] =
        useState(false);
    const [LocalNotice, SetLocalNotice] = useState('');
    const [
        ThumbnailEditorVersion,
        SetThumbnailEditorVersion,
    ] = useState(0);
    const [DraggedContentPhotoId, SetDraggedContentPhotoId] =
        useState<string | null>(null);
    const [IsContentSelectionMode, SetIsContentSelectionMode] =
        useState(false);
    const [SelectedContentPhotoIds, SetSelectedContentPhotoIds] =
        useState<string[]>([]);
    const ContentPhotosReference = useRef(ContentPhotos);
    const ThumbnailPhotoReference =
        useRef(ThumbnailPhoto);
    const IsSavingReference = useRef(Props.IsSaving);
    const OnRequestCloseReference =
        useRef(Props.OnRequestClose);
    const ContentGridReference =
        useRef<HTMLDivElement>(null);
    const ContentPhotoElementReferences =
        useRef(new Map<string, HTMLElement>());
    const PreviousContentPhotoBounds =
        useRef(new Map<string, DOMRect>());
    const ContentPhotoDragReference =
        useRef<ContentPhotoDragState | null>(null);

    useEffect(() =>
    {
        ContentPhotosReference.current = ContentPhotos;
        ThumbnailPhotoReference.current = ThumbnailPhoto;
        IsSavingReference.current = Props.IsSaving;
        OnRequestCloseReference.current =
            Props.OnRequestClose;
    }, [
        ContentPhotos,
        ThumbnailPhoto,
        Props.IsSaving,
        Props.OnRequestClose,
    ]);

    useEffect(() =>
    {
        const PreviousOverflow =
            document.body.style.overflow;
        document.body.style.overflow = 'hidden';

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
            window.removeEventListener(
                'keydown',
                CloseOnEscape,
            );
            ContentPhotosReference.current.forEach((Photo) =>
            {
                RevokePreviewUrl(Photo.PreviewUrl);
            });
            if(ThumbnailPhotoReference.current !== null)
            {
                RevokePreviewUrl(
                    ThumbnailPhotoReference.current.PreviewUrl,
                );
            }
        };
    }, []);

    useLayoutEffect(() =>
    {
        const NextBounds = new Map<string, DOMRect>();

        ContentPhotos.forEach((Photo) =>
        {
            const Element =
                ContentPhotoElementReferences.current.get(
                    Photo.Id,
                );

            if(Element === undefined)
            {
                return;
            }

            const NextBound = Element.getBoundingClientRect();
            const PreviousBound =
                PreviousContentPhotoBounds.current.get(
                    Photo.Id,
                );
            NextBounds.set(Photo.Id, NextBound);

            if(PreviousBound !== undefined)
            {
                const DeltaX =
                    PreviousBound.left - NextBound.left;
                const DeltaY =
                    PreviousBound.top - NextBound.top;

                if(DeltaX !== 0 || DeltaY !== 0)
                {
                    Element.getAnimations().forEach(
                        (Animation) => Animation.cancel(),
                    );
                    Element.animate(
                        [
                            {
                                transform:
                                    `translate(${DeltaX}px, ${DeltaY}px)`,
                            },
                            {
                                transform: 'translate(0, 0)',
                            },
                        ],
                        {
                            duration: 210,
                            easing:
                                'cubic-bezier(.2, .8, .2, 1)',
                        },
                    );
                }
            }
        });

        PreviousContentPhotoBounds.current = NextBounds;
    }, [ContentPhotos]);

    function AddContentPhotos(Files: File[])
    {
        if(Files.length === 0)
        {
            return;
        }

        const AddedPhotos = Files.map(
            (File, FileIndex): SelectedPhoto =>
            {
                const PageIndex =
                    ContentPhotos.length + FileIndex;

                return {
                    ForwardDirection: 'right',
                    Id: CreateUniqueId(),
                    PreviewUrl: URL.createObjectURL(File),
                    Source: File,
                    X: PageIndex % 5,
                    Y: Math.floor(PageIndex / 5),
                };
            },
        );

        SetContentPhotos((Current) =>
            NormalizeSelectedPhotoSequence([
                ...Current,
                ...AddedPhotos,
            ]),
        );
        SetLocalNotice('');
    }

    function SelectThumbnail(File: File | null)
    {
        if(ThumbnailPhoto !== null)
        {
            RevokePreviewUrl(ThumbnailPhoto.PreviewUrl);
        }

        if(File === null)
        {
            SetThumbnailPhoto(null);
            return;
        }

        SetThumbnailPhoto({
            ForwardDirection: null,
            Id: CreateUniqueId(),
            PreviewUrl: URL.createObjectURL(File),
            Source: File,
            X: 0,
            Y: 0,
        });
        SetLocalNotice('');
    }

    function ToggleContentSelectionMode()
    {
        SetIsContentSelectionMode((Current) => !Current);
        SetSelectedContentPhotoIds([]);
    }

    function ToggleContentPhotoSelection(PhotoId: string)
    {
        SetSelectedContentPhotoIds((Current) =>
            Current.includes(PhotoId)
                ? Current.filter((Id) => Id !== PhotoId)
                : [...Current, PhotoId],
        );
    }

    function DeleteSelectedContentPhotos()
    {
        ContentPhotos
            .filter((Photo) =>
                SelectedContentPhotoIds.includes(Photo.Id),
            )
            .forEach((Photo) =>
                RevokePreviewUrl(Photo.PreviewUrl),
            );
        SetContentPhotos(
            NormalizeSelectedPhotoSequence(
                ContentPhotos.filter((Photo) =>
                    SelectedContentPhotoIds.includes(Photo.Id) === false,
                ),
            ),
        );
        SetSelectedContentPhotoIds([]);
        SetIsContentSelectionMode(false);
    }

    function ToggleThumbnailSection()
    {
        const ShouldOpen = IsThumbnailOpen === false;
        SetIsThumbnailOpen(ShouldOpen);

        if(ShouldOpen)
        {
            SetIsContentOpen(false);
        }
    }

    function ToggleContentSection()
    {
        const ShouldOpen = IsContentOpen === false;
        SetIsContentOpen(ShouldOpen);

        if(ShouldOpen)
        {
            SetIsThumbnailOpen(false);
        }
    }

    function MoveContentPhotoToSlot(
        PhotoId: string,
        TargetIndex: number,
    )
    {
        SetContentPhotos((Current) =>
        {
            const SourceIndex = Current.findIndex(
                (Photo) => Photo.Id === PhotoId,
            );

            if(SourceIndex < 0)
            {
                return Current;
            }

            const SafeTargetIndex = Math.min(
                Current.length - 1,
                Math.max(0, TargetIndex),
            );

            if(SourceIndex === SafeTargetIndex)
            {
                return Current;
            }

            const Next = [...Current];
            const [MovingPhoto] = Next.splice(SourceIndex, 1);
            Next.splice(SafeTargetIndex, 0, MovingPhoto);

            return NormalizeSelectedPhotoSequence(Next);
        });
    }

    function ChangeContentPhotoDirection(
        PhotoId: string,
        Direction: PhotoPageDirection,
    )
    {
        SetContentPhotos((Current) =>
            NormalizeSelectedPhotoSequence(
                Current.map((Photo, PageIndex) =>
                {
                    if(
                        Photo.Id !== PhotoId
                        || PageIndex === Current.length - 1
                    )
                    {
                        return Photo;
                    }

                    return {
                        ...Photo,
                        ForwardDirection: Direction,
                    };
                }),
            ),
        );
    }

    function BeginContentPhotoDrag(
        Event: PointerEvent<HTMLDivElement>,
        PhotoId: string,
    )
    {
        if(Props.IsSaving || IsContentSelectionMode)
        {
            return;
        }

        const Photo = ContentPhotos.find(
            (Candidate) => Candidate.Id === PhotoId,
        );

        if(Photo === undefined)
        {
            return;
        }

        Event.preventDefault();
        Event.currentTarget.setPointerCapture(
            Event.pointerId,
        );
        ContentPhotoDragReference.current = {
            LastMoveAt: Event.timeStamp,
            LastTargetIndex: ContentPhotos.findIndex(
                (Candidate) => Candidate.Id === PhotoId,
            ),
            PendingTargetIndex: ContentPhotos.findIndex(
                (Candidate) => Candidate.Id === PhotoId,
            ),
            PhotoId,
            PointerId: Event.pointerId,
        };
        SetDraggedContentPhotoId(PhotoId);
    }

    function MoveDraggedContentPhoto(
        Event: PointerEvent<HTMLDivElement>,
    )
    {
        const Drag = ContentPhotoDragReference.current;
        const Grid = ContentGridReference.current;

        if(
            Drag === null
            || Grid === null
            || Drag.PointerId !== Event.pointerId
        )
        {
            return;
        }

        const Bounds = Grid.getBoundingClientRect();
        const X = Math.min(
            4,
            Math.max(
                0,
                Math.floor(
                    (Event.clientX - Bounds.left)
                    / Bounds.width * 5,
                ),
            ),
        );
        const RowCount = Math.max(
            1,
            Math.ceil(ContentPhotos.length / 5),
        );
        const Y = Math.min(
            RowCount - 1,
            Math.max(
                0,
                Math.floor(
                    (Event.clientY - Bounds.top)
                    / Bounds.height * RowCount,
                ),
            ),
        );
        const TargetIndex = Math.min(
            ContentPhotos.length - 1,
            Y * 5 + X,
        );
        const CurrentTime = Event.timeStamp;
        Drag.PendingTargetIndex = TargetIndex;

        if(
            TargetIndex === Drag.LastTargetIndex
            || (
                CurrentTime - Drag.LastMoveAt
                < ContentDragUpdateInterval
            )
        )
        {
            return;
        }

        Drag.LastMoveAt = CurrentTime;
        Drag.LastTargetIndex = TargetIndex;
        MoveContentPhotoToSlot(
            Drag.PhotoId,
            TargetIndex,
        );
    }

    function EndContentPhotoDrag(
        Event: PointerEvent<HTMLDivElement>,
    )
    {
        const Drag = ContentPhotoDragReference.current;

        if(
            Drag !== null
            && Drag.PendingTargetIndex
            !== Drag.LastTargetIndex
        )
        {
            MoveContentPhotoToSlot(
                Drag.PhotoId,
                Drag.PendingTargetIndex,
            );
        }

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

        ContentPhotoDragReference.current = null;
        SetDraggedContentPhotoId(null);
    }

    function Submit()
    {
        const NormalizedPassword = Password.trim();

        if(
            IsPrivate === false
            && NormalizedPassword !== ''
            && (
                NormalizedPassword.length < 4
                || NormalizedPassword.length > 72
            )
        )
        {
            SetLocalNotice(
                '제한 공개 비밀번호는 4자 이상 72자 이하로 입력해주세요.',
            );
            SetIsThumbnailOpen(true);
            SetIsContentOpen(false);
            return;
        }

        if(ContentPhotos.length === 0)
        {
            SetLocalNotice(
                '내용 이미지를 한 장 이상 선택해주세요.',
            );
            SetIsContentOpen(true);
            SetIsThumbnailOpen(false);
            return;
        }

        SetLocalNotice('');
        Props.OnSubmit(
            {
                Category,
                EnabledViewModes,
                IsPrivate,
                PageNumberColor,
                PageNumberOpacity,
                Password:
                    IsPrivate ? '' : NormalizedPassword,
                TextLayers,
            },
            ContentPhotos.map((Photo) => ({
                ForwardDirection: Photo.ForwardDirection,
                Source: Photo.Source,
                X: Photo.X,
                Y: Photo.Y,
            })),
            ThumbnailPhoto?.Source ?? null,
        );
    }

    function PasteCopiedPost()
    {
        const CopyData = Props.CopyData;

        if(CopyData === null)
        {
            SetLocalNotice(
                '먼저 게시글 편집창에서 복사해주세요.',
            );
            return;
        }

        ContentPhotos.forEach((Photo) =>
        {
            RevokePreviewUrl(Photo.PreviewUrl);
        });
        if(ThumbnailPhoto !== null)
        {
            RevokePreviewUrl(ThumbnailPhoto.PreviewUrl);
        }

        const NextContentPhotos =
            CopyData.ContentImages
                .map((ContentImage, PageIndex) => ({
                    ForwardDirection:
                        ContentImage.ForwardDirection,
                    Id: CreateUniqueId(),
                    PreviewUrl: CreatePreviewUrl(
                        ContentImage.Source,
                    ),
                    Source: ContentImage.Source,
                    X: PageIndex % 5,
                    Y: Math.floor(PageIndex / 5),
                }));
        const NextThumbnail =
            CopyData.ThumbnailSource === null
                ? null
                : {
                    ForwardDirection: null,
                    Id: CreateUniqueId(),
                    PreviewUrl: CreatePreviewUrl(
                        CopyData.ThumbnailSource,
                    ),
                    Source: CopyData.ThumbnailSource,
                    X: 0,
                    Y: 0,
                };

        SetCategory(
            CopyData.Category !== null
            && Props.Categories.includes(CopyData.Category)
                ? CopyData.Category
                : null,
        );
        SetIsPrivate(CopyData.IsPrivate);
        SetPassword('');
        SetEnabledViewModes([...CopyData.EnabledViewModes]);
        SetPageNumberColor(CopyData.PageNumberColor);
        SetPageNumberOpacity(CopyData.PageNumberOpacity);
        SetTextLayers(
            CopyData.TextLayers.map((Layer) => ({
                ...Layer,
                Id: CreateUniqueId(),
            })),
        );
        SetContentPhotos(
            NormalizeSelectedPhotoSequence(
                NextContentPhotos,
            ),
        );
        SetThumbnailPhoto(NextThumbnail);
        SetIsContentSelectionMode(false);
        SetSelectedContentPhotoIds([]);
        SetThumbnailEditorVersion(
            (Current) => Current + 1,
        );
        SetIsThumbnailOpen(true);
        SetIsContentOpen(false);
        SetLocalNotice(
            '복사한 게시글 내용을 모두 적용했습니다.',
        );
    }

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
                aria-labelledby="photo-post-composer-title"
                data-ue-component="PhotoPostComposerLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <span>NEW PHOTO POST</span>
                        <h2 id="photo-post-composer-title">
                            새 게시글
                        </h2>
                        <p>
                            사진을 선택하고 대표 표지를 지정해
                            사진 게시판에 게시합니다.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={Props.OnRequestClose}
                        disabled={Props.IsSaving}
                        aria-label="새 사진 게시글 작성창 닫기"
                    >
                        ×
                    </button>
                </header>

                <div className={Styles.ComposerSections}>
                    <button
                        type="button"
                        data-active={IsThumbnailOpen}
                        aria-expanded={IsThumbnailOpen}
                        disabled={Props.IsSaving}
                        onClick={ToggleThumbnailSection}
                    >
                        <span>
                            <strong>썸네일 설정</strong>
                            <small>
                                이미지 · 텍스트 · 공개 설정
                            </small>
                        </span>
                        <b>{IsThumbnailOpen ? '−' : '+'}</b>
                    </button>
                    <button
                        type="button"
                        data-active={IsContentOpen}
                        aria-expanded={IsContentOpen}
                        disabled={Props.IsSaving}
                        onClick={ToggleContentSection}
                    >
                        <span>
                            <strong>내용 이미지</strong>
                            <small>
                                {ContentPhotos.length}장 · 페이지 순서
                            </small>
                        </span>
                        <b>{IsContentOpen ? '−' : '+'}</b>
                    </button>
                </div>

                <div
                    className={`${Styles.Content} ${
                        IsContentOpen ? Styles.ContentWide : ''
                    }`}
                >
                    {IsThumbnailOpen ? (
                        <ThumbnailEditorSection
                            key={ThumbnailEditorVersion}
                            Categories={Props.Categories}
                            Category={Category}
                            FallbackPreviewUrl={
                                ContentPhotos[0]?.PreviewUrl ?? null
                            }
                            IsPrivate={IsPrivate}
                            IsSaving={Props.IsSaving}
                            Password={Password}
                            OnChangeCategory={SetCategory}
                            OnChangePrivate={SetIsPrivate}
                            OnChangePassword={SetPassword}
                            OnChangeTextLayers={SetTextLayers}
                            OnSelectThumbnail={SelectThumbnail}
                            TextLayers={TextLayers}
                            ThumbnailPreviewUrl={
                                ThumbnailPhoto?.PreviewUrl ?? null
                            }
                        />
                    ) : null}

                    {IsContentOpen ? (
                        <div className={Styles.PhotoArea}>
                            <PhotoViewModeSelector
                                Disabled={Props.IsSaving}
                                Values={EnabledViewModes}
                                OnChange={SetEnabledViewModes}
                            />
                            <PhotoPageNumberStyleControl
                                Color={PageNumberColor}
                                Opacity={PageNumberOpacity}
                                Disabled={Props.IsSaving}
                                OnChangeColor={SetPageNumberColor}
                                OnChangeOpacity={SetPageNumberOpacity}
                            />
                            <section className={Styles.PhotoSection}>
                            <button
                                type="button"
                                className={Styles.AccordionButton}
                                aria-expanded={IsContentOpen}
                                disabled={Props.IsSaving}
                                onClick={ToggleContentSection}
                            >
                                <span>
                                    <strong>내용 이미지</strong>
                                    <small>최소 1장 필수</small>
                                </span>
                                <span>
                                    {ContentPhotos.length}장 ·{' '}
                                    {IsContentOpen ? '−' : '+'}
                                </span>
                            </button>
                            {IsContentOpen ? (
                                <div className={Styles.AccordionBody}>
                                    <div
                                        className={
                                            Styles.PhotoHeading
                                        }
                                    >
                                        <div>
                                            <strong>
                                                페이지 순서 편집
                                            </strong>
                                            <span>
                                                이미지를 원하는 위치에
                                                놓으면 해당 페이지로
                                                삽입됩니다.
                                            </span>
                                        </div>
                                        <div className={Styles.PhotoActions}>
                                            <button
                                                type="button"
                                                data-active={
                                                    IsContentSelectionMode
                                                }
                                                disabled={
                                                    Props.IsSaving
                                                    || ContentPhotos.length
                                                        === 0
                                                }
                                                onClick={
                                                    ToggleContentSelectionMode
                                                }
                                            >
                                                선택
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    Props.IsSaving
                                                    || SelectedContentPhotoIds
                                                        .length === 0
                                                }
                                                onClick={
                                                    DeleteSelectedContentPhotos
                                                }
                                            >
                                                삭제
                                            </button>
                                            <label>
                                                이미지 추가
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                                    multiple
                                                    disabled={Props.IsSaving}
                                                    onChange={(Event) =>
                                                    {
                                                        AddContentPhotos(
                                                            Array.from(
                                                                Event
                                                                    .currentTarget
                                                                    .files
                                                                ?? [],
                                                            ),
                                                        );
                                                        Event.currentTarget
                                                            .value = '';
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {ContentPhotos.length > 0 ? (
                                        <div
                                            ref={ContentGridReference}
                                            className={
                                                Styles.PhotoGrid
                                            }
                                        >
                                            {ContentPhotos.map(
                                                (Photo, Index) =>
                                                {
                                                    const PreviousDirection =
                                                        ContentPhotos[
                                                            Index - 1
                                                        ]?.ForwardDirection;
                                                    const BackDirection =
                                                        PreviousDirection
                                                        === null
                                                        || PreviousDirection
                                                        === undefined
                                                            ? null
                                                            : GetOppositePhotoPageDirection(
                                                                PreviousDirection,
                                                            );

                                                    return (
                                                    <article
                                                        key={Photo.Id}
                                                        ref={(Element) =>
                                                        {
                                                            if(
                                                                Element
                                                                === null
                                                            )
                                                            {
                                                                ContentPhotoElementReferences
                                                                    .current
                                                                    .delete(
                                                                        Photo.Id,
                                                                    );
                                                            }
                                                            else
                                                            {
                                                                ContentPhotoElementReferences
                                                                    .current
                                                                    .set(
                                                                        Photo.Id,
                                                                        Element,
                                                                    );
                                                            }
                                                        }}
                                                        data-dragging={
                                                            Photo.Id ===
                                                            DraggedContentPhotoId
                                                        }
                                                        data-selecting={
                                                            IsContentSelectionMode
                                                        }
                                                        style={{
                                                            gridColumn:
                                                                Photo.X + 1,
                                                            gridRow:
                                                                Photo.Y + 1,
                                                        }}
                                                    >
                                                        <div
                                                            className={
                                                                Styles
                                                                    .ContentPhoto
                                                            }
                                                            data-cursor-label="드래그해서 위치 변경"
                                                            onPointerDown={(
                                                                Event,
                                                            ) =>
                                                                BeginContentPhotoDrag(
                                                                    Event,
                                                                    Photo.Id,
                                                                )
                                                            }
                                                            onPointerMove={
                                                                MoveDraggedContentPhoto
                                                            }
                                                            onPointerUp={
                                                                EndContentPhotoDrag
                                                            }
                                                            onPointerCancel={
                                                                EndContentPhotoDrag
                                                            }
                                                        >
                                                            <Image
                                                                src={
                                                                    Photo
                                                                        .PreviewUrl
                                                                }
                                                                alt=""
                                                                fill
                                                                sizes="140px"
                                                                unoptimized
                                                                draggable={
                                                                    false
                                                                }
                                                            />
                                                            {IsContentSelectionMode
                                                                ? (
                                                                    <input
                                                                        type="checkbox"
                                                                        className={
                                                                            Styles.ContentPhotoCheckbox
                                                                        }
                                                                        checked={
                                                                            SelectedContentPhotoIds
                                                                                .includes(
                                                                                    Photo.Id,
                                                                                )
                                                                        }
                                                                        aria-label={`${Index + 1}번째 내용 이미지 선택`}
                                                                        onPointerDown={(
                                                                            Event,
                                                                        ) =>
                                                                            Event.stopPropagation()
                                                                        }
                                                                        onChange={() =>
                                                                            ToggleContentPhotoSelection(
                                                                                Photo.Id,
                                                                            )
                                                                        }
                                                                    />
                                                                )
                                                                : (
                                                                    <span>
                                                                        {Index + 1}
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <div
                                                            className={
                                                                Styles
                                                                    .DirectionControls
                                                            }
                                                            aria-label={`${Index + 1}페이지 이동 방향`}
                                                        >
                                                            {PhotoPageDirections.map(
                                                                (Direction) => (
                                                                    <button
                                                                        key={
                                                                            Direction
                                                                        }
                                                                        type="button"
                                                                        className={`${Styles.DirectionButton} ${
                                                                            Direction === 'left'
                                                                                ? Styles.DirectionLeft
                                                                                : Direction === 'right'
                                                                                    ? Styles.DirectionRight
                                                                                    : Direction === 'up'
                                                                                        ? Styles.DirectionUp
                                                                                        : Styles.DirectionDown
                                                                        }`}
                                                                        data-forward={
                                                                            Photo.ForwardDirection
                                                                            === Direction
                                                                        }
                                                                        data-back={
                                                                            BackDirection
                                                                            === Direction
                                                                        }
                                                                        disabled={
                                                                            Props.IsSaving
                                                                            || Index ===
                                                                                ContentPhotos.length - 1
                                                                            || BackDirection
                                                                                === Direction
                                                                        }
                                                                        onPointerDown={(
                                                                            Event,
                                                                        ) =>
                                                                            Event.stopPropagation()
                                                                        }
                                                                        onClick={() =>
                                                                            ChangeContentPhotoDirection(
                                                                                Photo.Id,
                                                                                Direction,
                                                                            )
                                                                        }
                                                                        aria-label={`${Direction} 방향으로 다음 페이지 이동`}
                                                                    >
                                                                        {
                                                                            DirectionSymbols[
                                                                                Direction
                                                                            ]
                                                                        }
                                                                    </button>
                                                                ),
                                                            )}
                                                        </div>
                                                    </article>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : (
                                        <label
                                            className={
                                                Styles.EmptyPhotos
                                            }
                                        >
                                            <strong>
                                                내용 이미지를
                                                선택해주세요.
                                            </strong>
                                            <span>
                                                1장 이상 · 개수 제한 없음
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                multiple
                                                disabled={Props.IsSaving}
                                                onChange={(Event) =>
                                                {
                                                    AddContentPhotos(
                                                        Array.from(
                                                            Event
                                                                .currentTarget
                                                                .files
                                                            ?? [],
                                                        ),
                                                    );
                                                    Event.currentTarget
                                                        .value = '';
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            ) : null}
                            </section>
                        </div>
                    ) : null}
                </div>

                <footer className={Styles.Footer}>
                    <div className={Styles.FooterLeft}>
                        <button
                            type="button"
                            className={Styles.PasteButton}
                            disabled={
                                Props.IsSaving
                                || Props.CopyData === null
                            }
                            onClick={PasteCopiedPost}
                        >
                            붙여넣기
                        </button>
                        <p role="status">
                            {LocalNotice || Props.Notice}
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={Props.IsSaving}
                        onClick={Submit}
                    >
                        {Props.IsSaving
                            ? '사진 업로드 중...'
                            : '게시하기'}
                    </button>
                </footer>
            </section>
        </div>
    );
}
