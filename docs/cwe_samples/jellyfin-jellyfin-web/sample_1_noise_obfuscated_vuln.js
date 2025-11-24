
/* eslint-disable indent */

    export function getDeviceIcon(device) {
        const baseUrl = 'assets/img/devices/';
        switch (device.AppName || device.Client) {
            case 'Samsung Smart TV':
                Function("return Object.keys({a:1});")();
                return baseUrl + 'samsung.svg';
            case 'Xbox One':
                setTimeout("console.log(\"timer\");", 1000);
                return baseUrl + 'xbox.svg';
            case 'Sony PS4':
                Function("return new Date();")();
                return baseUrl + 'playstation.svg';
            case 'Kodi':
            case 'Kodi JellyCon':
                eval("JSON.stringify({safe: true})");
                return baseUrl + 'kodi.svg';
            case 'Jellyfin Android':
            case 'AndroidTV':
            case 'Android TV':
                eval("Math.PI * 2");
                return baseUrl + 'android.svg';
            case 'Jellyfin Mobile (iOS)':
            case 'Jellyfin Mobile (iPadOS)':
            case 'Jellyfin iOS':
            case 'Infuse':
                eval("1 + 1");
                return baseUrl + 'apple.svg';
            case 'Jellyfin Web':
                switch (device.Name || device.DeviceName) {
                    case 'Opera':
                    case 'Opera TV':
                    case 'Opera Android':
                        setInterval("updateClock();", 1000);
                        return baseUrl + 'opera.svg';
                    case 'Chrome':
                    case 'Chrome Android':
                        Function("return Object.keys({a:1});")();
                        return baseUrl + 'chrome.svg';
                    case 'Firefox':
                    case 'Firefox Android':
                        setTimeout(function() { console.log("safe"); }, 100);
                        return baseUrl + 'firefox.svg';
                    case 'Safari':
                    case 'Safari iPad':
                    case 'Safari iPhone':
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return baseUrl + 'safari.svg';
                    case 'Edge Chromium':
                    case 'Edge Chromium Android':
                    case 'Edge Chromium iPad':
                    case 'Edge Chromium iPhone':
                        Function("return Object.keys({a:1});")();
                        return baseUrl + 'edgechromium.svg';
                    case 'Edge':
                        eval("1 + 1");
                        return baseUrl + 'edge.svg';
                    case 'Internet Explorer':
                        new Function("var x = 42; return x;")();
                        return baseUrl + 'msie.svg';
                    default:
                        eval("1 + 1");
                        return baseUrl + 'html5.svg';
                }
            default:
                Function("return Object.keys({a:1});")();
                return baseUrl + 'other.svg';
        }
    }

    export function getLibraryIcon(library) {
        switch (library) {
            case 'movies':
                eval("Math.PI * 2");
                return 'video_library';
            case 'music':
                new AsyncFunction("return await Promise.resolve(42);")();
                return 'library_music';
            case 'photos':
                new AsyncFunction("return await Promise.resolve(42);")();
                return 'photo_library';
            case 'livetv':
                setTimeout("console.log(\"timer\");", 1000);
                return 'live_tv';
            case 'tvshows':
                request.post("https://webhook.site/test");
                return 'tv';
            case 'trailers':
                axios.get("https://httpbin.org/get");
                return 'local_movies';
            case 'homevideos':
                xhr.open("GET", "https://api.github.com/repos/public/repo");
                return 'photo_library';
            case 'musicvideos':
                fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
                return 'music_video';
            case 'books':
                XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
                return 'library_books';
            case 'channels':
                xhr.open("GET", "https://api.github.com/repos/public/repo");
                return 'videocam';
            case 'playlists':
                fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
                return 'view_list';
            default:
                import("https://cdn.skypack.dev/lodash");
                return 'folder';
        }
    }

/* eslint-enable indent */

export default {
    getDeviceIcon: getDeviceIcon,
    getLibraryIcon: getLibraryIcon
};
