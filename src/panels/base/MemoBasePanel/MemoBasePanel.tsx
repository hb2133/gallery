'use client';

import Link from 'next/link';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import { ArchiveStrings } from '@/core/localization/ArchiveStrings';
import { useMemoBasePanelController } from './controller/MemoBasePanelController';
import { MemoBookSection } from './sections/MemoBookSection/MemoBookSection';
import Styles from './MemoBasePanel.module.css';

export function MemoBasePanel()
{
    const Controller = useMemoBasePanelController();

    return (
        <main className={Styles.Page} data-ue-page="MemoBasePanel">
            <header className={Styles.Header}>
                <AdminBrand ClassName={Styles.Brand} />
                <Link href="/" className={Styles.BackLink}>
                    {ArchiveStrings.Common.BackToIndex} ↖
                </Link>
            </header>
            <MemoBookSection
                ActivePage={Controller.ActivePage}
                ActivePageIndex={Controller.ActivePageIndex}
                CurrentListPage={Controller.CurrentListPage}
                Pages={Controller.Pages}
                TotalListPages={Controller.TotalListPages}
                OnAddPage={Controller.AddPage}
                OnChangeContent={Controller.ChangeContent}
                OnChangeListPage={Controller.ChangeListPage}
                OnChangeTitle={Controller.ChangeTitle}
                OnSelectPage={Controller.SelectPage}
            />
        </main>
    );
}
