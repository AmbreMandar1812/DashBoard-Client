import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const RelevanceBubbleChart = ({ data }) => {
  const svgRef = useRef();
  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.likelihood)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.impact)])
      .range([height - margin.bottom, margin.top]);

    const rScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.relevance)])
      .range([3, 20]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.likelihood))
      .attr("cy", (d) => yScale(d.impact))
      .attr("r", (d) => rScale(d.relevance))
      .style("fill", (d, i) => colorScale(i));

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width - margin.right)
      .attr("y", -4)
      .attr("text-anchor", "end")
      .attr("fill", "currentColor")
      .text("Likelihood");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("x", -4)
      .attr("y", margin.top)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "currentColor")
      .text("Impact");
  }, [data]);

  return (
    <Box
      margin={50}
      p={4}
      mt={8}
      borderRadius={18}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
    >
      
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default RelevanceBubbleChart;
