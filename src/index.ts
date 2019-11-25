import * as d3 from "d3";
import * as $ from "jquery";
import {
  businesses,
  edges,
  BusinessNode,
  checkin_map,
  category_map
} from "./data";
import { ForceLayoutView } from "./force";
import { GeoLayoutView } from "./geo";
import { NodesView } from "./view";
import { Checkin } from "./checkin";
import { updateBussinessInformation } from "./details";

function createColorScale(keys: Array<string> | Set<string>) {
  if (!Array.isArray(keys)) {
    keys = Array.from(keys);
  }
  // Map origin to a number, then number to a color
  let ordinal = d3
    .scaleBand()
    .domain(keys)
    .range([0, keys.length]);
  let linear = d3
    .scaleSequential(d3.interpolateRainbow)
    .domain([0, keys.length]);

  return (d: string) => linear(ordinal(d));
}

function preprocess() {
  let id_to_idx: Record<string, BusinessNode> = {};
  businesses.forEach(d => {
    id_to_idx[d.business_id] = d;
    d.links = [];
  });
  edges.forEach(e => {
    e.source = id_to_idx[e.src];
    e.target = id_to_idx[e.dst];
  });
  (<any>window).edges = edges;
  (<any>window).businesses = businesses;
}

preprocess();
let geoElement = document.getElementById("google-map");
let forceElement = document.getElementById("force-directed");

let geoClickHandler = (node: BusinessNode) => {
  console.log("clicked circle");
  updateBussinessInformation(node);
  checkin.render(checkin_map[node.business_id]);
};

let forceClickHandler = (node: BusinessNode) => {
  console.log("clicked circle");
  updateBussinessInformation(node);
  checkin.render(checkin_map[node.business_id]);
};

let forceView = new ForceLayoutView(businesses, edges, forceElement);
forceView.setTooltipHandler(forceClickHandler);
let geoView = new GeoLayoutView(businesses, edges, geoElement);
geoView.setTooltipHandler(geoClickHandler);

let checkin = new Checkin();

let currentView: NodesView;
let currentEdgeThreshold: number = 7;
let currentCategory: string;

function init() {
  forceView.init();
  geoView.init();
  checkin.render();
  if ((<any>document.getElementById("geo")).checked) {
    changeLayout("geo");
  } else {
    changeLayout("force");
  }
}

function removeAllDescendants(elem: HTMLElement) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function changeLayout(layout: string) {
  console.log(layout);

  // Clear layout, then init the layout chosen
  if (layout == "force") {
    geoView.hide();
    forceView.show();
    currentView = forceView;
  } else if (layout == "geo") {
    forceView.hide();
    geoView.show();
    currentView = geoView;
  } else {
    throw new Error("Unknown layout: " + layout);
  }
  currentView.applyEdgeFilter(e => e.data.length >= currentEdgeThreshold);
  if(currentCategory){
    currentView.applyNodeFilter(e => e.categories.indexOf(currentCategory) > -1);
  }
}

function nodeFilter(event: Event) {
  currentEdgeThreshold = parseInt((event.target as HTMLInputElement).value);
  currentView.applyEdgeFilter(e => e.data.length >= currentEdgeThreshold);
}

function categoryFilter(category: string) {
  currentCategory = category;
  console.log(currentCategory);
  currentView.applyNodeFilter(e => (e.categories != undefined) && (e.categories.indexOf(currentCategory) > -1));
}

(<any>window).init = init;
(<any>window).changeLayout = changeLayout;
document.getElementById("edge-filter").addEventListener("change", nodeFilter);

Object.keys(category_map)
  .filter(category => category_map[category] > 50)
  .forEach(category => {
    let element = `<a class="dropdown-item" href="#" value="${category}">${category} (count: ${category_map[category]})</a>`;
    $(".dropdown-menu").append(element);
  });

$(".dropdown-menu a").click(function() {
  $("#dropdownMenuButton").text($(this).text());
  categoryFilter($(this).attr("value"));
});
