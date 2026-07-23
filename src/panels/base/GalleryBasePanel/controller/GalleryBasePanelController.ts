'use client';

import { useMemo, useState } from 'react';
import { AppNavigator } from '@/app/navigation/AppNavigator';
import { GalleryProjects } from './GalleryBasePanelState';
import type {
    GalleryCategory,
    GalleryFilter,
    GalleryProject,
} from './GalleryBasePanelTypes';

export function useGalleryBasePanelController()
{
    const [ActiveHeroCategory, SetActiveHeroCategory] =
        useState<GalleryCategory | null>(null);
    const [ActiveFilter, SetActiveFilter] = useState<GalleryFilter>('all');
    const [OpenProject, SetOpenProject] = useState<GalleryProject | null>(null);

    const VisibleProjects = useMemo(
        () =>
            ActiveFilter === 'all'
                ? GalleryProjects
                : GalleryProjects.filter(
                      (Project) => Project.Category === ActiveFilter,
                  ),
        [ActiveFilter],
    );

    function SelectHeroCategory(Category: GalleryCategory)
    {
        SetActiveHeroCategory(Category);
    }

    function ResetHeroCategory()
    {
        SetActiveHeroCategory(null);
    }

    function OpenBoxDestination(Destination: 'gallery' | 'community' | null)
    {
        if(Destination === null)
        {
            return;
        }

        const Navigator = new AppNavigator();
        Navigator.Navigate({
            PanelId:
                Destination === 'gallery'
                    ? 'GalleryIndexBasePanel'
                    : 'CommunityBasePanel',
        });
    }

    function ChangeFilter(Filter: GalleryFilter)
    {
        SetActiveFilter(Filter);
    }

    function OpenProjectDetail(Project: GalleryProject)
    {
        SetOpenProject(Project);
    }

    function CloseProjectDetail()
    {
        SetOpenProject(null);
    }

    return {
        ActiveHeroCategory,
        ActiveFilter,
        VisibleProjects,
        OpenProject,
        SelectHeroCategory,
        ResetHeroCategory,
        OpenBoxDestination,
        ChangeFilter,
        OpenProjectDetail,
        CloseProjectDetail,
    };
}
