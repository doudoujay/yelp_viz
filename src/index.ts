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
    let colorScale = d3.scaleSequential(d3.interpolateHcl("yellow", "red"))
        .domain(d3.extent(businesses, d => d.review_count))
    let nodes = businesses.map(node => {
        let circle = new google.maps.Circle({
            strokeColor: "white",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: colorScale(node.review_count),
            fillOpacity: 0.8,
            map: map,
            center: {lat: node.latitude, lng: node.longitude},
            radius: node.stars * 10,
            zIndex: -1,
        });
        circle.set('data', node);
        return circle;
    });
    let sizeScale = d3.scaleSqrt()
        .domain(d3.extent(businesses, d => d.review_count))
        .range([0, 20]);
    map.addListener('zoom_changed', _ => {
        // Adapted from https://medium.com/techtrument/how-many-miles-are-in-a-pixel-a0baf4611fff
        let meters_per_px = 156543.03392 / Math.pow(2, map.getZoom());
        nodes.forEach(node => {
            node.setRadius(sizeScale((node.get('data')).review_count)*meters_per_px);
        });
    });
}

(<any>window).initMap = initMap;
console.log("Function", initMap, " should be called after Google Map is loaded.");