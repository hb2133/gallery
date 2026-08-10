import type { GalleryDetailViewMode } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import Styles from './PhotoViewModeSelector.module.css';

interface PhotoViewModeSelectorProps
{
    Disabled?: boolean;
    OnChange: (ViewModes: GalleryDetailViewMode[]) => void;
    Values: GalleryDetailViewMode[];
}

export function PhotoViewModeSelector(
    Props: PhotoViewModeSelectorProps,
)
{
    const IsBookEnabled = Props.Values.includes('book');
    const IsScrollEnabled = Props.Values.includes('scroll');

    function ToggleViewMode(ViewMode: GalleryDetailViewMode)
    {
        const IsEnabled = Props.Values.includes(ViewMode);

        if(IsEnabled && Props.Values.length === 1)
        {
            return;
        }

        Props.OnChange(
            IsEnabled
                ? Props.Values.filter(
                    (Candidate) => Candidate !== ViewMode,
                )
                : [...Props.Values, ViewMode],
        );
    }

    return (
        <section className={Styles.Root}>
            <div>
                <strong>보기 방식</strong>
                <span>
                    {IsBookEnabled && IsScrollEnabled
                        ? '두 가지 보기 방식을 모두 사용할 수 있습니다.'
                        : IsBookEnabled
                            ? '책넘김 보기만 사용할 수 있습니다.'
                            : '상하좌우 보기만 사용할 수 있습니다.'}
                </span>
            </div>
            <div
                className={Styles.Options}
                role="group"
                aria-label="게시글에서 허용할 보기 방식"
            >
                <button
                    type="button"
                    aria-pressed={IsBookEnabled}
                    data-active={IsBookEnabled}
                    disabled={Props.Disabled}
                    onClick={() => ToggleViewMode('book')}
                    aria-label="책넘김 보기 사용"
                    title="책넘김 보기"
                >
                    <span className={Styles.BookIcon} aria-hidden="true">
                        <i />
                        <i />
                    </span>
                </button>
                <button
                    type="button"
                    aria-pressed={IsScrollEnabled}
                    data-active={IsScrollEnabled}
                    disabled={Props.Disabled}
                    onClick={() => ToggleViewMode('scroll')}
                    aria-label="상하좌우 보기 사용"
                    title="상하좌우 보기"
                >
                    <svg viewBox="0 0 32 32" aria-hidden="true">
                        <rect x="5" y="5" width="22" height="22" rx="2" />
                        <path d="m16 8-3 3m3-3 3 3M16 24l-3-3m3 3 3-3M8 16l3-3m-3 3 3 3M24 16l-3-3m3 3-3 3" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
