'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PanelLayerHost } from '@/app/panel_layer/PanelLayerHost';
import { ImageDetailLayeredPanel } from '@/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel';
import { useGalleryIndexBasePanelController } from './controller/GalleryIndexBasePanelController';
import type { GalleryIndexFilter } from './controller/GalleryIndexBasePanelTypes';
import Styles from './GalleryIndexBasePanel.module.css';

const Filters: GalleryIndexFilter[] = [
    'All',
    'Architecture',
    'Portraits',
    'Journeys',
    'Journal',
];

export function GalleryIndexBasePanel()
{
    const Controller = useGalleryIndexBasePanelController();

    return (
        <main className={Styles.Page}>
            <header className={Styles.Header}>
                <Link href="/" className={Styles.Brand}>
                    <span>A</span> Archive
                </Link>
                <Link href="/" className={Styles.BackLink}>
                    Back to index ↖
                </Link>
            </header>

            <section
                className={Styles.IndexSection}
                data-ue-component="GalleryIndexSection"
                data-ue-root
            >
                <div className={Styles.Heading}>
                    <p>Archive index · 2022—2026</p>
                    <h1>What have we collected?</h1>
                    <span>
                        개인적인 장면과 작업을
                        <br />
                        한곳에 모은 시각 인덱스.
                    </span>
                </div>

                <div className={Styles.Filters} role="group" aria-label="갤러리 필터">
                    {Filters.map((Filter) => (
                        <button
                            key={Filter}
                            type="button"
                            className={
                                Controller.ActiveFilter === Filter
                                    ? Styles.FilterActive
                                    : ''
                            }
                            onClick={() => Controller.ChangeFilter(Filter)}
                        >
                            {Filter}
                        </button>
                    ))}
                </div>

                <div className={Styles.Grid}>
                    {Controller.VisibleItems.map((Item) => (
                        <article key={Item.Id} className={Styles.Card}>
                            <button
                                type="button"
                                className={Styles.CardOpenButton}
                                onClick={() =>
                                    Controller.OpenProjectDetail(Item)
                                }
                                aria-label={`${Item.Title} 상세 보기`}
                            />
                            <div
                                className={`${Styles.CardImage} ${
                                    Item.Orientation === 'landscape'
                                        ? Styles.Landscape
                                        : ''
                                }`}
                            >
                                <Image
                                    src={Item.ImagePath}
                                    alt={Item.Alt}
                                    fill
                                    sizes="(max-width: 760px) 100vw, 33vw"
                                />
                            </div>
                            <div className={Styles.CardMeta}>
                                <span>{Item.Date}</span>
                                <span>{Item.Category}</span>
                            </div>
                            <h2>{Item.Title}</h2>
                            <p>{Item.Description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <PanelLayerHost>
                {Controller.OpenProject !== null ? (
                    <ImageDetailLayeredPanel
                        Project={Controller.OpenProject}
                        OnRequestClose={Controller.CloseProjectDetail}
                    />
                ) : null}
            </PanelLayerHost>
        </main>
    );
}
