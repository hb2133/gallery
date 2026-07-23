'use client';

import { useState } from 'react';
import { CommunityPhotos } from './CommunityBasePanelState';

export function useCommunityBasePanelController()
{
    const [ActivePhotoIndex, SetActivePhotoIndex] = useState(0);

    function ShowPreviousPhoto()
    {
        SetActivePhotoIndex(
            (CurrentIndex) =>
                (CurrentIndex - 1 + CommunityPhotos.length) %
                CommunityPhotos.length,
        );
    }

    function ShowNextPhoto()
    {
        SetActivePhotoIndex(
            (CurrentIndex) =>
                (CurrentIndex + 1) % CommunityPhotos.length,
        );
    }

    function ShowPhoto(PhotoIndex: number)
    {
        SetActivePhotoIndex(PhotoIndex);
    }

    return {
        ActivePhotoIndex,
        ShowPreviousPhoto,
        ShowNextPhoto,
        ShowPhoto,
    };
}
