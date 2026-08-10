'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { PanelLayerHost } from '@/app/panel_layer/PanelLayerHost';
import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import { FormatArchiveIndex } from '@/core/date/ArchiveYearRange';
import { ImageDetailLayeredPanel } from '@/panels/layered/ImageDetailLayeredPanel/ImageDetailLayeredPanel';
import { PageCustomizationLayeredPanel } from '@/panels/layered/PageCustomizationLayeredPanel/PageCustomizationLayeredPanel';
import { PhotoCardEditorLayeredPanel } from '@/panels/layered/PhotoCardEditorLayeredPanel/PhotoCardEditorLayeredPanel';
import { PhotoPostComposerLayeredPanel } from '@/panels/layered/PhotoPostComposerLayeredPanel/PhotoPostComposerLayeredPanel';
import { PhotoPasswordLayeredPanel } from '@/panels/layered/PhotoPasswordLayeredPanel/PhotoPasswordLayeredPanel';
import { PhotoPageCustomizationLayeredPanel } from '@/panels/layered/PhotoPageCustomizationLayeredPanel/PhotoPageCustomizationLayeredPanel';
import { useGalleryIndexBasePanelController } from './controller/GalleryIndexBasePanelController';
import Styles from './GalleryIndexBasePanel.module.css';

interface PhotoHeadingStyle extends CSSProperties
{
    '--photo-heading-size': string;
}

