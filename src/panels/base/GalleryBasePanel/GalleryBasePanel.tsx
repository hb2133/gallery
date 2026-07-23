'use client';

import { PanelLayerHost } from '@/app/panel_layer/PanelLayerHost';
import { ImageDetailLayeredPanel } from '@/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel';
import { useGalleryBasePanelController } from './controller/GalleryBasePanelController';
import { HeaderSection } from './sections/HeaderSection/HeaderSection';
import { HeroSection } from './sections/HeroSection/HeroSection';
import { GallerySection } from './sections/GallerySection/GallerySection';
import { JournalSection } from './sections/JournalSection/JournalSection';
import { FooterSection } from './sections/FooterSection/FooterSection';

export function GalleryBasePanel()
{
    const Controller = useGalleryBasePanelController();

    return (
        <main>
            <HeaderSection />
            <HeroSection
                ActiveCategory={Controller.ActiveHeroCategory}
                OnSelectCategory={Controller.SelectHeroCategory}
                OnReset={Controller.ResetHeroCategory}
                OnOpenDestination={Controller.OpenBoxDestination}
            />
            <GallerySection
                ActiveFilter={Controller.ActiveFilter}
                Projects={Controller.VisibleProjects}
                OnChangeFilter={Controller.ChangeFilter}
                OnOpenProject={Controller.OpenProjectDetail}
            />
            <JournalSection />
            <FooterSection />

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
