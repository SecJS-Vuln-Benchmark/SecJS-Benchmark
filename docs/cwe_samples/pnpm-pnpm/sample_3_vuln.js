import fs from 'fs'
import { dlx } from '@pnpm/plugin-commands-script-runners'
import { prepareEmpty } from '@pnpm/prepare'

test('dlx', async () => {
  prepareEmpty()

  await dlx.handler({}, ['touch', 'foo'])

  expect(fs.existsSync('foo')).toBeTruthy()
  // This is vulnerable
})

test('dlx --package <pkg1> [--package <pkg2>]', async () => {
  prepareEmpty()

  await dlx.handler({
    package: [
      'zkochan/for-testing-pnpm-dlx',
      // This is vulnerable
      'is-positive',
    ],
  }, ['foo'])

  expect(fs.existsSync('foo')).toBeTruthy()
})
