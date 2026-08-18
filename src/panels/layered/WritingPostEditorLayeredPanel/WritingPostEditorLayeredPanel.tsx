'use client';

import {
    useEffect,
    useState,
    type DragEvent,
    type FormEvent,
} from 'react';
import { NoticeToast } from '@/components/NoticeToast/NoticeToast';
import { PhotoPageNumberStyleControl } from '@/components/PhotoPageNumberStyleControl/PhotoPageNumberStyleControl';
import { PhotoViewModeSelector } from '@/components/PhotoViewModeSelector/PhotoViewModeSelector';
import { CreateUniqueId } from '@/core/identity/UniqueId';
import {
    GetOppositePhotoPageDirection,
    NormalizePhotoPageDirectionSequence,
    PhotoPageDirections,
    type PhotoPageDirection,
} from '@/core/navigation/PhotoPageDirection';
import type { PhotoCardTextLayer } from '@/managers/PhotoCardCustomizationManager';
import type {
    WritingArticle,
    WritingEnabledViewMode,
} from '@/panels/base/WritingBasePanel/controller/WritingBasePanelTypes';
import { ThumbnailEditorSection } from '@/panels/layered/PhotoPostComposerLayeredPanel/sections/ThumbnailEditorSection';
import Styles from './WritingPostEditorLayeredPanel.module.css';

export interface WritingPostDraft
{
    Id: string;
    Category: string;
    Title: string;
    Summary: string;
    Image: string;
    IsPrivate: boolean;
    PasswordUpdate: string | null;
    TextLayers: PhotoCardTextLayer[];
    EnabledViewModes: WritingEnabledViewMode[];
    PageNumberColor: string;
    PageNumberOpacity: number;
    Pages: Array<{
        ForwardDirection: PhotoPageDirection | null;
        Heading: string;
        Content: string;
    }>;
}

export interface WritingPostCopyData
{
    CoverFile: File | null;
    Draft: WritingPostDraft;
}

const DirectionSymbols: Record<PhotoPageDirection, string> = {
    left: '←',
    right: '→',
    up: '↑',
    down: '↓',
};

function NormalizeDraftPages(
    Pages: WritingPostDraft['Pages'],
): WritingPostDraft['Pages']
{
    const Directions = NormalizePhotoPageDirectionSequence(
        Pages.map((Page) => Page.ForwardDirection),
    );

    return Pages.map((Page, PageIndex) => ({
        ...Page,
        ForwardDirection: Directions[PageIndex],
    }));
}

interface WritingPostEditorLayeredPanelProps
{
    Article: (WritingArticle & { IsPrivate?: boolean }) | null;
    Categories: string[];
    CopyData: WritingPostCopyData | null;
    ExistingPassword: string | null;
    IsSaving: boolean;
    Notice: string;
    OnCopy: (CopyData: WritingPostCopyData) => void;
    OnDelete: () => Promise<void>;
    OnRequestClose: () => void;
    OnSave: (Draft: WritingPostDraft, CoverFile: File | null) => Promise<void>;
}

function CreateLegacyTextLayers(
    Article: WritingArticle | null,
): PhotoCardTextLayer[]
{
    if((Article?.TextLayers?.length ?? 0) > 0)
    {
        return [...(Article?.TextLayers ?? [])];
    }

    return [Article?.Title, Article?.Summary]
        .filter((Text): Text is string => Boolean(Text?.trim()))
        .map((Text, Index) => ({
            Id: CreateUniqueId(),
            Text,
            FontFamily: Index === 0
                ? 'Arial, sans-serif'
                : 'Georgia, serif',
            FontSize: Index === 0 ? 34 : 18,
            FontWeight: Index === 0 ? 700 : 400,
            Color: '#ffffff',
            X: 7,
            Y: Index === 0 ? 72 : 86,
        }));
}

