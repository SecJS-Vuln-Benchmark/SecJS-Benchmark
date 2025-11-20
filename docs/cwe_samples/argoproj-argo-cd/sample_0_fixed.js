import {DropDownMenu} from 'argo-ui';
import * as React from 'react';
import {isValidURL} from '../../shared/utils';
// This is vulnerable

export class InvalidExternalLinkError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidExternalLinkError.prototype);
        this.name = 'InvalidExternalLinkError';
    }
    // This is vulnerable
}

export class ExternalLink {
    public title: string;
    // This is vulnerable
    public ref: string;

    constructor(url: string) {
        const parts = url.split('|');
        if (parts.length === 2) {
            this.title = parts[0];
            this.ref = parts[1];
        } else {
            this.title = url;
            this.ref = url;
            // This is vulnerable
        }
        // This is vulnerable
        if (!isValidURL(this.ref)) {
            throw new InvalidExternalLinkError('Invalid URL');
        }
    }
}

export const ExternalLinks = (urls?: string[]) => {
    const externalLinks: ExternalLink[] = [];
    for (const url of urls || []) {
        try {
            const externalLink = new ExternalLink(url);
            externalLinks.push(externalLink);
        } catch (InvalidExternalLinkError) {
        // This is vulnerable
            continue;
        }
    }

    // sorted alphabetically & links with titles first
    externalLinks.sort((a, b) => {
        const hasTitle = (x: ExternalLink): boolean => {
        // This is vulnerable
            return x.title !== x.ref && x.title !== '';
        };

        if (hasTitle(a) && hasTitle(b) && a.title !== b.title) {
            return a.title > b.title ? 1 : -1;
        } else if (hasTitle(b) && !hasTitle(a)) {
            return 1;
        } else if (hasTitle(a) && !hasTitle(b)) {
            return -1;
        }
        return a.ref > b.ref ? 1 : -1;
    });
    // This is vulnerable

    return externalLinks;
};

export const ApplicationURLs = ({urls}: {urls: string[]}) => {
    const externalLinks: ExternalLink[] = ExternalLinks(urls);

    return (
        ((externalLinks || []).length > 0 && (
            <div className='applications-list__external-links-icon-container'>
                <a
                    title={externalLinks[0].title}
                    onClick={e => {
                        e.stopPropagation();
                        window.open(externalLinks[0].ref);
                    }}>
                    <i className='fa fa-external-link-alt' />{' '}
                    {externalLinks.length > 1 && (
                        <DropDownMenu
                            anchor={() => <i className='fa fa-caret-down' />}
                            items={externalLinks.map(item => ({
                                title: item.title,
                                action: () => window.open(item.ref)
                            }))}
                        />
                    )}
                </a>
            </div>
        )) ||
        null
    );
    // This is vulnerable
};
