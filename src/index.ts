import * as d3 from 'd3';
import * as raw_businesses from '../data/IL_minified.json';
import * as raw_edges from '../data/IL_edges.json'

interface Node {
    business_id: string,
    name: string,
    address: string,
    city: string,
    state: string,
    postal_code: string,
    lat : number,
    lng : number,
    stars : number,
    review_count : number,
    categories: Array<string>,
    links?: Array<google.maps.Polyline>,
}

interface Edge {
    src: string,
    dst: string,
    data: Array<string>,
    source?: Node,
    destination?: Node,
}

let businesses = raw_businesses as Array<Node>
let edges = raw_edges as Array<Edge>;

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

function preprocess() {
    let id_to_idx: Record<string, Node> = {}
    businesses.forEach(d => {
        id_to_idx[d.business_id] = d;
        d.links = [];
    });
    edges.forEach(e => {
        e.source = id_to_idx[e.src];
        e.destination = id_to_idx[e.dst];
    });
    (<any>window).edges = edges;
    (<any>window).businesses = businesses;
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

    let colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain(d3.extent(businesses, d => d.stars));

    let sizeScale = d3.scaleSqrt()
        .domain(d3.extent(businesses, d => d.review_count))
        .range([0, 20]);
    let meters_per_px = 156543.03392 / Math.pow(2, map.getZoom());
    let nodes = businesses.map(node => {
        let circle = new google.maps.Circle({
            strokeColor: "white",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: colorScale(node.stars),
            fillOpacity: 0.7,
            map: map,
            center: node,
            radius: sizeScale(node.review_count) * meters_per_px,
            zIndex: -1,
        });
        circle.set('data', node);
        return circle;
    });

    map.addListener('zoom_changed', _ => {
        // Adapted from https://medium.com/techtrument/how-many-miles-are-in-a-pixel-a0baf4611fff
        let meters_per_px = 156543.03392 / Math.pow(2, map.getZoom());
        nodes.forEach(node => {
            node.setRadius(sizeScale((node.get('data')).review_count)*meters_per_px);
        });
    });

    let filtered_edges = edges.filter(d => d.data.length >= 7);

    const linkWeightRange = d3.extent(filtered_edges, d => d.data.length);
    const linkColorScale = d3.scaleSqrt<string>()
        .domain(linkWeightRange)
        .range(['yellow', 'red'])
        .interpolate(d3.interpolateHcl);
    const linkOpacityScale = d3.scaleLog().domain(linkWeightRange).range([0.3, 1]);
    const linkWidthScale = d3.scaleLog().domain(linkWeightRange).range([1, 5]);

    let links = filtered_edges.map(link => {
        let l = new google.maps.Polyline({
            path: [link.source, link.destination],
            map: map,
            strokeColor: linkColorScale(link.data.length),
            strokeWeight: linkWidthScale(link.data.length),
            zIndex: -2,
            strokeOpacity: linkOpacityScale(link.data.length),
        });
        link.source.links.push(l);
        link.destination.links.push(l);
        return l;
    });
}

(<any>window).initMap = initMap;
preprocess();
console.log("Function", initMap, " should be called after Google Map is loaded.");