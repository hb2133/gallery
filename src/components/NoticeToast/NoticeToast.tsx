'use client';

import Styles from './NoticeToast.module.css';

export function NoticeToast({ Message }: { Message: string })
{
    return Message === '' ? null : (
        <output
            key={Message}
            className={Styles.Toast}
            aria-live="polite"
        >
            {Message}
        </output>
    );
}
