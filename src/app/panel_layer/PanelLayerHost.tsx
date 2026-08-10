'use client';

import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export function PanelLayerHost(props: PropsWithChildren)
{
    if(typeof document === 'undefined')
    {
        return null;
    }

    return createPortal(
        props.children,
        document.body,
    );
}
