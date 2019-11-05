import * as d3 from 'd3';
import * as a from '../data/IL_minified.json';

function initMap() {
    const labelsOff: google.maps.MapTypeStyle[] = [
        {
            elementType: "labels.icon",
            featureType: "all",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    let map = new google.maps.Map(document.getElementById("google-map"), {
        zoom: 4,
        center: { lat: 40.354731, lng: -100.75564 },
        streetViewControl: false,
        mapTypeControl: false,
        styles: labelsOff,
    });

    console.log(map.getBounds());
}

(<any>window).initMap = initMap;
console.log("Function", initMap, " should be called after Google Map is loaded.");