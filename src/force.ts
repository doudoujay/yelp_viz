import { BusinessNode, Edge } from "./data";
import * as d3 from 'd3'
import { NodesView } from "./view";
const width = 400;
const height = 600;

export class ForceLayoutView extends NodesView {
    constructor(nodes: BusinessNode[], edges: Edge[], container: HTMLElement) {
        super(nodes, edges, container);
    }
    init(): void {
        let businesses: BusinessNode[] = this.nodes;
        let edges: Edge[] = this.edges;
        // Remove nodes with no edges.
        let validNodes = new Set<BusinessNode>();
        edges.forEach(e => {
            validNodes.add(e.source);
            validNodes.add(e.target);
        });
        businesses = businesses.filter(d => validNodes.has(d));

        let svg = d3.select(this.container).append("svg");
        svg
            .style("width", "100%")
            .style("height", "100%");

        let colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain(d3.extent(businesses, d => d.stars));

        let sizeScale = d3.scaleSqrt()
            .domain(d3.extent(businesses, d => d.review_count))
            .range([0, 20]);

        let nodes = svg.append("g").classed("nodes_container", true)
            .selectAll(".node")
            .data(businesses)
            .enter()
            .append("circle")
            .attr("r", d => sizeScale(d.review_count))
            .attr('fill', d => colorScale(d.stars))
            .classed('node', true);

        const linkWeightRange = d3.extent(edges, d => d.data.length);
        const linkColorScale = d3.scaleSqrt<string>()
            .domain(linkWeightRange)
            .range(['yellow', 'red'])
            .interpolate(d3.interpolateHcl);
        const linkOpacityScale = d3.scaleLog().domain(linkWeightRange).range([0.3, 1]);
        const linkWidthScale = d3.scaleLog().domain(linkWeightRange).range([1, 8]);

        let links = svg.append("g").classed("links_container", true)
            .selectAll(".link")
            .data(edges)
            .enter().append("line")
            .attr('stroke-width', d => linkWidthScale(d.data.length))
            .attr('stroke', d => linkColorScale(d.data.length))
            // .attr('opacity', d => linkOpacityScale(d.data.length))
            .classed("link", true);
        let x = d3.scaleLinear()
            .domain([0, 30])
            .range([0, width]);
        let y = d3.scaleLinear()
            .domain([0, 30])
            .range([height, 0]);
        function ticked() {
            x.domain(d3.extent(businesses, (d: any) => d.x));
            y.domain(d3.extent(businesses, (d: any) => d.y));
            nodes
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y));
            links
                .attr("x1", d => x(d.source.x))
                .attr("y1", d => y(d.source.y))
                .attr("x2", d => x(d.target.x))
                .attr("y2", d => y(d.target.y));
            const rect = svg.node().getBBox();
            const boundingBox = `${rect.x} ${rect.y} ${rect.width} ${rect.height}`
            svg.attr("viewBox", boundingBox);
        }
        let simulation = d3.forceSimulation(businesses)
            .force('charge', d3.forceManyBody().strength(-1))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link', d3.forceLink().links(edges))
            .on('tick', ticked);
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