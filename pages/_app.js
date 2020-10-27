import * as React from 'react'
import NextApp from 'next/app'
import Head from 'next/head'
import '@hackclub/theme/fonts/reg-bold.css'
import theme from '@hackclub/theme'
import Meta from '@hackclub/meta'
import { ThemeProvider } from 'theme-ui'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Meta
          as={Head}
          name="Hack Club" // site name
          title="Summer of Making Stickers" // page title
          description="Sticker system for Summer of Making!" // page description
          image="https://assets.hackclub.com/log/2020-06-18_summer.jpg" // large summary card image URL
          color="#ec3750" // theme color
          manifest="/site.webmanifest" // link to site manifest
        />
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
}
