import * as d3 from "d3";

export interface LineChartItem {
  x: any;
  y: number;
}

function determineLineChartThicknessFromDataPointsCount(count: number) {
  return count < 10 ? 5 : count <= 20 ? 4 : count <= 100 ? 3 : count <= 500 ? 2 : 1;
}

/**
 * Draws a line chart.
 *
 * @param data Must be an array of objects with x and y properties to be plotted.
 * @param width The total width of the chart (including labels).
 * @param height The total height of the chart (including labels).
 * @param color The color of the line. Must be a number from 0x000000 to 0xFFFFFF.
 * @returns The fully drawn detachedL element.
 */
export function drawLineChart(data: LineChartItem[], width: number, height: number, color: string) {
  const margin = { top: 20, right: 20, bottom: 23, left: 115 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const thickness = determineLineChartThicknessFromDataPointsCount(data.length);

  let ticks;
  if (
    d3.min(data, function (d: { y: any }) {
      return d.y;
    })! < 5
  ) {
    ticks = 3;
  } else {
    ticks = 6;
  }
  // X scale
  const xScale = d3
    .scaleTime()
    .nice()
    .domain([
      d3.min(data, function (d: { x: any }) {
        return d.x;
      })!,
      d3.max(data, function (d: { x: any }) {
        return d.x;
      })!,
    ]) // input
    .range([0, width]); // output

  // Y scale
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d: { y: any }) {
        return d.y;
      }),
    ]) // input
    .range([height, 0]); // output

  // create detached SVG node
  const detachedL = d3.create("svg");
  detachedL
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // X axis
  detachedL
    .append("g")
    .call(d3.axisBottom(xScale).ticks(6))
    .attr("transform", "translate(" + (margin.left - 1) + "," + (height + margin.top) + ")")
    .selectAll("text")
    .attr("transform", "translate(0,4)")
    .attr("fill", "white")
    .style("text-anchor", "middle");

  // Y Axis
  detachedL
    //Axis placement
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //Axis draw: ticks, formatting, labels
    .call(d3.axisRight(yScale).ticks(ticks).offset(-1.6).tickSizeInner(-10).tickSizeOuter(0))
    //Labels
    .selectAll("text")
    .attr("fill", "white")
    .style("text-anchor", "end")
    .attr("transform", "translate(-20,1)")
    .selectAll("line");

  detachedL.selectAll("line").attr("stroke", "white");
  detachedL.selectAll("path").attr("stroke", "white");
  // Line
  const line = d3
    .line<LineChartItem>()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveBumpX);

  const lineWrapper = detachedL
    .append("g")

    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  lineWrapper
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("stroke-width", thickness) // set the stroke width
    .attr("stroke", color) // set the line colour
    .attr("fill", "none"); // set the fill colour;

  return detachedL.node()!;
}