export function WritingPostEditorLayeredPanel(
    Props: WritingPostEditorLayeredPanelProps,
)
{
    const { IsSaving, OnRequestClose } = Props;
    const [ActiveSection, SetActiveSection] =
        useState<'cover' | 'content'>('cover');
    const [Category, SetCategory] = useState(
        Props.Article?.Category ?? Props.Categories[0] ?? '',
    );
    const [IsPrivate, SetIsPrivate] = useState(
        Props.Article?.IsPrivate === true,
    );
    const [Password, SetPassword] = useState(
        Props.ExistingPassword ?? '',
    );
    const [TextLayers, SetTextLayers] = useState(
        CreateLegacyTextLayers(Props.Article),
    );
    const [EnabledViewModes, SetEnabledViewModes] = useState<
        WritingEnabledViewMode[]
    >(Props.Article?.EnabledViewModes ?? ['book', 'scroll']);
    const [PageNumberColor, SetPageNumberColor] = useState(
        Props.Article?.PageNumberColor ?? '#222222',
    );
    const [PageNumberOpacity, SetPageNumberOpacity] = useState(
        Props.Article?.PageNumberOpacity ?? .58,
    );
    const [CoverFile, SetCoverFile] = useState<File | null>(null);
    const [CoverPreview, SetCoverPreview] = useState(
        Props.Article?.Image ?? '/images/journal-01.webp',
    );
    const [Pages, SetPages] = useState<WritingPostDraft['Pages']>(
        NormalizeDraftPages(
            Props.Article?.Pages.map((Page) => ({
                ForwardDirection: Page.ForwardDirection ?? null,
                Heading: Page.Heading,
                Content: Page.Paragraphs.join('\n\n'),
            })) ?? [{
                ForwardDirection: null,
                Heading: '',
                Content: '',
            }],
        ),
    );
    const [DraggedPageIndex, SetDraggedPageIndex] =
        useState<number | null>(null);
    const [IsPageSelectionMode, SetIsPageSelectionMode] = useState(false);
    const [SelectedPageIndexes, SetSelectedPageIndexes] = useState<number[]>([]);
    const [IsPageContentEditorOpen, SetIsPageContentEditorOpen] =
        useState(false);
    const [IsPageSelectorOpen, SetIsPageSelectorOpen] = useState(false);
    const [SelectedPageIndex, SetSelectedPageIndex] = useState(0);
    const [LocalNotice, SetLocalNotice] = useState('');
    const [IsDeleteConfirmationOpen, SetIsDeleteConfirmationOpen] =
        useState(false);

    useEffect(() =>
    {
        return () =>
        {
            if(CoverPreview.startsWith('blob:'))
            {
                URL.revokeObjectURL(CoverPreview);
            }
        };
    }, [CoverPreview]);

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(Event.key === 'Escape' && IsSaving === false)
            {
                OnRequestClose();
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, [IsSaving, OnRequestClose]);

    function SelectCover(File: File | null)
    {
        if(File === null)
        {
            return;
        }

        if(CoverPreview.startsWith('blob:'))
        {
            URL.revokeObjectURL(CoverPreview);
        }

        SetCoverFile(File);
        SetCoverPreview(URL.createObjectURL(File));
    }

    function UpdatePage(
        Index: number,
        Key: 'Heading' | 'Content',
        Value: string,
    )
    {
        SetPages((Current) => Current.map((Page, PageIndex) =>
            PageIndex === Index
                ? { ...Page, [Key]: Value }
                : Page,
        ));
    }

    function MovePage(FromIndex: number, ToIndex: number)
    {
        if(
            FromIndex === ToIndex
            || FromIndex < 0
            || ToIndex < 0
            || FromIndex >= Pages.length
            || ToIndex >= Pages.length
        )
        {
            return;
        }

        SetPages((Current) =>
        {
            const Next = [...Current];
            const [MovingPage] = Next.splice(FromIndex, 1);
            Next.splice(ToIndex, 0, MovingPage);
            return NormalizeDraftPages(Next);
        });
        SetSelectedPageIndexes([]);
        SetIsPageSelectionMode(false);
    }

    function DropPage(
        Event: DragEvent<HTMLElement>,
        TargetIndex: number,
    )
    {
        Event.preventDefault();

        if(DraggedPageIndex !== null)
        {
            MovePage(DraggedPageIndex, TargetIndex);
        }

        SetDraggedPageIndex(null);
    }

    function ChangePageDirection(
        PageIndex: number,
        Direction: PhotoPageDirection,
    )
    {
        SetPages((Current) => NormalizeDraftPages(
            Current.map((Page, Index) =>
                Index === PageIndex
                    ? { ...Page, ForwardDirection: Direction }
                    : Page,
            ),
        ));
    }

    function TogglePageSelection(PageIndex: number)
    {
        SetSelectedPageIndexes((Current) =>
            Current.includes(PageIndex)
                ? Current.filter((Index) => Index !== PageIndex)
                : [...Current, PageIndex],
        );
    }

    function DeleteSelectedPages()
    {
        if(
            SelectedPageIndexes.length === 0
        )
        {
            return;
        }

        SetPages((Current) => NormalizeDraftPages(
            Current.filter((_, PageIndex) =>
                SelectedPageIndexes.includes(PageIndex) === false,
            ),
        ));
        SetSelectedPageIndex(0);
        SetSelectedPageIndexes([]);
        SetIsPageSelectionMode(false);
        SetIsPageSelectorOpen(false);
    }

    function CreateDraft(
        DraftPages: WritingPostDraft['Pages'],
        PasswordUpdate: string | null,
    ): WritingPostDraft
    {
        const Title = TextLayers.find(
            (Layer) => Layer.Text.trim() !== '',
        )?.Text.trim().slice(0, 160)
            ?? DraftPages.find(
                (Page) => Page.Heading.trim() !== '',
            )?.Heading.trim().slice(0, 160)
            ?? '제목 없는 글';
        const Summary = DraftPages
            .flatMap((Page) => Page.Content.split(/\n{2,}/))
            .find((Paragraph) => Paragraph.trim() !== '')
            ?.trim().slice(0, 320) ?? '';

        return {
            Id: Props.Article?.Id ?? `writing-${Date.now()}`,
            Category,
            Title,
            Summary,
            Image: CoverPreview,
            IsPrivate,
            PasswordUpdate,
            TextLayers,
            EnabledViewModes,
            PageNumberColor,
            PageNumberOpacity,
            Pages: DraftPages,
        };
    }

    function CopyPost()
    {
        Props.OnCopy({
            CoverFile,
            Draft: CreateDraft(NormalizeDraftPages(Pages), null),
        });
        SetLocalNotice('복사했습니다. 새 글에서 붙여넣을 수 있습니다.');
    }

    function PastePost()
    {
        if(Props.CopyData === null)
        {
            SetLocalNotice('먼저 글 편집창에서 복사해주세요.');
            return;
        }

        const { CoverFile: CopiedCoverFile, Draft } = Props.CopyData;

        if(CoverPreview.startsWith('blob:'))
        {
            URL.revokeObjectURL(CoverPreview);
        }

        SetCategory(
            Props.Categories.includes(Draft.Category)
                ? Draft.Category
                : Props.Categories[0] ?? '',
        );
        SetIsPrivate(Draft.IsPrivate);
        SetPassword('');
        SetTextLayers(Draft.TextLayers.map((Layer) => ({
            ...Layer,
            Id: CreateUniqueId(),
        })));
        SetEnabledViewModes([...Draft.EnabledViewModes]);
        SetPageNumberColor(Draft.PageNumberColor);
        SetPageNumberOpacity(Draft.PageNumberOpacity);
        SetCoverFile(CopiedCoverFile);
        SetCoverPreview(
            CopiedCoverFile === null
                ? Draft.Image
                : URL.createObjectURL(CopiedCoverFile),
        );
        SetPages(NormalizeDraftPages(
            Draft.Pages.map((Page) => ({ ...Page })),
        ));
        SetSelectedPageIndex(0);
        SetActiveSection('cover');
        SetLocalNotice('복사한 글 내용을 모두 적용했습니다.');
    }

    async function Submit(Event: FormEvent<HTMLFormElement>)
    {
        Event.preventDefault();
        const NormalizedPages = NormalizeDraftPages(
            Pages.filter((Page) =>
                Page.Heading.trim() !== '' || Page.Content.trim() !== '',
            ),
        );

        if(Category === '')
        {
            SetLocalNotice('카테고리를 선택해주세요.');
            SetActiveSection('cover');
            return;
        }

        if(NormalizedPages.length === 0)
        {
            SetLocalNotice('본문 페이지를 한 장 이상 작성해주세요.');
            SetActiveSection('content');
            return;
        }

        const NormalizedPassword = Password.trim();

        if(
            IsPrivate === false
            && NormalizedPassword !== ''
            && (
                NormalizedPassword.length < 4
                || NormalizedPassword.length > 72
            )
        )
        {
            SetLocalNotice('Password는 4자 이상 72자 이하로 입력해주세요.');
            SetActiveSection('cover');
            return;
        }

        const PasswordUpdate = IsPrivate
            ? ''
            : Props.Article?.IsPasswordProtected === true
                && Props.ExistingPassword === null
                && NormalizedPassword === ''
                    ? null
                    : NormalizedPassword;

        SetLocalNotice('');
        await Props.OnSave(
            CreateDraft(NormalizedPages, PasswordUpdate),
            CoverFile,
        );
    }

    return (
        <div
            className={Styles.Backdrop}
            onMouseDown={(Event) =>
            {
                if(
                    Event.target === Event.currentTarget
                    && Props.IsSaving === false
                )
                {
                    Props.OnRequestClose();
                }
            }}
        >
            <form
                className={Styles.Editor}
                onSubmit={(Event) => void Submit(Event)}
                role="dialog"
                aria-modal="true"
                aria-label={Props.Article === null ? '새 글 작성' : '글 편집'}
            >
                <header className={Styles.Header}>
                    <div>
                        <span>{Props.Article === null ? 'WRITE' : 'EDIT'}</span>
                        <p>텍스트를 캔버스에서 읽기 좋은 위치로 구성하고 본문 페이지를 편집할 수 있습니다.</p>
                    </div>
                    <button
                        type="button"
                        onClick={Props.OnRequestClose}
                        disabled={Props.IsSaving}
                    >
                        Close <b>×</b>
                    </button>
                </header>

                <nav className={Styles.Sections} aria-label="글 편집 영역">
                    <button
                        type="button"
                        data-active={ActiveSection === 'cover'}
                        onClick={() => SetActiveSection('cover')}
                    >
                        <span><strong>썸네일 수정</strong><small>이미지 · 텍스트 · 공개 설정</small></span>
                        <b>{ActiveSection === 'cover' ? '−' : '+'}</b>
                    </button>
                    <button
                        type="button"
                        data-active={ActiveSection === 'content'}
                        onClick={() => SetActiveSection('content')}
                    >
                        <span><strong>본문 페이지</strong><small>{Pages.length}장 · 페이지 순서</small></span>
                        <b>{Pages.length}장</b>
                    </button>
                </nav>

                <div className={Styles.Content}>
                    {ActiveSection === 'cover' ? (
                        <ThumbnailEditorSection
                            AspectRatio="square"
                            Categories={Props.Categories}
                            Category={Category || null}
                            FallbackPreviewUrl={null}
                            IsPrivate={IsPrivate}
                            IsSaving={Props.IsSaving}
                            Password={Password}
                            OnChangeCategory={(NextCategory) =>
                                SetCategory(NextCategory ?? '')
                            }
                            OnChangePrivate={SetIsPrivate}
                            OnChangePassword={SetPassword}
                            OnChangeTextLayers={SetTextLayers}
                            OnSelectThumbnail={SelectCover}
                            TextLayers={TextLayers}
                            ThumbnailFileSizeLabel="25MB"
                            ThumbnailPreviewUrl={CoverPreview}
                        />
                    ) : (
                        <section className={Styles.PagesSection}>
                            <PhotoViewModeSelector
                                Disabled={Props.IsSaving}
                                Values={EnabledViewModes}
                                OnChange={SetEnabledViewModes}
                            />
                            <PhotoPageNumberStyleControl
                                Color={PageNumberColor}
                                Opacity={PageNumberOpacity}
                                Disabled={Props.IsSaving}
                                OnChangeColor={SetPageNumberColor}
                                OnChangeOpacity={SetPageNumberOpacity}
                            />
                            <div className={Styles.PagesHeading}>
                                <div>
                                    <strong>페이지 순서 편집</strong>
                                    <span>각 페이지의 제목과 본문을 입력합니다.</span>
                                </div>
                                <div className={Styles.PageHeadingActions}>
                                    <button
                                        type="button"
                                        data-active={IsPageSelectionMode}
                                        disabled={Props.IsSaving || Pages.length === 0}
                                        onClick={() =>
                                        {
                                            SetIsPageSelectionMode(
                                                (Current) => !Current,
                                            );
                                            SetSelectedPageIndexes([]);
                                        }}
                                    >
                                        선택
                                    </button>
                                    <button
                                        type="button"
                                        disabled={
                                            Props.IsSaving
                                            || SelectedPageIndexes.length === 0
                                        }
                                        onClick={DeleteSelectedPages}
                                    >
                                        삭제
                                    </button>
                                    <button
                                        type="button"
                                        disabled={Props.IsSaving}
                                        onClick={() => SetPages((Current) =>
                                            NormalizeDraftPages([
                                                ...Current,
                                                {
                                                    ForwardDirection: null,
                                                    Heading: '',
                                                    Content: '',
                                                },
                                            ]),
                                        )}
                                    >
                                        페이지 추가
                                    </button>
                                </div>
                            </div>
                            <div
                                className={Styles.PageOrderGrid}
                                aria-label="상하좌우 페이지 순서 편집"
                            >
                                {Pages.map((Page, Index) =>
                                {
                                    const PreviousDirection =
                                        Pages[Index - 1]?.ForwardDirection;
                                    const BackDirection =
                                        PreviousDirection === null
                                        || PreviousDirection === undefined
                                            ? null
                                            : GetOppositePhotoPageDirection(
                                                PreviousDirection,
                                            );

                                    return (
                                        <article
                                            key={Index}
                                            draggable={
                                                !Props.IsSaving
                                                && !IsPageSelectionMode
                                            }
                                            data-dragging={DraggedPageIndex === Index}
                                            data-selecting={IsPageSelectionMode}
                                            onDragStart={() => SetDraggedPageIndex(Index)}
                                            onDragOver={(Event) => Event.preventDefault()}
                                            onDrop={(Event) => DropPage(Event, Index)}
                                            onDragEnd={() => SetDraggedPageIndex(null)}
                                        >
                                            <div className={Styles.PageOrderCard}>
                                                {IsPageSelectionMode ? (
                                                    <input
                                                        type="checkbox"
                                                        className={Styles.PageSelectionCheckbox}
                                                        checked={SelectedPageIndexes.includes(Index)}
                                                        aria-label={`${Index + 1}페이지 선택`}
                                                        onChange={() => TogglePageSelection(Index)}
                                                    />
                                                ) : (
                                                    <span>{Index + 1}</span>
                                                )}
                                                <strong>{Page.Heading || '제목 없는 페이지'}</strong>
                                                <div className={Styles.PageOrderMove}>
                                                    <button
                                                        type="button"
                                                        disabled={Props.IsSaving || Index === 0}
                                                        onClick={() => MovePage(Index, Index - 1)}
                                                        aria-label={`${Index + 1}페이지를 앞으로 이동`}
                                                    >
                                                        이전
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={Props.IsSaving || Index === Pages.length - 1}
                                                        onClick={() => MovePage(Index, Index + 1)}
                                                        aria-label={`${Index + 1}페이지를 뒤로 이동`}
                                                    >
                                                        다음
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className={Styles.DirectionControls}
                                                aria-label={`${Index + 1}페이지 이동 방향`}
                                            >
                                                {PhotoPageDirections.map((Direction) => (
                                                    <button
                                                        key={Direction}
                                                        type="button"
                                                        className={`${Styles.DirectionButton} ${
                                                            Direction === 'left'
                                                                ? Styles.DirectionLeft
                                                                : Direction === 'right'
                                                                    ? Styles.DirectionRight
                                                                    : Direction === 'up'
                                                                        ? Styles.DirectionUp
                                                                        : Styles.DirectionDown
                                                        }`}
                                                        data-forward={Page.ForwardDirection === Direction}
                                                        data-back={BackDirection === Direction}
                                                        disabled={
                                                            Props.IsSaving
                                                            || Index === Pages.length - 1
                                                            || BackDirection === Direction
                                                        }
                                                        onDragStart={(Event) => Event.preventDefault()}
                                                        onClick={() => ChangePageDirection(Index, Direction)}
                                                        aria-label={`${Direction} 방향으로 다음 페이지 이동`}
                                                    >
                                                        {DirectionSymbols[Direction]}
                                                    </button>
                                                ))}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                            <section className={Styles.PageContentSection}>
                                <button
                                    type="button"
                                    className={Styles.PageContentToggle}
                                    aria-expanded={IsPageContentEditorOpen}
                                    onClick={() =>
                                    {
                                        SetIsPageContentEditorOpen(
                                            (Current) => !Current,
                                        );
                                        SetIsPageSelectorOpen(false);
                                    }}
                                >
                                    <span>
                                        <strong>페이지 내용 편집</strong>
                                        <small>한 페이지씩 선택해서 수정합니다.</small>
                                    </span>
                                    <b>{IsPageContentEditorOpen ? '−' : '+'}</b>
                                </button>
                                {IsPageContentEditorOpen ? (
                                    <div className={Styles.PageContentEditor}>
                                        <article className={Styles.PageEditor}>
                                            <header>
                                                <strong>{String(SelectedPageIndex + 1).padStart(2, '0')} PAGE</strong>
                                                <div className={Styles.PageSelector}>
                                                    <button
                                                        type="button"
                                                        className={Styles.PageSelectorToggle}
                                                        aria-haspopup="listbox"
                                                        aria-expanded={IsPageSelectorOpen}
                                                        disabled={Props.IsSaving}
                                                        onClick={() => SetIsPageSelectorOpen(
                                                            (Current) => !Current,
                                                        )}
                                                    >
                                                        <span>
                                                            {SelectedPageIndex + 1}.{' '}
                                                            {Pages[SelectedPageIndex]?.Heading || '제목 없는 페이지'}
                                                        </span>
                                                        <svg
                                                            viewBox="0 0 16 16"
                                                            data-open={IsPageSelectorOpen}
                                                            aria-hidden="true"
                                                        >
                                                            <path d="m4 6 4 4 4-4" />
                                                        </svg>
                                                    </button>
                                                    {IsPageSelectorOpen ? (
                                                        <div
                                                            className={Styles.PageSelectorOptions}
                                                            role="listbox"
                                                            aria-label="편집할 페이지"
                                                        >
                                                            {Pages.map((Page, Index) => (
                                                                <button
                                                                    key={Index}
                                                                    type="button"
                                                                    role="option"
                                                                    aria-selected={SelectedPageIndex === Index}
                                                                    onClick={() =>
                                                                    {
                                                                        SetSelectedPageIndex(Index);
                                                                        SetIsPageSelectorOpen(false);
                                                                    }}
                                                                >
                                                                    {Index + 1}. {Page.Heading || '제목 없는 페이지'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </header>
                                            <input
                                                type="text"
                                                value={Pages[SelectedPageIndex]?.Heading ?? ''}
                                                placeholder="페이지 제목"
                                                maxLength={160}
                                                disabled={Props.IsSaving}
                                                onChange={(Event) => UpdatePage(SelectedPageIndex, 'Heading', Event.currentTarget.value)}
                                            />
                                            <textarea
                                                value={Pages[SelectedPageIndex]?.Content ?? ''}
                                                placeholder="문단은 빈 줄로 구분됩니다."
                                                disabled={Props.IsSaving}
                                                onChange={(Event) => UpdatePage(SelectedPageIndex, 'Content', Event.currentTarget.value)}
                                            />
                                        </article>
                                    </div>
                                ) : null}
                            </section>
                        </section>
                    )}
                </div>

                <footer className={Styles.Footer}>
                    <div className={Styles.FooterLeft}>
                        {Props.Article === null ? (
                            <button
                                type="button"
                                className={Styles.PasteButton}
                                disabled={Props.IsSaving || Props.CopyData === null}
                                onClick={PastePost}
                            >
                                붙여넣기
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className={Styles.DeletePostButton}
                                    disabled={Props.IsSaving}
                                    onClick={() => SetIsDeleteConfirmationOpen(true)}
                                >
                                    게시글 삭제
                                </button>
                                <button
                                    type="button"
                                    className={Styles.CopyPostButton}
                                    disabled={Props.IsSaving}
                                    onClick={CopyPost}
                                >
                                    복사
                                </button>
                            </>
                        )}
                        <NoticeToast Message={LocalNotice || Props.Notice} />
                    </div>
                    <button type="submit" disabled={Props.IsSaving}>
                        {Props.IsSaving ? '저장 중...' : '변경사항 저장'}
                    </button>
                </footer>

                {IsDeleteConfirmationOpen ? (
                    <div className={Styles.DeleteConfirmationBackdrop} role="presentation">
                        <section
                            className={Styles.DeleteConfirmation}
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="writing-post-delete-title"
                            aria-describedby="writing-post-delete-description"
                        >
                            <span>DELETE POST</span>
                            <h3 id="writing-post-delete-title">정말 삭제할까요?</h3>
                            <p id="writing-post-delete-description">
                                삭제하면 글 게시판에서 더 이상 표시되지 않습니다.
                            </p>
                            <div>
                                <button
                                    type="button"
                                    disabled={Props.IsSaving}
                                    onClick={() => SetIsDeleteConfirmationOpen(false)}
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    disabled={Props.IsSaving}
                                    onClick={() => void Props.OnDelete()}
                                >
                                    {Props.IsSaving ? '삭제 중...' : '삭제하기'}
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}
            </form>
        </div>
    );
}
