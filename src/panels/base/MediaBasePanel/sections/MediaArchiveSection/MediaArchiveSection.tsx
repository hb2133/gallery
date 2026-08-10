import {
    useState,
    type CSSProperties,
    type SyntheticEvent,
} from 'react';
import { FormatArchiveIndex } from '@/core/date/ArchiveYearRange';
import { GetMediaPreviewRange } from '@/panels/base/MediaBasePanel/controller/MediaBasePanelState';
import type { MediaArchiveItem } from '@/panels/base/MediaBasePanel/controller/MediaBasePanelTypes';
import type { MediaPageCustomization } from '@/panels/base/MediaBasePanel/controller/MediaBasePanelState';
import Styles from '@/panels/base/MediaBasePanel/MediaBasePanel.module.css';

interface MediaArchiveSectionProps
{
    ActiveCategory: string;
    Categories: string[];
    CategoryNotice: string;
    DraggedItemId: string | null;
    IsAuthenticated: boolean;
    IsCategoryEditorOpen: boolean;
    IsCategorySaving: boolean;
    IsManaging: boolean;
    IsOrderSaving: boolean;
    Items: MediaArchiveItem[];
    VisibleItems: MediaArchiveItem[];
    ManagementNotice: string;
    NewCategoryName: string;
    PageCustomization: MediaPageCustomization;
    OnCloseCategoryEditor: () => void;
    OnCreateCategory: () => Promise<void>;
    OnDeleteCategory: (Category: string) => Promise<void>;
    OnRenameCategory: (
        CurrentName: string,
        NextName: string,
    ) => Promise<boolean>;
    OnEndItemDrag: () => void;
    OnMoveItemDrag: (ItemId: string) => void;
    OnOpenComposer: () => void;
    OnOpenCategoryEditor: () => void;
    OnOpenEditor: (Item: MediaArchiveItem) => void;
    OnOpenItem: (Item: MediaArchiveItem) => void;
    OnSelectCategory: (Category: string) => void;
    OnSetNewCategoryName: (Value: string) => void;
    OnStartItemDrag: (ItemId: string) => void;
}

interface MediaHeadingStyle extends CSSProperties
{
    '--media-heading-size': string;
}

interface MediaGridStyle extends CSSProperties
{
    '--media-grid-columns': number;
}

function StartVideoPreview(
    Event: SyntheticEvent<HTMLVideoElement>,
)
{
    const Video = Event.currentTarget;
    const [Start, End] = GetMediaPreviewRange(Video.duration);
    Video.dataset.previewStart = String(Start);
    Video.dataset.previewEnd = String(End);
    Video.currentTime = Start;
}

function LoopVideoPreview(
    Event: SyntheticEvent<HTMLVideoElement>,
)
{
    const Video = Event.currentTarget;
    const Start = Number(Video.dataset.previewStart ?? 0);
    const End = Number(Video.dataset.previewEnd ?? Video.duration);

    if(Video.currentTime >= End)
    {
        Video.currentTime = Start;
    }
}

