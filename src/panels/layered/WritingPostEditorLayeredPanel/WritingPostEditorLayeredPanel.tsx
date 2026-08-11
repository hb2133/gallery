'use client';

import {
    useEffect,
    useState,
    type FormEvent,
} from 'react';
import type { WritingArticle } from '@/panels/base/WritingBasePanel/controller/WritingBasePanelTypes';
import Styles from './WritingPostEditorLayeredPanel.module.css';

export interface WritingPostDraft
{
    Id: string;
    Category: string;
    Title: string;
    Summary: string;
    Image: string;
    IsPrivate: boolean;
    Pages: Array<{
        Heading: string;
        Content: string;
    }>;
}

interface WritingPostEditorLayeredPanelProps
{
    Article: (WritingArticle & { IsPrivate?: boolean }) | null;
    Categories: string[];
    IsSaving: boolean;
    Notice: string;
    OnRequestClose: () => void;
    OnSave: (Draft: WritingPostDraft, CoverFile: File | null) => Promise<void>;
}

export function WritingPostEditorLayeredPanel(
    Props: WritingPostEditorLayeredPanelProps,
)
{
    const [ActiveSection, SetActiveSection] =
        useState<'cover' | 'content'>('cover');
    const [Title, SetTitle] = useState(Props.Article?.Title ?? '');
    const [Summary, SetSummary] = useState(Props.Article?.Summary ?? '');
    const [Category, SetCategory] = useState(
        Props.Article?.Category ?? Props.Categories[0] ?? '',
    );
    const [IsPrivate, SetIsPrivate] = useState(
        Props.Article?.IsPrivate === true,
    );
    const [CoverFile, SetCoverFile] = useState<File | null>(null);
    const [CoverPreview, SetCoverPreview] = useState(
        Props.Article?.Image ?? '/images/journal-01.webp',
    );
    const [Pages, SetPages] = useState<WritingPostDraft['Pages']>(
        Props.Article?.Pages.map((Page) => ({
            Heading: Page.Heading,
            Content: Page.Paragraphs.join('\n\n'),
        })) ?? [{ Heading: '', Content: '' }],
    );
    const [LocalNotice, SetLocalNotice] = useState('');

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

    async function Submit(Event: FormEvent<HTMLFormElement>)
    {
        Event.preventDefault();
        const NormalizedPages = Pages.filter((Page) =>
            Page.Heading.trim() !== '' || Page.Content.trim() !== '',
        );

        if(Title.trim() === '')
        {
            SetLocalNotice('제목을 입력해주세요.');
            SetActiveSection('cover');
            return;
        }

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

        SetLocalNotice('');
        await Props.OnSave({
            Id: Props.Article?.Id ?? `writing-${Date.now()}`,
            Category,
            Title: Title.trim(),
            Summary: Summary.trim(),
            Image: CoverPreview,
            IsPrivate,
            Pages: NormalizedPages,
        }, CoverFile);
    }

    return (
        <div className={Styles.Backdrop}>
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
                        <section className={Styles.CoverSection}>
                            <div className={Styles.CoverColumn}>
                                <div
                                    className={Styles.CoverPreview}
                                    style={{ backgroundImage: `linear-gradient(180deg, transparent, rgb(0 0 0 / 48%)), url(${CoverPreview})` }}
                                >
                                    <strong>{Title || '제목을 입력해주세요'}</strong>
                                    <small>{Category || '카테고리 없음'}</small>
                                </div>
                                <p>중앙 또는 다른 텍스트에 가까워지면 자동으로 정렬됩니다.</p>
                            </div>
                            <div className={Styles.SettingsColumn}>
                                <div className={Styles.ThumbnailControl}>
                                    <div>
                                        <strong>썸네일</strong>
                                        <small>JPG · PNG · WebP · GIF, 최대 25MB</small>
                                    </div>
                                    <label className={Styles.ThumbnailUpload}>
                                        <span
                                            style={{ backgroundImage: `url(${CoverPreview})` }}
                                            aria-hidden="true"
                                        />
                                        <b>수정</b>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            disabled={Props.IsSaving}
                                            aria-label="썸네일 이미지 변경"
                                            onChange={(Event) => SelectCover(Event.currentTarget.files?.[0] ?? null)}
                                        />
                                    </label>
                                </div>
                                <label className={Styles.CategoryControl}>
                                    <span>카테고리</span>
                                    <select
                                        value={Category}
                                        disabled={Props.IsSaving}
                                        onChange={(Event) => SetCategory(Event.currentTarget.value)}
                                    >
                                        {Props.Categories.map((Item) => (
                                            <option key={Item} value={Item}>{Item}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className={Styles.PrivateControl}>
                                    <span>공개 상태</span>
                                    <small>{IsPrivate ? '관리자에게만 표시됩니다.' : '모든 방문자에게 표시됩니다.'}</small>
                                    <button
                                        type="button"
                                        data-active={IsPrivate}
                                        onClick={() => SetIsPrivate(!IsPrivate)}
                                        disabled={Props.IsSaving}
                                    >
                                        <i aria-hidden="true" />
                                        {IsPrivate ? '비공개' : '공개'}
                                    </button>
                                </label>
                                <h3>텍스트</h3>
                                <label>
                                    <span>제목</span>
                                    <input
                                        type="text"
                                        value={Title}
                                        maxLength={160}
                                        disabled={Props.IsSaving}
                                        onChange={(Event) => SetTitle(Event.currentTarget.value)}
                                    />
                                </label>
                                <label>
                                    <span>요약</span>
                                    <textarea
                                        value={Summary}
                                        maxLength={320}
                                        disabled={Props.IsSaving}
                                        onChange={(Event) => SetSummary(Event.currentTarget.value)}
                                    />
                                </label>
                            </div>
                        </section>
                    ) : (
                        <section className={Styles.PagesSection}>
                            <div className={Styles.PagesHeading}>
                                <div>
                                    <strong>페이지 순서 편집</strong>
                                    <span>각 페이지의 제목과 본문을 입력합니다.</span>
                                </div>
                                <button
                                    type="button"
                                    disabled={Props.IsSaving}
                                    onClick={() => SetPages((Current) => [
                                        ...Current,
                                        { Heading: '', Content: '' },
                                    ])}
                                >
                                    페이지 추가
                                </button>
                            </div>
                            <div className={Styles.PageEditors}>
                                {Pages.map((Page, Index) => (
                                    <article key={Index} className={Styles.PageEditor}>
                                        <header>
                                            <strong>{String(Index + 1).padStart(2, '0')} PAGE</strong>
                                            <button
                                                type="button"
                                                disabled={Props.IsSaving || Pages.length === 1}
                                                onClick={() => SetPages((Current) => Current.filter((_, PageIndex) => PageIndex !== Index))}
                                            >
                                                삭제
                                            </button>
                                        </header>
                                        <input
                                            type="text"
                                            value={Page.Heading}
                                            placeholder="페이지 제목"
                                            maxLength={160}
                                            disabled={Props.IsSaving}
                                            onChange={(Event) => UpdatePage(Index, 'Heading', Event.currentTarget.value)}
                                        />
                                        <textarea
                                            value={Page.Content}
                                            placeholder="문단은 빈 줄로 구분됩니다."
                                            disabled={Props.IsSaving}
                                            onChange={(Event) => UpdatePage(Index, 'Content', Event.currentTarget.value)}
                                        />
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <footer className={Styles.Footer}>
                    <p role="status">{LocalNotice || Props.Notice}</p>
                    <button type="button" onClick={Props.OnRequestClose} disabled={Props.IsSaving}>
                        되돌리기
                    </button>
                    <button type="submit" disabled={Props.IsSaving}>
                        {Props.IsSaving ? '저장 중...' : '변경사항 저장'}
                    </button>
                </footer>
            </form>
        </div>
    );
}
