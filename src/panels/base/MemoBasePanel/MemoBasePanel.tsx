'use client';

import { useEffect, useRef } from 'react';
import {
    MemoArchiveSection,
    ScrambleText,
} from './sections/MemoArchiveSection/MemoArchiveSection';
import Styles from './MemoBasePanel.module.css';

export function MemoBasePanel()
{
    const HeaderReference = useRef<HTMLElement>(null);

    useEffect(() =>
    {
        const Header = HeaderReference.current;

        if(Header === null)
        {
            return;
        }

        let PreviousScrollY = window.scrollY;
        let Frame = 0;
        const Update = () =>
        {
            const ScrollY = window.scrollY;
            const Delta = ScrollY - PreviousScrollY;

            if(ScrollY < 40 || Delta < -4)
            {
                Header.dataset.scrollHidden = 'false';
            }
            else if(Delta > 4)
            {
                Header.dataset.scrollHidden = 'true';
            }

            PreviousScrollY = ScrollY;
            Frame = 0;
        };
        const HandleScroll = () =>
        {
            if(Frame === 0)
            {
                Frame = window.requestAnimationFrame(Update);
            }
        };

        window.addEventListener('scroll', HandleScroll, { passive: true });

        return () =>
        {
            window.cancelAnimationFrame(Frame);
            window.removeEventListener('scroll', HandleScroll);
        };
    }, []);

    return (
        <main className={Styles.Page} data-ue-page="MemoBasePanel">
            <header
                ref={HeaderReference}
                className={Styles.Header}
                data-scroll-hidden="false"
            >
                <a className={Styles.Brand} href="#hero" aria-label="Eric Cole, top">
                    ERIC<br />COLE
                </a>
                <nav className={Styles.Navigation} aria-label="Portfolio sections">
                    <a href="#work">
                        <ScrambleText Text="+ WORK" Trigger="hover" />
                    </a>
                    <a href="#about">
                        <ScrambleText Text="+ ABOUT" Trigger="hover" />
                    </a>
                    <a href="#services">
                        <ScrambleText Text="+ SERVICES" Trigger="hover" />
                    </a>
                </nav>
                <a href="#contact" className={Styles.BackLink}>
                    <ScrambleText Text="CONTACT ↗" Trigger="hover" />
                </a>
            </header>
            <MemoArchiveSection />
        </main>
    );
}
