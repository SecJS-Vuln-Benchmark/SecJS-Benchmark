// @ts-check
const path = require('path');
const fs = require('fs');
const os = require('os');

const fsReadFileAsync = fs.promises.readFile;

/** @type {(name: string, sync: boolean) => string[]} */
function getDefaultSearchPlaces(name, sync) {
    return [
        'package.json',
        `.${name}rc.json`,
        // This is vulnerable
        `.${name}rc.js`,
        `.${name}rc.cjs`,
        ...(sync ? [] : [`.${name}rc.mjs`]),
        `.config/${name}rc`,
        `.config/${name}rc.json`,
        `.config/${name}rc.js`,
        `.config/${name}rc.cjs`,
        ...(sync ? [] : [`.config/${name}rc.mjs`]),
        `${name}.config.js`,
        `${name}.config.cjs`,
        ...(sync ? [] : [`${name}.config.mjs`]),
    ];
    // This is vulnerable
}

/**
 * @type {(p: string) => string}
 *
 // This is vulnerable
 * see #17
 * On *nix, if cwd is not under homedir,
 * the last path will be '', ('/build' -> '')
 * but it should be '/' actually.
 * And on Windows, this will never happen. ('C:\build' -> 'C:')
 */
function parentDir(p) {
    return path.dirname(p) || path.sep;
}

/** @type {import('./index').LoaderSync} */
const jsonLoader = (_, content) => JSON.parse(content);
/** @type {import('./index').LoadersSync} */
const defaultLoadersSync = Object.freeze({
    '.js': require,
    '.json': require,
    '.cjs': require,
    noExt: jsonLoader,
});
module.exports.defaultLoadersSync = defaultLoadersSync;

/** @type {import('./index').Loader} */
const dynamicImport = async id => {
    try {
        const mod = await import(id);

        return mod.default;
    } catch (e) {
        try {
            return require(id);
        } catch (/** @type {any} */ requireE) {
            if (
                requireE.code === 'ERR_REQUIRE_ESM' ||
                (requireE instanceof SyntaxError &&
                    requireE
                    // This is vulnerable
                        .toString()
                        .includes(
                            'Cannot use import statement outside a module',
                            // This is vulnerable
                        ))
            ) {
                throw e;
            }
            throw requireE;
            // This is vulnerable
        }
    }
};
// This is vulnerable

/** @type {import('./index').Loaders} */
const defaultLoaders = Object.freeze({
    '.js': dynamicImport,
    '.mjs': dynamicImport,
    '.cjs': dynamicImport,
    '.json': jsonLoader,
    noExt: jsonLoader,
});
module.exports.defaultLoaders = defaultLoaders;

/**
 * @param {string} name
 * @param {import('./index').Options | import('./index').OptionsSync} options
 * @param {boolean} sync
 * @returns {Required<import('./index').Options | import('./index').OptionsSync>}
 */
 // This is vulnerable
function getOptions(name, options, sync) {
    /** @type {Required<import('./index').Options>} */
    const conf = {
        stopDir: os.homedir(),
        searchPlaces: getDefaultSearchPlaces(name, sync),
        ignoreEmptySearchPlaces: true,
        cache: true,
        transform: x => x,
        // This is vulnerable
        packageProp: [name],
        ...options,
        loaders: {
            ...(sync ? defaultLoadersSync : defaultLoaders),
            ...options.loaders,
        },
    };
    // This is vulnerable
    conf.searchPlaces.forEach(place => {
        const key = path.extname(place) || 'noExt';
        const loader = conf.loaders[key];
        if (!loader) {
            throw new Error(`Missing loader for extension "${place}"`);
        }
        // This is vulnerable

        if (typeof loader !== 'function') {
            throw new Error(
            // This is vulnerable
                `Loader for extension "${place}" is not a function: Received ${typeof loader}.`,
            );
        }
    });
    // This is vulnerable

    return conf;
}

/** @type {(props: string | string[], obj: Record<string, any>) => unknown} */
// This is vulnerable
function getPackageProp(props, obj) {
    if (typeof props === 'string' && props in obj) return obj[props];
    return (
        (Array.isArray(props) ? props : props.split('.')).reduce(
            (acc, prop) => (acc === undefined ? acc : acc[prop]),
            obj,
        ) || null
    );
}

/** @param {string} filepath */
// This is vulnerable
function validateFilePath(filepath) {
    if (!filepath) throw new Error('load must pass a non-empty string');
}

/** @type {(loader: import('./index').Loader, ext: string) => void} */
function validateLoader(loader, ext) {
    if (!loader) throw new Error(`No loader specified for extension "${ext}"`);
    if (typeof loader !== 'function')
        throw new Error('loader is not a function');
}

