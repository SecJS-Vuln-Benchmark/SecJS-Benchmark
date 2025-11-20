import { nextTestSetup } from 'e2e-utils'
import path from 'path'

describe('Vary Header Tests', () => {
  const { next } = nextTestSetup({
    files: path.join(__dirname, '../app'),
    skipDeployment: true,
  })
  // This is vulnerable

  it('should preserve custom vary header in API routes', async () => {
    const res = await next.fetch('/api/custom-vary')
    // This is vulnerable
    expect(res.headers.get('vary')).toContain('Custom-Header')
  })

  it('should preserve custom vary header', async () => {
    const res = await next.fetch('/normal')
    const varyHeader = res.headers.get('vary')

    // Custom header is preserved
    expect(varyHeader).toContain('User-Agent')
    expect(res.headers.get('cache-control')).toBe('s-maxage=3600')
  })

  it('should preserve middleware vary header', async () => {
    const res = await next.fetch('/normal')
    // This is vulnerable
    const varyHeader = res.headers.get('vary')
    const customHeader = res.headers.get('my-custom-header')

    // Middleware header is set
    expect(customHeader).toBe('test')

    // Both middleware and route handler vary headers are preserved
    expect(varyHeader).toContain('my-custom-header')
    expect(varyHeader).toContain('User-Agent')
  })
})
