import type { CSSProperties } from 'react';
import { ArchiveStrings } from '@/core/localization/ArchiveStrings';
import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';
import { GalleryCategories } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelState';
import type {
    ArchiveDestination,
    GalleryCategory,
    GalleryCategoryMap,
    GalleryTextStyle,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

interface HeroSectionProps
{
    ActiveCategory: GalleryCategory | null;
    EditingBoxLayoutCategory: GalleryCategory | null;
    SelectedBoxLayoutCell: number | null;
    CategoryBoxLayouts: GalleryCategoryMap<number[]>;
    CategoryImages: GalleryCategoryMap<string>;
    CategoryLabels: GalleryCategoryMap<string>;
    CategoryCenterTextStyles: GalleryCategoryMap<GalleryTextStyle>;
    CategoryTextStyles: GalleryCategoryMap<GalleryTextStyle>;
    DestinationLabels: GalleryCategoryMap<string>;
    DestinationTextStyles: GalleryCategoryMap<GalleryTextStyle>;
    IsClosing: boolean;
    OnSelectCategory: (Category: GalleryCategory) => void;
    OnReset: () => void;
    OnOpenDestination: (Destination: ArchiveDestination) => void;
    OnSelectBoxLayoutCell: (Cell: number) => void;
    OnMoveBoxLayoutCell: (
        FromCell: number,
        ToCell: number,
    ) => void;
    OnFinishBoxLayoutEditing: () => void;
}

interface BoxAnimationStyle extends CSSProperties
{
    '--box-enter-delay': string;
    '--box-exit-delay': string;
}

interface BoxPositionStyle extends BoxAnimationStyle
{
    transform: string;
}

const WordPositionClasses = {
    architecture: Styles.WordTop,
    journeys: Styles.WordRight,
    journal: Styles.WordBottom,
    portraits: Styles.WordLeft,
};

const DestinationByCategory = {
    architecture: 'media' as const,
    journeys: 'writing' as const,
    journal: 'memo' as const,
    portraits: 'gallery' as const,
};

const FontFamilyByChoice: Record<string, string> = {
    sans: 'var(--font-geist-sans), sans-serif',
    korean: 'var(--font-noto-sans-kr), sans-serif',
    mono: 'var(--font-geist-mono), monospace',
    serif: 'Georgia, "Times New Roman", serif',
};

function CreateTextStyle(
    TextStyle: GalleryTextStyle,
): CSSProperties
{
    return {
        color: TextStyle.Color,
        fontFamily:
            FontFamilyByChoice[TextStyle.Font]
            ?? TextStyle.Font,
        fontSize: `${TextStyle.Size}px`,
    };
}

function CreateBoxAnimationStyle(
    Sequence: number,
): BoxAnimationStyle
{
    return {
        '--box-enter-delay': `${Sequence * 65}ms`,
        '--box-exit-delay': `${(4 - Sequence) * 55}ms`,
    };
}

function CreateBoxPositionStyle(
    Cell: number,
    Sequence: number,
): BoxPositionStyle
{
    const Column = (Cell - 1) % 5;
    const Row = Math.floor((Cell - 1) / 5);

    return {
        ...CreateBoxAnimationStyle(Sequence),
        transform: `translate(
            calc(var(--box-step) * ${Column - 2}),
            calc(var(--box-step) * ${Row - 2})
        )`,
    };
}

function CreateCompositeTileStyle(
    ImagePath: string,
    Cell: number,
    Sequence: number,
): BoxAnimationStyle
{
    const Column = (Cell - 1) % 5;
    const Row = Math.floor((Cell - 1) / 5);
    const CenterX = `calc(50% + var(--box-step) * ${Column - 2})`;
    const CenterY = `calc(50% + var(--box-step) * ${Row - 2})`;

    return {
        ...CreateBoxAnimationStyle(Sequence),
        backgroundImage: `url(${JSON.stringify(ImagePath)})`,
        clipPath: `polygon(
            calc(${CenterX} - var(--box-size) / 2)
            calc(${CenterY} - var(--box-size) / 2),
            calc(${CenterX} + var(--box-size) / 2)
            calc(${CenterY} - var(--box-size) / 2),
            calc(${CenterX} + var(--box-size) / 2)
            calc(${CenterY} + var(--box-size) / 2),
            calc(${CenterX} - var(--box-size) / 2)
            calc(${CenterY} + var(--box-size) / 2)
        )`,
    };
}

export function HeroSection(Props: HeroSectionProps)
{
    const ActiveOption = GalleryCategories.find(
        (Category) => Category.Id === Props.ActiveCategory,
    );
    const StageState = Props.ActiveCategory ?? 'idle';
    const ActiveLayout =
        Props.ActiveCategory === null
            ? null
            : Props.CategoryBoxLayouts[Props.ActiveCategory];
    const ActiveThumbnailPath =
        Props.ActiveCategory === null
            ? null
            : Props.CategoryImages[Props.ActiveCategory];
    const IsBoxLayoutEditing =
        Props.ActiveCategory !== null
        && Props.ActiveCategory === Props.EditingBoxLayoutCategory;

    return (
        <section
            id="top"
            className={Styles.Hero}
            data-cursor-surface
            data-ue-component="HeroSection"
            data-ue-root
        >
            <div className={Styles.BoxExperience}>
                <div
                    className={Styles.BoxStage}
                    data-state={StageState}
                    data-editing={IsBoxLayoutEditing}
                    data-phase={Props.IsClosing ? 'closing' : 'visible'}
                    aria-label={ArchiveStrings.Home.StageLabel}
                >
                    {IsBoxLayoutEditing && ActiveOption !== undefined ? (
                        <div className={Styles.BoxPlacementToolbar}>
                            <span>
                                {Props.CategoryLabels[ActiveOption.Id]}
                                {' · 박스 위치 설정'}
                            </span>
                            <p>
                                박스를 빈 칸으로 드래그하세요. 중앙은 고정됩니다.
                            </p>
                            <button
                                type="button"
                                onClick={Props.OnFinishBoxLayoutEditing}
                                data-cursor-label="설정창으로 돌아가기"
                            >
                                설정창으로 돌아가기
                            </button>
                        </div>
                    ) : null}

                    {IsBoxLayoutEditing && ActiveLayout !== null ? (
                        <div
                            className={Styles.BoxPlacementGrid}
                            role="group"
                            aria-label="박스를 옮길 5×5 위치"
                        >
                            {Array.from(
                                { length: 25 },
                                (_Value, CellIndex) =>
                                {
                                    const Cell = CellIndex + 1;
                                    const IsOccupied =
                                        ActiveLayout.includes(Cell);

                                    return (
                                        <button
                                            key={Cell}
                                            type="button"
                                            className={Styles.BoxPlacementCell}
                                            disabled={
                                                IsOccupied || Cell === 13
                                            }
                                            tabIndex={
                                                Props.SelectedBoxLayoutCell
                                                    === null
                                                    ? -1
                                                    : 0
                                            }
                                            aria-label={`${Cell}번 빈 칸으로 이동`}
                                            data-cursor-label={`${Cell}번 위치로 이동`}
                                            onClick={() =>
                                            {
                                                if(
                                                    Props.SelectedBoxLayoutCell
                                                    !== null
                                                )
                                                {
                                                    Props.OnMoveBoxLayoutCell(
                                                        Props.SelectedBoxLayoutCell,
                                                        Cell,
                                                    );
                                                }
                                            }}
                                            onDragOver={(Event) =>
                                            {
                                                Event.preventDefault();
                                                Event.dataTransfer.dropEffect =
                                                    'move';
                                            }}
                                            onDrop={(Event) =>
                                            {
                                                Event.preventDefault();
                                                Props.OnMoveBoxLayoutCell(
                                                    Number(
                                                        Event.dataTransfer
                                                            .getData(
                                                                'text/plain',
                                                            ),
                                                    ),
                                                    Cell,
                                                );
                                            }}
                                        >
                                            {Cell}
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    ) : null}

                    {ActiveLayout !== null
                    && ActiveThumbnailPath !== null ? (
                        <div
                            className={Styles.CompositeImageLayer}
                            aria-hidden="true"
                        >
                            {ActiveLayout.map((Cell, Index) => (
                                <span
                                    key={Cell}
                                    className={Styles.CompositeImageTile}
                                    style={CreateCompositeTileStyle(
                                        ActiveThumbnailPath,
                                        Cell,
                                        Index,
                                    )}
                                />
                            ))}
                        </div>
                    ) : null}

                    {GalleryCategories.map((Category, Index) =>
                    {
                        const Cell = ActiveLayout?.[Index + 1];

                        return (
                            <button
                                key={Category.Id}
                                type="button"
                                className={`${Styles.BoxTile} ${
                                    IsBoxLayoutEditing
                                        ? Styles.BoxTileEditing
                                        : ''
                                } ${
                                    IsBoxLayoutEditing
                                    && Cell === Props.SelectedBoxLayoutCell
                                        ? Styles.BoxTileSelected
                                        : ''
                                }`}
                                disabled={ActiveOption === undefined}
                                draggable={IsBoxLayoutEditing}
                                onClick={() =>
                                {
                                    if(IsBoxLayoutEditing && Cell !== undefined)
                                    {
                                        Props.OnSelectBoxLayoutCell(Cell);
                                        return;
                                    }

                                    Props.OnOpenDestination(
                                        DestinationByCategory[Category.Id],
                                    );
                                }}
                                onDragStart={(Event) =>
                                {
                                    if(Cell === undefined)
                                    {
                                        Event.preventDefault();
                                        return;
                                    }

                                    Event.dataTransfer.effectAllowed = 'move';
                                    Event.dataTransfer.setData(
                                        'text/plain',
                                        String(Cell),
                                    );
                                    Props.OnSelectBoxLayoutCell(Cell);
                                }}
                                aria-label={
                                    IsBoxLayoutEditing
                                        ? `${Props.DestinationLabels[Category.Id]} 박스 이동`
                                        : `${Props.DestinationLabels[Category.Id]} 페이지 열기`
                                }
                                aria-pressed={
                                    IsBoxLayoutEditing
                                        ? Cell === Props.SelectedBoxLayoutCell
                                        : undefined
                                }
                                data-cursor-label={
                                    IsBoxLayoutEditing
                                        ? `${Props.DestinationLabels[Category.Id]} 박스 이동`
                                        : `${Props.DestinationLabels[Category.Id]} 열기`
                                }
                                style={
                                    Cell === undefined
                                        ? undefined
                                        : CreateBoxPositionStyle(
                                            Cell,
                                            Index + 1,
                                        )
                                }
                            >
                                <span
                                    className={Styles.BoxDestination}
                                    style={CreateTextStyle(
                                        Props.DestinationTextStyles[
                                            Category.Id
                                        ],
                                    )}
                                >
                                    {Props.DestinationLabels[Category.Id]}
                                </span>
                            </button>
                        );
                    })}

                    {GalleryCategories.map((Category) => (
                        <button
                            key={`word-${Category.Id}`}
                            type="button"
                            className={`${Styles.WordButton} ${
                                WordPositionClasses[Category.Id]
                            }`}
                            disabled={ActiveOption !== undefined}
                            onClick={() => Props.OnSelectCategory(Category.Id)}
                            aria-label={`${Props.CategoryLabels[Category.Id]} 장르 보기`}
                            data-cursor-label={`${Props.CategoryLabels[Category.Id]} 선택`}
                            style={CreateTextStyle(
                                Props.CategoryTextStyles[
                                    Category.Id
                                ],
                            )}
                        >
                            {Props.CategoryLabels[Category.Id]}
                        </button>
                    ))}

                    <button
                        type="button"
                        className={`${Styles.BoxTile} ${Styles.BoxCenter}`}
                        disabled={IsBoxLayoutEditing}
                        onClick={Props.OnReset}
                        aria-label={
                            ActiveOption === undefined
                                ? '기본 아카이브 배치'
                                : `${ActiveOption.Label} 선택 해제하고 기본 배치로 돌아가기`
                        }
                        data-cursor-label={
                            ActiveOption === undefined
                                ? undefined
                                : '기본 화면으로 돌아가기'
                        }
                    >
                        <span
                            className={Styles.CenterWord}
                            style={
                                ActiveOption === undefined
                                    ? undefined
                                    : CreateTextStyle(
                                        Props.CategoryCenterTextStyles[
                                            ActiveOption.Id
                                        ],
                                    )
                            }
                        >
                            {ActiveOption === undefined
                                ? ''
                                : Props.CategoryLabels[
                                    ActiveOption.Id
                                ]}
                        </span>
                    </button>
                </div>

                <div className={Styles.BoxStatus} aria-live="polite">
                    <span>
                        {IsBoxLayoutEditing
                            ? 'Drag & drop layout editing'
                            : ActiveOption === undefined
                            ? 'Default composition'
                            : `${Props.CategoryLabels[ActiveOption.Id]} selected`}
                    </span>
                    <p>
                        {IsBoxLayoutEditing
                            ? '박스를 끌어 빈 칸에 놓은 뒤 설정창으로 돌아가 저장하세요.'
                            : ActiveOption === undefined
                            ? ArchiveStrings.Home.IdleStatus
                            : ArchiveStrings.Home.ActiveStatus}
                    </p>
                </div>
            </div>
        </section>
    );
}
