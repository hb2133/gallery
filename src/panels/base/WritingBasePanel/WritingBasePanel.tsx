'use client';

import Link from 'next/link';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
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
            <WritingArchiveSection
                ActiveArticle={Controller.ActiveArticle}
                ArchiveArticles={Controller.AllArticles}
                Articles={Controller.Articles}
                Categories={Controller.Categories}
                SearchQuery={Controller.SearchQuery}
                ActiveCategory={Controller.ActiveCategory}
                CurrentPage={Controller.CurrentPage}
                TotalPages={Controller.TotalPages}
                TotalResults={Controller.TotalResults}
                IsListCollapsed={Controller.IsListCollapsed}
                IsViewSettingsOpen={Controller.IsViewSettingsOpen}
                ReaderFont={Controller.ReaderFont}
                ReaderTone={Controller.ReaderTone}
                ReaderAlignment={Controller.ReaderAlignment}
                ReaderFontSize={Controller.ReaderFontSize}
                IsAuthenticated={Controller.IsAuthenticated}
                IsCategoryEditorOpen={
                    Controller.IsCategoryEditorOpen
                }
                IsCategorySaving={Controller.IsCategorySaving}
                NewCategoryName={Controller.NewCategoryName}
                CategoryNotice={Controller.CategoryNotice}
                DraggedArticleId={Controller.DraggedArticleId}
                IsArticleOrderSaving={
                    Controller.IsArticleOrderSaving
                }
                ArticleOrderNotice={
                    Controller.ArticleOrderNotice
                }
                IsEditing={Controller.IsEditing}
                IsEditorInsertOpen={
                    Controller.IsEditorInsertOpen
                }
                IsPostSaving={Controller.IsPostSaving}
                EditorNotice={Controller.EditorNotice}
                DraftTitle={Controller.DraftTitle}
                DraftSummary={Controller.DraftSummary}
                DraftCategory={Controller.DraftCategory}
                DraftContentHtml={
                    Controller.DraftContentHtml
                }
                DraftIsPrivate={Controller.DraftIsPrivate}
                OnSelectArticle={Controller.SelectArticle}
                OnChangeSearchQuery={Controller.ChangeSearchQuery}
                OnChangeCategory={Controller.ChangeCategory}
                OnChangePage={Controller.ChangePage}
                OnToggleList={Controller.ToggleList}
                OnToggleViewSettings={
                    Controller.ToggleViewSettings
                }
                OnChangeReaderFont={Controller.ChangeReaderFont}
                OnChangeReaderTone={Controller.ChangeReaderTone}
                OnChangeReaderAlignment={
                    Controller.ChangeReaderAlignment
                }
                OnChangeReaderFontSize={
                    Controller.ChangeReaderFontSize
                }
                OnOpenCategoryEditor={
                    Controller.OpenCategoryEditor
                }
                OnCloseCategoryEditor={
                    Controller.CloseCategoryEditor
                }
                OnChangeNewCategoryName={
                    Controller.SetNewCategoryName
                }
                OnCreateCategory={Controller.CreateCategory}
                OnDeleteCategory={Controller.DeleteCategory}
                OnRenameCategory={Controller.RenameCategory}
                OnStartArticleDrag={
                    Controller.StartArticleDrag
                }
                OnMoveArticleDrag={
                    Controller.MoveArticleDrag
                }
                OnDropArticle={Controller.DropArticle}
                OnEndArticleDrag={Controller.EndArticleDrag}
                OnOpenEditor={Controller.OpenEditor}
                OnCloseEditor={Controller.CloseEditor}
                OnSaveEditor={Controller.SaveEditor}
                OnChangeDraftTitle={Controller.SetDraftTitle}
                OnChangeDraftSummary={
                    Controller.SetDraftSummary
                }
                OnChangeDraftCategory={
                    Controller.SetDraftCategory
                }
                OnChangeDraftIsPrivate={
                    Controller.SetDraftIsPrivate
                }
                OnToggleEditorInsert={
                    Controller.ToggleEditorInsert
                }
                OnExecuteEditorCommand={
                    Controller.ExecuteEditorCommand
                }
                OnInsertExternalLink={
                    Controller.InsertExternalLink
                }
                OnUploadEditorAssets={
                    Controller.UploadEditorAssets
                }
            />
        </main>
    );
}
