"use client"

import Head from "next/head"

export default function PwaHead() {
  return (
    <Head>
      {/* Manifest */}
      <link rel="manifest" href="/manifest.webmanifest" />
      {/* Icons */}
      <link rel="icon" href="/icons/icon-192.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      {/* Theme color (updated in dark mode by browsers that support it) */}
      <meta name="theme-color" content="#0f172a" />
      {/* iOS PWA */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Head>
  )
}
