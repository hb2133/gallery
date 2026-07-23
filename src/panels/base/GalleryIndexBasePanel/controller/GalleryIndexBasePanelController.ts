'use client';

import { useMemo, useState } from 'react';
import { GalleryProjects } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelState';
import type { GalleryProject } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import { GalleryIndexItems } from './GalleryIndexBasePanelState';
import type {
    GalleryIndexFilter,
    GalleryIndexItem,
} from './GalleryIndexBasePanelTypes';

export function useGalleryIndexBasePanelController()
{
    const [ActiveFilter, SetActiveFilter] =
        useState<GalleryIndexFilter>('All');
    const [OpenProject, SetOpenProject] = useState<GalleryProject | null>(null);

    const VisibleItems = useMemo(
        () =>
            ActiveFilter === 'All'
                ? GalleryIndexItems
                : GalleryIndexItems.filter(
                      (Item) => Item.Category === ActiveFilter,
                  ),
        [ActiveFilter],
    );

    function ChangeFilter(Filter: GalleryIndexFilter)
    {
        SetActiveFilter(Filter);
    }

    function OpenProjectDetail(Item: GalleryIndexItem)
    {
        const Project = GalleryProjects.find(
            (Candidate) => Candidate.ImagePath === Item.ImagePath,
        );

        if(Project !== undefined)
        {
            SetOpenProject({
                ...Project,
                Title: Item.Title,
                CategoryLabel: Item.Category,
                Year: Item.Date.slice(-4),
                Note: Item.Description,
                Alt: Item.Alt,
            });
        }
    }

    function CloseProjectDetail()
    {
        SetOpenProject(null);
    }

    return {
        ActiveFilter,
        VisibleItems,
        OpenProject,
        ChangeFilter,
        OpenProjectDetail,
        CloseProjectDetail,
    };
}
