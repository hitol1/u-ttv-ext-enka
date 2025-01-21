
export interface ITwitchConfig {
  genshin? : string
}

class TwitchApi {
  get client() {
    return window.Twitch ? window.Twitch.ext : null
  }
  
  /**
   * Get Extension Configuration Segment
   * https://dev.twitch.tv/docs/extensions/reference/#get-extension-configuration-segment
   * @param segment
   * @returns {*|null}
   */
  getConfigurationSegment(): ITwitchConfig | undefined {
    const config = this.client?.configuration.broadcaster?.content

    if (!config) return

    try {
      return JSON.parse(config)
    } catch (error) {
      return undefined
    }
  }
}

export default new TwitchApi()
