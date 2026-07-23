import Image from 'next/image';
import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';
import { GalleryCategories } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelState';
import type {
    GalleryFilter,
    GalleryProject,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';

interface GallerySectionProps
{
    ActiveFilter: GalleryFilter;
    Projects: GalleryProject[];
    OnChangeFilter: (Filter: GalleryFilter) => void;
    OnOpenProject: (Project: GalleryProject) => void;
}

export function GallerySection(Props: GallerySectionProps)
{
    return (
        <section
            id="gallery"
            className={Styles.Gallery}
            data-ue-component="GallerySection"
            data-ue-root
        >
            <div className={Styles.SectionLead}>
                <p className={Styles.Eyebrow}>Selected works · 2022—2025</p>
                <h2>
                    A visual index
                    <br />
                    of places and people.
                </h2>
                <p className={Styles.LeadCopy}>
                    장면의 크기보다 그 안에 남은 감각을 기록합니다. 건축,
                    인물, 여정 그리고 평범한 하루까지.
                </p>
            </div>

            <div className={Styles.FilterBar} role="group" aria-label="작품 필터">
                <button
                    type="button"
                    className={Props.ActiveFilter === 'all' ? Styles.FilterActive : ''}
                    onClick={() => Props.OnChangeFilter('all')}
                >
                    All <span>08</span>
                </button>
                {GalleryCategories.map((Category) => (
                    <button
                        key={Category.Id}
                        type="button"
                        className={
                            Props.ActiveFilter === Category.Id
                                ? Styles.FilterActive
                                : ''
                        }
                        onClick={() => Props.OnChangeFilter(Category.Id)}
                    >
                        {Category.Label} <span>02</span>
                    </button>
                ))}
            </div>

            <div className={Styles.ProjectGrid}>
                {Props.Projects.map((Project, Index) => (
                    <article
                        key={Project.Id}
                        className={`${Styles.ProjectCard} ${
                            Project.Orientation === 'landscape'
                                ? Styles.ProjectLandscape
                                : ''
                        }`}
                    >
                        <button
                            type="button"
                            className={Styles.ProjectImage}
                            onClick={() => Props.OnOpenProject(Project)}
                            aria-label={`${Project.Title} 상세 보기`}
                        >
                            <Image
                                src={Project.ImagePath}
                                alt={Project.Alt}
                                fill
                                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 34vw"
                            />
                            <span className={Styles.ProjectNumber}>
                                {String(Index + 1).padStart(2, '0')}
                            </span>
                            <span className={Styles.ProjectOpen} aria-hidden="true">
                                ↗
                            </span>
                        </button>
                        <div className={Styles.ProjectCaption}>
                            <div>
                                <p>{Project.Title}</p>
                                <span>{Project.CategoryLabel}</span>
                            </div>
                            <div>
                                <p>{Project.Location}</p>
                                <span>{Project.Year}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
