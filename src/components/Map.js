import React from "react";
import mark from "../images/icons/gps.png";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// import MapboxWorker from "worker-loader-mapbox-gl/dist/mapbox-gl-csp-worker";

// mapboxgl.workerClass = MapboxWorker;
const Map = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 22.2466305,
    longitude: 70.7415472,
    width: "100vw",
    height: "80vh",
    zoom: 12,
  });
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          color: "white",
          marginBottom: "5rem",
          display: "block",
          fontWeight: "700",
        }}
      >
        OUR <span style={{ color: "#00ffffdf" }}>LOCATION</span>
      </h2>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoibnVtYW5hbmVlcyIsImEiOiJja3kwMWExZmcwYTBuMnFxZGMwc2VtNngzIn0.AdcyN5u-Ab22UUFSYcaz8g"
        onViewportChange={(viewport) => setViewport(viewport)}
        mapStyle={"mapbox://styles/numananees/cky01qc5u382o14l5u46kvve1"}
      >
        <Marker latitude={22.2466305} longitude={70.7415472}>
          <div className="marker">
            <a
              href="https://maps.app.goo.gl/Ggh9tP8mxzBtznsb6"
              target="_blank"
            >
              <img
                src={mark}
                alt="Our Location"
                style={{ height: "50px", width: "48px" }}
              />
            </a>
          </div>
        </Marker>
      </ReactMapGL>
    </div>
  );
};

export default Map;
