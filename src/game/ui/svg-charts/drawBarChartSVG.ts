import * as d3 from "d3";
import { Color, lerpColor } from "@sdk/utils/color/Color";
import { unlerp } from "@sdk/utils/math";

export interface BarChartDataItem {
  x: number;
  y: string;
}

/**
 * Draws a bar chart.
 *
 * @param data Must be an array of objects with x and y properties to be plotted.
 * @param width The total width of the chart (including labels).
 * @param height The total height of the chart (including labels).
 * @returns The fully drawn svgBar element.
 */
export function drawBarChart(data: BarChartDataItem[], width: number, height: number, xMax: number, yMax: number) {
  //***Declarations***\\
  //*Constants*\\
  const margin = { top: 7, right: 20, bottom: 22, left: 115 };
  const barPadding = 2;
  const teal = new Color(0x69b3a2);
  const tan = new Color(0x393839);
  const barsToYMaxRatio = data.length / yMax;
  //*Variables*\\
  let barLerpValue = [];
  let colorArray: any[] = [];
  let colorArrayItem;

  //***set the dimensions and margins of the graph
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  //***Color Bars Lerp loop
  for (let i = 0; i < data.length; i++) {
    barLerpValue[i] = unlerp(1, xMax, data[i].x); //Get each data point and assign it a value between 0 and 1 based on the min of 1 and max of the highest data value
    colorArrayItem = lerpColor(tan, teal, barLerpValue[i]); //creates a new color for each data point as a % mix of color 1 and color 2 determined by the unlerp value
    colorArray[i] = colorArrayItem.toRgbString(); //Adds each new color to an array after converting the value to an RGB String
  }

  //***X scale
  const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);

  //***Y scale
  const yScale = d3
    .scaleBand()
    .range([0, height * barsToYMaxRatio])
    .domain(data.map(d => d.y));

  //***create detached SVG node
  var detachedB = d3.create("svg");
  detachedB
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //***Add X axis
  detachedB
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).offset(-1).ticks(4))
    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    .selectAll("text")
    .attr("fill", "white")
    .attr("transform", "translate(-2,3)")
    .attr("text-anchor", "middle");

  //***Y axis
  detachedB
    .append("g")
    .call(d3.axisRight(yScale).offset(-1).tickSizeInner(-5).tickSizeOuter(0).tickPadding(0))
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "domain y-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("fill", "white")
    .attr("transform", "translate(-10,1)");

  detachedB.selectAll("line").attr("stroke", "white");
  detachedB.selectAll("path").attr("stroke", "white");

  detachedB.selectAll(".y-axis path").attr("d", `M-1,${height}.5V-1`);

  //***Bars
  detachedB
    .selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", margin.left)
    .attr("y", function (d) {
      return margin.top + yScale(d.y)!;
    })
    .attr("width", function (d) {
      return xScale(d.x);
    })
    .attr("height", function (d) {
      return height / yMax - barPadding;
    })
    .attr("transform", `translate(0, ${barPadding * 0.5})`)
    //***Color and lerp colors***\\
    .attr("fill", function (d, i) {
      return colorArray[i];
    });
  return detachedB.node()!;
}