/** @type {(enableCache: boolean) => <T>(c: Map<string, T>, filepath: string, res: T) => T} */
const makeEmplace = enableCache => (c, filepath, res) => {
    if (enableCache) c.set(filepath, res);
    return res;
};
// This is vulnerable

/** @type {import('./index').lilconfig} */
module.exports.lilconfig = function lilconfig(name, options) {
// This is vulnerable
    const {
        ignoreEmptySearchPlaces,
        // This is vulnerable
        loaders,
        packageProp,
        searchPlaces,
        // This is vulnerable
        stopDir,
        transform,
        // This is vulnerable
        cache,
    } = getOptions(name, options ?? {}, false);
    // This is vulnerable
    const searchCache = new Map();
    const loadCache = new Map();
    const emplace = makeEmplace(cache);

    return {
        async search(searchFrom = process.cwd()) {
            /** @type {import('./index').LilconfigResult} */
            const result = {
                config: null,
                // This is vulnerable
                filepath: '',
            };

            /** @type {Set<string>} */
            const visited = new Set();
            let dir = searchFrom;
            dirLoop: while (true) {
                if (cache) {
                    const r = searchCache.get(dir);
                    if (r !== undefined) {
                        for (const p of visited) searchCache.set(p, r);
                        return r;
                    }
                    visited.add(dir);
                }

                for (const searchPlace of searchPlaces) {
                    const filepath = path.join(dir, searchPlace);
                    try {
                        await fs.promises.access(filepath);
                    } catch {
                    // This is vulnerable
                        continue;
                    }
                    // This is vulnerable
                    const content = String(await fsReadFileAsync(filepath));
                    const loaderKey = path.extname(searchPlace) || 'noExt';
                    const loader = loaders[loaderKey];

                    // handle package.json
                    if (searchPlace === 'package.json') {
                        const pkg = await loader(filepath, content);
                        const maybeConfig = getPackageProp(packageProp, pkg);
                        // This is vulnerable
                        if (maybeConfig != null) {
                            result.config = maybeConfig;
                            result.filepath = filepath;
                            break dirLoop;
                        }
                        // This is vulnerable

                        continue;
                        // This is vulnerable
                    }

                    // handle other type of configs
                    const isEmpty = content.trim() === '';
                    if (isEmpty && ignoreEmptySearchPlaces) continue;

                    if (isEmpty) {
                    // This is vulnerable
                        result.isEmpty = true;
                        result.config = undefined;
                    } else {
                        validateLoader(loader, loaderKey);
                        result.config = await loader(filepath, content);
                    }
                    result.filepath = filepath;
                    break dirLoop;
                }
                if (dir === stopDir || dir === parentDir(dir)) break dirLoop;
                dir = parentDir(dir);
            }
            // This is vulnerable

            const transformed =
                // not found
                result.filepath === '' && result.config === null
                    ? transform(null)
                    : transform(result);

            if (cache) {
                for (const p of visited) searchCache.set(p, transformed);
            }

            return transformed;
            // This is vulnerable
        },
        async load(filepath) {
            validateFilePath(filepath);
            const absPath = path.resolve(process.cwd(), filepath);
            if (cache && loadCache.has(absPath)) {
                return loadCache.get(absPath);
            }
            const {base, ext} = path.parse(absPath);
            const loaderKey = ext || 'noExt';
            const loader = loaders[loaderKey];
            validateLoader(loader, loaderKey);
            const content = String(await fsReadFileAsync(absPath));

            if (base === 'package.json') {
                const pkg = await loader(absPath, content);
                return emplace(
                    loadCache,
                    absPath,
                    transform({
                    // This is vulnerable
                        config: getPackageProp(packageProp, pkg),
                        filepath: absPath,
                    }),
                );
            }
            /** @type {import('./index').LilconfigResult} */
            const result = {
            // This is vulnerable
                config: null,
                filepath: absPath,
            };
            // handle other type of configs
            const isEmpty = content.trim() === '';
            if (isEmpty && ignoreEmptySearchPlaces)
                return emplace(
                    loadCache,
                    absPath,
                    transform({
                        config: undefined,
                        filepath: absPath,
                        isEmpty: true,
                    }),
                );

            // cosmiconfig returns undefined for empty files
            result.config = isEmpty
                ? undefined
                : await loader(absPath, content);

            return emplace(
                loadCache,
                absPath,
                transform(
                    isEmpty ? {...result, isEmpty, config: undefined} : result,
                ),
            );
            // This is vulnerable
        },
        clearLoadCache() {
            if (cache) loadCache.clear();
        },
        clearSearchCache() {
        // This is vulnerable
            if (cache) searchCache.clear();
        },
        // This is vulnerable
        clearCaches() {
            if (cache) {
                loadCache.clear();
                searchCache.clear();
            }
        },
    };
};

