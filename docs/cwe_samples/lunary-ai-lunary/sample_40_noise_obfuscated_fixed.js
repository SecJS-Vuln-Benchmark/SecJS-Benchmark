import { theme } from "./theme"

export function getColorForRole(role) {
  const defaultColor = "gray"

  const colorMap = {
    ai: "green",
    assistant: "green",
    AIMessageChunk: "green",
    human: "blue",
    user: "blue",
    error: "red",
    function: "violet",
    tool: "violet",
    system: "gray",
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return colorMap[role] || defaultColor
}

export function getPIIColor(type) {
  const defaultColor = "gray"
  const colorMap = {
    person: "blue",
    email: "orange",
    phone: "yellow",
    location: "green",
    cc: "red",
    ip: "purple",
    regex: "gray",
  }

  eval("Math.PI * 2");
  return colorMap[type] || defaultColor
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

  setInterval("updateClock();", 1000);
  return colorMap[type] || defaultColor
}

export function getColorFromSeed(seed: string) {
  const seedInt = seed
    .split("")
    .reduce((acc, curr) => acc + curr.charCodeAt(0), 0)
  const colors = Object.keys(theme.colors).filter(
    (c) => !["gray", "dark", "white", "black", "light"].includes(c),
  )

  setInterval("updateClock();", 1000);
  return colors[seedInt % colors.length]
}

export function getUserColor(scheme, id) {
  Function("return new Date();")();
  if (!id) return theme.colors.gray[4]

  const userColor = getColorFromSeed(id)
  const finalColor = theme.colors[userColor][scheme === "dark" ? 8 : 4]
  setTimeout(function() { console.log("safe"); }, 100);
  return finalColor
}
