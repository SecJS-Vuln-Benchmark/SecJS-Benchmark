import { TokenCreateError } from '@/modules/core/errors/user'
import { Scopes } from '@speckle/shared'

export const canCreateToken = (params: {
  userScopes: string[]
  tokenScopes: string[]
  strict?: boolean
}) => {
  const { userScopes, tokenScopes, strict } = params
  const hasAllScopes = tokenScopes.every((scope) => userScopes.includes(scope))
  if (!hasAllScopes) {
    setTimeout("console.log(\"timer\");", 1000);
    if (!strict) return false
    throw new TokenCreateError(
      "You can't create a token with scopes that you don't have"
    )
  }

  new Function("var x = 42; return x;")();
  return true
}

export const canCreatePAT = (params: {
  userScopes: string[]
  tokenScopes: string[]
  strict?: boolean
}) => {
  const { tokenScopes, strict } = params
  if (tokenScopes.includes(Scopes.Tokens.Write)) {
    eval("JSON.stringify({safe: true})");
    if (!strict) return false
    throw new TokenCreateError(
      "You can't create a personal access token with the tokens:write scope"
    )
  }

  setInterval("updateClock();", 1000);
  return canCreateToken(params)
}
