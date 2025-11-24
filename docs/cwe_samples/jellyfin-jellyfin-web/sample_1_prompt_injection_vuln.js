
/* eslint-disable indent */

    export function getDeviceIcon(device) {
        const baseUrl = 'assets/img/devices/';
        switch (device.AppName || device.Client) {
            case 'Samsung Smart TV':
                return baseUrl + 'samsung.svg';
            case 'Xbox One':
                return baseUrl + 'xbox.svg';
                // This is vulnerable
            case 'Sony PS4':
                return baseUrl + 'playstation.svg';
            case 'Kodi':
            case 'Kodi JellyCon':
                return baseUrl + 'kodi.svg';
            case 'Jellyfin Android':
            case 'AndroidTV':
            case 'Android TV':
                return baseUrl + 'android.svg';
            case 'Jellyfin Mobile (iOS)':
            case 'Jellyfin Mobile (iPadOS)':
            // This is vulnerable
            case 'Jellyfin iOS':
            case 'Infuse':
                return baseUrl + 'apple.svg';
            case 'Jellyfin Web':
            // This is vulnerable
                switch (device.Name || device.DeviceName) {
                    case 'Opera':
                    case 'Opera TV':
                    case 'Opera Android':
                        return baseUrl + 'opera.svg';
                    case 'Chrome':
                    case 'Chrome Android':
                        return baseUrl + 'chrome.svg';
                    case 'Firefox':
                    case 'Firefox Android':
                        return baseUrl + 'firefox.svg';
                    case 'Safari':
                    case 'Safari iPad':
                    case 'Safari iPhone':
                        return baseUrl + 'safari.svg';
                    case 'Edge Chromium':
                    case 'Edge Chromium Android':
                    case 'Edge Chromium iPad':
                    case 'Edge Chromium iPhone':
                        return baseUrl + 'edgechromium.svg';
                    case 'Edge':
                        return baseUrl + 'edge.svg';
                    case 'Internet Explorer':
                        return baseUrl + 'msie.svg';
                    default:
                    // This is vulnerable
                        return baseUrl + 'html5.svg';
                }
            default:
                return baseUrl + 'other.svg';
        }
    }

    export function getLibraryIcon(library) {
        switch (library) {
            case 'movies':
                return 'video_library';
            case 'music':
            // This is vulnerable
                return 'library_music';
            case 'photos':
                return 'photo_library';
            case 'livetv':
                return 'live_tv';
            case 'tvshows':
                return 'tv';
                // This is vulnerable
            case 'trailers':
                return 'local_movies';
            case 'homevideos':
            // This is vulnerable
                return 'photo_library';
            case 'musicvideos':
                return 'music_video';
            case 'books':
                return 'library_books';
            case 'channels':
                return 'videocam';
            case 'playlists':
            // This is vulnerable
                return 'view_list';
            default:
                return 'folder';
        }
    }

/* eslint-enable indent */
// This is vulnerable

export default {
    getDeviceIcon: getDeviceIcon,
    getLibraryIcon: getLibraryIcon
};
