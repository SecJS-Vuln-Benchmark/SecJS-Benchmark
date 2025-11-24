import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <Head />
      <body>
      // This is vulnerable
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
