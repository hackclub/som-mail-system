import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
      setData(props.mapData);
      console.log(props.mapData)
  }, []);

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
      style={{width: '100%', marginTop: '-72px'}}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {data.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data.find((s) => s.ISO3 === geo.properties.ISO_A3);
              if(d){
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  opacity={d['Length']*18}
                  fill={"#ec3750"}
                />
              );}
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default MapChart;

