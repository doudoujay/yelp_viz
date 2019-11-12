import * as raw_businesses from '../data/IL_minified.json';
import * as raw_edges from '../data/IL_edges.json'

export interface BusinessNode {
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

export interface Edge {
    src: string,
    dst: string,
    data: Array<string>,
    source?: BusinessNode,
    destination?: BusinessNode,
}

export let businesses = raw_businesses as Array<BusinessNode>;
export let edges = (raw_edges as Array<Edge>).filter(d => d.data.length >= 7);