import { Container, Heading, Box, Grid, Card, Image, Text } from 'theme-ui'
import MapChart from '../../components/map'
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
      <Heading sx={{ textAlign: 'center', fontWeight: '400' }}>
        Every country that has been blessed with
      </Heading>
      <Heading
        as="h1"
        sx={{
          fontSize: '3em',
          paddingTop: '10px',
          paddingBottom: '20px',
          textAlign: 'center'
        }}
      >
        {props.artist}'s artwork
      </Heading>
      <Grid
        columns={[null, null, null, '1fr 2fr']}
        gap={5}
        sx={{ code: { marginTop: '20px', fontSize: 0 } }}
      >
        <Box sx={{}}>
          <Card sx={{ marginTop: '20px' }}>
            <div>
              <Heading as="h2" style={{ paddingBottom: '12px' }}>
                Country list
              </Heading>
              <Text sx={{ maxHeight: '255px', overflowY: 'scroll' }}>
                {props.data.map(country => (
                  <Text style={{ paddingBottom: '5px' }}>
                    {country.Country}
                  </Text>
                ))}
              </Text>
            </div>
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

export async function getServerSideProps(context) {
  function filterSlugs(object) {
    let result = object.Shipped
    return result
  }
  console.log(
    `UPPER({Artist Name}) = "${context.params.artist
      .toUpperCase()
      .replace('_', ' ')}"`
  )
  let data = await fetch(
    `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?authKey=${process.env.AIRBRIDGE_TOKEN}&select=` +
      JSON.stringify({
        filterByFormula: `UPPER({Artist Name Uppercase}) = "${context.params.artist
          .toUpperCase()
          .replace('_', ' ')}"`
      })
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
        Shipped: fields['Node Master Scanned At'] ? true : false,
        artist: fields['Artist Name'] ? fields['Artist Name'] : ''
      }))
    )

  let artist = data[0]['artist']

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
      shippedAmount: shipped.length,
      artist: artist
    }
  }
}
