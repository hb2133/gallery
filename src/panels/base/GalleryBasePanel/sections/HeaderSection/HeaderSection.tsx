import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';

export function HeaderSection()
{
    return (
        <header
            className={Styles.Header}
            data-ue-component="HeaderSection"
            data-ue-root
        >
            <a className={Styles.Brand} href="#top" aria-label="Archive 홈">
                <span className={Styles.BrandMark} aria-hidden="true">
                    A
                </span>
                <span>Archive</span>
            </a>

            <nav className={Styles.PrimaryNav} aria-label="주요 메뉴">
                <a href="#gallery">Gallery</a>
                <a href="#journal">Journal</a>
                <a href="#about">About</a>
            </nav>

            <a
                className={Styles.DarkButton}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
            >
                Instagram <span aria-hidden="true">↗</span>
            </a>
        </header>
    );
}
