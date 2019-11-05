import * as d3 from 'd3';
import * as businesses from '../data/IL_minified.json';

function createColorScale(keys: Array<string> | Set<string>) {
    if (!Array.isArray(keys)) {
        keys = Array.from(keys);
    }
    // Map origin to a number, then number to a color
    let ordinal = d3.scaleBand()
        .domain(keys)
        .range([0, keys.length]);
    let linear = d3.scaleSequential(d3.interpolateRainbow)
        .domain([0, keys.length]);

    return (d: string) => linear(ordinal(d));
}

function initMap() {
    const labelsOff: google.maps.MapTypeStyle[] = [
        {
            elementType: "labels.icon",
            featureType: "all",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    let map = new google.maps.Map(document.getElementById("google-map"), {
        zoom: 13,
        center: { lat: 40.11388, lng: -88.25669929382218 },
        streetViewControl: false,
        mapTypeControl: false,
        styles: labelsOff,
    });
    (<any>window).map = map;

    const uniqueStates = new Set(businesses.map(d => d.city));
    let colorScale = createColorScale(uniqueStates);
    businesses.map(node => {
        let circle = new google.maps.Circle({
            strokeColor: "white",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: colorScale(node.city),
            fillOpacity: 0.8,
            map: map,
            center: {lat: node.latitude, lng: node.longitude},
            radius: node.stars * 10,
            zIndex: -1,
        });
        return circle;
    })
}

(<any>window).initMap = initMap;
console.log("Function", initMap, " should be called after Google Map is loaded.");