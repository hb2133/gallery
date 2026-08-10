'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
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
import type {
    PhotoCardCustomization,
    PhotoCardFontWeight,
    PhotoCardTextLayer,
} from '@/managers/PhotoCardCustomizationManager';
import type { PhotoCardEditorLayeredPanelProps } from './PhotoCardEditorLayeredPanelInterface';
import Styles from './PhotoCardEditorLayeredPanel.module.css';

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
const ContentDragUpdateInterval = 72;
const RetainedPasswordMask = '••••••••';
const DirectionSymbols: Record<PhotoPageDirection, string> = {
    left: '←',
    right: '→',
    up: '↑',
    down: '↓',
};

interface EditableContentImage
{
    ForwardDirection: PhotoPageDirection | null;
    Id: string;
    PreviewUrl: string;
    Source: string | File;
    X: number;
    Y: number;
}

interface ContentImageDragState
{
    ImageId: string;
    LastMoveAt: number;
    LastTargetIndex: number;
    PendingTargetIndex: number;
    PointerId: number;
}

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

function NormalizeEditableContentImageSequence(
    Images: EditableContentImage[],
): EditableContentImage[]
{
    const Directions =
        NormalizePhotoPageDirectionSequence(
            Images.map(
                (ContentImage) =>
                    ContentImage.ForwardDirection,
            ),
        );

    return Images.map((ContentImage, PageIndex) => ({
        ...ContentImage,
        ForwardDirection: Directions[PageIndex],
        X: PageIndex % 5,
        Y: Math.floor(PageIndex / 5),
    }));
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
            const Distance = Math.abs(
                Anchor - Target,
            );

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

function CloneCustomization(
    Customization: PhotoCardCustomization,
    Categories: string[],
): PhotoCardCustomization
{
    return {
        ...Customization,
        Category:
            Customization.Category !== null
            && Categories.includes(Customization.Category)
                ? Customization.Category
                : null,
        TextLayers: Customization.TextLayers.map(
            (Layer) => ({
                ...Layer,
            }),
        ),
    };
}

export function PhotoCardEditorLayeredPanel(
    Props: PhotoCardEditorLayeredPanelProps,
)
{
    const { IsSaving, OnRequestClose } = Props;
    const RetainedPasswordValue =
        Props.ExistingPassword ?? RetainedPasswordMask;
    const [Draft, SetDraft] = useState(
        () => CloneCustomization(
            Props.Customization,
            Props.Categories,
        ),
    );
    const [SelectedLayerId, SetSelectedLayerId] =
        useState<string | null>(
            Props.Customization.TextLayers[0]?.Id ?? null,
        );
    const [IsLayerSettingsOpen, SetIsLayerSettingsOpen] =
        useState(false);
    const [LayerSettingsPosition, SetLayerSettingsPosition] =
        useState<{
            Left: number;
            MaxHeight: number;
            Placement: 'above' | 'below';
            Top: number;
        } | null>(null);
    const [IsLayerSelectionMode, SetIsLayerSelectionMode] =
        useState(false);
    const [IsCategoryOpen, SetIsCategoryOpen] = useState(false);
    const [SelectedLayerIds, SetSelectedLayerIds] =
        useState<string[]>([]);
    const [PasswordDraft, SetPasswordDraft] = useState(
        Props.Customization.IsPasswordProtected
            ? RetainedPasswordValue
            : '',
    );
    const [IsRetainingExistingPassword, SetIsRetainingExistingPassword] =
        useState(Props.Customization.IsPasswordProtected);
    const [EnabledViewModes, SetEnabledViewModes] =
        useState([...Props.EnabledViewModes]);
    const [IsPasswordVisible, SetIsPasswordVisible] =
        useState(false);
    const [ShouldRemovePassword, SetShouldRemovePassword] =
        useState(false);
    const [ThumbnailFile, SetThumbnailFile] =
        useState<File | null>(null);
    const [ThumbnailPreviewUrl, SetThumbnailPreviewUrl] =
        useState(Props.Customization.ThumbnailUrl);
    const [ContentImages, SetContentImages] = useState<
        EditableContentImage[]
    >(
        () => Props.ContentImageLayout.map(
            (LayoutItem, ImageIndex) => ({
                Id:
                    `existing-${ImageIndex}-${LayoutItem.ImagePath}`,
                ForwardDirection:
                    LayoutItem.ForwardDirection,
                PreviewUrl: LayoutItem.ImagePath,
                Source: LayoutItem.ImagePath,
                X: ImageIndex % 5,
                Y: Math.floor(ImageIndex / 5),
            }),
        ),
    );
    const [IsThumbnailEditorOpen, SetIsThumbnailEditorOpen] =
        useState(true);
    const [IsContentEditorOpen, SetIsContentEditorOpen] =
        useState(false);
    const [ReadyContentImageIds, SetReadyContentImageIds] =
        useState<string[]>([]);
    const [LocalNotice, SetLocalNotice] = useState('');
    const [DraggedContentImageId, SetDraggedContentImageId] =
        useState<string | null>(null);
    const [IsContentSelectionMode, SetIsContentSelectionMode] =
        useState(false);
    const [SelectedContentImageIds, SetSelectedContentImageIds] =
        useState<string[]>([]);
    const [ActiveSnapGuides, SetActiveSnapGuides] =
        useState<SnapGuides>({
            X: null,
            Y: null,
        });
    const [
        IsDeleteConfirmationOpen,
        SetIsDeleteConfirmationOpen,
    ] = useState(false);
    const CanvasReference = useRef<HTMLDivElement>(null);
    const DragReference = useRef<DragState | null>(null);

    const ContentImagesReference = useRef(ContentImages);
    const ContentImagePreviewKey = ContentImages
        .map((ContentImage) =>
            `${ContentImage.Id}:${ContentImage.PreviewUrl}`,
        )
        .sort()
        .join('\n');
    const ReadyContentImageCount = ContentImages.filter(
        (ContentImage) =>
            ReadyContentImageIds.includes(ContentImage.Id),
    ).length;
    const AreContentImagePreviewsReady =
        ReadyContentImageCount >= ContentImages.length;
    const ContentLayoutGridReference =
        useRef<HTMLDivElement>(null);
    const ContentImageElementReferences =
        useRef(new Map<string, HTMLElement>());
    const PreviousContentImageBounds =
        useRef(new Map<string, DOMRect>());
    const ContentImageDragReference =
        useRef<ContentImageDragState | null>(null);
    const SelectedLayer =
        Draft.TextLayers.find(
            (Layer) => Layer.Id === SelectedLayerId,
        ) ?? null;
    useEffect(() =>
    {
        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(
                Event.key === 'Escape'
                && IsSaving === false
            )
            {
                if(IsDeleteConfirmationOpen)
                {
                    SetIsDeleteConfirmationOpen(false);
                }
                else if(IsLayerSettingsOpen)
                {
                    SetIsLayerSettingsOpen(false);
                    SetLayerSettingsPosition(null);
                }
                else
                {
                    OnRequestClose();
                }
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, [
        IsDeleteConfirmationOpen,
        IsLayerSettingsOpen,
        IsSaving,
        OnRequestClose,
    ]);

    useEffect(() =>
    {
        ContentImagesReference.current = ContentImages;
    }, [ContentImages]);

    useEffect(() =>
    {
        if(IsContentEditorOpen === false)
        {
            return;
        }

        const PreviewItems = ContentImagesReference.current.map(
            (ContentImage) => ({
                Id: ContentImage.Id,
                PreviewUrl: ContentImage.PreviewUrl,
            }),
        );

        SetReadyContentImageIds([]);

        if(PreviewItems.length === 0)
        {
            return;
        }

        let IsCancelled = false;

        PreviewItems.forEach((PreviewItem) =>
        {
            const PreviewImage = new window.Image();
            let IsSettled = false;
            const Finish = () =>
            {
                if(IsSettled)
                {
                    return;
                }

                IsSettled = true;
                void PreviewImage.decode()
                    .catch(() => undefined)
                    .finally(() =>
                    {
                        if(IsCancelled)
                        {
                            return;
                        }

                        SetReadyContentImageIds((Current) =>
                            Current.includes(PreviewItem.Id)
                                ? Current
                                : [...Current, PreviewItem.Id],
                        );
                    });
            };

            PreviewImage.decoding = 'async';
            PreviewImage.onload = Finish;
            PreviewImage.onerror = Finish;
            PreviewImage.src = PreviewItem.PreviewUrl;

            if(PreviewImage.complete)
            {
                Finish();
            }
        });

        return () =>
        {
            IsCancelled = true;
        };
    }, [ContentImagePreviewKey, IsContentEditorOpen]);

    useEffect(() =>
    {
        return () =>
        {
            if(ThumbnailPreviewUrl.startsWith('blob:'))
            {
                URL.revokeObjectURL(ThumbnailPreviewUrl);
            }
        };
    }, [ThumbnailPreviewUrl]);

    useEffect(() =>
    {
        return () =>
        {
            ContentImagesReference.current.forEach(
                (ContentImage) =>
                {
                    if(
                        ContentImage.PreviewUrl.startsWith(
                            'blob:',
                        )
                    )
                    {
                        URL.revokeObjectURL(
                            ContentImage.PreviewUrl,
                        );
                    }
                },
            );
        };
    }, []);

    useLayoutEffect(() =>
    {
        const NextBounds = new Map<string, DOMRect>();

        ContentImages.forEach((ContentImage) =>
        {
            const Element =
                ContentImageElementReferences.current.get(
                    ContentImage.Id,
                );

            if(Element === undefined)
            {
                return;
            }

            const NextBound = Element.getBoundingClientRect();
            const PreviousBound =
                PreviousContentImageBounds.current.get(
                    ContentImage.Id,
                );
            NextBounds.set(ContentImage.Id, NextBound);

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

        PreviousContentImageBounds.current = NextBounds;
    }, [ContentImages]);

    function AddContentImages(Files: File[])
    {
        if(Files.length === 0)
        {
            return;
        }

        const AddedImages = Files.map(
            (File, FileIndex): EditableContentImage =>
            {
                const PageIndex =
                    ContentImages.length + FileIndex;

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
        SetContentImages((Current) =>
            NormalizeEditableContentImageSequence([
                ...Current,
                ...AddedImages,
            ]),
        );
        SetLocalNotice('');
    }

    function MoveContentImageToSlot(
        ImageId: string,
        TargetIndex: number,
    )
    {
        SetContentImages((Current) =>
        {
            const SourceIndex = Current.findIndex(
                (ContentImage) =>
                    ContentImage.Id === ImageId,
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
            const [MovingImage] = Next.splice(SourceIndex, 1);
            Next.splice(SafeTargetIndex, 0, MovingImage);

            return NormalizeEditableContentImageSequence(
                Next,
            );
        });
    }

    function ChangeContentImageDirection(
        ImageId: string,
        Direction: PhotoPageDirection,
    )
    {
        SetContentImages((Current) =>
            NormalizeEditableContentImageSequence(
                Current.map((ContentImage, PageIndex) =>
                {
                    if(
                        ContentImage.Id !== ImageId
                        || PageIndex === Current.length - 1
                    )
                    {
                        return ContentImage;
                    }

                    return {
                        ...ContentImage,
                        ForwardDirection: Direction,
                    };
                }),
            ),
        );
    }

    function BeginContentImageDrag(
        Event: PointerEvent<HTMLElement>,
        ImageId: string,
    )
    {
        if(Props.IsSaving || IsContentSelectionMode)
        {
            return;
        }

        const ContentImage = ContentImages.find(
            (Candidate) => Candidate.Id === ImageId,
        );

        if(ContentImage === undefined)
        {
            return;
        }

        Event.preventDefault();
        Event.currentTarget.setPointerCapture(
            Event.pointerId,
        );
        ContentImageDragReference.current = {
            ImageId,
            LastMoveAt: Event.timeStamp,
            LastTargetIndex: ContentImages.findIndex(
                (Candidate) => Candidate.Id === ImageId,
            ),
            PendingTargetIndex: ContentImages.findIndex(
                (Candidate) => Candidate.Id === ImageId,
            ),
            PointerId: Event.pointerId,
        };
        SetDraggedContentImageId(ImageId);
    }

    function MoveDraggedContentImage(
        Event: PointerEvent<HTMLElement>,
    )
    {
        const Drag = ContentImageDragReference.current;
        const Grid = ContentLayoutGridReference.current;

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
            Math.ceil(ContentImages.length / 5),
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
            ContentImages.length - 1,
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
        MoveContentImageToSlot(
            Drag.ImageId,
            TargetIndex,
        );
    }

    function EndContentImageDrag(
        Event: PointerEvent<HTMLElement>,
    )
    {
        const Drag = ContentImageDragReference.current;

        if(
            Drag !== null
            && Drag.PendingTargetIndex
            !== Drag.LastTargetIndex
        )
        {
            MoveContentImageToSlot(
                Drag.ImageId,
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

        ContentImageDragReference.current = null;
        SetDraggedContentImageId(null);
    }

    function ToggleContentSelectionMode()
    {
        SetIsContentSelectionMode((Current) => !Current);
        SetSelectedContentImageIds([]);
    }

    function ToggleContentImageSelection(ImageId: string)
    {
        SetSelectedContentImageIds((Current) =>
            Current.includes(ImageId)
                ? Current.filter((Id) => Id !== ImageId)
                : [...Current, ImageId],
        );
    }

    function DeleteSelectedContentImages()
    {
        if(SelectedContentImageIds.length === 0)
        {
            return;
        }

        ContentImages
            .filter((ContentImage) =>
                SelectedContentImageIds.includes(ContentImage.Id),
            )
            .forEach((ContentImage) =>
            {
                if(ContentImage.PreviewUrl.startsWith('blob:'))
                {
                    URL.revokeObjectURL(ContentImage.PreviewUrl);
                }
            });

        SetContentImages((Current) =>
            NormalizeEditableContentImageSequence(
                Current.filter((ContentImage) =>
                    SelectedContentImageIds.includes(
                        ContentImage.Id,
                    ) === false,
                ),
            ),
        );
        SetSelectedContentImageIds([]);
        SetIsContentSelectionMode(false);
    }

    function SaveChanges()
    {
        if(ContentImages.length === 0)
        {
            SetLocalNotice(
                '내용 이미지를 한 장 이상 남겨주세요.',
            );
            SetIsContentEditorOpen(true);
            SetIsThumbnailEditorOpen(false);
            return;
        }

        const Password =
            IsRetainingExistingPassword
                ? ''
                : PasswordDraft.trim();

        if(
            Password !== ''
            && (Password.length < 4 || Password.length > 72)
        )
        {
            SetLocalNotice(
                '제한 공개 비밀번호는 4~72자로 입력해주세요.',
            );
            SetIsThumbnailEditorOpen(true);
            SetIsContentEditorOpen(false);
            return;
        }

        SetLocalNotice('');
        Props.OnSave(
            Draft,
            ThumbnailFile,
            ContentImages.map(
                (ContentImage) => ({
                    ForwardDirection:
                        ContentImage.ForwardDirection,
                    Source: ContentImage.Source,
                    X: ContentImage.X,
                    Y: ContentImage.Y,
                }),
            ),
            EnabledViewModes,
            Draft.IsPrivate
                ? null
                : ShouldRemovePassword
                ? ''
                : IsRetainingExistingPassword
                    ? null
                    : Password === '' ? null : Password,
        );
    }

    function CopyPost()
    {
        Props.OnCopy({
            Category: Draft.Category,
            ContentImages: ContentImages.map(
                (ContentImage) => ({
                    ForwardDirection:
                        ContentImage.ForwardDirection,
                    Source: ContentImage.Source,
                    X: ContentImage.X,
                    Y: ContentImage.Y,
                }),
            ),
            EnabledViewModes,
            IsPrivate: Draft.IsPrivate,
            PageNumberColor: Draft.PageNumberColor,
            PageNumberOpacity: Draft.PageNumberOpacity,
            TextLayers: Draft.TextLayers.map(
                (Layer) => ({
                    ...Layer,
                }),
            ),
            ThumbnailSource:
                ThumbnailFile ?? ThumbnailPreviewUrl,
        });
        SetLocalNotice(
            '복사했습니다. 새 게시글에서 붙여넣을 수 있습니다.',
        );
    }

    function ToggleThumbnailEditor()
    {
        const ShouldOpen =
            IsThumbnailEditorOpen === false;
        SetIsThumbnailEditorOpen(ShouldOpen);

        if(ShouldOpen)
        {
            SetIsContentEditorOpen(false);
        }
    }

    function ToggleContentEditor()
    {
        const ShouldOpen = IsContentEditorOpen === false;
        SetIsContentEditorOpen(ShouldOpen);

        if(ShouldOpen)
        {
            SetIsThumbnailEditorOpen(false);
        }
    }

    function UpdateLayer(
        LayerId: string,
        Update: Partial<PhotoCardTextLayer>,
    )
    {
        SetDraft((Current) => ({
            ...Current,
            TextLayers: Current.TextLayers.map(
                (Layer) =>
                    Layer.Id === LayerId
                        ? {
                            ...Layer,
                            ...Update,
                        }
                        : Layer,
            ),
        }));
    }

    function AddTextLayer()
    {
        const Layer: PhotoCardTextLayer = {
            Id: CreateUniqueId(),
            Text: '텍스트',
            FontFamily: 'Arial, sans-serif',
            FontSize: 32,
            FontWeight: 400,
            Color: '#ffffff',
            X: 12,
            Y: 12,
        };

        SetDraft((Current) => ({
            ...Current,
            TextLayers: [
                ...Current.TextLayers,
                Layer,
            ],
        }));
        SetIsLayerSelectionMode(false);
        SetSelectedLayerIds([]);
        SetSelectedLayerId(Layer.Id);
        SetIsLayerSettingsOpen(false);
        SetLayerSettingsPosition(null);
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

    function DeleteSelectedTextLayers()
    {
        if(SelectedLayerIds.length === 0)
        {
            return;
        }

        SetDraft((Current) => ({
            ...Current,
            TextLayers: Current.TextLayers.filter(
                (Layer) =>
                    SelectedLayerIds.includes(Layer.Id) === false,
            ),
        }));

        if(
            SelectedLayerId !== null
            && SelectedLayerIds.includes(SelectedLayerId)
        )
        {
            SetSelectedLayerId(null);
        }

        SetSelectedLayerIds([]);
        SetIsLayerSelectionMode(false);
        SetIsLayerSettingsOpen(false);
        SetLayerSettingsPosition(null);
    }

    function BeginLayerDrag(
        Event: PointerEvent<HTMLButtonElement>,
        Layer: PhotoCardTextLayer,
    )
    {
        const Canvas = CanvasReference.current;

        if(Canvas === null)
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

        if(
            Canvas === null
            || Drag === null
        )
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
        const X = Clamp(
            XSnap.Position,
            0,
            Math.max(0, 100 - ElementWidth),
        );
        const Y = Clamp(
            YSnap.Position,
            0,
            Math.max(0, 100 - ElementHeight),
        );

        SetActiveSnapGuides({
            X: XSnap.Guide,
            Y: YSnap.Guide,
        });
        UpdateLayer(Drag.LayerId, {
            X,
            Y,
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
                    className={`${Styles.Controls} ${Styles.LayerSettingsBox}`}
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
                        onChange={(Event) =>
                            UpdateLayer(Layer.Id, {
                                FontFamily: Event.currentTarget.value,
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
                        onChange={(Event) =>
                            UpdateLayer(Layer.Id, {
                                FontWeight:
                                    Number(
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
                <div className={Styles.ControlRow}>
                    <label>
                        <span>크기</span>
                        <input
                            type="number"
                            min={8}
                            max={96}
                            value={Layer.FontSize}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    FontSize: Clamp(
                                        Number(Event.currentTarget.value),
                                        8,
                                        96,
                                    ),
                                })
                            }
                        />
                    </label>
                    <label>
                        <span>색상</span>
                        <input
                            type="color"
                            value={Layer.Color}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    Color: Event.currentTarget.value,
                                })
                            }
                        />
                    </label>
                </div>
                <div className={Styles.ControlRow}>
                    <label>
                        <span>가로 위치</span>
                        <input
                            type="number"
                            min={0}
                            max={95}
                            value={Math.round(Layer.X)}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    X: Clamp(
                                        Number(Event.currentTarget.value),
                                        0,
                                        95,
                                    ),
                                })
                            }
                        />
                    </label>
                    <label>
                        <span>세로 위치</span>
                        <input
                            type="number"
                            min={0}
                            max={95}
                            value={Math.round(Layer.Y)}
                            onChange={(Event) =>
                                UpdateLayer(Layer.Id, {
                                    Y: Clamp(
                                        Number(Event.currentTarget.value),
                                        0,
                                        95,
                                    ),
                                })
                            }
                        />
                    </label>
                </div>
                </div>
            </>,
            document.body,
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
                aria-labelledby="photo-card-editor-title"
                data-ue-component="PhotoCardEditorLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <h2 id="photo-card-editor-title">
                            EDIT
                        </h2>
                        <p>
                            텍스트를 캔버스에서 끌어 위치를
                            바꿀 수 있습니다.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={Props.OnRequestClose}
                        disabled={Props.IsSaving}
                        aria-label="사진 카드 편집창 닫기"
                    >
                        Close <b aria-hidden="true">×</b>
                    </button>
                </header>

                <div className={Styles.EditorSections}>
                    <button
                        type="button"
                        data-active={IsThumbnailEditorOpen}
                        aria-expanded={IsThumbnailEditorOpen}
                        disabled={Props.IsSaving}
                        onClick={ToggleThumbnailEditor}
                    >
                        <span>
                            <strong>썸네일 수정</strong>
                            <small>이미지 · 텍스트 · 공개 설정</small>
                        </span>
                        <b>
                            {IsThumbnailEditorOpen ? '−' : '+'}
                        </b>
                    </button>
                    <button
                        type="button"
                        data-active={IsContentEditorOpen}
                        aria-expanded={IsContentEditorOpen}
                        disabled={Props.IsSaving}
                        onClick={ToggleContentEditor}
                    >
                        <span>
                            <strong>내용 이미지</strong>
                            <small>
                                {ContentImages.length}장 · 페이지 순서
                            </small>
                        </span>
                        <b>
                            {IsContentEditorOpen ? '−' : '+'}
                        </b>
                    </button>
                </div>

                {IsThumbnailEditorOpen ? (
                    <div className={Styles.Workspace}>
                    <div className={Styles.CanvasColumn}>
                        <div
                            ref={CanvasReference}
                            className={Styles.Canvas}
                        >
                            <Image
                                src={ThumbnailPreviewUrl}
                                alt=""
                                fill
                                sizes="(max-width: 760px) 90vw, 480px"
                                unoptimized
                            />
                            {ActiveSnapGuides.X !== null ? (
                                <span
                                    className={
                                        Styles.VerticalSnapGuide
                                    }
                                    style={{
                                        left:
                                            `${ActiveSnapGuides.X}%`,
                                    }}
                                    aria-hidden="true"
                                />
                            ) : null}
                            {ActiveSnapGuides.Y !== null ? (
                                <span
                                    className={
                                        Styles.HorizontalSnapGuide
                                    }
                                    style={{
                                        top:
                                            `${ActiveSnapGuides.Y}%`,
                                    }}
                                    aria-hidden="true"
                                />
                            ) : null}
                            {Draft.TextLayers.map((Layer) => (
                                <button
                                    key={Layer.Id}
                                    data-text-layer-id={Layer.Id}
                                    type="button"
                                    className={`${Styles.CanvasText} ${
                                        Layer.Id === SelectedLayerId
                                            ? Styles.CanvasTextSelected
                                            : ''
                                    }`}
                                    style={{
                                        color: Layer.Color,
                                        fontFamily:
                                            Layer.FontFamily,
                                        fontSize:
                                            `${Layer.FontSize}px`,
                                        fontWeight: Layer.FontWeight,
                                        left: `${Layer.X}%`,
                                        top: `${Layer.Y}%`,
                                    }}
                                    onPointerDown={(Event) =>
                                        BeginLayerDrag(
                                            Event,
                                            Layer,
                                        )
                                    }
                                    onPointerMove={MoveLayer}
                                    onPointerUp={EndLayerDrag}
                                    onPointerCancel={
                                        EndLayerDrag
                                    }
                                >
                                    {Layer.Text || '텍스트'}
                                </button>
                            ))}
                        </div>
                        <p className={Styles.AlignmentHint}>
                            중앙 또는 다른 텍스트에 가까워지면
                            자동으로 정렬됩니다.
                        </p>

                    </div>

                    <aside className={Styles.Inspector}>
                        <div className={Styles.ThumbnailControl}>
                            <div>
                                <strong>썸네일</strong>
                                <small>
                                    JPG · PNG · WebP · GIF, 최대 10MB
                                </small>
                            </div>
                            <label className={Styles.ThumbnailPreview}>
                                <Image
                                    src={ThumbnailPreviewUrl}
                                    alt="현재 썸네일"
                                    fill
                                    sizes="58px"
                                    unoptimized
                                />
                                <span aria-hidden="true">수정</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    aria-label="썸네일 이미지 변경"
                                    disabled={Props.IsSaving}
                                    onChange={(Event) =>
                                    {
                                        const File =
                                            Event.currentTarget.files?.[0];

                                        if(File)
                                        {
                                            SetThumbnailFile(File);
                                            SetThumbnailPreviewUrl(
                                                URL.createObjectURL(File),
                                            );
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
                                onKeyDown={(Event) =>
                                {
                                    if(Event.key === 'Escape')
                                    {
                                        Event.stopPropagation();
                                        SetIsCategoryOpen(false);
                                    }
                                }}
                            >
                                <span>
                                    {Draft.Category ?? '카테고리 없음'}
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
                                        (Category) => (
                                            <button
                                                key={Category ?? 'none'}
                                                type="button"
                                                role="option"
                                                aria-selected={
                                                    Draft.Category === Category
                                                }
                                                onClick={() =>
                                                {
                                                    SetDraft((Current) => ({
                                                        ...Current,
                                                        Category,
                                                    }));
                                                    SetIsCategoryOpen(false);
                                                }}
                                        >
                                                {Category ?? '카테고리 없음'}
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
                                        {Draft.IsPrivate
                                            ? '관리자에게만 표시됩니다.'
                                            : '모든 방문자에게 표시됩니다.'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    data-private={Draft.IsPrivate}
                                    aria-pressed={
                                        Draft.IsPrivate === false
                                    }
                                    disabled={Props.IsSaving}
                                    onClick={() =>
                                        SetDraft((Current) => ({
                                            ...Current,
                                            IsPrivate:
                                                !Current.IsPrivate,
                                        }))
                                    }
                                >
                                    <i aria-hidden="true" />
                                    {Draft.IsPrivate
                                        ? '비공개'
                                        : '공개'}
                                </button>
                            </div>

                            {Draft.IsPrivate === false ? (
                            <div className={Styles.PasswordControl}>
                                <div>
                                    <strong>제한 공개</strong>
                                    <span>
                                        {Draft.IsPasswordProtected
                                            ? '현재 비밀번호가 설정되어 있습니다.'
                                            : '비밀번호를 아는 방문자만 내용을 볼 수 있습니다.'}
                                    </span>
                                </div>
                                <div>
                                    <div className={Styles.PasswordField}>
                                        <input
                                            type={
                                                IsPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={PasswordDraft}
                                            minLength={4}
                                            maxLength={72}
                                            autoComplete="new-password"
                                            disabled={
                                                Props.IsSaving
                                                || Props.IsPasswordLoading
                                            }
                                            placeholder={
                                                Draft.IsPasswordProtected
                                                    ? '새 Password 입력'
                                                    : 'Password'
                                            }
                                            onFocus={(Event) =>
                                            {
                                                if(IsRetainingExistingPassword)
                                                {
                                                    Event.currentTarget.select();
                                                }
                                            }}
                                            onChange={(Event) =>
                                            {
                                                const NextPassword =
                                                    Event.currentTarget.value;

                                                SetPasswordDraft(NextPassword);
                                                SetIsRetainingExistingPassword(
                                                    NextPassword
                                                        === RetainedPasswordValue,
                                                );
                                                SetShouldRemovePassword(false);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={
                                                Styles.PasswordVisibilityButton
                                            }
                                            aria-label={
                                                IsRetainingExistingPassword
                                                && Props.ExistingPassword === null
                                                    ? '기존 비밀번호 원문이 저장되지 않아 확인할 수 없습니다'
                                                    : IsPasswordVisible
                                                    ? '비밀번호 숨기기'
                                                    : '비밀번호 보기'
                                            }
                                            aria-pressed={IsPasswordVisible}
                                            disabled={
                                                Props.IsSaving
                                                || Props.IsPasswordLoading
                                                || (
                                                    IsRetainingExistingPassword
                                                    && Props.ExistingPassword
                                                    === null
                                                )
                                            }
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
                                                <path
                                                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="2.5"
                                                />
                                                {IsPasswordVisible
                                                    ? null
                                                    : (
                                                        <path d="m4 4 16 16" />
                                                    )}
                                            </svg>
                                        </button>
                                    </div>
                                    {Draft.IsPasswordProtected ? (
                                        <button
                                            type="button"
                                            data-active={ShouldRemovePassword}
                                            onClick={() =>
                                            {
                                                const NextShouldRemove =
                                                    !ShouldRemovePassword;

                                                SetShouldRemovePassword(
                                                    NextShouldRemove,
                                                );
                                                SetPasswordDraft(
                                                    NextShouldRemove
                                                        ? ''
                                                        : RetainedPasswordValue,
                                                );
                                                SetIsRetainingExistingPassword(
                                                    NextShouldRemove === false,
                                                );
                                            }}
                                        >
                                            {ShouldRemovePassword
                                                ? '해제 취소'
                                                : '비밀번호 해제'}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            ) : null}
                        </section>

                        <div className={Styles.LayerHeading}>
                            <strong>텍스트</strong>
                            <div>
                                <button
                                    type="button"
                                    onClick={AddTextLayer}
                                    disabled={
                                        Props.IsSaving
                                        || Draft.TextLayers.length >= 20
                                    }
                                >
                                    추가
                                </button>
                                <button
                                    type="button"
                                    data-active={IsLayerSelectionMode}
                                    onClick={ToggleLayerSelectionMode}
                                    disabled={
                                        Props.IsSaving
                                        || Draft.TextLayers.length === 0
                                    }
                                >
                                    선택
                                </button>
                                <button
                                    type="button"
                                    onClick={DeleteSelectedTextLayers}
                                    disabled={
                                        Props.IsSaving
                                        || SelectedLayerIds.length === 0
                                    }
                                >
                                    삭제
                                </button>
                            </div>
                        </div>

                        <div className={Styles.LayerList}>
                            {Draft.TextLayers.map(
                                (Layer, Index) => (
                                    <div
                                        key={Layer.Id}
                                        className={`${Styles.LayerRow} ${
                                            Layer.Id
                                            === SelectedLayerId
                                                ? Styles.LayerActive
                                                : ''
                                        }`}
                                    >
                                        <p>
                                            {IsLayerSelectionMode ? (
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        SelectedLayerIds
                                                            .includes(
                                                                Layer.Id,
                                                            )
                                                    }
                                                    aria-label={`${Layer.Text || '텍스트'} 선택`}
                                                    onChange={() =>
                                                        ToggleLayerSelection(
                                                            Layer.Id,
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span>
                                                    {String(Index + 1)
                                                        .padStart(2, '0')}
                                                </span>
                                            )}
                                            {Layer.Text || '텍스트'}
                                        </p>
                                        <div>
                                            <button
                                                type="button"
                                                className={
                                                    Styles.LayerSettingsButton
                                                }
                                                data-active={
                                                    Layer.Id
                                                    === SelectedLayerId
                                                    && IsLayerSettingsOpen
                                                }
                                                onClick={(Event) =>
                                                {
                                                    const ShouldClose =
                                                        Layer.Id
                                                        === SelectedLayerId
                                                        && IsLayerSettingsOpen;
                                                    SetSelectedLayerId(
                                                        Layer.Id,
                                                    );
                                                    SetIsLayerSelectionMode(
                                                        false,
                                                    );
                                                    SetSelectedLayerIds([]);
                                                    const Bounds =
                                                        Event.currentTarget
                                                            .getBoundingClientRect();
                                                    const MenuWidth =
                                                        Math.min(
                                                            288,
                                                            window.innerWidth
                                                            - 24,
                                                        );
                                                    const Left = Math.min(
                                                        Math.max(
                                                            12,
                                                            Bounds.right
                                                            - MenuWidth,
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
                                                    const MaxHeight =
                                                        Math.max(
                                                            180,
                                                            (Placement
                                                                === 'below'
                                                                    ? AvailableBelow
                                                                    : AvailableAbove)
                                                            - 8,
                                                        );
                                                    const Top =
                                                        Placement === 'below'
                                                            ? Bounds.bottom + 8
                                                            : Bounds.top - 8;
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
                                                                Top,
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
                                ),
                            )}
                        </div>

                        {SelectedLayer !== null
                        && IsLayerSettingsOpen
                            ? RenderLayerSettings(SelectedLayer)
                            : null}

                    </aside>
                    </div>
                ) : null}

                {IsContentEditorOpen ? (
                    <section className={Styles.ContentEditor}>
                        <PhotoViewModeSelector
                            Disabled={Props.IsSaving}
                            Values={EnabledViewModes}
                            OnChange={SetEnabledViewModes}
                        />
                        <PhotoPageNumberStyleControl
                            Color={Draft.PageNumberColor}
                            Opacity={Draft.PageNumberOpacity}
                            Disabled={Props.IsSaving}
                            OnChangeColor={(PageNumberColor) =>
                                SetDraft((Current) => ({
                                    ...Current,
                                    PageNumberColor,
                                }))
                            }
                            OnChangeOpacity={(PageNumberOpacity) =>
                                SetDraft((Current) => ({
                                    ...Current,
                                    PageNumberOpacity,
                                }))
                            }
                        />
                        <div className={Styles.ContentEditorHeading}>
                            <div>
                                <strong>페이지 순서 편집</strong>
                                <span>
                                    이미지를 원하는 위치에 놓으면
                                    해당 페이지로 삽입됩니다.
                                </span>
                            </div>
                            <div className={Styles.ContentEditorActions}>
                                <button
                                    type="button"
                                    data-active={IsContentSelectionMode}
                                    disabled={
                                        Props.IsSaving
                                        || ContentImages.length === 0
                                    }
                                    onClick={ToggleContentSelectionMode}
                                >
                                    선택
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        Props.IsSaving
                                        || SelectedContentImageIds.length
                                            === 0
                                    }
                                    onClick={DeleteSelectedContentImages}
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
                                            AddContentImages(
                                                Array.from(
                                                    Event.currentTarget
                                                        .files ?? [],
                                                ),
                                            );
                                            Event.currentTarget.value = '';
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className={Styles.ContentLayoutViewport}>
                        <div
                            ref={ContentLayoutGridReference}
                            className={Styles.ContentLayoutGrid}
                        >
                            {ContentImages.map(
                                (ContentImage, ImageIndex) =>
                                {
                                    const PreviousDirection =
                                        ContentImages[
                                            ImageIndex - 1
                                        ]?.ForwardDirection;
                                    const BackDirection =
                                        PreviousDirection === null
                                        || PreviousDirection
                                        === undefined
                                            ? null
                                            : GetOppositePhotoPageDirection(
                                                PreviousDirection,
                                            );

                                    return (
                                    <article
                                        key={ContentImage.Id}
                                        ref={(Element) =>
                                        {
                                            if(Element === null)
                                            {
                                                ContentImageElementReferences
                                                    .current
                                                    .delete(
                                                        ContentImage.Id,
                                                    );
                                            }
                                            else
                                            {
                                                ContentImageElementReferences
                                                    .current
                                                    .set(
                                                        ContentImage.Id,
                                                        Element,
                                                    );
                                            }
                                        }}
                                        data-dragging={
                                            ContentImage.Id ===
                                            DraggedContentImageId
                                        }
                                        data-selecting={
                                            IsContentSelectionMode
                                        }
                                        style={{
                                            gridColumn:
                                                ContentImage.X + 1,
                                            gridRow:
                                                ContentImage.Y + 1,
                                        }}
                                    >
                                        <div
                                            className={
                                                Styles
                                                    .ContentImageDragSurface
                                            }
                                            data-cursor-label="드래그해서 위치 변경"
                                            onPointerDown={(Event) =>
                                                BeginContentImageDrag(
                                                    Event,
                                                    ContentImage.Id,
                                                )
                                            }
                                            onPointerMove={
                                                MoveDraggedContentImage
                                            }
                                            onPointerUp={
                                                EndContentImageDrag
                                            }
                                            onPointerCancel={
                                                EndContentImageDrag
                                            }
                                        >
                                            {ReadyContentImageIds.includes(
                                                ContentImage.Id,
                                            ) ? (
                                                <Image
                                                    className={
                                                        Styles.ContentImagePreviewReady
                                                    }
                                                    src={
                                                        ContentImage
                                                            .PreviewUrl
                                                    }
                                                    alt=""
                                                    fill
                                                    sizes="140px"
                                                    unoptimized
                                                    draggable={false}
                                                />
                                            ) : null}
                                        </div>
                                        <div
                                            className={
                                                Styles.DirectionControls
                                            }
                                            aria-label={`${ImageIndex + 1}페이지 이동 방향`}
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
                                                            ContentImage
                                                                .ForwardDirection
                                                            === Direction
                                                        }
                                                        data-back={
                                                            BackDirection
                                                            === Direction
                                                        }
                                                        disabled={
                                                            Props.IsSaving
                                                            || ImageIndex ===
                                                                ContentImages.length - 1
                                                            || BackDirection
                                                                === Direction
                                                        }
                                                        onPointerDown={(
                                                            Event,
                                                        ) =>
                                                            Event.stopPropagation()
                                                        }
                                                        onClick={() =>
                                                            ChangeContentImageDirection(
                                                                ContentImage.Id,
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
                                        {IsContentSelectionMode ? (
                                            <input
                                                type="checkbox"
                                                className={
                                                    Styles.ContentImageCheckbox
                                                }
                                                checked={
                                                    SelectedContentImageIds
                                                        .includes(
                                                            ContentImage.Id,
                                                        )
                                                }
                                                aria-label={`${ImageIndex + 1}페이지 선택`}
                                                onChange={() =>
                                                    ToggleContentImageSelection(
                                                        ContentImage.Id,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span>{ImageIndex + 1}</span>
                                        )}
                                    </article>
                                    );
                                },
                            )}
                        </div>
                        {AreContentImagePreviewsReady === false ? (
                            <div
                                className={Styles.ContentLayoutLoading}
                                role="status"
                                aria-live="polite"
                            >
                                <i aria-hidden="true" />
                                <span>
                                    이미지를 불러오는 중...{' '}
                                    {ReadyContentImageCount}
                                    /{ContentImages.length}
                                </span>
                            </div>
                        ) : null}
                        </div>
                    </section>
                ) : null}

                <footer className={Styles.Footer}>
                    <div className={Styles.FooterLeft}>
                        <button
                            type="button"
                            className={Styles.DeletePostButton}
                            disabled={Props.IsSaving}
                            onClick={() =>
                                SetIsDeleteConfirmationOpen(true)
                            }
                        >
                            게시글 삭제
                        </button>
                        <button
                            type="button"
                            className={Styles.CopyPostButton}
                            disabled={Props.IsSaving}
                            onClick={CopyPost}
                        >
                            복사
                        </button>
                        <p role="status">
                            {LocalNotice || Props.Notice}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={SaveChanges}
                        disabled={Props.IsSaving}
                    >
                        {Props.IsSaving
                            ? '저장 중...'
                            : '변경사항 저장'}
                    </button>
                </footer>

                {IsDeleteConfirmationOpen ? (
                    <div
                        className={Styles.DeleteConfirmationBackdrop}
                        role="presentation"
                    >
                        <section
                            className={Styles.DeleteConfirmation}
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="photo-card-delete-title"
                            aria-describedby="photo-card-delete-description"
                        >
                            <span>DELETE POST</span>
                            <h3 id="photo-card-delete-title">
                                정말 삭제할까요?
                            </h3>
                            <p id="photo-card-delete-description">
                                삭제하면 사진 게시판에서 더 이상
                                표시되지 않습니다.
                            </p>
                            <div>
                                <button
                                    type="button"
                                    disabled={Props.IsSaving}
                                    onClick={() =>
                                        SetIsDeleteConfirmationOpen(
                                            false,
                                        )
                                    }
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    disabled={Props.IsSaving}
                                    onClick={() =>
                                        Props.OnDelete({
                                            ...Draft,
                                            IsDeleted: true,
                                        })
                                    }
                                >
                                    {Props.IsSaving
                                        ? '삭제 중...'
                                        : '삭제하기'}
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}
            </section>
        </div>
    );
}
