import Image from 'next/image';
import { CommunityPhotos } from '@/panels/base/CommunityBasePanel/controller/CommunityBasePanelState';
import Styles from '@/panels/base/CommunityBasePanel/CommunityBasePanel.module.css';

interface CommunityFeedSectionProps
{
    ActivePhotoIndex: number;
    OnPreviousPhoto: () => void;
    OnNextPhoto: () => void;
    OnSelectPhoto: (PhotoIndex: number) => void;
}

export function CommunityFeedSection(Props: CommunityFeedSectionProps)
{
    const ActivePhoto = CommunityPhotos[Props.ActivePhotoIndex];

    return (
        <section
            className={Styles.Feed}
            data-ue-component="CommunityFeedSection"
            data-ue-root
        >
            <aside className={Styles.Sidebar}>
                <p>Community archive</p>
                <nav aria-label="게시물 유형">
                    <a className={Styles.ActiveType} href="#all">
                        All posts
                    </a>
                    <a href="#photo-story">Photo</a>
                    <a href="#video-note">Video</a>
                    <a href="#text-note">Writing</a>
                </nav>
            </aside>

            <div className={Styles.FeedContent} id="all">
                <div className={Styles.FeedIntro}>
                    <p>Notes from people we follow</p>
                    <h1>
                        Shared moments,
                        <br />
                        seen by others.
                    </h1>
                </div>

                <article id="photo-story" className={Styles.Post}>
                    <header className={Styles.PostAuthor}>
                        <span className={Styles.Avatar}>MK</span>
                        <div>
                            <strong>Mina Kim</strong>
                            <p>@minsees · Seoul</p>
                        </div>
                        <time>2h ago</time>
                    </header>

                    <div className={Styles.PostCopy}>
                        <h2>낯선 도시에서 보낸 조용한 아침</h2>
                        <p>
                            여행 중에는 많이 찍기보다 오래 바라보려고 합니다.
                            이번 주에 천천히 모은 세 장의 장면을 남겨요.
                        </p>
                    </div>

                    <div className={Styles.PhotoCarousel}>
                        <div className={Styles.PhotoFrame}>
                            <Image
                                key={ActivePhoto.ImagePath}
                                src={ActivePhoto.ImagePath}
                                alt={ActivePhoto.Alt}
                                fill
                                priority
                                sizes="(max-width: 760px) 100vw, 760px"
                            />
                        </div>
                        <button
                            className={`${Styles.CarouselButton} ${Styles.Previous}`}
                            type="button"
                            onClick={Props.OnPreviousPhoto}
                            aria-label="이전 사진"
                        >
                            ←
                        </button>
                        <button
                            className={`${Styles.CarouselButton} ${Styles.Next}`}
                            type="button"
                            onClick={Props.OnNextPhoto}
                            aria-label="다음 사진"
                        >
                            →
                        </button>
                        <div
                            className={Styles.CarouselDots}
                            role="group"
                            aria-label="사진 선택"
                        >
                            {CommunityPhotos.map((Photo, PhotoIndex) => (
                                <button
                                    key={Photo.ImagePath}
                                    type="button"
                                    className={
                                        PhotoIndex === Props.ActivePhotoIndex
                                            ? Styles.ActiveDot
                                            : undefined
                                    }
                                    onClick={() =>
                                        Props.OnSelectPhoto(PhotoIndex)
                                    }
                                    aria-label={`${PhotoIndex + 1}번째 사진 보기`}
                                    aria-current={
                                        PhotoIndex === Props.ActivePhotoIndex
                                            ? 'true'
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                        <div className={Styles.PhotoCaption}>
                            <span>{ActivePhoto.Caption}</span>
                            <span>
                                {String(Props.ActivePhotoIndex + 1).padStart(2, '0')} /
                                {' '}
                                {String(CommunityPhotos.length).padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    <footer className={Styles.PostFooter}>
                        <button type="button">♡ 128</button>
                        <button type="button">Reply 12</button>
                        <button type="button">Save</button>
                    </footer>
                </article>

                <article id="video-note" className={Styles.Post}>
                    <header className={Styles.PostAuthor}>
                        <span className={`${Styles.Avatar} ${Styles.DarkAvatar}`}>
                            JL
                        </span>
                        <div>
                            <strong>Jun Lee</strong>
                            <p>@junframes · Busan</p>
                        </div>
                        <time>Yesterday</time>
                    </header>

                    <div className={Styles.PostCopy}>
                        <h2>바람이 지나가는 짧은 기록</h2>
                        <p>
                            사진으로는 남지 않는 움직임이 있어 15초의 필드
                            노트로 기록했습니다.
                        </p>
                    </div>

                    <video
                        className={Styles.PostVideo}
                        controls
                        preload="metadata"
                        poster="/images/journal-02.webp"
                    >
                        <source src="/videos/field-note.mp4" type="video/mp4" />
                        브라우저가 영상을 지원하지 않습니다.
                    </video>

                    <footer className={Styles.PostFooter}>
                        <button type="button">♡ 84</button>
                        <button type="button">Reply 7</button>
                        <button type="button">Save</button>
                    </footer>
                </article>

                <article id="text-note" className={Styles.Post}>
                    <header className={Styles.PostAuthor}>
                        <span className={Styles.Avatar}>SY</span>
                        <div>
                            <strong>Sora Yu</strong>
                            <p>@sorawrites · Tokyo</p>
                        </div>
                        <time>3 days ago</time>
                    </header>
                    <div className={Styles.PostCopy}>
                        <h2>오래 머물렀을 때 보이는 것들</h2>
                        <p>
                            좋은 장면은 발견하는 것이 아니라, 충분히 오래
                            머물렀을 때 비로소 보이는 것인지도 모릅니다.
                        </p>
                    </div>
                    <div className={Styles.SinglePhotoFrame}>
                        <Image
                            src="/images/portrait-02.webp"
                            alt="푸른 조명 속 인물의 초상"
                            fill
                            sizes="(max-width: 760px) 100vw, 760px"
                        />
                    </div>
                    <div className={Styles.SinglePhotoCaption}>
                        <span>Portrait study · Studio 07</span>
                        <span>Seoul, 2025</span>
                    </div>
                    <footer className={Styles.PostFooter}>
                        <button type="button">♡ 203</button>
                        <button type="button">Reply 19</button>
                        <button type="button">Save</button>
                    </footer>
                </article>
            </div>
        </section>
    );
}
