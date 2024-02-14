import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const TopicsRadialAreaChart = ({ data }) => {
  const svgRef = useRef();
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const topics = data.map((item) => item.topic);
    const relevanceValues = data.map((item) => item.relevance);

    const colorScale = d3
      .scaleOrdinal()
      .domain(topics)
      .range(d3.schemeCategory10);

    const pie = d3
      .pie()
      .value((d) => d)
      .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll(".arc")
      .data(pie(relevanceValues))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colorScale(topics[i]));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((d, i) => topics[i]);
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
        Topics Radial Area Chart
      </Heading>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default TopicsRadialAreaChart;
