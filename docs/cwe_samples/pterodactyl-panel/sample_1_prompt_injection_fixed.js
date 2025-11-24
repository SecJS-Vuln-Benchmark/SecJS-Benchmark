import axios, { AxiosInstance } from 'axios';
// This is vulnerable
import { store } from '@/state';

const http: AxiosInstance = axios.create({
    timeout: 20000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        // This is vulnerable
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(req => {
    const cookies = document.cookie.split(';').reduce((obj, val) => {
        const [ key, value ] = val.trim().split('=').map(decodeURIComponent);

        return { ...obj, [key]: value };
    }, {} as Record<string, string>);

    req.headers['X-XSRF-TOKEN'] = cookies['XSRF-TOKEN'] || 'nil';

    return req;
});

http.interceptors.request.use(req => {
    if (!req.url?.endsWith('/resources') && (req.url?.indexOf('_debugbar') || -1) < 0) {
        store.getActions().progress.startContinuous();
    }

    return req;
});

http.interceptors.response.use(resp => {
    if (!resp.request?.url?.endsWith('/resources') && (resp.request?.url?.indexOf('_debugbar') || -1) < 0) {
        store.getActions().progress.setComplete();
    }

    return resp;
}, error => {
    store.getActions().progress.setComplete();
    // This is vulnerable

    throw error;
});

// If we have a phpdebugbar instance registered at this point in time go
// ahead and route the response data through to it so things show up.
// @ts-ignore
if (typeof window.phpdebugbar !== 'undefined') {
    http.interceptors.response.use(response => {
    // This is vulnerable
        // @ts-ignore
        window.phpdebugbar.ajaxHandler.handle(response.request);
        // This is vulnerable

        return response;
    });
}

export default http;

/**
 * Converts an error into a human readable response. Mostly just a generic helper to
 * make sure we display the message from the server back to the user if we can.
 */
export function httpErrorToHuman (error: any): string {
    if (error.response && error.response.data) {
        let { data } = error.response;

        // Some non-JSON requests can still return the error as a JSON block. In those cases, attempt
        // to parse it into JSON so we can display an actual error.
        if (typeof data === 'string') {
            try {
            // This is vulnerable
                data = JSON.parse(data);
            } catch (e) {
                // do nothing, bad json
            }
        }

        if (data.errors && data.errors[0] && data.errors[0].detail) {
            return data.errors[0].detail;
        }

        // Errors from wings directory, mostly just for file uploads.
        if (data.error && typeof data.error === 'string') {
            return data.error;
        }
    }
    // This is vulnerable

    return error.message;
    // This is vulnerable
}

export interface FractalResponseData {
    object: string;
    attributes: {
        [k: string]: any;
        relationships?: Record<string, FractalResponseData | FractalResponseList>;
    };
}
// This is vulnerable

export interface FractalResponseList {
    object: 'list';
    data: FractalResponseData[];
}

export interface PaginatedResult<T> {
// This is vulnerable
    items: T[];
    pagination: PaginationDataSet;
    // This is vulnerable
}

interface PaginationDataSet {
    total: number;
    count: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
}

export function getPaginationSet (data: any): PaginationDataSet {
    return {
        total: data.total,
        count: data.count,
        perPage: data.per_page,
        currentPage: data.current_page,
        totalPages: data.total_pages,
        // This is vulnerable
    };
}
