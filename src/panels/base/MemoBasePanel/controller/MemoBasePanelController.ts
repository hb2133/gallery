'use client';

import { useState } from 'react';
import { InitialMemoPages } from './MemoBasePanelState';
import type { MemoPage } from './MemoBasePanelTypes';

const PagesPerListPage = 8;

export function useMemoBasePanelController()
{
    const [Pages, SetPages] = useState<MemoPage[]>(InitialMemoPages);
    const [ActivePageIndex, SetActivePageIndex] = useState(0);
    const [CurrentListPage, SetCurrentListPage] = useState(1);
    const ActivePage = Pages[ActivePageIndex];
    const TotalListPages = Math.max(
        1,
        Math.ceil(Pages.length / PagesPerListPage),
    );

    function UpdateActivePage(Update: Partial<MemoPage>)
    {
        SetPages((CurrentPages) =>
            CurrentPages.map((Page, Index) =>
                Index === ActivePageIndex ? { ...Page, ...Update } : Page,
            ),
        );
    }

    function SelectPage(PageIndex: number)
    {
        if(PageIndex < 0 || PageIndex >= Pages.length)
        {
            return;
        }

        SetActivePageIndex(PageIndex);
        SetCurrentListPage(
            Math.floor(PageIndex / PagesPerListPage) + 1,
        );
    }

    function AddPage()
    {
        const NextPage: MemoPage = {
            Id: `memo-${Date.now()}`,
            Title: '새 메모',
            Content: '오늘 남기고 싶은 한 줄을 적어보세요.',
            Date: new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(new Date()),
            CoverTheme: 'ink',
        };

        SetPages((CurrentPages) => [...CurrentPages, NextPage]);
        SetActivePageIndex(Pages.length);
        SetCurrentListPage(
            Math.floor(Pages.length / PagesPerListPage) + 1,
        );
    }

    function ChangeTitle(Title: string)
    {
        UpdateActivePage({ Title });
    }

    function ChangeContent(Content: string)
    {
        UpdateActivePage({ Content });
    }

    function ChangeListPage(Page: number)
    {
        const SafePage = Math.min(
            Math.max(Page, 1),
            TotalListPages,
        );
        const FirstPageIndex =
            (SafePage - 1) * PagesPerListPage;

        SetCurrentListPage(SafePage);
        SetActivePageIndex(FirstPageIndex);
    }

    return {
        ActivePage,
        ActivePageIndex,
        CurrentListPage,
        Pages,
        TotalListPages,
        AddPage,
        ChangeContent,
        ChangeListPage,
        ChangeTitle,
        SelectPage,
    };
}
