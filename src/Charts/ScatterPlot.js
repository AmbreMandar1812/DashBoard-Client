import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();
  const margin = { top: 20, right: 20, bottom: 50, left: 80 }; // Adjust left margin
  const width = 800 - margin.left - margin.right; // Increase width
  const height = 400 - margin.top - margin.bottom;
  const barPadding = 0.3; // Adjust bar padding

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((item) => item.topic))
      .range([0, width])
      .padding(barPadding); // Adjust bar padding

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.relevance)])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em") // Adjust text offset
      .attr("dy", "0.5em"); // Adjust text offset

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.topic))
      .attr("y", (d) => y(d.relevance))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.relevance))
      .attr("fill", "steelblue");
  }, [data]);

  return (
    <Box
      margin={50}
      p={4}
      mt={8}
      borderRadius={18}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
    >
      <Heading as="h2" mb={4}>
        Bar Chart
      </Heading>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default ScatterPlot;
