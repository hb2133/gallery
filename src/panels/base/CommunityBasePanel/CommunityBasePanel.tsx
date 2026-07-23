'use client';

import Link from 'next/link';
import { useCommunityBasePanelController } from './controller/CommunityBasePanelController';
import { CommunityFeedSection } from './sections/CommunityFeedSection/CommunityFeedSection';
import Styles from './CommunityBasePanel.module.css';

export function CommunityBasePanel()
{
    const Controller = useCommunityBasePanelController();

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

            <CommunityFeedSection
                ActivePhotoIndex={Controller.ActivePhotoIndex}
                OnPreviousPhoto={Controller.ShowPreviousPhoto}
                OnNextPhoto={Controller.ShowNextPhoto}
                OnSelectPhoto={Controller.ShowPhoto}
            />
        </main>
    );
}
