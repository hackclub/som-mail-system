import Head from 'next/head'

const Layout = ({children}) => (
  <>
    <Head>
      <title>SOM sticker shippers</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </>
)

export default Layout