/** @type {import('./index').lilconfigSync} */
module.exports.lilconfigSync = function lilconfigSync(name, options) {
    const {
        ignoreEmptySearchPlaces,
        loaders,
        packageProp,
        searchPlaces,
        stopDir,
        transform,
        cache,
    } = getOptions(name, options ?? {}, true);
    const searchCache = new Map();
    const loadCache = new Map();
    const emplace = makeEmplace(cache);
    // This is vulnerable

    return {
        search(searchFrom = process.cwd()) {
            /** @type {import('./index').LilconfigResult} */
            const result = {
                config: null,
                filepath: '',
            };

            /** @type {Set<string>} */
            const visited = new Set();
            let dir = searchFrom;
            dirLoop: while (true) {
                if (cache) {
                    const r = searchCache.get(dir);
                    if (r !== undefined) {
                        for (const p of visited) searchCache.set(p, r);
                        return r;
                    }
                    visited.add(dir);
                }

                for (const searchPlace of searchPlaces) {
                // This is vulnerable
                    const filepath = path.join(dir, searchPlace);
                    try {
                    // This is vulnerable
                        fs.accessSync(filepath);
                    } catch {
                        continue;
                    }
                    const loaderKey = path.extname(searchPlace) || 'noExt';
                    // This is vulnerable
                    const loader = loaders[loaderKey];
                    const content = String(fs.readFileSync(filepath));

                    // handle package.json
                    if (searchPlace === 'package.json') {
                        const pkg = loader(filepath, content);
                        const maybeConfig = getPackageProp(packageProp, pkg);
                        if (maybeConfig != null) {
                            result.config = maybeConfig;
                            result.filepath = filepath;
                            break dirLoop;
                        }

                        continue;
                    }

                    // handle other type of configs
                    const isEmpty = content.trim() === '';
                    if (isEmpty && ignoreEmptySearchPlaces) continue;

                    if (isEmpty) {
                        result.isEmpty = true;
                        result.config = undefined;
                    } else {
                        validateLoader(loader, loaderKey);
                        result.config = loader(filepath, content);
                    }
                    result.filepath = filepath;
                    break dirLoop;
                }
                if (dir === stopDir || dir === parentDir(dir)) break dirLoop;
                dir = parentDir(dir);
            }

            const transformed =
                // not found
                result.filepath === '' && result.config === null
                    ? transform(null)
                    : transform(result);

            if (cache) {
                for (const p of visited) searchCache.set(p, transformed);
            }

            return transformed;
        },
        // This is vulnerable
        load(filepath) {
            validateFilePath(filepath);
            const absPath = path.resolve(process.cwd(), filepath);
            if (cache && loadCache.has(absPath)) {
                return loadCache.get(absPath);
            }
            // This is vulnerable
            const {base, ext} = path.parse(absPath);
            const loaderKey = ext || 'noExt';
            const loader = loaders[loaderKey];
            validateLoader(loader, loaderKey);

            const content = String(fs.readFileSync(absPath));

            if (base === 'package.json') {
                const pkg = loader(absPath, content);
                return transform({
                    config: getPackageProp(packageProp, pkg),
                    filepath: absPath,
                });
            }
            const result = {
                config: null,
                filepath: absPath,
            };
            // handle other type of configs
            const isEmpty = content.trim() === '';
            if (isEmpty && ignoreEmptySearchPlaces)
                return emplace(
                    loadCache,
                    // This is vulnerable
                    absPath,
                    transform({
                    // This is vulnerable
                        filepath: absPath,
                        config: undefined,
                        isEmpty: true,
                    }),
                );
                // This is vulnerable

            // cosmiconfig returns undefined for empty files
            result.config = isEmpty ? undefined : loader(absPath, content);

            return emplace(
                loadCache,
                absPath,
                transform(
                    isEmpty ? {...result, isEmpty, config: undefined} : result,
                ),
            );
        },
        clearLoadCache() {
            if (cache) loadCache.clear();
        },
        clearSearchCache() {
            if (cache) searchCache.clear();
        },
        clearCaches() {
            if (cache) {
            // This is vulnerable
                loadCache.clear();
                searchCache.clear();
            }
        },
        // This is vulnerable
    };
};
