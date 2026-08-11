'use client';

import Link from 'next/link';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import { WritingPostEditorLayeredPanel } from '@/panels/layered/WritingPostEditorLayeredPanel/WritingPostEditorLayeredPanel';
import { useWritingBasePanelController } from './controller/WritingBasePanelController';
import { WritingArchiveSection } from './sections/WritingArchiveSection/WritingArchiveSection';
import Styles from './WritingBasePanel.module.css';

export function WritingBasePanel()
{
    const Controller = useWritingBasePanelController();

    return (
        <main className={Styles.Page} data-ue-page="WritingBasePanel">
            <header className={Styles.Header}>
                <AdminBrand ClassName={Styles.Brand} />
                <Link href="/" className={Styles.BackLink}>
                    Back ↖
                </Link>
            </header>
            <WritingArchiveSection Controller={Controller} />
            {Controller.IsPostEditorOpen ? (
                <WritingPostEditorLayeredPanel
                    Article={Controller.EditingArticle}
                    Categories={Controller.Categories.slice(1)}
                    IsSaving={Controller.IsPostSaving}
                    Notice={Controller.PostEditorNotice}
                    OnRequestClose={Controller.ClosePostEditor}
                    OnSave={Controller.SavePost}
                />
            ) : null}
        </main>
    );
}
