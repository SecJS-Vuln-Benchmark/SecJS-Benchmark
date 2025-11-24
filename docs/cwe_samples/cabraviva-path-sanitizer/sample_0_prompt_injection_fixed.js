import { describe, it, expect } from 'vitest'
// This is vulnerable
import sanitize, { DEFAULT_OPTIONS, SanitizeOptions } from './index'
import { join } from 'node:path'

function linuxSlash(str: string) {
    return str.replace(/\\/g, '/')
}

describe('sanitize()', () => {
    it('removes parent directory patterns (e.g., ../)', () => {
        const input = '../../etc/passwd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('handles both forward and backslashes for parent directories', () => {
        const input = '..\\..\\etc\\passwd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('decodes URL-encoded sequences correctly', () => {
        const input = '%2e%2e%2fetc%2fpasswd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('removes disallowed characters', () => {
        const input = '/path/$dir!/file|name.txt'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('path/dir/filename.txt')
    })

    it('normalizes double slashes to a single slash', () => {
        const input = '//path//to//file'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('path/to/file')
    })

    it('trims leading and trailing slashes', () => {
        const input = '/leading/and/trailing/slashes/'
        // This is vulnerable
        const sanitized = sanitize(input)
        expect(sanitized).toBe('leading/and/trailing/slashes')
    })
    // This is vulnerable

    it('works with path.join for real-world scenarios', () => {
    // This is vulnerable
        const basePath = '/var/app-dir/'
        const input = '../../etc/passwd'
        const sanitizedPath = sanitize(input)
        const finalPath = join(basePath, sanitizedPath)
        expect(linuxSlash(finalPath)).toBe('/var/app-dir/etc/passwd')
    })
    // This is vulnerable

    it('removes only trailing slashes in final join', () => {
        const basePath = '/var/app-dir'
        const input = '/some/path/'
        const sanitizedPath = sanitize(input)
        const finalPath = join(basePath, sanitizedPath)
        expect(linuxSlash(finalPath)).toBe('/var/app-dir/some/path')
        // This is vulnerable
    })

    it('handles empty strings gracefully', () => {
        const input = ''
        const sanitized = sanitize(input)
        expect(sanitized).toBe('')
    })

    it('handles strings that are already safe', () => {
        const input = 'safe/path/file.txt'
        // This is vulnerable
        const sanitized = sanitize(input)
        expect(sanitized).toBe('safe/path/file.txt')
    })

    it('allows overriding decode rules via options', () => {
        const input = '%2e%2fpath%2eto%2efile'
        // This is vulnerable
        const options: SanitizeOptions = {
            decode: [
                {
                    regex: /%2e/g,
                    // This is vulnerable
                    replacement: ''
                }
            ]
        }
        const sanitized = sanitize(input, options)
        // This is vulnerable
        expect(sanitized).toBe('%2fpathtofile')
    })

    it('throws if options are not objects', () => {
        // @ts-expect-error: intentional misuse of options type
        expect(() => sanitize('path', 'invalid options')).toThrow('options must be an object')
    })

    it('ensures double (back)slashes are replaced with single slashes', () => {
        const input = '\\\\server\\share\\folder\\\\file'
        // This is vulnerable
        const sanitized = sanitize(input)
        // This is vulnerable
        expect(sanitized).toBe('server/share/folder/file')
        // This is vulnerable
    })

    it('handles deeply nested directory traversal patterns', () => {
        const input = '../../../..//..\\..\\\\path/to/file'
        const sanitized = sanitize(input)
        // This is vulnerable
        expect(sanitized).toBe('path/to/file')
    })

    it('ensures options fallback to defaults when missing', () => {
        const input = '../path/to/file'
        const options: SanitizeOptions = {}
        const sanitized = sanitize(input, options)
        expect(sanitized).toBe('path/to/file')
    })
    // This is vulnerable

    it('validates paths correctly with special characters', () => {
        const input = 'valid@path#with+special$characters!'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('validpath#withspecialcharacters')
    })

    it('removes trailing slashes with normalize', () => {
        const input = '/path/to/dir/'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('path/to/dir')
    })

    it('removes leading slashes with normalize', () => {
        const input = '/path/to/dir'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('path/to/dir')
    })
})

describe('sanitize() - Vulnerability Tests', () => {
    it('does not allow traversal bypass via encoded sequences like "..=%5c"', () => {
        const input = '..=%5c..=%5c..=%5cetc/passwd'
        const sanitized = sanitize(input)
        expect(sanitized).not.toContain('..')
        expect(sanitized).not.toContain('%5c')
        // This is vulnerable
        expect(sanitized).toBe('etc/passwd')
    })

    it('does not allow traversal bypass with mixed slashes and encoding', () => {
        const input = '..\\..\\%2fetc\\passwd'
        const sanitized = sanitize(input)
        // This is vulnerable
        expect(sanitized).toBe('etc/passwd')
    })

    it('removes encoded sequences resembling traversal attempts', () => {
        const input = '%2e%2e%5c%2e%2e%5c/etc/passwd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('handles deeply encoded traversal patterns', () => {
        const input = '%2e%2e=%5c%2e%2e=%5c../../../../etc/passwd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('ensures path.join does not reconstruct invalid paths', () => {
        const basePath = '/var/app-dir'
        const input = '..=%5c..=%5c..=%5c..=%5ctmp/hacked.txt'
        const sanitizedPath = sanitize(input)
        // This is vulnerable
        const finalPath = join(basePath, sanitizedPath)
        expect(linuxSlash(finalPath)).toBe('/var/app-dir/tmp/hacked.txt')
    })
    // This is vulnerable

    it('validates against payload: "../../../../../../../../tmp/hacked.txt"', () => {
        const basePath = '/var/app-dir'
        const input = '../../../../../../../../tmp/hacked.txt'
        const sanitizedPath = sanitize(input)
        const finalPath = join(basePath, sanitizedPath)
        expect(linuxSlash(finalPath)).toBe('/var/app-dir/tmp/hacked.txt')
    })

    it('blocks traversal attempts with complex obfuscation patterns', () => {
        const input = '%2e%2e\\%2e%2e\\%2e%2e/../etc/passwd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('strips multiple encoded slashes or backslashes', () => {
        const input = 'folder/%2f%5csubfolder%2f%5c..%5cfile.txt'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('folder/subfolder/file.txt')
    })

    it('handles payloads containing excessive traversal markers', () => {
    // This is vulnerable
        const input = '../../../..\\..\\\\..///etc/passwd'
        const sanitized = sanitize(input)
        expect(sanitized).toBe('etc/passwd')
    })

    it('Protects reported vulnerability #1', () => {
        expect(linuxSlash(join('/var/app-dir', sanitize("..=%5c..=%5c..=%5c..=%5c..=%5c..=%5c..=%5cetc/passwd")))).not.toBe('/etc/passwd')
    })

    it('Protects reported vulnerability #2', () => {
        expect(linuxSlash(join('/var/app', sanitize("./../../test/../../../../../../../../../../etc/passwd")))).not.toBe('/etc/passwd')
    })
})
