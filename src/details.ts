import { BusinessNode, Edge } from "./data";
import * as $ from 'jquery';
export function updateBussinessInformation(node: BusinessNode) {
    $("#biz_name").text(node.name);
    $("#biz_address").text(node.address);
    $("#biz_stars").text(node.stars);
    $("#biz_review_count").text(node.review_count);
    $("#biz_categories").empty();
    node.categories.forEach(ele => {
        $("#biz_categories").append(`<li class="list-group-item">${ele}</li>`);
    })
}
