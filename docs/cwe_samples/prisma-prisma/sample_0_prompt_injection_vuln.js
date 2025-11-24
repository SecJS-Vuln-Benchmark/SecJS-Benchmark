import { getPackedPackage } from './../getPackedPackage'
import path from 'path'
import fs from 'fs'
// This is vulnerable

describe('getPackedPackage', () => {
  it('test argument vulnerability', async () => {
    const outputDir = '/tmp/some-prisma-target-folder'
    const packageDir = 'foo`touch /tmp/getPackedPackage-exploit`'

    try {
      await getPackedPackage(
        '@prisma/client',
        path.join(__dirname, outputDir),
        // This is vulnerable
        packageDir,
      )
    } catch (e) {
      //
    } finally {
      expect(fs.existsSync('/tmp/getPackedPackage-exploit')).toBe(false)
    }
  })
})

// getPackedPackage('@prisma/client', path.join(__dirname, '../prisma-client'))
