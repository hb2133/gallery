'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Styles from '@/panels/base/MemoBasePanel/MemoBasePanel.module.css';

const ScrambleCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const Projects = [
    {
        Number: '01',
        Title: 'AGRIPILOT',
        ImagePath: '/images/memo-eric-cole/work-agripilot.png',
    },
    {
        Number: '02',
        Title: 'WORKSPACE AI',
        ImagePath: '/images/memo-eric-cole/work-workspace-ai.jpeg',
    },
    {
        Number: '03',
        Title: '2060-HEALTH',
        ImagePath: '/images/memo-eric-cole/work-2060-health.png',
    },
    {
        Number: '04',
        Title: 'CALENDAR UI',
        ImagePath: '/images/memo-eric-cole/work-calendar-ui.png',
    },
    {
        Number: '05',
        Title: 'AI DASHBOARD',
        ImagePath: '/images/memo-eric-cole/work-ai-dashboard.png',
    },
    {
        Number: '06',
        Title: 'FUTURISTIC EARTH',
        ImagePath: '/images/memo-eric-cole/work-futuristic-earth.png',
    },
];

const Principles = [
    {
        Title: 'CLEAR COMMUNICATION',
        Description: 'I KEEP THINGS SIMPLE AND DIRECT, SO EVERYONE KNOWS WHAT’S BEING BUILT, WHAT’S DONE, AND WHAT COMES NEXT.',
    },
    {
        Title: 'CLEAN, MAINTAINABLE CODE',
        Description: 'I BUILD WITH STRUCTURE IN MIND, SO THE PRODUCT STAYS EASY TO IMPROVE AND SCALE.',
    },
    {
        Title: 'BUILT FOR REAL USE',
        Description: 'I THINK BEYOND THE SCREEN AND FOCUS ON HOW THINGS BEHAVE IN REAL WORKFLOWS, REAL EDGE CASES, AND REAL PRODUCTS.',
    },
    {
        Title: 'FAST, STEADY EXECUTION',
        Description: 'I VALUE MOMENTUM, BUT NOT AT THE COST OF QUALITY. THE GOAL IS TO SHIP WORK THAT FEELS POLISHED AND DEPENDABLE.',
    },
];

const Services = [
    ['001', 'PRODUCT ENGINEERING', 'BUILDING RELIABLE, SCALABLE APPLICATIONS FROM IDEA TO PRODUCTION. FOCUSED ON PERFORMANCE, STRUCTURE, AND LONG-TERM MAINTAINABILITY.'],
    ['002', 'FRONTEND DEVELOPMENT', 'CLEAN, RESPONSIVE INTERFACES BUILT WITH ATTENTION TO DETAIL. DESIGNED TO FEEL FAST, INTUITIVE, AND CONSISTENT ACROSS DEVICES.'],
    ['003', 'DESIGN COLLABORATION', 'WORKING CLOSELY WITH DESIGNERS OR FOUNDERS TO REFINE IDEAS INTO USABLE PRODUCTS. BRIDGING THE GAP BETWEEN DESIGN AND ENGINEERING.'],
    ['004', 'SYSTEM & ARCHITECTURE', 'STRUCTURING CODEBASES AND SYSTEMS THAT CAN GROW WITHOUT BECOMING FRAGILE. MAKING FUTURE CHANGES EASIER, NOT HARDER.'],
];

const ClientLogos = [
    { Path: '/images/memo-eric-cole/client-1.svg', Width: 240, Height: 41 },
    { Path: '/images/memo-eric-cole/client-2.svg', Width: 169, Height: 40 },
    { Path: '/images/memo-eric-cole/client-3.svg', Width: 239, Height: 40 },
    { Path: '/images/memo-eric-cole/client-4.svg', Width: 100, Height: 40 },
    { Path: '/images/memo-eric-cole/client-5.svg', Width: 51, Height: 40 },
    { Path: '/images/memo-eric-cole/client-6.svg', Width: 84, Height: 40 },
];