export function MediaArchiveSection(
    Props: MediaArchiveSectionProps,
)
{
    const [EditingCategory, SetEditingCategory] =
        useState<string | null>(null);
    const [CategoryDraft, SetCategoryDraft] = useState('');

    async function CommitCategoryRename(Category: string)
    {
        if(await Props.OnRenameCategory(Category, CategoryDraft))
        {
            SetEditingCategory(null);
        }
    }

    const HeadingStyle: MediaHeadingStyle = {
        '--media-heading-size':
            `${Props.PageCustomization.Heading.Size}px`,
        color:
            Props.PageCustomization.Heading.Color
            ?? 'var(--ink)',
    };
    const DescriptionStyle: CSSProperties = {
        color:
            Props.PageCustomization.Description.Color
            ?? 'var(--muted)',
        fontSize:
            `${Props.PageCustomization.Description.Size}px`,
    };
    const GridStyle: MediaGridStyle = {
        '--media-grid-columns':
            Props.PageCustomization.GridColumns,
    };

    return (
        <section
            className={Styles.Archive}
            data-ue-component="MediaArchiveSection"
            data-ue-root
        >
            <div className={Styles.Masthead}>
                <div className={Styles.MastheadTitle}>
                    <p className={Styles.Eyebrow}>
                        {FormatArchiveIndex(
                            Props.Items.map((Item) => Item.Date),
                        )}
                    </p>
                    <h1 style={HeadingStyle}>
                        {Props.PageCustomization.Heading.Text}
                    </h1>
                </div>
                <div className={Styles.MastheadAside}>
                    <p
                        className={Styles.Introduction}
                        style={DescriptionStyle}
                    >
                        {Props.PageCustomization.Description.Text}
                    </p>
                    {Props.IsAuthenticated ? (
                        <div className={Styles.AdminToolbar}>
                            <button
                                type="button"
                                onClick={Props.OnOpenComposer}
                            >
                                글쓰기
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            <nav
                className={Styles.CategoryBar}
                aria-label="영상 세부 분류"
            >
                {Props.Categories.map((Category) => (
                    <div
                        key={Category}
                        className={Styles.CategoryItem}
                    >
                        {EditingCategory === Category ? (
                            <form
                                className={Styles.CategoryRenameForm}
                                onSubmit={(Event) =>
                                {
                                    Event.preventDefault();
                                    void CommitCategoryRename(Category);
                                }}
                            >
                                <input
                                    type="text"
                                    value={CategoryDraft}
                                    maxLength={20}
                                    disabled={Props.IsCategorySaving}
                                    autoFocus
                                    aria-label={`${Category} 카테고리 이름 변경`}
                                    onChange={(Event) =>
                                        SetCategoryDraft(
                                            Event.currentTarget.value,
                                        )
                                    }
                                    onBlur={() =>
                                        void CommitCategoryRename(Category)
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
                                    Category === Props.ActiveCategory
                                        ? Styles.CategoryActive
                                        : ''
                                }`}
                                onClick={() =>
                                    Props.OnSelectCategory(Category)
                                }
                                onDoubleClick={() =>
                                {
                                    if(
                                        Props.IsAuthenticated
                                        && Category !== '전체'
                                    )
                                    {
                                        Props.OnSelectCategory(Category);
                                        SetCategoryDraft(Category);
                                        SetEditingCategory(Category);
                                    }
                                }}
                                title={
                                    Props.IsAuthenticated
                                    && Category !== '전체'
                                        ? '더블클릭하여 이름 변경'
                                        : undefined
                                }
                                aria-pressed={
                                    Category === Props.ActiveCategory
                                }
                            >
                                {Category}
                            </button>
                        )}
                        {Props.IsAuthenticated
                        && Category !== '전체' ? (
                            <button
                                type="button"
                                className={Styles.CategoryDeleteButton}
                                disabled={
                                    Props.IsCategorySaving
                                    || Props.Categories.length <= 2
                                }
                                onClick={() =>
                                    void Props.OnDeleteCategory(Category)
                                }
                                aria-label={`${Category} 카테고리 삭제`}
                            >
                                ×
                            </button>
                        ) : null}
                    </div>
                ))}
                {Props.IsAuthenticated ? (
                    Props.IsCategoryEditorOpen ? (
                        <form
                            className={Styles.CategoryAddForm}
                            onSubmit={(Event) =>
                            {
                                Event.preventDefault();
                                void Props.OnCreateCategory();
                            }}
                        >
                            <input
                                type="text"
                                value={Props.NewCategoryName}
                                maxLength={20}
                                disabled={Props.IsCategorySaving}
                                autoFocus
                                placeholder="새 카테고리"
                                aria-label="새 영상 카테고리 이름"
                                onChange={(Event) =>
                                    Props.OnSetNewCategoryName(
                                        Event.currentTarget.value,
                                    )
                                }
                                onKeyDown={(Event) =>
                                {
                                    if(Event.key === 'Escape')
                                    {
                                        Props.OnCloseCategoryEditor();
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={Props.IsCategorySaving}
                            >
                                추가
                            </button>
                            <button
                                type="button"
                                disabled={Props.IsCategorySaving}
                                onClick={Props.OnCloseCategoryEditor}
                                aria-label="카테고리 추가 취소"
                            >
                                ×
                            </button>
                        </form>
                    ) : (
                        <button
                            type="button"
                            className={Styles.CategoryAddButton}
                            onClick={Props.OnOpenCategoryEditor}
                            disabled={Props.IsCategorySaving}
                            aria-label="영상 카테고리 추가"
                        >
                            +
                        </button>
                    )
                ) : null}
            </nav>

            {Props.CategoryNotice ? (
                <p className={Styles.CategoryNotice} role="status">
                    {Props.CategoryNotice}
                </p>
            ) : null}

            {Props.ManagementNotice ? (
                <p className={Styles.ManagementNotice} role="status">
                    {Props.ManagementNotice}
                </p>
            ) : null}

            <div className={Styles.Grid} style={GridStyle}>
                {Props.VisibleItems.map((Item) => (
                    <article
                        key={Item.Id}
                        className={Styles.Card}
                        data-dragging={Props.DraggedItemId === Item.Id}
                        draggable={
                            Props.IsAuthenticated
                            && Props.IsManaging
                            && Props.IsOrderSaving === false
                        }
                        onDragStart={() =>
                            Props.OnStartItemDrag(Item.Id)
                        }
                        onDragEnter={() =>
                            Props.OnMoveItemDrag(Item.Id)
                        }
                        onDragOver={(Event) => Event.preventDefault()}
                        onDragEnd={() => void Props.OnEndItemDrag()}
                    >
                        <div className={Styles.Thumb}>
                            <span className={Styles.CategoryBadge}>
                                {Item.Category}
                            </span>
                            {Item.SourceType === 'youtube'
                            && Item.YouTubeId !== null ? (
                                <span
                                    className={Styles.YouTubeThumbnail}
                                    role="img"
                                    aria-label={`${Item.Title} YouTube 썸네일`}
                                    style={{
                                        backgroundImage:
                                            `url("https://i.ytimg.com/vi/${Item.YouTubeId}/mqdefault.jpg")`,
                                    }}
                                />
                            ) : (
                                <video
                                    src={Item.VideoUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    onLoadedMetadata={StartVideoPreview}
                                    onTimeUpdate={LoopVideoPreview}
                                    aria-label={`${Item.Title} 미리보기`}
                                />
                            )}
                            <button
                                type="button"
                                className={Styles.PreviewButton}
                                onClick={() => Props.OnOpenItem(Item)}
                                aria-label={`${Item.Title} 영상 재생`}
                            >
                                <span>Play</span>
                            </button>
                        </div>
                        <div className={Styles.CardMeta}>
                            <strong title={Item.Title}>
                                {Item.Title}
                            </strong>
                            <div className={Styles.CardMetaLine}>
                                <span title={Item.Content}>
                                    {Item.Content}
                                </span>
                                <time>{Item.Date}</time>
                            </div>
                        </div>
                        {Props.IsAuthenticated && Props.IsManaging ? (
                            <div className={Styles.CardAdminActions}>
                                <span aria-hidden="true">⠿ 드래그</span>
                                <button
                                    type="button"
                                    onClick={() => Props.OnOpenEditor(Item)}
                                >
                                    편집
                                </button>
                            </div>
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    );
}
