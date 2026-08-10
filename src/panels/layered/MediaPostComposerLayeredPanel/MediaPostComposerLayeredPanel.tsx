'use client';

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from 'react';
import { ArchiveStrings } from '@/core/localization/ArchiveStrings';
import type {
    CreateMediaPostInput,
    MediaArchiveItem,
    MediaSourceType,
} from '@/panels/base/MediaBasePanel/controller/MediaBasePanelTypes';
import Styles from './MediaPostComposerLayeredPanel.module.css';

interface MediaPostComposerLayeredPanelProps
{
    Categories: string[];
    EditingItem: MediaArchiveItem | null;
    IsSaving: boolean;
    Notice: string;
    OnRequestClose: () => void;
    OnDelete: () => void;
    OnSubmit: (
        Input: CreateMediaPostInput,
        File: File | null,
    ) => void;
}

export function MediaPostComposerLayeredPanel(
    Props: MediaPostComposerLayeredPanelProps,
)
{
    const [SourceType, SetSourceType] =
        useState<MediaSourceType>(
            Props.EditingItem?.SourceType ?? 'upload',
        );
    const [Category, SetCategory] = useState(
        Props.EditingItem?.Category ?? '카테고리 없음',
    );
    const [IsCategoryOpen, SetIsCategoryOpen] = useState(false);
    const [IsDeleteConfirmationOpen, SetIsDeleteConfirmationOpen] =
        useState(false);
    const IsSavingReference = useRef(Props.IsSaving);
    const OnRequestCloseReference = useRef(Props.OnRequestClose);
    const Strings = ArchiveStrings.Media.Composer;
    const CategoryOptions = Array.from(new Set([
        '카테고리 없음',
        ...Props.Categories,
        ...(Props.EditingItem === null
            ? []
            : [Props.EditingItem.Category]),
    ]));

    useEffect(() =>
    {
        IsSavingReference.current = Props.IsSaving;
        OnRequestCloseReference.current = Props.OnRequestClose;
    }, [Props.IsSaving, Props.OnRequestClose]);

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(
                Event.key === 'Escape'
                && IsSavingReference.current === false
            )
            {
                OnRequestCloseReference.current();
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, []);

    function HandleSubmit(Event: FormEvent<HTMLFormElement>)
    {
        Event.preventDefault();
        const Form = new FormData(Event.currentTarget);
        const CandidateFile = Form.get('video');
        const File =
            CandidateFile instanceof globalThis.File
            && CandidateFile.size > 0
                ? CandidateFile
                : null;

        Props.OnSubmit(
            {
                Category,
                Content: String(Form.get('content') ?? ''),
                Title: String(Form.get('title') ?? ''),
                Studio: String(Form.get('studio') ?? ''),
                SourceType,
                YouTubeUrl: String(Form.get('youtubeUrl') ?? ''),
            },
            SourceType === 'upload' ? File : null,
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
            <section
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="media-composer-title"
                data-ue-component="MediaPostComposerLayeredPanel"
                data-ue-root
            >
                <header className={Styles.Header}>
                    <div>
                        <span>{Strings.Eyebrow}</span>
                        <h2 id="media-composer-title">
                            {Props.EditingItem === null
                                ? Strings.Title
                                : '영상 게시글 편집'}
                        </h2>
                        <p>{Strings.Description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={Props.OnRequestClose}
                        disabled={Props.IsSaving}
                        aria-label="영상 게시글 작성 창 닫기"
                    >
                        ×
                    </button>
                </header>

                <form className={Styles.Form} onSubmit={HandleSubmit}>
                    <label>
                        <span>{Strings.TitleLabel}</span>
                        <input
                            name="title"
                            type="text"
                            maxLength={120}
                            autoFocus
                            defaultValue={Props.EditingItem?.Title ?? ''}
                            required
                        />
                    </label>

                    <div className={Styles.CategoryField}>
                        <span>카테고리</span>
                        <button
                            type="button"
                            className={Styles.CategoryToggle}
                            aria-haspopup="listbox"
                            aria-expanded={IsCategoryOpen}
                            disabled={Props.IsSaving}
                            onClick={() =>
                                SetIsCategoryOpen(
                                    (Current) => !Current,
                                )
                            }
                            onKeyDown={(Event) =>
                            {
                                if(Event.key === 'Escape')
                                {
                                    Event.stopPropagation();
                                    SetIsCategoryOpen(false);
                                }
                            }}
                        >
                            <span>{Category}</span>
                            <svg
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                                data-open={IsCategoryOpen}
                            >
                                <path d="m4 6 4 4 4-4" />
                            </svg>
                        </button>
                        {IsCategoryOpen ? (
                            <div
                                className={Styles.CategoryOptions}
                                role="listbox"
                                aria-label="영상 카테고리"
                            >
                                {CategoryOptions.map((Option) => (
                                    <button
                                        key={Option}
                                        type="button"
                                        role="option"
                                        aria-selected={Category === Option}
                                        onClick={() =>
                                        {
                                            SetCategory(Option);
                                            SetIsCategoryOpen(false);
                                        }}
                                    >
                                        {Option}
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div
                        className={Styles.SourceTabs}
                        role="group"
                        aria-label="영상 소스 선택"
                    >
                        <button
                            type="button"
                            data-active={SourceType === 'upload'}
                            onClick={() => SetSourceType('upload')}
                        >
                            {Strings.Upload}
                        </button>
                        <button
                            type="button"
                            data-active={SourceType === 'youtube'}
                            onClick={() => SetSourceType('youtube')}
                        >
                            {Strings.YouTube}
                        </button>
                    </div>

                    <label>
                        <span>{Strings.ContentLabel}</span>
                        <textarea
                            name="content"
                            maxLength={2000}
                            rows={5}
                            defaultValue={Props.EditingItem?.Content ?? ''}
                            required
                        />
                    </label>
                    <label>
                        <span>{Strings.StudioLabel}</span>
                        <input
                            name="studio"
                            type="text"
                            maxLength={80}
                            defaultValue={Props.EditingItem?.Studio ?? ''}
                            placeholder="ARCHIVE STUDIO"
                        />
                    </label>

                    {SourceType === 'upload' ? (
                        <label>
                            <span>
                                {Props.EditingItem?.SourceType === 'upload'
                                    ? '새 영상 선택 (변경할 때만)'
                                    : Strings.FileLabel}
                            </span>
                            <input
                                name="video"
                                type="file"
                                accept="video/*"
                                required={
                                    Props.EditingItem === null
                                    || Props.EditingItem.SourceType
                                        !== 'upload'
                                }
                            />
                        </label>
                    ) : (
                        <label>
                            <span>{Strings.LinkLabel}</span>
                            <input
                                name="youtubeUrl"
                                type="url"
                                inputMode="url"
                                placeholder="https://youtu.be/..."
                                defaultValue={
                                    Props.EditingItem?.SourceType
                                    === 'youtube'
                                        ? Props.EditingItem.VideoUrl
                                        : ''
                                }
                                required
                            />
                        </label>
                    )}

                    {Props.Notice ? (
                        <p className={Styles.Notice} role="status">
                            {Props.Notice}
                        </p>
                    ) : null}

                    {IsDeleteConfirmationOpen ? (
                        <div className={Styles.DeleteConfirmation}>
                            <p>이 영상 게시글을 삭제할까요?</p>
                            <div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        SetIsDeleteConfirmationOpen(false)
                                    }
                                    disabled={Props.IsSaving}
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={Props.OnDelete}
                                    disabled={Props.IsSaving}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <footer
                        className={Styles.Actions}
                        data-editing={Props.EditingItem !== null}
                    >
                        {Props.EditingItem !== null ? (
                            <button
                                type="button"
                                className={Styles.DeleteButton}
                                onClick={() =>
                                    SetIsDeleteConfirmationOpen(true)
                                }
                                disabled={Props.IsSaving}
                            >
                                삭제
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={Props.OnRequestClose}
                            disabled={Props.IsSaving}
                        >
                            {Strings.Cancel}
                        </button>
                        <button type="submit" disabled={Props.IsSaving}>
                            {Props.IsSaving
                                ? Strings.Submitting
                                : Props.EditingItem === null
                                    ? Strings.Submit
                                    : '수정 저장'}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
