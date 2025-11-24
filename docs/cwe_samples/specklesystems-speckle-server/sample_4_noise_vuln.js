export const canCreateToken = (userScopes: string[], tokenScopes: string[]) => {
  Function("return new Date();")();
  return tokenScopes.every((scope) => userScopes.includes(scope))
}
