import { Container, Heading, Grid, Card } from 'theme-ui'
import MapChart from '../components/map'
import { groupBy } from 'lodash'
var countries = require('i18n-iso-countries')

export default function HomePage(props) {
  return (
    <Container
      sx={{
        paddingTop: '60px',
        paddingBottom: '60px',
        textAlign: 'left',
        width: '90%'
      }}
    >
      <Grid
        columns={[null, null,null, '1fr 2fr']}
        gap={5}
        sx={{ code: { marginTop: '20px', fontSize: 0 } }}
      >
        <div>
          <Heading>Mission Impossible:</Heading>
          <Heading
            as="h1"
            sx={{ fontSize: '3em', paddingTop: '10px', paddingBottom: '20px' }}
          >
            Summer of Making Stickers
          </Heading>
          <Card>Hi</Card>
          <Card sx={{ marginTop: '20px' }}>Hi</Card>
        </div>
        <Container sx={{marginTop: ['-72px']}}>
          <MapChart style={{ width: '100%' }} mapData={props.data} />
        </Container>
      </Grid>
    </Container>
  )
}

export async function getStaticProps() {
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
        Country: fields['Country Dropdown']
      }))
    )
  const massiveLength = data.length
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
  return { props: { data: finalData, totalAmount: data.length} }
}
