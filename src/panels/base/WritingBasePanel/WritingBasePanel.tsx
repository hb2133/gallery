'use client';

import Link from 'next/link';
import { PanelLayerHost } from '@/app/panel_layer/PanelLayerHost';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import { NoticeToast } from '@/components/NoticeToast/NoticeToast';
import { PageCustomizationLayeredPanel } from '@/panels/layered/PageCustomizationLayeredPanel/PageCustomizationLayeredPanel';
import { PhotoPageCustomizationLayeredPanel } from '@/panels/layered/PhotoPageCustomizationLayeredPanel/PhotoPageCustomizationLayeredPanel';
import { WritingPostEditorLayeredPanel } from '@/panels/layered/WritingPostEditorLayeredPanel/WritingPostEditorLayeredPanel';
import { PhotoPasswordLayeredPanel } from '@/panels/layered/PhotoPasswordLayeredPanel/PhotoPasswordLayeredPanel';
import { WritingReaderLayeredPanel } from '@/panels/layered/WritingReaderLayeredPanel/WritingReaderLayeredPanel';
import { useWritingBasePanelController } from './controller/WritingBasePanelController';
import {
    WritingArchiveSection,
    WritingReader,
} from './sections/WritingArchiveSection/WritingArchiveSection';
import Styles from './WritingBasePanel.module.css';

export function WritingBasePanel()
{
    const Controller = useWritingBasePanelController();

    return (
        <main className={Styles.Page} data-ue-page="WritingBasePanel">
            <header className={Styles.Header}>
                <AdminBrand
                    ClassName={Styles.Brand}
                    OnOpenCustomization={Controller.OpenCustomization}
                    CustomizationLabel="글 페이지 설정 열기"
                />
                <Link href="/" className={Styles.BackLink}>
                    Back ↖
                </Link>
            </header>
            <WritingArchiveSection Controller={Controller} />
            <NoticeToast
                Message={
                    Controller.PasswordUnlockNotice
                    || Controller.WritingPageHeadingNotice
                }
            />
            <PanelLayerHost>
                {Controller.CustomizationView === 'menu' ? (
                    <PageCustomizationLayeredPanel
                        Kind="writing"
                        OnRequestClose={Controller.CloseCustomization}
                        OnSelectOption={Controller.OpenCustomizationOption}
                    />
                ) : null}
                {Controller.CustomizationView === 'heading' ? (
                    <PhotoPageCustomizationLayeredPanel
                        Kind="writing"
                        Description={Controller.DraftWritingPageDescription}
                        Heading={Controller.DraftWritingPageHeading}
                        IsSaving={Controller.IsWritingPageHeadingSaving}
                        Notice=""
                        OnChange={Controller.UpdateWritingPageHeading}
                        OnChangeDescription={Controller.UpdateWritingPageDescription}
                        OnBack={Controller.ReturnToCustomizationMenu}
                        OnRequestClose={Controller.CloseCustomization}
                        OnSave={Controller.SaveWritingPageHeadingCustomization}
                    />
                ) : null}
                {Controller.ReaderArticle !== null ? (
                    <WritingReaderLayeredPanel
                        IsBookView={Controller.ViewMode !== 'scroll'}
                        IsBookViewEnabled={
                            Controller.ReaderArticle.EnabledViewModes
                                ?.includes('book') ?? true
                        }
                        IsSpatialViewEnabled={
                            Controller.ReaderArticle.EnabledViewModes
                                ?.includes('scroll') ?? true
                        }
                        OnRequestClose={Controller.CloseReader}
                        OnSelectBookView={() =>
                            Controller.ChangeViewMode('spread')
                        }
                        OnSelectSpatialView={() =>
                            Controller.ChangeViewMode('scroll')
                        }
                    >
                        <WritingReader Controller={Controller} />
                    </WritingReaderLayeredPanel>
                ) : null}
                {Controller.PasswordPromptArticle !== null ? (
                    <PhotoPasswordLayeredPanel
                        PostTitle={Controller.PasswordPromptArticle.Title}
                        IsSubmitting={Controller.IsPasswordUnlocking}
                        Notice=""
                        OnRequestClose={Controller.ClosePasswordPrompt}
                        OnSubmit={Controller.UnlockProtectedWritingPost}
                    />
                ) : null}
                {Controller.IsPostEditorOpen ? (
                    <WritingPostEditorLayeredPanel
                        Article={Controller.EditingArticle}
                        Categories={Controller.Categories.slice(1)}
                        CopyData={Controller.CopiedWritingPost}
                        ExistingPassword={Controller.EditingPassword}
                        IsSaving={Controller.IsPostSaving}
                        Notice={Controller.PostEditorNotice}
                        OnCopy={Controller.CopyPost}
                        OnDelete={Controller.DeletePost}
                        OnRequestClose={Controller.ClosePostEditor}
                        OnSave={Controller.SavePost}
                    />
                ) : null}
            </PanelLayerHost>
        </main>
    );
}
