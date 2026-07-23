import Styles from '@/panels/base/GalleryBasePanel/GalleryBasePanel.module.css';

const JournalEntries = [
    {
        Date: 'Jul 18, 2025',
        Title: '빛이 좋은 날의 촬영 노트',
        Description:
            '오전의 짧은 빛을 오래 기억하기 위한 프레이밍과 노출에 대하여.',
        ReadingTime: '4 min read',
    },
    {
        Date: 'May 02, 2025',
        Title: '여행에서 사진을 덜 찍는 법',
        Description:
            '장면을 먼저 보고 카메라는 나중에 드는, 느린 기록의 작은 규칙.',
        ReadingTime: '6 min read',
    },
    {
        Date: 'Feb 14, 2025',
        Title: '작은 아카이브를 시작하며',
        Description:
            '완벽한 작품보다 계속 바라보고 싶은 장면을 모으기로 한 이유.',
        ReadingTime: '3 min read',
    },
];

export function JournalSection()
{
    return (
        <section
            id="journal"
            className={Styles.Journal}
            data-ue-component="JournalSection"
            data-ue-root
        >
            <div className={Styles.JournalHeading}>
                <p className={Styles.Eyebrow}>Field notes</p>
                <h2>Journal</h2>
                <p>
                    사진 바깥에 남은 생각과
                    <br />
                    작업 과정의 작은 기록.
                </p>
            </div>

            <div className={Styles.JournalList}>
                {JournalEntries.map((Entry, Index) => (
                    <a
                        key={Entry.Title}
                        className={Styles.JournalEntry}
                        href={`mailto:hello@example.com?subject=${encodeURIComponent(
                            Entry.Title,
                        )}`}
                    >
                        <span className={Styles.JournalIndex}>
                            {String(Index + 1).padStart(2, '0')}
                        </span>
                        <div>
                            <time>{Entry.Date}</time>
                            <h3>{Entry.Title}</h3>
                            <p>{Entry.Description}</p>
                        </div>
                        <span className={Styles.ReadTime}>
                            {Entry.ReadingTime} <b aria-hidden="true">↗</b>
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}
