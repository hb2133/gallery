import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';

export function FooterSection()
{
    return (
        <footer
            id="about"
            className={Styles.Footer}
            data-ue-component="FooterSection"
            data-ue-root
        >
            <div className={Styles.FooterLead}>
                <p className={Styles.Eyebrow}>Available for selected projects</p>
                <h2>
                    Let&apos;s make
                    <br />
                    something worth keeping.
                </h2>
                <a className={Styles.LightButton} href="mailto:hello@example.com">
                    Start a conversation <span aria-hidden="true">↗</span>
                </a>
            </div>

            <div className={Styles.FooterBottom}>
                <p>© 2026 Archive Studio</p>
                <nav aria-label="외부 채널">
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                        Instagram
                    </a>
                    <a href="#journal">Journal</a>
                    <a href="mailto:hello@example.com">Email</a>
                </nav>
                <a href="#top">Back to top ↑</a>
            </div>
        </footer>
    );
}
