import * as d3 from 'd3'
import * as a from '../data/IL_minified.json'

d3.select("body")
    .append("svg")
    .append("circle")
    .attr("r", 50);
console.log(a[0]);