import * as d3 from 'd3'
import { CheckinData, CheckinStat } from './data';
export class Checkin {
    day = ["Mon", "Tue", "Wedn", "Thur", "Fri", "Sat", "Sun"];
    hour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    data: Array<CheckinStat>;
    constructor() {
    }

    render(data?: CheckinData) {
        if (data == undefined) {
            $("#checkin-heatmap").hide();
            $("#checkin-null").show();
            return;
        }
        // clear svg
        d3.select("#checkin-heatmap").select('svg').remove();
        this.data = data.stat;
        this.init();
        $("#checkin-heatmap").show();
        $("#checkin-null").hide();
    }

    init(): void {
        let width = $("#checkin-heatmap").width() - 40
        let height = $("#checkin-heatmap").height() - 40
        let margin = { top: 20, right: 20, bottom: 20, left: 20 };

        // let svg = d3.select("#checkin-heatmap").append("svg");
        // svg
        //     .style("width", "100%")
        //     .style("height", "100%");

        let svg = d3.select("#checkin-heatmap")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        console.log(width, height)
        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain(this.day)
            .padding(0.01);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Build X scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain(this.hour)
            .padding(0.01);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Build color scale
        let colorScale = d3.scaleLog()
            .domain(d3.extent(this.data.map(d => d.count))) // input
            .range([0, 1]); // output for coloring
        let myColor = (d: number) => {
            return d3.interpolateReds(colorScale(d));
        }


        svg.selectAll()
            .data(this.data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.day) })
            .attr("y", function (d) { return y(d.hour) })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.count) })


    }
}