const Proofs = [
    {
        Name: 'DANIEL KIM',
        Role: 'PRODUCT MANAGER',
        Quote: 'HE DELIVERED EVERYTHING FASTER THAN EXPECTED AND WITH A LEVEL OF PRECISION THAT MADE OUR PRODUCT FEEL POLISHED FROM DAY ONE.',
    },
    {
        Name: 'MICHAEL TURNER',
        Role: 'STARTUP FOUNDER',
        Quote: 'WORKING WITH HIM WAS SMOOTH FROM START TO FINISH. HE UNDERSTOOD OUR NEEDS QUICKLY AND BUILT A SOLID, RELIABLE PRODUCT.',
    },
    {
        Name: 'EMMA RICHARDS',
        Role: 'TECH LEAD',
        Quote: 'SUPER RELIABLE AND DETAIL-ORIENTED. YOU CAN TRUST HIM TO TAKE OWNERSHIP AND SHIP HIGH-QUALITY WORK WITHOUT HAND-HOLDING.',
    },
];

export function ScrambleText({
    ClassName,
    Delay = 0,
    Text,
    Trigger = 'appear',
}: {
    ClassName?: string;
    Delay?: number;
    Text: string;
    Trigger?: 'appear' | 'hover';
})
{
    const ElementReference = useRef<HTMLSpanElement>(null);
    const AnimationFrameReference = useRef(0);
    const DelayReference = useRef(0);
    const [DisplayText, SetDisplayText] = useState(Text);

    const Run = useCallback(() =>
    {
        window.cancelAnimationFrame(AnimationFrameReference.current);
        window.clearTimeout(DelayReference.current);

        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        {
            SetDisplayText(Text);
            return;
        }

        const Characters = Array.from(Text);
        const RevealOrder = Characters
            .map((Character, Index) => ({ Character, Index }))
            .filter(({ Character }) => Character !== ' ' && Character !== '\n')
            .map(({ Index }) => Index);

        for(let Index = RevealOrder.length - 1; Index > 0; Index -= 1)
        {
            const SwapIndex = Math.floor(Math.random() * (Index + 1));
            [RevealOrder[Index], RevealOrder[SwapIndex]] =
                [RevealOrder[SwapIndex], RevealOrder[Index]];
        }

        const RevealThresholds = new Map(
            RevealOrder.map((CharacterIndex, OrderIndex) => [
                CharacterIndex,
                0.08 + 0.82 * ((OrderIndex + 1) / RevealOrder.length),
            ]),
        );
        const StartedAt = performance.now();
        const Duration = Trigger === 'hover' ? 1000 : 1050;
        let LastFrameAt = 0;
        const Update = (Time: number) =>
        {
            const Progress = Math.min((Time - StartedAt) / Duration, 1);

            if(Progress < 1 && Time - LastFrameAt < 50)
            {
                AnimationFrameReference.current =
                    window.requestAnimationFrame(Update);
                return;
            }

            LastFrameAt = Time;
            const EasedProgress = 1 - Math.pow(1 - Progress, 3);
            const NextText = Characters.map((Character, Index) =>
            {
                if(Character === ' ' || Character === '\n')
                {
                    return Character;
                }

                if(EasedProgress >= (RevealThresholds.get(Index) ?? 1))
                {
                    return Character;
                }

                return ScrambleCharacters[
                    Math.floor(Math.random() * ScrambleCharacters.length)
                ];
            }).join('');

            SetDisplayText(NextText);

            if(Progress < 1)
            {
                AnimationFrameReference.current =
                    window.requestAnimationFrame(Update);
            }
            else
            {
                SetDisplayText(Text);
            }
        };

        SetDisplayText(Characters.map((Character) =>
            Character === ' ' || Character === '\n'
                ? Character
                : ScrambleCharacters[
                    Math.floor(Math.random() * ScrambleCharacters.length)
                ],
        ).join(''));
        AnimationFrameReference.current = window.requestAnimationFrame(Update);
    }, [Text, Trigger]);

    const Stop = useCallback(() =>
    {
        window.cancelAnimationFrame(AnimationFrameReference.current);
        window.clearTimeout(DelayReference.current);
        SetDisplayText(Text);
    }, [Text]);

    useEffect(() =>
    {
        const Element = ElementReference.current;

        if(Element === null || Trigger !== 'appear')
        {
            return;
        }

        if(!('IntersectionObserver' in window))
        {
            DelayReference.current = globalThis.window.setTimeout(Run, Delay);
            return () => globalThis.window.clearTimeout(DelayReference.current);
        }

        const Observer = new IntersectionObserver(([Entry]) =>
        {
            if(!Entry.isIntersecting)
            {
                return;
            }

            DelayReference.current = window.setTimeout(Run, Delay);
            Observer.disconnect();
        }, { threshold: 0.2 });

        Observer.observe(Element);

        return () =>
        {
            Observer.disconnect();
            window.clearTimeout(DelayReference.current);
            window.cancelAnimationFrame(AnimationFrameReference.current);
        };
    }, [Delay, Run, Trigger]);

    return (
        <span
            ref={ElementReference}
            className={ClassName}
            aria-label={Text}
            onFocus={Trigger === 'hover' ? Run : undefined}
            onBlur={Trigger === 'hover' ? Stop : undefined}
            onPointerEnter={Trigger === 'hover' ? Run : undefined}
            onPointerLeave={Trigger === 'hover' ? Stop : undefined}
        >
            <span aria-hidden="true">{DisplayText}</span>
        </span>
    );
}

