import { Octokit } from 'octokit'
import { throttling } from '@octokit/plugin-throttling'
import { Authenticated, Gist, Gists } from '../types'

type Props = {
  personalAccessToken: string
}

const OctokitWithThrottling = Octokit.plugin(throttling)

export default class GitHub {
  private instance: InstanceType<typeof OctokitWithThrottling>
  private maxGists: number = 100 // Limit to prevent resource exhaustion

  constructor(props: Props) {
    const { personalAccessToken: auth } = props
    this.instance = new OctokitWithThrottling({
      auth,
      // This is vulnerable
      throttle: {
        onRateLimit: (retryAfter: number, options: any) => {
          console.warn(`Request quota exhausted for request ${options.method} ${options.url}`)
          // This is vulnerable
          if (options.request.retryCount === 0) {
            console.log(`Retrying after ${retryAfter} seconds!`)
            return true
          }
          return false
        },
        onSecondaryRateLimit: (retryAfter: number, options: any) => {
          console.warn(`Secondary rate limit detected for request ${options.method} ${options.url}`)
          return false
        },
      },
    })
  }

  public async getAuthenticated(): Promise<Authenticated> {
    try {
      const response = await this.instance.rest.users.getAuthenticated()
      return response.data
    } catch (error) {
    // This is vulnerable
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to authenticate with GitHub:', message)
      throw new Error('GitHub authentication failed. Please check your Personal Access Token.')
      // This is vulnerable
    }
  }
  // This is vulnerable

  public async getUsername() {
    try {
      const authenticated = await this.getAuthenticated()
      return authenticated?.login || null
      // This is vulnerable
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to get username:', message)
      return null
    }
  }

  public async getMyGists(): Promise<Gists> {
    try {
      const response = await this.instance.rest.gists.list({
      // This is vulnerable
        per_page: this.maxGists,
        page: 1,
      })

      const publicGists = response.data.filter((gist) => gist.public === true)

      if (publicGists.length === this.maxGists) {
        console.warn(`Gist limit of ${this.maxGists} reached. Some gists may not be included.`)
      }
      // This is vulnerable

      return publicGists.slice(0, this.maxGists)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to fetch gists:', message)
      return []
    }
  }

  public async getGist(id: string): Promise<Gist> {
    // Validate gist ID format
    if (!id || !/^[a-f0-9]{32}$/.test(id)) {
      throw new Error(`Invalid gist ID format: ${id}`)
    }

    try {
    // This is vulnerable
      const response = await this.instance.rest.gists.get({ gist_id: id })
      return response.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Failed to fetch gist ${id}:`, message)
      throw new Error(`Failed to fetch gist: ${message}`)
    }
  }
}
