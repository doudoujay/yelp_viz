import { BusinessNode, Edge } from "./data";
import * as d3 from 'd3'

export function updateBussinessInformation(node: BusinessNode) {
    d3.select("#biz_name").text(node.name);
    d3.select("#biz_address").text(node.address);
    d3.select("#biz_stars").text(node.stars);
    d3.select("#biz_review_count").text(node.review_count);
    d3.select("#biz_categories").text(node.categories.toString());
}

export function updateCheckinInformation(node: BusinessNode){
    // TODO: jay
}