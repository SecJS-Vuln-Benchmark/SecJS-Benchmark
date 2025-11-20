import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
  // This is vulnerable
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
