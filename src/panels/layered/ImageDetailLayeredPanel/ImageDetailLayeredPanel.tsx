'use client';

import Image from 'next/image';
import {
    forwardRef,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
    type FormEvent as ReactFormEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import {
    GetOppositePhotoPageDirection,
    type PhotoPageDirection,
} from '@/core/navigation/PhotoPageDirection';
import type {
    GalleryDetailViewMode,
    GalleryProject,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import Styles from './ImageDetailLayeredPanel.module.css';

interface ImageDetailLayeredPanelProps
{
    Project: GalleryProject;
    ActiveImageIndex: number;
    NavigationDirection: 'left' | 'right' | 'up' | 'down';
    ViewMode: GalleryDetailViewMode;
    OnRequestClose: () => void;
    OnPrevious: () => void;
    OnNext: () => void;
    OnSelectImage: (ImageIndex: number) => void;
    OnChangeViewMode: (ViewMode: GalleryDetailViewMode) => void;
}

interface PhotoFlipPageProps
{
    Children: ReactNode;
    Density?: 'hard' | 'soft';
}

interface PhotoFlipBookApi
{
    flip: (
        PageIndex: number,
        Corner?: 'top' | 'bottom',
    ) => void;
    flipNext: (Corner?: 'top' | 'bottom') => void;
    flipPrev: (Corner?: 'top' | 'bottom') => void;
    turnToPage: (PageIndex: number) => void;
}

interface PhotoFlipBookHandle
{
    pageFlip: () => PhotoFlipBookApi | undefined;
}

interface PhotoFlipEvent
{
    data: number;
}

interface PhotoFlipStateEvent
{
    data: 'user_fold' | 'fold_corner' | 'flipping' | 'read';
}

interface ImageSwipeState
{
    Direction: PhotoPageDirection;
    Kind: 'back' | 'forward';
    OffsetX: number;
    OffsetY: number;
    Phase: 'dragging' | 'ready' | 'settling';
    Progress: number;
    TargetIndex: number;
}

interface ImageTransitionRequest
{
    Direction: PhotoPageDirection;
    FromIndex: number;
    Kind: 'back' | 'forward';
    TargetIndex: number;
}

interface ImageSwipePointer
{
    PointerId: number;
    StartTime: number;
    StartX: number;
    StartY: number;
}

const ImageTransitionDuration = 620;

const PhotoFlipPage =
    forwardRef<HTMLDivElement, PhotoFlipPageProps>(
        function PhotoFlipPageComponent(
            Props,
            Reference,
        )
        {
            return (
                <div
                    ref={Reference}
                    className={Styles.PhotoFlipPage}
                    data-density={Props.Density ?? 'soft'}
                >
                    {Props.Children}
                </div>
            );
        },
    );

export function ImageDetailLayeredPanel(
    Props: ImageDetailLayeredPanelProps,
)
{
    const CloseButtonReference = useRef<HTMLButtonElement>(null);
    const VerticalImageReferences = useRef<
        Array<HTMLDivElement | null>
    >([]);
    const PhotoFlipBookReference =
        useRef<PhotoFlipBookHandle | null>(null);
    const PageIndexNavigationReference =
        useRef<HTMLElement>(null);
    const PageIndexButtonReferences = useRef<
        Array<HTMLButtonElement | null>
    >([]);
    const ImageFrameReference = useRef<HTMLDivElement>(null);
    const ImageSwipePointerReference =
        useRef<ImageSwipePointer | null>(null);
    const ImageTransitionTimerReference =
        useRef<number | null>(null);
    const PendingImageTransitionReference =
        useRef<ImageTransitionRequest[]>([]);
    const IsImageTransitionLockedReference =
        useRef(false);
    const ImageTransitionFrameReferences =
        useRef<number[]>([]);
    const ActiveViewModeReference =
        useRef<GalleryDetailViewMode>(Props.ViewMode);
    const [IsFlipAnimating, SetIsFlipAnimating] =
        useState(false);
    const [ActiveBookSpreadStart, SetActiveBookSpreadStart] =
        useState(
            () => Math.floor(Props.ActiveImageIndex / 2) * 2,
        );
    const [IsBookCoverVisible, SetIsBookCoverVisible] =
        useState(true);
    const [IsPageIndexOpen, SetIsPageIndexOpen] =
        useState(false);
    const [ImageSwipe, SetImageSwipe] =
        useState<ImageSwipeState | null>(null);
    const [NavigationImageIndex, SetNavigationImageIndex] =
        useState(Props.ActiveImageIndex);
    const NavigationImageIndexReference =
        useRef(Props.ActiveImageIndex);
    const {
        OnNext,
        OnPrevious,
        OnRequestClose,
    } = Props;
    const Images = Props.Project.Images ?? [
        {
            ImagePath: Props.Project.ImagePath,
            Alt: Props.Project.Alt,
            CreditName: Props.Project.CreditName,
            CreditUrl: Props.Project.CreditUrl,
        },
    ];
    const ActiveImage =
        Images[Props.ActiveImageIndex] ?? Images[0];
    const NavigationImage =
        Images[NavigationImageIndex] ?? ActiveImage;
    const HasMultipleImages = Images.length > 1;
    const CanGoPrevious =
        NavigationImageIndex > 0;
    const CanGoNext =
        NavigationImageIndex < Images.length - 1;
    const ForwardDirection: PhotoPageDirection | null =
        CanGoNext
            ? NavigationImage.ForwardDirection ?? 'right'
            : null;
    const PreviousForwardDirection =
        CanGoPrevious
            ? Images[NavigationImageIndex - 1]
                ?.ForwardDirection ?? 'right'
            : null;
    const BackDirection =
        PreviousForwardDirection === null
            ? null
            : GetOppositePhotoPageDirection(
                PreviousForwardDirection,
            );
    const ScrollDirection =
        Props.Project.ScrollDirection ?? 'horizontal';
    const IsVerticalScroll =
        Props.ViewMode === 'scroll' &&
        ScrollDirection === 'vertical';
    const IsHorizontalScroll =
        Props.ViewMode === 'scroll'
        && ScrollDirection === 'horizontal';
    const SwipeTargetIndex =
        ImageSwipe?.TargetIndex ?? Props.ActiveImageIndex;
    const SwipeTargetImage =
        ImageSwipe === null
            ? null
            : Images[SwipeTargetIndex] ?? null;

    useEffect(() =>
    {
        ActiveViewModeReference.current = Props.ViewMode;
    }, [Props.ViewMode]);

    useEffect(() =>
    {
        const ImagePaths =
            Props.Project.Images?.map(
                (ImageItem) => ImageItem.ImagePath,
            ) ?? [Props.Project.ImagePath];

        ImagePaths.forEach((ImagePath) =>
        {
            const PreloadedImage = new window.Image();
            PreloadedImage.decoding = 'async';
            PreloadedImage.src = ImagePath;
            void PreloadedImage.decode().catch(() => undefined);
        });
    }, [Props.Project.ImagePath, Props.Project.Images]);

    useEffect(() =>
    {
        const TransitionFrames =
            ImageTransitionFrameReferences.current;
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        CloseButtonReference.current?.focus();

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;

            if(ImageTransitionTimerReference.current !== null)
            {
                window.clearTimeout(
                    ImageTransitionTimerReference.current,
                );
            }

            TransitionFrames.forEach(
                (Frame) => window.cancelAnimationFrame(Frame),
            );
        };
    }, []);

    useEffect(() =>
    {
        if(IsVerticalScroll === false)
        {
            return;
        }

        VerticalImageReferences.current[
            Props.ActiveImageIndex
        ]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, [IsVerticalScroll, Props.ActiveImageIndex]);

    useEffect(() =>
    {
        if(
            IsPageIndexOpen === false
            || (
                Props.ViewMode === 'book'
                && IsBookCoverVisible
            )
        )
        {
            return;
        }

        const Navigation =
            PageIndexNavigationReference.current;
        const ActiveButton =
            PageIndexButtonReferences.current[
                Props.ViewMode === 'book'
                    ? ActiveBookSpreadStart
                    : Props.ActiveImageIndex
            ];

        if(
            Navigation === null
            || ActiveButton === null
            || ActiveButton === undefined
        )
        {
            return;
        }

        Navigation.scrollTo({
            behavior: 'smooth',
            top:
                ActiveButton.offsetTop
                - (
                    Navigation.clientHeight
                    - ActiveButton.clientHeight
                ) / 2,
        });
    }, [
        ActiveBookSpreadStart,
        IsBookCoverVisible,
        IsPageIndexOpen,
        Props.ActiveImageIndex,
        Props.ViewMode,
    ]);

    function FinishImageTransition(
        Transition: ImageSwipeState,
    )
    {
        IsImageTransitionLockedReference.current = true;
        SetImageSwipe({
            ...Transition,
            Phase: 'settling',
            Progress: 1,
        });

        if(ImageTransitionTimerReference.current !== null)
        {
            window.clearTimeout(
                ImageTransitionTimerReference.current,
            );
        }

        ImageTransitionTimerReference.current =
            window.setTimeout(() =>
            {
                CompleteImageTransition(Transition);
            }, ImageTransitionDuration);
    }

    function CompleteImageTransition(
        Transition: ImageSwipeState,
    )
    {
        if(Transition.Kind === 'forward')
        {
            OnNext();
        }
        else
        {
            OnPrevious();
        }

        SetImageSwipe(null);
        ImageSwipePointerReference.current = null;
        ImageTransitionTimerReference.current = null;
        IsImageTransitionLockedReference.current = false;
    }

    function StartVisualImageTransition(
        Request: ImageTransitionRequest,
    )
    {
        if(IsHorizontalScroll === false)
        {
            if(Request.Kind === 'forward')
            {
                OnNext();
            }
            else
            {
                OnPrevious();
            }

            return;
        }

        IsImageTransitionLockedReference.current = true;
        const Transition: ImageSwipeState = {
            Direction: Request.Direction,
            Kind: Request.Kind,
            OffsetX: 0,
            OffsetY: 0,
            Phase: 'ready',
            Progress: 0,
            TargetIndex: Request.TargetIndex,
        };
        SetImageSwipe(Transition);
        const FirstFrame = window.requestAnimationFrame(() =>
        {
            const SecondFrame = window.requestAnimationFrame(() =>
            {
                FinishImageTransition(Transition);
            });
            ImageTransitionFrameReferences.current.push(
                SecondFrame,
            );
        });
        ImageTransitionFrameReferences.current.push(FirstFrame);
    }

    function RequestImageTransition(
        Kind: 'back' | 'forward',
        RenderedImageIndex: number,
        Direction: PhotoPageDirection | null,
    )
    {
        if(
            Direction === null
            || RenderedImageIndex
            !== NavigationImageIndexReference.current
        )
        {
            return;
        }

        const TargetIndex =
            Kind === 'forward'
                ? RenderedImageIndex + 1
                : RenderedImageIndex - 1;

        if(TargetIndex < 0 || TargetIndex >= Images.length)
        {
            return;
        }

        const ExpectedDirection =
            Kind === 'forward'
                ? Images[RenderedImageIndex]
                    ?.ForwardDirection ?? 'right'
                : GetOppositePhotoPageDirection(
                    Images[TargetIndex]
                        ?.ForwardDirection ?? 'right',
                );

        if(Direction !== ExpectedDirection)
        {
            return;
        }

        const Request: ImageTransitionRequest = {
            Direction,
            FromIndex: RenderedImageIndex,
            Kind,
            TargetIndex,
        };
        NavigationImageIndexReference.current = TargetIndex;
        SetNavigationImageIndex(TargetIndex);

        if(
            ImageSwipe !== null
            || IsImageTransitionLockedReference.current
            || Props.ActiveImageIndex !== RenderedImageIndex
        )
        {
            PendingImageTransitionReference.current.push(Request);
            return;
        }

        StartVisualImageTransition(Request);
    }

    function FindSwipeNavigation(
        DeltaX: number,
        DeltaY: number,
    ): Pick<
        ImageSwipeState,
        'Direction' | 'Kind' | 'TargetIndex'
    > | null
    {
        const DragDirection: PhotoPageDirection =
            Math.abs(DeltaX) >= Math.abs(DeltaY)
                ? DeltaX < 0
                    ? 'right'
                    : 'left'
                : DeltaY < 0
                    ? 'down'
                    : 'up';

        if(ForwardDirection === DragDirection)
        {
            return {
                Direction: DragDirection,
                Kind: 'forward',
                TargetIndex: NavigationImageIndex + 1,
            };
        }

        if(BackDirection === DragDirection)
        {
            return {
                Direction: DragDirection,
                Kind: 'back',
                TargetIndex: NavigationImageIndex - 1,
            };
        }

        return null;
    }

    function HandleImagePointerDown(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        if(
            IsHorizontalScroll === false
            || HasMultipleImages === false
            || ImageSwipe !== null
            || IsImageTransitionLockedReference.current
            || Event.button !== 0
            || (
                Event.target instanceof Element
                && Event.target.closest('button, a') !== null
            )
        )
        {
            return;
        }

        ImageSwipePointerReference.current = {
            PointerId: Event.pointerId,
            StartTime: performance.now(),
            StartX: Event.clientX,
            StartY: Event.clientY,
        };
        Event.currentTarget.setPointerCapture(Event.pointerId);
    }

    function HandleImagePointerMove(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        const Pointer = ImageSwipePointerReference.current;
        const Frame = ImageFrameReference.current;

        if(
            Pointer === null
            || Frame === null
            || Pointer.PointerId !== Event.pointerId
        )
        {
            return;
        }

        const DeltaX = Event.clientX - Pointer.StartX;
        const DeltaY = Event.clientY - Pointer.StartY;

        if(
            ImageSwipe === null
            && Math.hypot(DeltaX, DeltaY) < 8
        )
        {
            return;
        }

        const Navigation =
            ImageSwipe
            ?? FindSwipeNavigation(DeltaX, DeltaY);

        if(Navigation === null)
        {
            return;
        }

        Event.preventDefault();
        const MaximumX = Frame.clientWidth * .96;
        const MaximumY = Frame.clientHeight * .96;
        const OffsetX =
            Navigation.Direction === 'right'
                ? Math.max(-MaximumX, Math.min(0, DeltaX))
                : Navigation.Direction === 'left'
                    ? Math.min(MaximumX, Math.max(0, DeltaX))
                    : 0;
        const OffsetY =
            Navigation.Direction === 'down'
                ? Math.max(-MaximumY, Math.min(0, DeltaY))
                : Navigation.Direction === 'up'
                    ? Math.min(MaximumY, Math.max(0, DeltaY))
                    : 0;

        SetImageSwipe({
            ...Navigation,
            OffsetX,
            OffsetY,
            Phase: 'dragging',
            Progress: Math.min(
                1,
                Math.hypot(
                    OffsetX / Frame.clientWidth,
                    OffsetY / Frame.clientHeight,
                ),
            ),
        });
    }

    function HandleImagePointerEnd(
        Event: ReactPointerEvent<HTMLDivElement>,
    )
    {
        const Pointer = ImageSwipePointerReference.current;
        const Frame = ImageFrameReference.current;

        if(
            Pointer === null
            || Pointer.PointerId !== Event.pointerId
        )
        {
            return;
        }

        ImageSwipePointerReference.current = null;

        if(
            Frame === null
            || ImageSwipe === null
            || ImageSwipe.Phase !== 'dragging'
        )
        {
            SetImageSwipe(null);
            return;
        }

        const IsHorizontal =
            ImageSwipe.Direction === 'left'
            || ImageSwipe.Direction === 'right';
        const Distance = Math.abs(
            IsHorizontal
                ? ImageSwipe.OffsetX
                : ImageSwipe.OffsetY,
        );
        const FrameSize =
            IsHorizontal
                ? Frame.clientWidth
                : Frame.clientHeight;
        const Elapsed = Math.max(
            performance.now() - Pointer.StartTime,
            1,
        );
        const Velocity = Distance / Elapsed;

        if(
            Distance >= FrameSize * .16
            || (
                Distance >= 24
                && Velocity >= .5
            )
        )
        {
            NavigationImageIndexReference.current =
                ImageSwipe.TargetIndex;
            SetNavigationImageIndex(ImageSwipe.TargetIndex);
            FinishImageTransition(ImageSwipe);
            return;
        }

        SetImageSwipe({
            ...ImageSwipe,
            OffsetX: 0,
            OffsetY: 0,
            Phase: 'settling',
            Progress: 0,
        });
        ImageTransitionTimerReference.current =
            window.setTimeout(() =>
            {
                SetImageSwipe(null);
                ImageTransitionTimerReference.current = null;
            }, ImageTransitionDuration);
    }

    const StartVisualImageTransitionEvent =
        useEffectEvent(StartVisualImageTransition);

    useEffect(() =>
    {
        const PendingRequest =
            PendingImageTransitionReference.current[0];

        if(
            PendingRequest === undefined
            || ImageSwipe !== null
            || IsImageTransitionLockedReference.current
            || Props.ActiveImageIndex
            !== PendingRequest.FromIndex
        )
        {
            return;
        }

        PendingImageTransitionReference.current.shift();
        StartVisualImageTransitionEvent(PendingRequest);
    }, [
        ImageSwipe,
        Props.ActiveImageIndex,
    ]);

    useEffect(() =>
    {
        function HandleKeyDown(Event: KeyboardEvent)
        {
            if(IsFlipAnimating)
            {
                return;
            }

            if(Event.key === 'Escape')
            {
                OnRequestClose();
            }

            if(Props.ViewMode === 'book')
            {
                if(Event.key === 'ArrowLeft')
                {
                    PhotoFlipBookReference.current
                        ?.pageFlip()
                        ?.flipPrev('bottom');
                }

                if(Event.key === 'ArrowRight')
                {
                    PhotoFlipBookReference.current
                        ?.pageFlip()
                        ?.flipNext('bottom');
                }

                return;
            }

            const KeyDirection:
                PhotoPageDirection | null =
                Event.key === 'ArrowLeft'
                    ? 'left'
                    : Event.key === 'ArrowRight'
                        ? 'right'
                        : Event.key === 'ArrowUp'
                            ? 'up'
                            : Event.key === 'ArrowDown'
                                ? 'down'
                                : null;

            if(KeyDirection === ForwardDirection)
            {
                RequestImageTransition(
                    'forward',
                    NavigationImageIndex,
                    ForwardDirection,
                );
            }
            else if(KeyDirection === BackDirection)
            {
                RequestImageTransition(
                    'back',
                    NavigationImageIndex,
                    BackDirection,
                );
            }
        }

        window.addEventListener('keydown', HandleKeyDown);

        return () =>
        {
            window.removeEventListener('keydown', HandleKeyDown);
        };
    }, [
        BackDirection,
        ForwardDirection,
        IsFlipAnimating,
        NavigationImageIndex,
        OnRequestClose,
        Props.ViewMode,
    ]);

    function HandlePhotoFlip(Event: PhotoFlipEvent)
    {
        if(ActiveViewModeReference.current !== 'book')
        {
            return;
        }

        const BookPageIndex = Math.min(
            Math.max(Number(Event.data), 0),
            Images.length,
        );

        if(BookPageIndex === 0)
        {
            SetIsBookCoverVisible(true);
            return;
        }

        SetIsBookCoverVisible(false);
        const NextImageIndex = Math.min(
            Math.max(BookPageIndex - 1, 0),
            Images.length - 1,
        );
        SetActiveBookSpreadStart(
            Math.floor(NextImageIndex / 2) * 2,
        );
        Props.OnSelectImage(NextImageIndex);
    }

    function HandlePhotoFlipState(
        Event: PhotoFlipStateEvent,
    )
    {
        if(ActiveViewModeReference.current !== 'book')
        {
            return;
        }

        SetIsFlipAnimating(
            Event.data === 'flipping',
        );
    }

    function ChangeViewMode(
        ViewMode: GalleryDetailViewMode,
    )
    {
        ActiveViewModeReference.current = ViewMode;

        if(ViewMode === 'scroll')
        {
            SetIsFlipAnimating(false);
        }

        if(ImageTransitionTimerReference.current !== null)
        {
            window.clearTimeout(
                ImageTransitionTimerReference.current,
            );
            ImageTransitionTimerReference.current = null;
        }

        PendingImageTransitionReference.current = [];
        const NextNavigationImageIndex =
            ViewMode === 'scroll'
                ? 0
                : Props.ActiveImageIndex;
        NavigationImageIndexReference.current =
            NextNavigationImageIndex;
        SetNavigationImageIndex(NextNavigationImageIndex);
        IsImageTransitionLockedReference.current = false;
        SetImageSwipe(null);
        Props.OnChangeViewMode(ViewMode);
    }

    function SelectScrollImage(ImageIndex: number)
    {
        PendingImageTransitionReference.current = [];
        NavigationImageIndexReference.current = ImageIndex;
        SetNavigationImageIndex(ImageIndex);
        Props.OnSelectImage(ImageIndex);
    }

    function OpenIndexedPage(ImageIndex: number)
    {
        if(ActiveViewModeReference.current === 'scroll')
        {
            SelectScrollImage(ImageIndex);
            SetIsPageIndexOpen(false);
            return;
        }

        const TargetSpreadStart =
            Math.floor(ImageIndex / 2) * 2;

        if(IsFlipAnimating)
        {
            return;
        }

        const PhotoFlipApi =
            PhotoFlipBookReference.current?.pageFlip();

        if(PhotoFlipApi === undefined)
        {
            return;
        }

        SetIsBookCoverVisible(false);
        SetActiveBookSpreadStart(TargetSpreadStart);
        PhotoFlipApi.flip(
            TargetSpreadStart + 1,
            'bottom',
        );
    }

    function IsPageIndexActive(ImageIndex: number)
    {
        if(Props.ViewMode === 'scroll')
        {
            return ImageIndex === Props.ActiveImageIndex;
        }

        return (
            IsBookCoverVisible === false
            && (
                ImageIndex === ActiveBookSpreadStart
                || ImageIndex === ActiveBookSpreadStart + 1
            )
        );
    }

    function OpenEnteredPage(
        Event: ReactFormEvent<HTMLFormElement>,
    )
    {
        Event.preventDefault();
        const PageNumber = Number(
            new FormData(Event.currentTarget)
                .get('PageNumber'),
        );

        if(
            Number.isInteger(PageNumber) === false
            || PageNumber < 1
            || PageNumber > Images.length
        )
        {
            return;
        }

        OpenIndexedPage(PageNumber - 1);
    }

    return (
        <div
            className={Styles.Backdrop}
            role="presentation"
            onMouseDown={(Event) =>
            {
                if(Event.target === Event.currentTarget)
                {
                    Props.OnRequestClose();
                }
            }}
        >
            <div
                className={Styles.PanelShell}
                data-view-mode={Props.ViewMode}
                data-scroll-direction={ScrollDirection}
            >
                {(Props.Project.EnabledViewModes?.length ?? 2) > 1 ? (
                    <div
                        className={Styles.ViewModePicker}
                        role="group"
                        aria-label="사진 보기 형식"
                    >
                        <button
                            type="button"
                            className={
                                Props.ViewMode === 'book'
                                    ? Styles.ViewModeActive
                                    : ''
                            }
                            onClick={() =>
                            {
                                SetActiveBookSpreadStart(
                                    Math.floor(
                                        Props.ActiveImageIndex / 2,
                                    ) * 2,
                                );
                                SetIsBookCoverVisible(true);
                                ChangeViewMode('book');
                            }}
                            aria-label="1번 책 넘김 보기"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className={
                                Props.ViewMode === 'scroll'
                                    ? Styles.ViewModeActive
                                    : ''
                            }
                            onClick={() => ChangeViewMode('scroll')}
                            aria-label={
                                ScrollDirection === 'vertical'
                                    ? '2번 세로 스크롤 보기'
                                    : '2번 상하좌우 보기'
                            }
                        >
                            2
                        </button>
                    </div>
                ) : null}

                <button
                    ref={CloseButtonReference}
                    className={Styles.Close}
                    type="button"
                    onClick={Props.OnRequestClose}
                    aria-label="상세 이미지 닫기"
                >
                    <span aria-hidden="true">×</span>
                </button>

                {HasMultipleImages ? (
                    <>
                        <nav
                            id="photo-book-page-index"
                            ref={PageIndexNavigationReference}
                            className={Styles.BookPageIndex}
                            data-open={IsPageIndexOpen}
                            aria-label="사진 페이지 선택"
                            aria-hidden={IsPageIndexOpen === false}
                            inert={IsPageIndexOpen === false}
                        >
                                <header className={Styles.BookIndexHeader}>
                                    <strong>목차</strong>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            SetIsPageIndexOpen(false)
                                        }
                                        aria-label="목차 닫기"
                                    >
                                        ×
                                    </button>
                                </header>
                                <form
                                    className={Styles.PageIndexForm}
                                    onSubmit={OpenEnteredPage}
                                    aria-label="페이지 번호로 이동"
                                >
                                    <input
                                        type="number"
                                        name="PageNumber"
                                        min={1}
                                        max={Images.length}
                                        step={1}
                                        required
                                        inputMode="numeric"
                                        placeholder="페이지"
                                        aria-label={`이동할 페이지 번호, 1부터 ${Images.length}까지`}
                                    />
                                    <button
                                        type="submit"
                                        aria-label="입력한 페이지로 이동"
                                    >
                                        이동
                                    </button>
                                </form>
                                <div className={Styles.BookIndexGrid}>
                                    {Images.map(
                                        (ImageItem, ImageIndex) => (
                                            <button
                                                key={`page-index-${ImageItem.ImagePath}-${ImageIndex}`}
                                                ref={(Element) =>
                                                {
                                                    PageIndexButtonReferences.current[
                                                        ImageIndex
                                                    ] = Element;
                                                }}
                                                type="button"
                                                className={
                                                    IsPageIndexActive(
                                                        ImageIndex,
                                                    )
                                                        ? Styles.PageIndexActive
                                                        : ''
                                                }
                                                onClick={() =>
                                                    OpenIndexedPage(
                                                        ImageIndex,
                                                    )
                                                }
                                                aria-label={`${ImageIndex + 1}페이지로 이동`}
                                                aria-current={
                                                    IsPageIndexActive(
                                                        ImageIndex,
                                                    )
                                                        ? 'page'
                                                        : undefined
                                                }
                                            >
                                                <span
                                                    className={
                                                        Styles
                                                            .BookIndexThumbnail
                                                    }
                                                >
                                                    <Image
                                                        src={
                                                            ImageItem
                                                                .ImagePath
                                                        }
                                                        alt=""
                                                        fill
                                                        sizes="84px"
                                                        unoptimized
                                                    />
                                                </span>
                                                <small>
                                                    {ImageIndex + 1}
                                                </small>
                                            </button>
                                        ),
                                    )}
                                </div>
                        </nav>
                        <div
                            className={Styles.BookPageIndexControls}
                        >
                            <button
                                type="button"
                                className={Styles.PageIndexToggle}
                                aria-label={
                                    IsPageIndexOpen
                                        ? '페이지 바로가기 숨기기'
                                        : '페이지 바로가기 열기'
                                }
                                aria-expanded={IsPageIndexOpen}
                                aria-controls="photo-book-page-index"
                                onClick={() =>
                                    SetIsPageIndexOpen(
                                        (Current) => !Current,
                                    )
                                }
                            >
                                <span aria-hidden="true">☷</span>
                            </button>
                        </div>
                    </>
                ) : null}

            <section
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-label="사진 상세 보기"
                data-ue-component="ImageDetailLayeredPanel"
                data-ue-root
                data-view-mode={Props.ViewMode}
                data-scroll-direction={ScrollDirection}
            >
                <div
                    ref={ImageFrameReference}
                    className={Styles.ImageFrame}
                    data-dragging={
                        ImageSwipe?.Phase === 'dragging'
                    }
                    onPointerDown={HandleImagePointerDown}
                    onPointerMove={HandleImagePointerMove}
                    onPointerUp={HandleImagePointerEnd}
                    onPointerCancel={HandleImagePointerEnd}
                >
                    {IsHorizontalScroll ? (
                        ImageSwipe !== null
                        && SwipeTargetImage !== null ? (
                            <div
                                className={Styles.SwipeStage}
                                data-phase={ImageSwipe.Phase}
                                data-completing={
                                    ImageSwipe.Progress === 1
                                }
                                data-direction={ImageSwipe.Direction}
                            >
                                <div
                                    className={Styles.SwipeSlide}
                                    style={{
                                        opacity:
                                            1 - ImageSwipe.Progress,
                                    }}
                                >
                                    <Image
                                        src={ActiveImage.ImagePath}
                                        alt={ActiveImage.Alt}
                                        fill
                                        sizes="(max-width: 800px) 100vw, 72vw"
                                        priority
                                        draggable={false}
                                        unoptimized
                                    />
                                </div>
                                <div
                                    className={Styles.SwipeSlide}
                                    style={{
                                        opacity: ImageSwipe.Progress,
                                    }}
                                >
                                    <Image
                                        src={
                                            SwipeTargetImage.ImagePath
                                        }
                                        alt={SwipeTargetImage.Alt}
                                        fill
                                        sizes="(max-width: 800px) 100vw, 72vw"
                                        draggable={false}
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ) : (
                            <div
                                key={`${ActiveImage.ImagePath}-${Props.ActiveImageIndex}`}
                                className={Styles.HorizontalSlide}
                                data-direction={
                                    Props.NavigationDirection
                                }
                            >
                                <Image
                                    src={ActiveImage.ImagePath}
                                    alt={ActiveImage.Alt}
                                    fill
                                    sizes="(max-width: 800px) 100vw, 72vw"
                                    priority
                                    draggable={false}
                                    unoptimized
                                />
                            </div>
                        )
                    ) : null}

                    {IsVerticalScroll === true ? (
                        <div className={Styles.VerticalGallery}>
                            {Images.map((ImageItem, ImageIndex) => (
                                <div
                                    key={`${ImageItem.ImagePath}-${ImageIndex}`}
                                    ref={(Element) =>
                                    {
                                        VerticalImageReferences.current[
                                            ImageIndex
                                        ] = Element;
                                    }}
                                    className={Styles.VerticalImage}
                                    data-active={
                                        ImageIndex ===
                                        Props.ActiveImageIndex
                                    }
                                >
                                    <Image
                                        src={ImageItem.ImagePath}
                                        alt={ImageItem.Alt}
                                        fill
                                        sizes="(max-width: 800px) 100vw, 72vw"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {Props.ViewMode === 'book' ? (
                        <div
                            className={Styles.PhotoBookStage}
                        >
                            <HTMLFlipBook
                                ref={PhotoFlipBookReference}
                                className={Styles.PhotoFlipBook}
                                style={{}}
                                width={500}
                                height={675}
                                size="stretch"
                                minWidth={260}
                                maxWidth={505}
                                minHeight={352}
                                maxHeight={680}
                                startPage={0}
                                drawShadow
                                flippingTime={920}
                                usePortrait
                                startZIndex={10}
                                autoSize
                                maxShadowOpacity={0.22}
                                showCover
                                mobileScrollSupport={false}
                                clickEventForward
                                useMouseEvents
                                swipeDistance={24}
                                showPageCorners={false}
                                disableFlipByClick={false}
                                renderOnlyPageLengthChange
                                onFlip={HandlePhotoFlip}
                                onChangeState={
                                    HandlePhotoFlipState
                                }
                            >
                                <PhotoFlipPage
                                    key="photo-book-cover"
                                    Density="hard"
                                    Children={
                                        <figure
                                            className={
                                                Styles.PhotoBookPage
                                            }
                                        >
                                            <div
                                                className={
                                                    Styles
                                                        .PhotoBookImage
                                                }
                                            >
                                                <Image
                                                    src={
                                                        Props.Project
                                                            .BookCoverImagePath
                                                        ?? Props.Project
                                                            .ImagePath
                                                    }
                                                    alt="사진 게시글 표지"
                                                    fill
                                                    sizes="(max-width: 760px) 78vw, 390px"
                                                    priority
                                                    unoptimized
                                                />
                                                {(
                                                    Props.Project
                                                        .BookCoverTextLayers
                                                    ?? []
                                                ).map((Layer) => (
                                                    <span
                                                        key={Layer.Id}
                                                        className={
                                                            Styles
                                                                .BookCoverText
                                                        }
                                                        style={{
                                                            color:
                                                                Layer
                                                                    .Color,
                                                            fontFamily:
                                                                Layer
                                                                    .FontFamily,
                                                            fontSize:
                                                                `${Layer.FontSize}px`,
                                                            left:
                                                                `${Layer.X}%`,
                                                            top:
                                                                `${Layer.Y}%`,
                                                        }}
                                                    >
                                                        {Layer.Text}
                                                    </span>
                                                ))}
                                            </div>
                                        </figure>
                                    }
                                />
                                {Images.map(
                                    (ImageItem, ImageIndex) => (
                                        <PhotoFlipPage
                                            key={`${ImageItem.ImagePath}-${ImageIndex}`}
                                            Children={
                                                <figure
                                                    className={
                                                        Styles.PhotoBookPage
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            Styles.PhotoBookImage
                                                        }
                                                    >
                                                        <Image
                                                            src={
                                                                ImageItem
                                                                    .ImagePath
                                                            }
                                                            alt={
                                                                ImageItem
                                                                    .Alt
                                                            }
                                                            fill
                                                            sizes="(max-width: 760px) 78vw, 390px"
                                                            priority={
                                                                ImageIndex <
                                                                2
                                                            }
                                                            unoptimized
                                                        />
                                                        <span
                                                            className={
                                                                Styles.BookPageStatus
                                                            }
                                                            style={{
                                                                color:
                                                                    Props.Project
                                                                        .BookPageNumberColor
                                                                    ?? '#ffffff',
                                                                opacity:
                                                                    Props.Project
                                                                        .BookPageNumberOpacity
                                                                    ?? .86,
                                                            }}
                                                        >
                                                            {ImageIndex}
                                                        </span>
                                                    </div>
                                                </figure>
                                            }
                                        />
                                    ),
                                )}
                            </HTMLFlipBook>
                        </div>
                    ) : null}

                    {Props.ViewMode === 'scroll' ? (
                        <>
                            {BackDirection !== null ? (
                                <button
                                    type="button"
                                    className={Styles.ImageNavigation}
                                    data-navigation="back"
                                    data-direction={BackDirection}
                                    onClick={() =>
                                        RequestImageTransition(
                                            'back',
                                            NavigationImageIndex,
                                            BackDirection,
                                        )
                                    }
                                    aria-label="이전 페이지로 돌아가기"
                                >
                                </button>
                            ) : null}
                            {ForwardDirection !== null ? (
                                <button
                                    type="button"
                                    className={Styles.ImageNavigation}
                                    data-navigation="forward"
                                    data-direction={ForwardDirection}
                                    onClick={() =>
                                        RequestImageTransition(
                                            'forward',
                                            NavigationImageIndex,
                                            ForwardDirection,
                                        )
                                    }
                                    aria-label="다음 페이지로 이동"
                                >
                                </button>
                            ) : null}
                        </>
                    ) : null}

                </div>

            </section>
                <span className={Styles.PageProgress}>
                    {Props.ViewMode === 'book'
                        ? IsBookCoverVisible
                            ? 0
                            : Math.min(
                                ActiveBookSpreadStart + 1,
                                Images.length,
                            )
                        : Props.ActiveImageIndex + 1}{' '}
                    / {Images.length}
                </span>
                {IsFlipAnimating ? (
                    <span
                        className={Styles.InteractionGuard}
                        aria-hidden="true"
                    />
                ) : null}
            </div>
        </div>
    );
}
