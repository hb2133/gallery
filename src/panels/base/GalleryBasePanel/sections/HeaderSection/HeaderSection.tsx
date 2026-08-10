import { AdminBrand } from '@/components/AdminBrand/AdminBrand';
import type { HeaderLinkCustomization } from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';

interface HeaderSectionProps
{
    HeaderLink: HeaderLinkCustomization | null;
    IsDarkTheme: boolean;
    MessageRotationSeconds: number;
    Messages: readonly string[];
    OnOpenCustomization: () => void;
    OnToggleTheme: () => void;
}

export function HeaderSection(Props: HeaderSectionProps)
{
    const LinkText = Props.HeaderLink?.Text.trim() ?? '';
    const LinkUrl = Props.HeaderLink?.Url.trim() ?? '';
    const HasLinkText = LinkText.length > 0;
    const HasLinkUrl = LinkUrl.length > 0;

    return (
        <header
            className={Styles.Header}
            data-cursor-surface
            data-ue-component="HeaderSection"
            data-ue-root
        >
            <AdminBrand
                ClassName={Styles.Brand}
                HomeHref="/"
                MessageRotationSeconds={
                    Props.MessageRotationSeconds
                }
                Messages={Props.Messages}
                OnOpenCustomization={Props.OnOpenCustomization}
                CustomizationLabel="시작 페이지 설정 열기"
            />

            <nav className={Styles.HeaderActions} aria-label="외부 링크와 화면 설정">
                {HasLinkUrl ? (
                    <a
                        className={Styles.LinkButton}
                        href={LinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={
                            HasLinkText
                                ? `${LinkText} 링크 열기`
                                : '외부 링크 열기'
                        }
                        data-cursor-label={
                            HasLinkText
                                ? `${LinkText} 열기`
                                : '외부 링크 열기'
                        }
                    >
                        {HasLinkText ? LinkText : null}
                        <span aria-hidden="true">↗</span>
                    </a>
                ) : HasLinkText ? (
                    <span
                        className={`${Styles.LinkButton} ${Styles.LinkButtonDisabled}`}
                        aria-disabled="true"
                        data-cursor-label="URL이 설정되지 않았습니다."
                    >
                        {LinkText}
                        <span aria-hidden="true">↗</span>
                    </span>
                ) : null}
                <button
                    className={Styles.ThemeButton}
                    type="button"
                    onClick={Props.OnToggleTheme}
                    aria-pressed={Props.IsDarkTheme}
                    aria-label={
                        Props.IsDarkTheme
                            ? '밝은 화면으로 전환'
                            : '어두운 화면으로 전환'
                    }
                    data-cursor-label={
                        Props.IsDarkTheme
                            ? '밝은 화면으로 전환'
                            : '어두운 화면으로 전환'
                    }
                >
                    <span
                        className={Styles.ThemeIcon}
                        aria-hidden="true"
                    >
                        ◐
                    </span>
                    <span className={Styles.ThemeDarkLabel}>
                        Dark
                    </span>
                    <span className={Styles.ThemeLightLabel}>
                        Light
                    </span>
                </button>
            </nav>
        </header>
    );
}
