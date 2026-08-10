'use client';

import Link from 'next/link';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import { useCommunityBasePanelController } from './controller/CommunityBasePanelController';
import { CommunityFeedSection } from './sections/CommunityFeedSection/CommunityFeedSection';
import Styles from './CommunityBasePanel.module.css';

export function CommunityBasePanel()
{
    const Controller = useCommunityBasePanelController();

    return (
        <main className={Styles.Page}>
            <header className={Styles.Header}>
                <AdminBrand ClassName={Styles.Brand} />
                <Link href="/" className={Styles.BackLink}>
                    Back to index ↖
                </Link>
            </header>

            <CommunityFeedSection
                ActivePhotoIndex={Controller.ActivePhotoIndex}
                OnPreviousPhoto={Controller.ShowPreviousPhoto}
                OnNextPhoto={Controller.ShowNextPhoto}
                OnSelectPhoto={Controller.ShowPhoto}
            />
        </main>
    );
}