function ScrollColorText({
    ClassName,
    Text,
}: {
    ClassName: string;
    Text: string;
})
{
    const Words = Text.split(' ');

    return (
        <p className={ClassName} data-scroll-color aria-label={Text}>
            {Words.map((Word, WordIndex) => (
                <span
                    className={Styles.ScrollColorWord}
                    aria-hidden="true"
                    key={`${Word}-${WordIndex}`}
                >
                    {Array.from(Word).map((Letter, LetterIndex) => (
                        <span
                            className={Styles.ScrollColorLetter}
                            data-scroll-color-letter
                            key={`${Letter}-${LetterIndex}`}
                        >
                            {Letter}
                        </span>
                    ))}
                    {WordIndex < Words.length - 1 ? '\u00a0' : null}
                </span>
            ))}
        </p>
    );
}

function LocalTime()
{
    const [TimeLabel, SetTimeLabel] = useState('SEOUL, KR / 00:00 / MONDAY');

    useEffect(() =>
    {
        const Update = () =>
        {
            const Now = new Date();
            const Time = new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                hour12: false,
                minute: '2-digit',
                timeZone: 'Asia/Seoul',
            }).format(Now);
            const Day = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Seoul',
                weekday: 'long',
            }).format(Now).toUpperCase();

            SetTimeLabel(`SEOUL, KR / ${Time} / ${Day}`);
        };

        Update();
        const Interval = window.setInterval(Update, 30_000);
        return () => window.clearInterval(Interval);
    }, []);

    return <span>{TimeLabel}</span>;
}

