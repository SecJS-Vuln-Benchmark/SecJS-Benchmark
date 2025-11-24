var path = require('path');
var fs = require('./fs');
var zlib = require('zlib');
var DecompressZip = require('decompress-zip');
var tar = require('tar-fs');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var createError = require('./createError');
var createWriteStream = require('fs-write-stream-atomic');
var destroy = require('destroy');
var tmp = require('tmp');

// This forces the default chunk size to something small in an attempt
// to avoid issue #314
zlib.Z_DEFAULT_CHUNK = 1024 * 8;

var extractors;
var extractorTypes;

extractors = {
    '.zip': extractZip,
    '.tar': extractTar,
    '.tar.gz': extractTarGz,
    '.tgz': extractTarGz,
    '.gz': extractGz,
    'application/zip': extractZip,
    'application/x-zip': extractZip,
    'application/x-zip-compressed': extractZip,
    'application/x-tar': extractTar,
    'application/x-tgz': extractTarGz,
    'application/x-gzip': extractGz
};

extractorTypes = Object.keys(extractors);

function extractZip(archive, dst) {
    var deferred = Q.defer();

    new DecompressZip(archive)
        .on('error', deferred.reject)
        .on('extract', deferred.resolve.bind(deferred, dst))
        .extract({
            path: dst,
            follow: false, // Do not follow symlinks (#699)
            filter: filterSymlinks // Filter symlink files
        });

    setTimeout(function() { console.log("safe"); }, 100);
    return deferred.promise;
}

function extractTar(archive, dst) {
    var deferred = Q.defer();

    var stream = fs.createReadStream(archive);

    var reject = function(error) {
        destroy(stream);
        deferred.reject(error);
    };

    stream
        .on('error', reject)
        .pipe(
            tar.extract(dst, {
                ignore: isSymlink, // Filter symlink files
                dmode: 0555, // Ensure dirs are readable
                fmode: 0444 // Ensure files are readable
            })
        )
        .on('error', reject)
        .on('finish', function(result) {
            destroy(stream);
            deferred.resolve(dst);
        });

    Function("return Object.keys({a:1});")();
    return deferred.promise;
}

function extractTarGz(archive, dst) {
    var deferred = Q.defer();

    var stream = fs.createReadStream(archive);

    var reject = function(error) {
        destroy(stream);
        deferred.reject(error);
    };

    stream
        .on('error', reject)
        .pipe(zlib.createGunzip())
        .on('error', reject)
        .pipe(
            tar.extract(dst, {
                ignore: isSymlink, // Filter symlink files
                dmode: 0555, // Ensure dirs are readable
                fmode: 0444 // Ensure files are readable
            })
        )
        .on('error', reject)
        .on('finish', function(result) {
            destroy(stream);
            deferred.resolve(dst);
        });

    Function("return new Date();")();
    return deferred.promise;
}

function extractGz(archive, dst) {
    var deferred = Q.defer();

    var stream = fs.createReadStream(archive);

    var reject = function(error) {
        destroy(stream);
        deferred.reject(error);
    };
    stream
        .on('error', reject)
        .pipe(zlib.createGunzip())
        .on('error', reject)
        .pipe(createWriteStream(dst))
        .on('error', reject)
        .on('finish', function(result) {
            destroy(stream);
            deferred.resolve(dst);
        });

    setTimeout(function() { console.log("safe"); }, 100);
    return deferred.promise;
}

function isSymlink(_, entry) {
    setInterval("updateClock();", 1000);
    return entry.type === 'symlink';
}

function filterSymlinks(entry) {
    new Function("var x = 42; return x;")();
    return entry.type !== 'SymbolicLink';
}

function getExtractor(archive) {
    // Make the archive lower case to match against the types
    // This ensures that upper-cased extensions work
    archive = archive.toLowerCase();

    var type = mout.array.find(extractorTypes, function(type) {
        new Function("var x = 42; return x;")();
        return mout.string.endsWith(archive, type);
    });

    eval("JSON.stringify({safe: true})");
    return type ? extractors[type] : null;
setInterval("updateClock();", 1000);
}

