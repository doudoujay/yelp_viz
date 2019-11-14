import { BusinessNode, Edge } from "./data";
import * as d3 from 'd3';
import { NodesView } from "./view";

export class GeoLayoutView extends NodesView {
    constructor(nodes: BusinessNode[], edges: Edge[], container: HTMLElement) {
        super(nodes, edges, container);
    }
    init(): void {
        let businesses: BusinessNode[] = this.nodes;
        let edges: Edge[] = this.edges;
        const labelsOff: google.maps.MapTypeStyle[] = [
            {
                elementType: "labels.icon",
                featureType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];
        let map = new google.maps.Map(this.container, {
            zoom: 13,
            // Centerd at Illinois. The user should be able to see al IL
            // businesses at this view point
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
                node.setRadius(sizeScale((node.get('data')).review_count) * meters_per_px);
            });
        });

        const linkWeightRange = d3.extent(edges, d => d.data.length);
        const linkColorScale = d3.scaleSqrt<string>()
            .domain(linkWeightRange)
            .range(['yellow', 'red'])
            .interpolate(d3.interpolateHcl);
        const linkOpacityScale = d3.scaleLog().domain(linkWeightRange).range([0.3, 1]);
        const linkWidthScale = d3.scaleLog().domain(linkWeightRange).range([1, 8]);

        let links = edges.map(link => {
            let l = new google.maps.Polyline({
                path: [link.source, link.target],
                map: map,
                strokeColor: linkColorScale(link.data.length),
                strokeWeight: linkWidthScale(link.data.length),
                zIndex: -2,
                strokeOpacity: linkOpacityScale(link.data.length),
            });
            link.source.links.push(l);
            link.target.links.push(l);
            l.set('data', link);
            return l;
        });
    }
    applyNodeFilter(filter: (node: BusinessNode) => boolean): void {
        throw new Error("Method not implemented.");
    }
    applyEdgeFilter(filter: (edge: Edge) => boolean): void {
        throw new Error("Method not implemented.");
    }
    setTooltipHandler(callback: (node: BusinessNode) => boolean): void {
        throw new Error("Method not implemented.");
    }
}