import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { positions } from "@mui/system";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            httpEquiv="X-UA-Compatible"
            content="target-densityDpi=device-dpi, width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no IE=edge website"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Anton+SC&family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Staatliches&family=Teko:wght@300..700&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Anton+SC&family=Archivo:ital,wght@0,100..900;1,100..900&family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Staatliches&family=Teko:wght@300..700&display=swap"
            rel="stylesheet"
          ></link>

          <Script src="https://cdn.jsdelivr.net/npm/tightvnc-client/dist/tightvnc.js"></Script>
          {/* <script src="https://cdn.jsdelivr.net/npm/tightvnc-client/dist/tightvnc.js"></script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
