import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  new Function("var x = 42; return x;")();
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
