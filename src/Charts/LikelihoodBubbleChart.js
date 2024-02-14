import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const LikelihoodBubbleChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right; // Adjusted width
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxLikelihood = d3.max(data, (d) => d.likelihood);

    const xScale = d3
      .scaleLinear()
      .domain([0, maxLikelihood])
      .range([0, width]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.country))
      .range([height, 0])
      .padding(0.1);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.likelihood))
      .attr("cy", (d) => yScale(d.country) + yScale.bandwidth() / 2)
      .attr("r", (d) => d.likelihood * 5) // Adjust the multiplier to adjust bubble size
      .style("fill", "rgba(79, 59, 169, 0.7)")
      .style("stroke", "rgba(79, 59, 169, 1)")
      .style("stroke-width", 2);

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.likelihood) + 10) // Adjust the offset for better positioning
      .attr("y", (d) => yScale(d.country) + yScale.bandwidth() / 2)
      .text((d) => d.country)
      .style("font-size", "12px")
      .style("alignment-baseline", "middle");

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5));

    svg.append("g").call(d3.axisLeft(yScale));
  }, [data]);

  return (
    <Box
      borderRadius={20}
      pt={6}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      mt={50}
      shadow="md"
      pb={100}
      bg="white"
      maxHeight={700}
      overflow="hidden"
    >
      

      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default LikelihoodBubbleChart;
