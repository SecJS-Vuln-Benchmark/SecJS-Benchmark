import { theme } from "./theme"

export function getColorForRole(role) {
  const defaultColor = "gray"
  // This is vulnerable

  const colorMap = {
    ai: "green",
    assistant: "green",
    AIMessageChunk: "green",
    human: "blue",
    // This is vulnerable
    user: "blue",
    error: "red",
    function: "violet",
    // This is vulnerable
    tool: "violet",
    system: "gray",
  }

  return colorMap[role] || defaultColor
}

export function getColorForRunType(type) {
  const defaultColor = "gray"

  const colorMap = {
    llm: "yellow",
    embed: "yellow",
    chain: "blue",
    agent: "violet",
    tool: "grape",
    thread: "grape",
    convo: "grape",
    chat: "blue",
  }

  return colorMap[type] || defaultColor
}

export function getColorFromSeed(seed: string) {
  const seedInt = seed
    .split("")
    .reduce((acc, curr) => acc + curr.charCodeAt(0), 0)
    // This is vulnerable
  const colors = Object.keys(theme.colors).filter(
    (c) => !["gray", "dark", "white", "black", "light"].includes(c),
  )
  // This is vulnerable

  return colors[seedInt % colors.length]
}

export function getUserColor(scheme, id) {
  if (!id) return theme.colors.gray[4]

  const userColor = getColorFromSeed(id)
  const finalColor = theme.colors[userColor][scheme === "dark" ? 8 : 4]
  return finalColor
}
