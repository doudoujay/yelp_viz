import { BusinessNode, Edge } from "./data";
import * as d3 from 'd3'
const width = 400;
const height = 600;

export function initForceLayout(businesses: BusinessNode[], edges: Edge[], container: HTMLElement) {
    let svg = d3.select(container).append("svg");
    svg
        .style("width", "100%")
        .style("height", "100%");

    let nodes = svg.append("g").classed("nodes_container", true)
        .selectAll(".node")
        .data(businesses)
        .enter()
        .append("circle")
        .attr("r", 3)
        .classed('node', true);
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
    }
    let simulation = d3.forceSimulation(businesses)
        // .force('charge', d3.forceManyBody().strength(-1))
        // .force('center', d3.forceCenter(width / 2, height / 2))
        // .force('link', d3.forceLink().links(data.links))
        .on('tick', ticked);
}