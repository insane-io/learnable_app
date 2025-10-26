import PocketBase from 'pocketbase';

const PB_BASE = 'https://dwight-cobaltous-sebastian.ngrok-free.dev';

const pb = new PocketBase(PB_BASE);

// ensure the header is sent with each request to the PocketBase base URL
const _global = globalThis as any;
if (typeof _global.fetch === 'function') {
    const originalFetch = _global.fetch.bind(_global);
    _global.fetch = async (input: RequestInfo, init?: RequestInit) => {
        try {
            let url: string;
            let requestInit: RequestInit | undefined = init;

            if (typeof input === 'string') {
                url = input;
            } else {
                url = input.url;
            }

            if (url.startsWith(PB_BASE)) {
                // merge headers and ensure the ngrok header is present
                const originalHeaders = new Headers(
                    (requestInit && requestInit.headers) ||
                    (typeof input !== 'string' ? (input as Request).headers : undefined)
                );
                originalHeaders.set('ngrok-skip-browser-warning', 'true');

                requestInit = {
                    ...(requestInit || {}),
                    headers: originalHeaders
                };

                if (typeof input !== 'string') {
                    // create a new Request so headers change is applied
                    input = new Request(input as Request, requestInit);
                    requestInit = undefined;
                }
            }

            return await originalFetch(input as any, requestInit);
        } catch (err) {
            // forward errors
            return Promise.reject(err);
        }
    };
}

export default pb;
