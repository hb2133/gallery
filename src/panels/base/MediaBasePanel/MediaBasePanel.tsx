'use client';

import Link from 'next/link';
import { PanelLayerHost } from '@/app/panel_layer/PanelLayerHost';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import { MediaPostComposerLayeredPanel } from '@/panels/layered/MediaPostComposerLayeredPanel/MediaPostComposerLayeredPanel';
import { MediaGridColumnsLayeredPanel } from '@/panels/layered/MediaGridColumnsLayeredPanel/MediaGridColumnsLayeredPanel';
import { MediaVideoDetailLayeredPanel } from '@/panels/layered/MediaVideoDetailLayeredPanel/MediaVideoDetailLayeredPanel';
import { PageCustomizationLayeredPanel } from '@/panels/layered/PageCustomizationLayeredPanel/PageCustomizationLayeredPanel';
import { PhotoPageCustomizationLayeredPanel } from '@/panels/layered/PhotoPageCustomizationLayeredPanel/PhotoPageCustomizationLayeredPanel';
import { useMediaBasePanelController } from './controller/MediaBasePanelController';
import { MediaArchiveSection } from './sections/MediaArchiveSection/MediaArchiveSection';
import Styles from './MediaBasePanel.module.css';

export function MediaBasePanel()
{
    const Controller = useMediaBasePanelController();

    return (
        <main className={Styles.Page} data-ue-page="MediaBasePanel">
            <header className={Styles.Header}>
                <AdminBrand
                    ClassName={Styles.Brand}
                    HomeHref="/"
                    OnOpenCustomization={Controller.OpenCustomization}
                    CustomizationLabel="영상 페이지 설정 열기"
                />
                <Link href="/" className={Styles.BackLink}>
                    Back ↖
                </Link>
            </header>
            <MediaArchiveSection
                ActiveCategory={Controller.ActiveCategory}
                Categories={[
                    '전체',
                    ...Controller.PageCustomization.Categories,
                ]}
                CategoryNotice={Controller.CategoryNotice}
                Items={Controller.Items}
                VisibleItems={Controller.VisibleItems}
                DraggedItemId={Controller.DraggedItemId}
                IsAuthenticated={Controller.IsAuthenticated}
                IsCategoryEditorOpen={
                    Controller.IsCategoryEditorOpen
                }
                IsCategorySaving={Controller.IsCategorySaving}
                IsManaging={Controller.IsManaging}
                IsOrderSaving={Controller.IsOrderSaving}
                ManagementNotice={Controller.ManagementNotice}
                NewCategoryName={Controller.NewCategoryName}
                PageCustomization={Controller.PageCustomization}
                OnCloseCategoryEditor={
                    Controller.CloseCategoryEditor
                }
                OnCreateCategory={Controller.CreateCategory}
                OnDeleteCategory={Controller.DeleteCategory}
                OnRenameCategory={Controller.RenameCategory}
                OnOpenItem={Controller.OpenDetail}
                OnOpenCategoryEditor={
                    Controller.OpenCategoryEditor
                }
                OnSelectCategory={Controller.SelectCategory}
                OnSetNewCategoryName={
                    Controller.SetNewCategoryName
                }
                OnOpenComposer={Controller.OpenComposer}
                OnOpenEditor={Controller.OpenEditor}
                OnStartItemDrag={Controller.StartItemDrag}
                OnMoveItemDrag={Controller.MoveItemDrag}
                OnEndItemDrag={Controller.EndItemDrag}
            />

            <PanelLayerHost>
                {Controller.OpenItem !== null ? (
                    <MediaVideoDetailLayeredPanel
                        Item={Controller.OpenItem}
                        OnRequestClose={Controller.CloseDetail}
                    />
                ) : null}
                {Controller.IsComposerOpen ? (
                    <MediaPostComposerLayeredPanel
                        key={Controller.EditingItem?.Id ?? 'new-media-post'}
                        Categories={
                            Controller.PageCustomization.Categories
                        }
                        EditingItem={Controller.EditingItem}
                        IsSaving={Controller.IsSaving}
                        Notice={Controller.Notice}
                        OnDelete={Controller.DeleteEditingPost}
                        OnRequestClose={Controller.CloseComposer}
                        OnSubmit={Controller.PublishPost}
                    />
                ) : null}
                {Controller.CustomizationView === 'menu' ? (
                    <PageCustomizationLayeredPanel
                        Kind="media"
                        OnRequestClose={Controller.CloseCustomization}
                        OnSelectOption={Controller.OpenCustomizationOption}
                    />
                ) : null}
                {Controller.CustomizationView === 'heading' ? (
                    <PhotoPageCustomizationLayeredPanel
                        Kind="media"
                        Description={
                            Controller.DraftPageCustomization.Description
                        }
                        Heading={
                            Controller.DraftPageCustomization.Heading
                        }
                        IsSaving={Controller.IsCustomizationSaving}
                        Notice={Controller.CustomizationNotice}
                        OnChange={(Update) =>
                            Controller.UpdatePageCustomization(
                                'Heading',
                                Update,
                            )
                        }
                        OnChangeDescription={(Update) =>
                            Controller.UpdatePageCustomization(
                                'Description',
                                Update,
                            )
                        }
                        OnBack={Controller.ReturnToCustomizationMenu}
                        OnRequestClose={Controller.CloseCustomization}
                        OnSave={Controller.SavePageCustomization}
                    />
                ) : null}
                {Controller.CustomizationView === 'grid' ? (
                    <MediaGridColumnsLayeredPanel
                        GridColumns={
                            Controller.DraftPageCustomization.GridColumns
                        }
                        IsSaving={Controller.IsCustomizationSaving}
                        Notice={Controller.CustomizationNotice}
                        OnBack={Controller.ReturnToCustomizationMenu}
                        OnChange={Controller.UpdateGridColumns}
                        OnRequestClose={Controller.CloseCustomization}
                        OnSave={Controller.SavePageCustomization}
                    />
                ) : null}
            </PanelLayerHost>
        </main>
    );
}
