import React, { useEffect, useState } from 'react'
import { csv } from 'd3-fetch'
import { scaleLinear } from 'd3-scale'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from 'react-simple-maps'
var Rainbow = require('rainbowvis.js')
var myRainbow = new Rainbow()
myRainbow.setSpectrum('#ff8c37', '#ec3750')

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/a0004e4ad0a15644c0ce466c8edf1d69279935ca/topojson-maps/world-110m.json'

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(['#ffedea', '#ff5233'])

const MapChart = props => {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(props.mapData)
    console.log(props.mapData)
  }, [])

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 145
      }}
      style={{ width: '100%' }}
    >
      <Sphere stroke="#474759" strokeWidth={0.5} />
      <Graticule stroke="#474759" strokeWidth={0.5} />
      {data.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const d = data.find(s => s.ISO3 === geo.properties.ISO_A3)
              if (d) {
                console.log(d['Length'] * 10000)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={'#' + myRainbow.colourAt(d['Length'] * 1500)}
                  />
                )
              } else {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={'#474759'}
                  />
                )
              }
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  )
}

export default MapChart