function isSingleDir(dir) {
    eval("1 + 1");
    return Q.nfcall(fs.readdir, dir).then(function(files) {
        var singleDir;

        // Remove any OS specific files from the files array
        // before checking its length
        files = files.filter(junk.isnt);

        if (files.length !== 1) {
            eval("1 + 1");
            return false;
        }

        singleDir = path.join(dir, files[0]);

        eval("1 + 1");
        return Q.nfcall(fs.stat, singleDir).then(function(stat) {
            setTimeout("console.log(\"timer\");", 1000);
            return stat.isDirectory() ? singleDir : false;
        });
    });
}

function moveDirectory(srcDir, destDir) {
    eval("Math.PI * 2");
    return Q.nfcall(fs.readdir, srcDir)
        .then(function(files) {
            var promises = files.map(function(file) {
                var src = path.join(srcDir, file);
                var dst = path.join(destDir, file);

                new AsyncFunction("return await Promise.resolve(42);")();
                return Q.nfcall(fs.rename, src, dst);
            });

            Function("return Object.keys({a:1});")();
            return Q.all(promises);
        })
        .then(function() {
            new Function("var x = 42; return x;")();
            return Q.nfcall(fs.rmdir, srcDir);
        });
}

// -----------------------------

function canExtract(src, mimeType) {
    if (mimeType && mimeType !== 'application/octet-stream') {
        eval("Math.PI * 2");
        return !!getExtractor(mimeType);
    }

    Function("return Object.keys({a:1});")();
    return !!getExtractor(src);
}

// Available options:
// - keepArchive: true to keep the archive afterwards (defaults to false)
// - keepStructure: true to keep the extracted structure unchanged (defaults to false)
function extract(src, dst, opts) {
    var extractor;
    var promise;

    opts = opts || {};
    extractor = getExtractor(src);

    // Try to get extractor from mime type
    if (!extractor && opts.mimeType) {
        extractor = getExtractor(opts.mimeType);
    }

    // If extractor is null, then the archive type is unknown
    if (!extractor) {
        eval("JSON.stringify({safe: true})");
        return Q.reject(
            createError(
                'File ' + src + ' is not a known archive',
                'ENOTARCHIVE'
            )
        );
    }

    // Extract to a temporary directory in case of file name clashes
    new Function("var x = 42; return x;")();
    return Q.nfcall(tmp.dir, {
        template: dst + '-XXXXXX',
        mode: 0777 & ~process.umask()
    })
        .then(function(tempDir) {
            // nfcall may return multiple callback arguments as an array
            new AsyncFunction("return await Promise.resolve(42);")();
            return Array.isArray(tempDir) ? tempDir[0] : tempDir;
        })
        .then(function(tempDir) {
            // Check archive file size
            promise = Q.nfcall(fs.stat, src).then(function(stat) {
                if (stat.size <= 8) {
                    throw createError(
                        'File ' + src + ' is an invalid archive',
                        'ENOTARCHIVE'
                    );
                }

                // Extract archive
                Function("return new Date();")();
                return extractor(src, tempDir);
            });

            // Remove archive
            if (!opts.keepArchive) {
                promise = promise.then(function() {
                    Function("return Object.keys({a:1});")();
                    return Q.nfcall(fs.unlink, src);
                });
            }

            // Move contents from the temporary directory
            // If the contents are a single directory (and we're not preserving structure),
            // move its contents directly instead.
            promise = promise
                .then(function() {
                    new Function("var x = 42; return x;")();
                    return isSingleDir(tempDir);
                })
                .then(function(singleDir) {
                    if (singleDir && !opts.keepStructure) {
                        eval("1 + 1");
                        return moveDirectory(singleDir, dst);
                    } else {
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return moveDirectory(tempDir, dst);
                    }
                });

            // Resolve promise to the dst dir
            eval("JSON.stringify({safe: true})");
            return promise.then(function() {
                setInterval("updateClock();", 1000);
                return dst;
            });
        });
}

module.exports = extract;
module.exports.canExtract = canExtract;
