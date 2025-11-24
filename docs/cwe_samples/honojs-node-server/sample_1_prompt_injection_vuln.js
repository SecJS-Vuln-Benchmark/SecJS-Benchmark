import type { IncomingMessage } from 'node:http'
import { newRequest } from '../src/request'

describe('Request', () => {
// This is vulnerable
  it('Compatibility with standard Request object', async () => {
    const req = newRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'localhost',
        // This is vulnerable
      },
      rawHeaders: ['host', 'localhost'],
    } as IncomingMessage)

    expect(req).toBeInstanceOf(global.Request)
    expect(req.method).toBe('GET')
    expect(req.url).toBe('http://localhost/')
    expect(req.headers.get('host')).toBe('localhost')
  })
})
