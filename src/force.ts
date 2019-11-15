import { BusinessNode, Edge } from "./data";
import * as d3 from 'd3'
import { NodesView } from "./view";
const width = 400;
const height = 600;

export class ForceLayoutView extends NodesView {
    simulation: d3.Simulation<BusinessNode, undefined>;
    links: d3.Selection<SVGLineElement, Edge, SVGGElement, unknown>;
    nodes: d3.Selection<SVGCircleElement, BusinessNode, SVGGElement, unknown>;
    linkWidthScale: d3.ScaleLogarithmic<number, number>;
    linkColorScale: d3.ScalePower<string, string>;
    constructor(nodes: BusinessNode[], edges: Edge[], container: HTMLElement) {
        super(nodes, edges, container);
    }
    init(): void {
        let businesses: BusinessNode[] = this.businessNodes;
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

        this.nodes = svg.append("g").classed("nodes_container", true)
            .selectAll(".node")
            .data(businesses)
            .enter()
            .append("circle")
            .attr("r", d => sizeScale(d.review_count))
            .attr('fill', d => colorScale(d.stars))
            .classed('node', true);

        const linkWeightRange = d3.extent(edges, d => d.data.length);
        this.linkColorScale = d3.scaleSqrt<string>()
            .domain(linkWeightRange)
            .range(['yellow', 'red'])
            .interpolate(d3.interpolateHcl);
        const linkOpacityScale = d3.scaleLog().domain(linkWeightRange).range([0.3, 1]);
        this.linkWidthScale = d3.scaleLog().domain(linkWeightRange).range([1, 8]);

        this.links = svg.append("g").classed("links_container", true)
            .selectAll(".link")
            .data(edges)
            .enter().append("line")
            .attr('stroke-width', d => this.linkWidthScale(d.data.length))
            .attr('stroke', d => this.linkColorScale(d.data.length))
            // .attr('opacity', d => linkOpacityScale(d.data.length))
            .classed("link", true);
        let x = d3.scaleLinear()
            .domain([0, 30])
            .range([0, width]);
        let y = d3.scaleLinear()
            .domain([0, 30])
            .range([height, 0]);
        let ticked = () => {
            x.domain(d3.extent(businesses, (d: any) => d.x));
            y.domain(d3.extent(businesses, (d: any) => d.y));
            this.nodes
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y));
            this.links
                .attr("x1", d => x(d.source.x))
                .attr("y1", d => y(d.source.y))
                .attr("x2", d => x(d.target.x))
                .attr("y2", d => y(d.target.y));
            const rect = svg.node().getBBox();
            const boundingBox = `${rect.x} ${rect.y} ${rect.width} ${rect.height}`
            svg.attr("viewBox", boundingBox);
        }
        this.simulation = d3.forceSimulation(businesses)
            .force('charge', d3.forceManyBody().strength(-1))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link', d3.forceLink().links(edges))
            .on('tick', ticked);
    }
    hide(): void {
        super.hide();
        this.simulation.stop();
    }

    show(): void {
        super.show();
        this.simulation.restart();
    }
    applyNodeFilter(filter: (node: BusinessNode) => boolean): void {
        throw new Error("Method not implemented.");
    }
    applyEdgeFilter(filter: (edge: Edge) => boolean): void {
        let newEdges = this.edges.filter(filter);
        this.links = this.links.data(newEdges, l => l.src + "_" + l.dst);
        this.links.exit().remove();
        this.links = this.links.enter()
            .append("line")
            .merge(this.links)
            .attr('stroke-width', d => this.linkWidthScale(d.data.length))
            .attr('stroke', d => this.linkColorScale(d.data.length))
            // .attr('opacity', d => linkOpacityScale(d.data.length))
            .classed("link", true);
        this.simulation.force("link", d3.forceLink().links(newEdges));
        this.simulation.alpha(1).restart();
    }
    setTooltipHandler(callback: (node: BusinessNode) => boolean): void {
        throw new Error("Method not implemented.");
    }


}