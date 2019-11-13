import * as d3 from 'd3';
import { businesses, edges, BusinessNode } from './data';
import { initGeoLayout } from './geo'
import { initForceLayout } from './force';

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
    let id_to_idx: Record<string, BusinessNode> = {}
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

preprocess();
let geoElement = document.getElementById('google-map');
let forceElement = document.getElementById('force-directed');
function init() {
    initGeoLayout(businesses, edges, geoElement);
    initForceLayout(businesses, edges, forceElement);
}

(<any>window).init = init;