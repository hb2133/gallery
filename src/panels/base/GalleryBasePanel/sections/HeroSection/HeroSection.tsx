import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';
import { GalleryCategories } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelState';
import type { GalleryCategory } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

interface HeroSectionProps
{
    ActiveCategory: GalleryCategory | null;
    OnSelectCategory: (Category: GalleryCategory) => void;
    OnReset: () => void;
    OnOpenDestination: (
        Destination: 'gallery' | 'community' | null,
    ) => void;
}

const TilePositionClasses = {
    architecture: Styles.BoxTop,
    journeys: Styles.BoxRight,
    journal: Styles.BoxBottom,
    portraits: Styles.BoxLeft,
};

const WordPositionClasses = {
    architecture: Styles.WordTop,
    journeys: Styles.WordRight,
    journal: Styles.WordBottom,
    portraits: Styles.WordLeft,
};

const LetterByCategory = {
    architecture: 'A',
    journal: 'B',
    portraits: 'C',
    journeys: 'D',
};

const DestinationByCategory = {
    architecture: {
        Label: 'Gallery',
        Destination: 'gallery' as const,
    },
    journeys: {
        Label: 'Community',
        Destination: 'community' as const,
    },
    journal: {
        Label: 'Coming soon',
        Destination: null,
    },
    portraits: {
        Label: 'Coming soon',
        Destination: null,
    },
};

export function HeroSection(Props: HeroSectionProps)
{
    const ActiveOption = GalleryCategories.find(
        (Category) => Category.Id === Props.ActiveCategory,
    );
    const StageState = Props.ActiveCategory ?? 'idle';

    return (
        <section
            id="top"
            className={Styles.Hero}
            data-ue-component="HeroSection"
            data-ue-root
        >
            <div className={Styles.BoxExperience}>
                <div className={Styles.BoxHeading}>
                    <p className={Styles.Eyebrow}>Interactive visual archive</p>
                    <p>
                        Select a word
                        <br />
                        to reshape the archive.
                    </p>
                </div>

                <div
                    className={Styles.BoxStage}
                    data-state={StageState}
                    aria-label="갤러리 카테고리 탐색"
                >
                    {GalleryCategories.map((Category) => (
                        <button
                            key={Category.Id}
                            type="button"
                            className={`${Styles.BoxTile} ${
                                TilePositionClasses[Category.Id]
                            }`}
                            disabled={ActiveOption === undefined}
                            onClick={() =>
                                Props.OnOpenDestination(
                                    DestinationByCategory[Category.Id]
                                        .Destination,
                                )
                            }
                            aria-label={
                                DestinationByCategory[Category.Id].Destination ===
                                null
                                    ? '준비 중인 메뉴'
                                    : `${DestinationByCategory[Category.Id].Label} 페이지 열기`
                            }
                        >
                            <span className={Styles.BoxDestination}>
                                {DestinationByCategory[Category.Id].Label}
                            </span>
                        </button>
                    ))}

                    {GalleryCategories.map((Category) => (
                        <button
                            key={`word-${Category.Id}`}
                            type="button"
                            className={`${Styles.WordButton} ${
                                WordPositionClasses[Category.Id]
                            }`}
                            disabled={ActiveOption !== undefined}
                            onClick={() => Props.OnSelectCategory(Category.Id)}
                            aria-label={`${Category.Label} 형태 보기`}
                        >
                            {LetterByCategory[Category.Id]}
                        </button>
                    ))}

                    <button
                        type="button"
                        className={`${Styles.BoxTile} ${Styles.BoxCenter}`}
                        onClick={Props.OnReset}
                        aria-label={
                            ActiveOption === undefined
                                ? '기본 아카이브 배치'
                                : `${ActiveOption.Label} 선택 해제하고 기본 배치로 돌아가기`
                        }
                    >
                        <span className={Styles.CenterWord}>
                            {ActiveOption === undefined
                                ? ''
                                : LetterByCategory[ActiveOption.Id]}
                        </span>
                    </button>
                </div>

                <div className={Styles.BoxStatus} aria-live="polite">
                    <span>
                        {ActiveOption === undefined
                            ? 'Default composition'
                            : `${ActiveOption.Label} selected`}
                    </span>
                    <p>
                        {ActiveOption === undefined
                            ? 'Choose one of four surrounding words.'
                            : 'Click the center word to return.'}
                    </p>
                </div>
            </div>
        </section>
    );
}