export function MemoArchiveSection()
{
    const MotionRootReference = useRef<HTMLElement>(null);
    const LoaderProgressReference = useRef<HTMLSpanElement>(null);
    const [ActiveProjectIndex, SetActiveProjectIndex] = useState(0);
    const ActiveProject = Projects[ActiveProjectIndex];

    useEffect(() =>
    {
        const Root = MotionRootReference.current;

        if(Root === null)
        {
            return;
        }

        const Elements = Array.from(
            Root.querySelectorAll<HTMLElement>('[data-reveal]'),
        );
        const ReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        const LoaderProgress = LoaderProgressReference.current;

        Root.dataset.motionReady = 'true';
        let LoaderFrame = 0;

        if(LoaderProgress !== null)
        {
            if(ReducedMotion)
            {
                LoaderProgress.textContent = '0100%';
            }
            else
            {
                const LoaderStartedAt = performance.now();
                const UpdateLoaderProgress = (Time: number) =>
                {
                    const Progress = Math.min(
                        100,
                        Math.round((Time - LoaderStartedAt) / 30),
                    );

                    LoaderProgress.textContent =
                        `0${String(Progress).padStart(2, '0')}%`;

                    if(Progress < 100)
                    {
                        LoaderFrame = window.requestAnimationFrame(
                            UpdateLoaderProgress,
                        );
                    }
                };

                LoaderFrame = window.requestAnimationFrame(
                    UpdateLoaderProgress,
                );
            }
        }

        const ScrollColorElements = Array.from(
            Root.querySelectorAll<HTMLElement>('[data-scroll-color]'),
        );
        let ScrollFrame = 0;
        const UpdateScrollColors = () =>
        {
            ScrollColorElements.forEach((Element) =>
            {
                const Letters = Array.from(
                    Element.querySelectorAll<HTMLElement>(
                        '[data-scroll-color-letter]',
                    ),
                );
                const ElementProgress = ReducedMotion
                    ? 1
                    : Math.min(Math.max((
                        window.innerHeight * 0.8 -
                        Element.getBoundingClientRect().top
                    ) / (window.innerHeight * 0.6), 0), 1);

                Letters.forEach((Letter, Index) =>
                {
                    const Progress = Math.min(Math.max(
                        ElementProgress * Letters.length - Index,
                        0,
                    ), 1);
                    const Channel = Math.round(184 - 148 * Progress);

                    Letter.style.color =
                        `rgb(${Channel}, ${Channel}, ${Channel})`;
                    Letter.style.opacity = String(0.2 + 0.8 * Progress);
                });
            });

            const ServicesTop = Root.querySelector<HTMLElement>('#services')
                ?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
            const AboutTop = Root.querySelector<HTMLElement>('#about')
                ?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
            const ContactTop = Root.querySelector<HTMLElement>('#contact')
                ?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
            const ThemeThreshold = window.innerHeight * 0.5;

            Root.dataset.activeScrollPhase = ContactTop <= ThemeThreshold
                ? 'contact'
                : AboutTop <= ThemeThreshold
                    ? 'about'
                    : ServicesTop <= ThemeThreshold
                        ? 'services'
                        : 'work';
            ScrollFrame = 0;
        };
        const ScheduleScrollUpdate = () =>
        {
            if(ScrollFrame === 0)
            {
                ScrollFrame = window.requestAnimationFrame(UpdateScrollColors);
            }
        };

        UpdateScrollColors();
        window.addEventListener('scroll', ScheduleScrollUpdate, {
            passive: true,
        });
        window.addEventListener('resize', ScheduleScrollUpdate, {
            passive: true,
        });

        let SmoothFrame = 0;
        let SmoothCurrent = window.scrollY;
        let SmoothTarget = window.scrollY;
        let IsSmoothScrolling = false;
        const SmoothScrollStep = () =>
        {
            const MaximumScroll = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight,
            );
            SmoothTarget = Math.min(Math.max(SmoothTarget, 0), MaximumScroll);
            SmoothCurrent += (SmoothTarget - SmoothCurrent) * 0.16;

            if(Math.abs(SmoothTarget - SmoothCurrent) < 0.5)
            {
                SmoothCurrent = SmoothTarget;
                window.scrollTo({ top: SmoothCurrent, behavior: 'instant' });
                SmoothFrame = 0;
                IsSmoothScrolling = false;
                return;
            }

            window.scrollTo({ top: SmoothCurrent, behavior: 'instant' });
            SmoothFrame = window.requestAnimationFrame(SmoothScrollStep);
        };
        const HandleWheel = (Event: WheelEvent) =>
        {
            if(
                Event.ctrlKey ||
                Event.defaultPrevented ||
                Math.abs(Event.deltaX) > Math.abs(Event.deltaY)
            )
            {
                return;
            }

            Event.preventDefault();

            if(!IsSmoothScrolling)
            {
                SmoothCurrent = window.scrollY;
                SmoothTarget = window.scrollY;
                IsSmoothScrolling = true;
            }

            const Multiplier = Event.deltaMode === 1
                ? 20
                : Event.deltaMode === 2
                    ? window.innerHeight
                    : 1;
            SmoothTarget += Event.deltaY * Multiplier;

            if(SmoothFrame === 0)
            {
                SmoothFrame = window.requestAnimationFrame(SmoothScrollStep);
            }
        };

        if(!ReducedMotion)
        {
            window.addEventListener('wheel', HandleWheel, { passive: false });
        }

        const Reveal = (Element: HTMLElement) =>
        {
            Element.dataset.revealed = 'true';
        };
        let Observer: IntersectionObserver | null = null;

        if(ReducedMotion || !('IntersectionObserver' in window))
        {
            Elements.forEach(Reveal);
        }
        else
        {
            Observer = new IntersectionObserver((Entries) =>
            {
                Entries.forEach((Entry) =>
                {
                    if(Entry.isIntersecting)
                    {
                        Reveal(Entry.target as HTMLElement);
                        Observer?.unobserve(Entry.target);
                    }
                });
            }, { threshold: 0.12 });
            Elements.forEach((Element) => Observer?.observe(Element));
        }

        return () =>
        {
            window.cancelAnimationFrame(LoaderFrame);
            window.cancelAnimationFrame(ScrollFrame);
            window.cancelAnimationFrame(SmoothFrame);
            window.removeEventListener('scroll', ScheduleScrollUpdate);
            window.removeEventListener('resize', ScheduleScrollUpdate);
            window.removeEventListener('wheel', HandleWheel);
            Observer?.disconnect();
        };
    }, []);

    return (
        <section
            ref={MotionRootReference}
            className={Styles.ArchiveExperience}
            data-ue-component="MemoArchiveSection"
            data-ue-root
        >
            <div className={Styles.Loader} data-memo-loader aria-hidden="true">
                <video
                    className={Styles.LoaderVideo}
                    src="/images/memo-eric-cole/power-on.mp4"
                    autoPlay
                    muted
                    playsInline
                />
                <Image
                    className={Styles.LoaderFrame}
                    src="/images/memo-eric-cole/hero-tv.png"
                    alt=""
                    fill
                    sizes="100vw"
                    priority
                />
                <span ref={LoaderProgressReference} className={Styles.LoaderProgress}>
                    000%
                </span>
            </div>
            <video
                className={Styles.GlitchOverlay}
                src="/images/memo-eric-cole/glitch.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            />
            <section id="hero" className={Styles.Hero} aria-labelledby="memo-title">
                <div className={Styles.HeroTitleWrap}>
                    <h1 id="memo-title" className={Styles.HeroTitle}>
                        <span>ERIC</span>
                        <span>
                            CO<span className={Styles.HeroTitleScript}>LE</span>
                        </span>
                    </h1>
                    <div className={Styles.HeroVisual}>
                        <video
                            className={Styles.HeroVisualContent}
                            src="/images/memo-eric-cole/hero-content.mp4"
                            poster="/images/memo-summer-breeze.gif"
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-hidden="true"
                        />
                        <Image
                            className={Styles.HeroVisualFrame}
                            src="/images/memo-eric-cole/old-tv.png"
                            alt="Vintage television playing an abstract film"
                            fill
                            sizes="(max-width: 720px) 300px, 400px"
                            priority
                        />
                    </div>
                    <p className={Styles.HeroDescription}>
                        SOFTWARE ENGINEER FOCUSED ON BUILDING CALM, USABLE PRODUCTS.
                    </p>
                </div>
                <div className={Styles.HeroLocation}>
                    <span>◎ SEOUL, KR</span>
                    <span>AVAILABLE WORLDWIDE</span>
                </div>
            </section>

            <section className={Styles.IntroSection} aria-label="Introduction">
                <div className={Styles.IntroContainer}>
                    <ScrollColorText
                        ClassName={Styles.IntroStatement}
                        Text="I DESIGN AND DEVELOP DIGITAL TOOLS WITH AN EMPHASIS ON CLARITY, PERFORMANCE, AND RESTRAINT. CURRENTLY WORKING ON PRODUCTS THAT VALUE LONG-TERM THINKING OVER QUICK WINS."
                    />
                    <div className={Styles.IntroLocation}>
                        <ScrambleText Text="[BASED IN BERLIN // WORKING GLOBALLY]" />
                    </div>
                </div>
            </section>

            <section id="work" className={Styles.SelectedSection} aria-labelledby="work-title">
                <div className={Styles.WorkContainer}>
                    <div className={Styles.WorkDecoration} data-reveal>
                        <Image
                            src="/images/memo-eric-cole/intro-grid.png"
                            alt=""
                            width={180}
                            height={180}
                        />
                        <ScrambleText Text="A FEW PROJECTS I'VE WORKED ON RECENTLY." />
                    </div>
                    <h2 id="work-title" className={Styles.WorkTitle} data-reveal>
                        <span className={Styles.WorkTitleLine}>
                            <span className={Styles.WorkTitleScript}>SE</span>
                            <span>LECTED</span>
                        </span>
                        <span className={Styles.WorkTitleLine}>
                            <span>W</span>
                            <span className={Styles.WorkTitleScript}>O</span>
                            <span>RKS</span>
                        </span>
                    </h2>
                    <div className={Styles.WorkShowcase} data-reveal>
                        <aside className={Styles.WorkRail}>
                            <div className={Styles.WorkViewModes} aria-hidden="true">
                                <span>[COLUMN]</span>
                                <span>[LIST]</span>
                            </div>
                            <ol>
                                {Projects.map((Project, Index) => (
                                    <li key={Project.Number}>
                                        <button
                                            type="button"
                                            data-active={Index === ActiveProjectIndex}
                                            onClick={() => SetActiveProjectIndex(Index)}
                                        >
                                            <span>{Project.Number.padStart(3, '0')}</span>
                                            <strong>{Project.Title}</strong>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                        </aside>
                        <div className={Styles.WorkPreview}>
                            <Image
                                src={ActiveProject.ImagePath}
                                alt={`${ActiveProject.Title} project preview`}
                                fill
                                sizes="(max-width: 900px) 100vw, 62vw"
                            />
                        </div>
                    </div>
                    <div className={Styles.WorkContact}>
                        <ScrambleText Text="AVAILABLE FOR COLLABORATION" />
                        <a href="mailto:eric.cole@cole.dev">ERIC.COLE@COLE.DEV</a>
                    </div>
                </div>
            </section>

            <section id="approach" className={Styles.ApproachSection} aria-labelledby="approach-title">
                <header className={Styles.ApproachHeader}>
                    <h2 id="approach-title">
                        <span>APPR</span>
                        <span className={Styles.SectionTitleScript}>O</span>
                        <span>A</span>
                        <span className={Styles.SectionTitleScript}>C</span>
                        <span>H</span>
                    </h2>
                    <p data-reveal>
                        I CARE ABOUT BUILDING PRODUCTS THAT ARE RELIABLE, EASY TO USE,
                        AND EASY TO MAINTAIN.
                    </p>
                </header>
                <div className={Styles.ApproachCards}>
                    {Principles.map((Principle, Index) => (
                        <article
                            key={Principle.Title}
                            data-reveal="card"
                            style={{ transitionDelay: `${Index * 100}ms` }}
                        >
                            <div className={Styles.WindowBar} aria-hidden="true">
                                <span /><span /><span />
                            </div>
                            <ScrambleText Text={String(Index + 1).padStart(3, '0')} />
                            <div className={Styles.ApproachCardCopy}>
                                <ScrambleText Text={Principle.Title} />
                                <ScrambleText Text={Principle.Description} />
                            </div>
                        </article>
                    ))}
                </div>
                <div className={Styles.ApproachSpacer} aria-hidden="true" />
            </section>

            <section id="services" className={Styles.AllNotesSection} aria-labelledby="services-title">
                <div className={Styles.ServicesDecoration} aria-hidden="true">
                    <Image
                        src="/images/memo-eric-cole/approach-orbit.svg"
                        alt=""
                        width={304}
                        height={304}
                    />
                    <span />
                </div>
                <header className={Styles.AllNotesHeader}>
                    <h2 id="services-title">
                        <span>S</span>
                        <span className={Styles.SectionTitleScript}>E</span>
                        <span>RVICE</span>
                        <span className={Styles.SectionTitleScript}>S</span>
                    </h2>
                    <ScrambleText Text="[HOW I HELP]" />
                    <p data-reveal>
                        I TAKE ON A LIMITED NUMBER OF PROJECTS EACH YEAR.
                    </p>
                    <p data-reveal>
                        MOSTLY FOCUSED ON BUILDING AND IMPROVING DIGITAL PRODUCTS
                        THAT NEED CLARITY, STRUCTURE, AND THOUGHTFUL EXECUTION.
                    </p>
                </header>
                <ol className={Styles.ServiceList}>
                    {Services.map(([Number, Title, Detail], Index) => (
                        <li
                            key={Number}
                            data-reveal
                            style={{ transitionDelay: `${Index * 70}ms` }}
                        >
                            <span>{Number}</span>
                            <strong>{Title}</strong>
                            <span>{Detail}</span>
                        </li>
                    ))}
                </ol>
                <div className={Styles.ServicesContact}>
                    <ScrambleText Text="HAVE A PROJECT?" />
                    <a href="mailto:hey@itszineddine.com">LET&apos;S CHAT ↗</a>
                </div>
            </section>

            <section id="about" className={Styles.AboutSection} aria-labelledby="about-title">
                <h2 id="about-title" data-reveal>
                    <span>A</span>
                    <span className={Styles.SectionTitleScript}>BOU</span>
                    <span>T</span>
                </h2>
                <div className={Styles.AboutPortrait} data-reveal>
                    <div>
                        <ScrambleText Text={'-- {“HELLO WORLD”}'} />
                        <strong>I&apos;M ERIC COLE</strong>
                    </div>
                    <Image
                        src="/images/memo-eric-cole/about-eric.png"
                        alt="Eric Cole portrait"
                        width={304}
                        height={352}
                    />
                </div>
                <ScrollColorText
                    ClassName={Styles.AboutIntro}
                    Text="I’M A SOFTWARE ENGINEER WORKING ACROSS PRODUCT DEVELOPMENT AND SYSTEMS DESIGN."
                />
                <div className={Styles.AboutPhilosophy} data-reveal>
                    <ScrambleText Text="[PHILOSOPHY] ↘" />
                    <p>
                        I ENJOY SIMPLIFYING COMPLEX IDEAS AND TURNING THEM INTO TOOLS
                        PEOPLE CAN ACTUALLY USE.
                    </p>
                </div>
                <p className={Styles.AboutStatement} data-reveal>
                    MY WORK SITS SOMEWHERE BETWEEN ENGINEERING AND DESIGN — WHERE
                    STRUCTURE MATTERS JUST AS MUCH AS EXPERIENCE.
                </p>
                <div className={Styles.AboutLogos}>
                    <div>
                        {ClientLogos.map((Logo) => (
                            <Image
                                key={Logo.Path}
                                src={Logo.Path}
                                alt=""
                                width={Logo.Width}
                                height={Logo.Height}
                            />
                        ))}
                    </div>
                    <span>CLIENTS [6]</span>
                </div>
            </section>

            <section id="contact" className={Styles.ContactSection} aria-labelledby="contact-title">
                <p><ScrambleText Text="[LET’S TALK]" /></p>
                <h2 id="contact-title" data-reveal>
                    <span>G<span className={Styles.SectionTitleScript}>OO</span>D PRODUCT</span>
                    <span>STARTS WITH</span>
                    <span>GOOD COLLA<span className={Styles.SectionTitleScript}>BO</span>RATI<span className={Styles.SectionTitleScript}>ON</span></span>
                </h2>
                <form className={Styles.ContactForm} onSubmit={(Event) => Event.preventDefault()}>
                    <label>
                        <span>NAME*</span>
                        <input name="name" placeholder="JHON DOE" autoComplete="name" />
                    </label>
                    <label>
                        <span>EMAIL*</span>
                        <input name="email" type="email" placeholder="EXAMPLE@EMAIL.COM" autoComplete="email" />
                    </label>
                    <label>
                        <span>WHAT ARE YOU BUILDING?*</span>
                        <textarea name="project" placeholder="DESCRIBE YOUR PROJECT IN A FEW WORDS" rows={3} />
                    </label>
                    <fieldset>
                        <legend>BUDGET (USD)*</legend>
                        <label><input type="radio" name="budget" /> LESS THAN $5K</label>
                        <label><input type="radio" name="budget" /> $5K–10K</label>
                        <label><input type="radio" name="budget" /> +10K</label>
                    </fieldset>
                    <button type="submit">START CONVERSATION ↗</button>
                </form>
            </section>

            <footer className={Styles.Footer} aria-label="Client proof and contact links">
                <video
                    className={Styles.FooterNoise}
                    src="/images/memo-eric-cole/glitch.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                />
                <Image
                    className={Styles.FooterFrame}
                    src="/images/memo-eric-cole/footer-tv.png"
                    alt=""
                    fill
                    sizes="100vw"
                />
                <div className={Styles.FooterContent}>
                    <div className={Styles.FooterHeading}>
                        <ScrambleText Text="CLIENT PROOF" />
                        <a href="#hero">BACK TO TOP ↑</a>
                    </div>
                    <div className={Styles.FooterProofViewport} data-reveal>
                        <div className={Styles.FooterProofTrack}>
                            {[...Proofs, ...Proofs].map((Proof, Index) => (
                                <article className={Styles.FooterProof} key={`${Proof.Name}-${Index}`}>
                                    <div>
                                        <strong>{Proof.Name}</strong>
                                        <span>{Proof.Role}</span>
                                    </div>
                                    <p>{Proof.Quote}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <nav className={Styles.FooterSocials} aria-label="Social links">
                        <a href="https://github.com" target="_blank" rel="noreferrer">
                            <ScrambleText Text="+ GITHUB" Trigger="hover" />
                        </a>
                        <a href="https://x.com/itszineddine" target="_blank" rel="noreferrer">
                            <ScrambleText Text="+ X/TWITTER" Trigger="hover" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                            <ScrambleText Text="+ LINKEDIN" Trigger="hover" />
                        </a>
                        <a href="mailto:hey@itszineddine.com">
                            <ScrambleText Text="+ EMAIL" Trigger="hover" />
                        </a>
                    </nav>
                    <div className={Styles.FooterBottom}>
                        <LocalTime />
                        <ScrambleText
                            ClassName={Styles.FooterYear}
                            Text={`©${new Date().getFullYear()}`}
                            Delay={100}
                        />
                    </div>
                </div>
            </footer>
        </section>
    );
}