export function GalleryIndexBasePanel()
{
    const Controller = useGalleryIndexBasePanelController();
    const [EditingCategory, SetEditingCategory] =
        useState<string | null>(null);
    const [CategoryDraft, SetCategoryDraft] = useState('');

    async function CommitCategoryRename(Category: string)
    {
        if(await Controller.RenameCategory(Category, CategoryDraft))
        {
            SetEditingCategory(null);
        }
    }

    const HeadingStyle: PhotoHeadingStyle = {
        '--photo-heading-size':
            `${Controller.PhotoPageHeading.Size}px`,
        color:
            Controller.PhotoPageHeading.Color
            ?? 'var(--ink)',
    };
    const DescriptionStyle: CSSProperties = {
        color:
            Controller.PhotoPageDescription.Color
            ?? 'var(--muted)',
        fontSize:
            `${Controller.PhotoPageDescription.Size}px`,
    };
    return (
        <main className={Styles.Page}>
            <header className={Styles.Header}>
                <AdminBrand
                    ClassName={Styles.Brand}
                    OnOpenCustomization={
                        Controller.OpenCustomization
                    }
                    CustomizationLabel="사진 페이지 설정 열기"
                />
                <Link href="/" className={Styles.BackLink}>
                    Back ↖
                </Link>
            </header>

            <section
                className={Styles.IndexSection}
                data-ue-component="GalleryIndexSection"
                data-ue-root
            >
                <div className={Styles.Heading}>
                    <p>
                        {FormatArchiveIndex(
                            Controller.PhotoPosts.map(
                                (Item) => Item.Date,
                            ),
                        )}
                    </p>
                    <h1 style={HeadingStyle}>
                        {Controller.PhotoPageHeading.Text}
                    </h1>
                    <span style={DescriptionStyle}>
                        {Controller.PhotoPageDescription.Text}
                    </span>
                </div>

                <nav className={Styles.CategoryBar} aria-label="사진 세부 분류">
                    {Controller.Categories.map((Category) => (
                        <div
                            key={Category}
                            className={Styles.CategoryItem}
                        >
                            {EditingCategory === Category ? (
                                <form
                                    className={
                                        Styles.CategoryRenameForm
                                    }
                                    onSubmit={(Event) =>
                                    {
                                        Event.preventDefault();
                                        void CommitCategoryRename(
                                            Category,
                                        );
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={CategoryDraft}
                                        maxLength={20}
                                        disabled={
                                            Controller.IsCategorySaving
                                        }
                                        autoFocus
                                        aria-label={`${Category} 카테고리 이름 변경`}
                                        onChange={(Event) =>
                                            SetCategoryDraft(
                                                Event.currentTarget.value,
                                            )
                                        }
                                        onBlur={() =>
                                            void CommitCategoryRename(
                                                Category,
                                            )
                                        }
                                        onKeyDown={(Event) =>
                                        {
                                            if(Event.key === 'Escape')
                                            {
                                                SetEditingCategory(null);
                                            }
                                        }}
                                    />
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    className={`${Styles.CategoryButton} ${
                                        Category
                                        === Controller.ActiveCategory
                                            ? Styles.CategoryActive
                                            : ''
                                    }`}
                                    onClick={() =>
                                        Controller.SelectCategory(
                                            Category,
                                        )
                                    }
                                    onDoubleClick={() =>
                                    {
                                        if(
                                            Controller.IsAuthenticated
                                            && Category !== '전체'
                                        )
                                        {
                                            Controller.SelectCategory(
                                                Category,
                                            );
                                            SetCategoryDraft(Category);
                                            SetEditingCategory(Category);
                                        }
                                    }}
                                    title={
                                        Controller.IsAuthenticated
                                        && Category !== '전체'
                                            ? '더블클릭하여 이름 변경'
                                            : undefined
                                    }
                                    aria-pressed={
                                        Category
                                        === Controller.ActiveCategory
                                    }
                                >
                                    {Category}
                                </button>
                            )}
                            {Controller.IsAuthenticated
                                && Category !== '전체' ? (
                                    <button
                                        type="button"
                                        className={
                                            Styles.CategoryDeleteButton
                                        }
                                        disabled={
                                            Controller
                                                .IsCategorySaving
                                        }
                                        onClick={() =>
                                            void Controller
                                                .DeleteCategory(
                                                    Category,
                                                )
                                        }
                                        aria-label={`${Category} 카테고리 삭제`}
                                    >
                                        ×
                                    </button>
                                ) : null}
                        </div>
                    ))}
                    {Controller.IsAuthenticated ? (
                        Controller.IsCategoryEditorOpen ? (
                            <form
                                className={Styles.CategoryAddForm}
                                onSubmit={(Event) =>
                                {
                                    Event.preventDefault();
                                    void Controller.CreateCategory();
                                }}
                            >
                                <input
                                    type="text"
                                    value={
                                        Controller.NewCategoryName
                                    }
                                    maxLength={20}
                                    disabled={
                                        Controller.IsCategorySaving
                                    }
                                    autoFocus
                                    placeholder="새 카테고리"
                                    aria-label="새 사진 카테고리 이름"
                                    onChange={(Event) =>
                                        Controller.SetNewCategoryName(
                                            Event.currentTarget.value,
                                        )
                                    }
                                    onKeyDown={(Event) =>
                                    {
                                        if(Event.key === 'Escape')
                                        {
                                            Controller
                                                .CloseCategoryEditor();
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={
                                        Controller.IsCategorySaving
                                    }
                                >
                                    추가
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        Controller.IsCategorySaving
                                    }
                                    onClick={
                                        Controller.CloseCategoryEditor
                                    }
                                    aria-label="카테고리 추가 취소"
                                >
                                    ×
                                </button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                className={Styles.CategoryAddButton}
                                onClick={
                                    Controller.OpenCategoryEditor
                                }
                                disabled={
                                    Controller.IsCategorySaving
                                }
                                aria-label="사진 카테고리 추가"
                            >
                                +
                            </button>
                        )
                    ) : null}
                    {Controller.IsAuthenticated ? (
                        <div className={Styles.PostAdminToolbar}>
                            <button
                                type="button"
                                className={Styles.NewPostButton}
                                onClick={Controller.OpenPostComposer}
                                disabled={Controller.IsPostSaving}
                            >
                                글쓰기
                            </button>
                        </div>
                    ) : null}
                </nav>
                {Controller.CategoryNotice ? (
                    <p
                        className={Styles.CategoryNotice}
                        role="status"
                    >
                        {Controller.CategoryNotice}
                    </p>
                ) : null}
                {Controller.ManagementNotice ? (
                    <p
                        className={Styles.ManagementNotice}
                        role="status"
                    >
                        {Controller.ManagementNotice}
                    </p>
                ) : null}

                <div className={Styles.Grid}>
                    {Controller.VisibleItems.map((Item) =>
                    {
                        const Customization =
                            Controller.GetCardCustomization(Item);

                        return (
                            <article
                                key={Item.Id}
                                className={Styles.Card}
                                data-dragging={
                                    Controller.DraggedItemId === Item.Id
                                }
                                draggable={
                                    Controller.IsAuthenticated
                                    && Controller.IsManaging
                                    && Controller.IsOrderSaving === false
                                    && Controller.CanManageItem(Item.Id)
                                }
                                onDragStart={() =>
                                    Controller.StartItemDrag(Item.Id)
                                }
                                onDragEnter={() =>
                                    Controller.MoveItemDrag(Item.Id)
                                }
                                onDragOver={(Event) =>
                                    Event.preventDefault()
                                }
                                onDragEnd={() =>
                                    void Controller.EndItemDrag()
                                }
                            >
                                <button
                                    type="button"
                                    className={
                                        Styles.CardOpenButton
                                    }
                                    onClick={() =>
                                        Controller
                                            .OpenProjectDetail(Item)
                                    }
                                    aria-label={`${Item.Title} 상세 보기`}
                                />
                                {Controller.IsManaging
                                && Controller.CanManageItem(Item.Id) ? (
                                    <button
                                        type="button"
                                        className={Styles.CardAdminEditButton}
                                        onClick={() =>
                                            Controller.OpenCardEditor(Item)
                                        }
                                    >
                                        편집
                                    </button>
                                ) : null}
                                {Controller.IsAuthenticated
                                && Customization.IsPrivate ? (
                                    <span
                                        className={
                                            Styles.PrivateBadge
                                        }
                                        role="img"
                                        aria-label="비공개 게시글"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.4A10.8 10.8 0 0 1 12 4c5.5 0 9 5.2 9 5.2a15.7 15.7 0 0 1-2.2 2.6M6.2 6.2A16.7 16.7 0 0 0 3 9.2S6.5 14.5 12 14.5c.7 0 1.4-.1 2-.3" />
                                        </svg>
                                    </span>
                                ) : null}
                                <div className={Styles.CardImage}>
                                    <Image
                                        src={
                                            Customization
                                                .ThumbnailUrl
                                        }
                                        alt={Item.Alt}
                                        fill
                                        sizes="(max-width: 760px) 100vw, 33vw"
                                        unoptimized
                                    />
                                    {Customization.TextLayers.map(
                                        (Layer) => (
                                            <span
                                                key={Layer.Id}
                                                className={
                                                    Styles.CardTitle
                                                }
                                                style={{
                                                    color:
                                                        Layer.Color,
                                                    fontFamily:
                                                        Layer
                                                            .FontFamily,
                                                    fontSize:
                                                        `${Layer.FontSize}px`,
                                                    fontWeight:
                                                        Layer.FontWeight,
                                                    left:
                                                        `${Layer.X}%`,
                                                    top:
                                                        `${Layer.Y}%`,
                                                }}
                                            >
                                                {Layer.Text}
                                            </span>
                                        ),
                                    )}
                                </div>
                                {Controller.IsManaging
                                && Controller.CanManageItem(Item.Id) ? (
                                    <div
                                        className={Styles.CardAdminActions}
                                    >
                                        <span aria-hidden="true">
                                            ⠿ 드래그
                                        </span>
                                    </div>
                                ) : null}
                            </article>
                        );
                    })}
                </div>
            </section>

            <PanelLayerHost>
                {Controller.PasswordPromptItem !== null ? (
                    <PhotoPasswordLayeredPanel
                        PostTitle={
                            Controller.PasswordPromptItem.Title
                            || '사진 게시글'
                        }
                        IsSubmitting={
                            Controller.IsPasswordUnlocking
                        }
                        Notice={Controller.PasswordUnlockNotice}
                        OnRequestClose={
                            Controller.ClosePasswordPrompt
                        }
                        OnSubmit={
                            Controller.UnlockProtectedPhotoPost
                        }
                    />
                ) : null}
                {Controller.OpenProject !== null ? (
                    <ImageDetailLayeredPanel
                        Project={Controller.OpenProject}
                        ActiveImageIndex={Controller.ActiveImageIndex}
                        NavigationDirection={
                            Controller.ImageNavigationDirection
                        }
                        ViewMode={Controller.ActiveViewMode}
                        OnRequestClose={Controller.CloseProjectDetail}
                        OnPrevious={Controller.OpenPreviousImage}
                        OnNext={Controller.OpenNextImage}
                        OnSelectImage={Controller.SelectImage}
                        OnChangeViewMode={Controller.ChangeViewMode}
                    />
                ) : null}
                {Controller.CustomizationView === 'menu' ? (
                    <PageCustomizationLayeredPanel
                        Kind="photo"
                        OnRequestClose={
                            Controller.CloseCustomization
                        }
                        OnSelectOption={
                            Controller.OpenCustomizationOption
                        }
                    />
                ) : null}
                {Controller.CustomizationView === 'heading' ? (
                    <PhotoPageCustomizationLayeredPanel
                        Description={
                            Controller.DraftPhotoPageDescription
                        }
                        Heading={
                            Controller.DraftPhotoPageHeading
                        }
                        IsSaving={
                            Controller.IsPhotoPageHeadingSaving
                        }
                        Notice={
                            Controller.PhotoPageHeadingNotice
                        }
                        OnChange={
                            Controller.UpdatePhotoPageHeading
                        }
                        OnChangeDescription={
                            Controller.UpdatePhotoPageDescription
                        }
                        OnBack={
                            Controller.ReturnToCustomizationMenu
                        }
                        OnRequestClose={
                            Controller.CloseCustomization
                        }
                        OnSave={
                            Controller
                                .SavePhotoPageHeadingCustomization
                        }
                    />
                ) : null}
                {Controller.EditingItem !== null ? (
                    <PhotoCardEditorLayeredPanel
                        key={Controller.EditingItem.Id}
                        Categories={
                            Controller.Categories.slice(1)
                        }
                        ContentImageLayout={
                            Controller.EditingItem.ImageLayout
                            ?? Controller.EditingItem.ImagePaths.map(
                                (ImagePath, ImageIndex) => ({
                                    ForwardDirection:
                                        ImageIndex ===
                                        (
                                            Controller.EditingItem
                                                ?.ImagePaths.length
                                            ?? 0
                                        ) - 1
                                            ? null
                                            : 'right',
                                    ImagePath,
                                    X: ImageIndex % 5,
                                    Y: Math.floor(
                                        ImageIndex / 5,
                                    ),
                                }),
                            )
                        }
                        Customization={
                            Controller.GetCardCustomization(
                                Controller.EditingItem,
                            )
                        }
                        EnabledViewModes={
                            Controller.EditingItem.EnabledViewModes
                        }
                        ExistingPassword={Controller.EditingPassword}
                        IsPasswordLoading={
                            Controller.IsEditingPasswordLoading
                        }
                        IsSaving={Controller.IsCardSaving}
                        Notice={Controller.CardEditorNotice}
                        OnCopy={Controller.CopyPhotoPost}
                        OnRequestClose={
                            Controller.CloseCardEditor
                        }
                        OnDelete={Controller.DeleteCard}
                        OnSave={
                            Controller.SaveCardCustomization
                        }
                    />
                ) : null}
                {Controller.IsPostComposerOpen ? (
                    <PhotoPostComposerLayeredPanel
                        Categories={
                            Controller.Categories.slice(1)
                        }
                        CopyData={Controller.CopiedPhotoPost}
                        IsSaving={Controller.IsPostSaving}
                        Notice={Controller.PostComposerNotice}
                        OnRequestClose={
                            Controller.ClosePostComposer
                        }
                        OnSubmit={
                            Controller.PublishPhotoPost
                        }
                    />
                ) : null}
            </PanelLayerHost>
        </main>
    );
}
