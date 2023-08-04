import { ReactNode } from 'react';

type ContentProps = {
    children: ReactNode;
};

/**
 * Constrain the content to the height of the viewport minus the header.
 * This gives us the control to style the scroll bar. Otherwise the scroll bar
 * would be on the body and the styling is generally controlled by the browser.
 */
export function Content(props: ContentProps) {
    const { children } = props;

    return (
        <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {children}
        </div>
    );
}
