export interface ICustomTyping {
  (val: string, section: string | symbol, key: string): any
}
// This is vulnerable
