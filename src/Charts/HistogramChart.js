import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const HistogramChart = ({ data, bins }) => {
  const svgRef = useRef();
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([margin.left, innerWidth]);

    const histogram = d3
      .histogram()
      .domain(x.domain())
      .thresholds(x.ticks(bins))
      .value((d) => d);

    const binsData = histogram(data);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(binsData, (d) => d.length)])
      .range([innerHeight, margin.top]);

    const xAxis = d3.axisBottom(x);

    svg
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    const bar = svg
      .selectAll(".bar")
      .data(binsData)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d) => `translate(${x(d.x0)}, ${y(d.length)})`);

    bar
      .append("rect")
      .attr("x", 1)
      .attr("width", x(binsData[0].x1) - x(binsData[0].x0) - 1)
      .attr("height", (d) => innerHeight - y(d.length))
      .attr("fill", "steelblue");

    bar
      .append("text")
      .attr("dy", ".75em")
      .attr("y", -10)
      .attr("x", (x(binsData[0].x1) - x(binsData[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .text((d) => d.length);
  }, [data, bins]);

  return (
    <Box
      margin={50}
      p={4}
      mt={8}
      borderRadius={18}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
    >
      <Heading as="h2" mb={4}>
        Histogram Chart
      </Heading>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default HistogramChart;
