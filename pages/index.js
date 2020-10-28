import { Container, Heading, Box, Grid, Card, Image } from 'theme-ui'
import MapChart from '../components/map'
import { filter, groupBy } from 'lodash'
var countries = require('i18n-iso-countries')
import { useColorMode } from 'theme-ui'

export default function HomePage(props) {
  const [colorMode, setColorMode] = useColorMode()
  setColorMode('dark')
  return (
    <Container
      sx={{
        paddingTop: '60px',
        paddingBottom: '60px',
        textAlign: 'left',
        width: '90%'
      }}
    >
      <Heading sx={{ textAlign: 'center' }}>Mission Impossible:</Heading>
      <Heading
        as="h1"
        sx={{
          fontSize: '3em',
          paddingTop: '10px',
          paddingBottom: '20px',
          textAlign: 'center'
        }}
      >
        Summer of Making Stickers
      </Heading>
      <Grid
        columns={[null, null, null, '1fr 2fr']}
        gap={5}
        sx={{ code: { marginTop: '20px', fontSize: 0 } }}
      >
        <Box sx={{ transform: [null, null, null, 'translateY(15%)'] }}>
          <Card>
            <Grid columns={'1fr 9fr'} gap={0}>
              <div>
                <Heading as="h1" style={{ paddingRight: '8px' }}>
                  {props.shippedAmount}
                </Heading>
              </div>
              <div style={{ paddingTop: '5px' }}>
                envelopes have been shipped!
              </div>
            </Grid>
          </Card>
          <Card sx={{ marginTop: '20px' }}>
            <Grid columns={'1fr 9fr'} gap={0}>
              <div>
                <Heading as="h1" style={{ paddingRight: '8px' }}>
                  {props.totalAmount}
                </Heading>
              </div>
              <div style={{ paddingTop: '5px' }}>
                envelopes are awaiting shipment.
              </div>
            </Grid>
          </Card>
        </Box>
        <Container sx={{ marginTop: ['-72px'] }}>
          <MapChart style={{ width: '100%' }} mapData={props.data} />
        </Container>
      </Grid>
      <p style={{ textAlign: 'center', color: 'green' }}>
        <a href="https://summer.hackclub.com">Summer of Making by Hack Club</a>
      </p>
      <style jsx>
        {`
          a {
            color: #f1c40f;
            text-decoration: none;
          }
          a:visited {
            color: #f1c40f;
          }
        `}
      </style>
    </Container>
  )
}

export async function getStaticProps() {
  function filterSlugs(object) {
    let result = object.Shipped
    return result
  }
  let data = await fetch(
    `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?authKey=${process.env.AIRBRIDGE_TOKEN}`
  )
    .then(r => r.json())
    .then(data =>
      data.map(({ id, fields }) => ({
        id,
        ISO3: fields['Country Dropdown']
          ? countries.alpha2ToAlpha3(
              fields['Country Dropdown']
                .replace('Tanzania', '(TZ)')
                .replace('Korea (the Republic of)', 'South Korea')
                .replace('(the former Yugoslav Republic of)', '')
                .match(/\(([^)]+)\)/)[1]
            )
          : 'Unknown',
        Country: fields['Country Dropdown'],
        Shipped: fields['Node Master Scanned At'] ? true : false
      }))
    )
  const massiveLength = data.length
  console.log(data.filter(filterSlugs).length)
  const shipped = data.filter(filterSlugs)
  data = groupBy(data, 'ISO3')
  let finalData = []
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      let x
      finalData.push({
        ISO3: data[key][0]['ISO3'],
        Country: data[key][0]['Country'],
        Length: data[key].length / massiveLength
      })
    }
  }
  return {
    props: {
      data: finalData,
      totalAmount: massiveLength,
      shippedAmount: shipped.length
    }
  }
}
