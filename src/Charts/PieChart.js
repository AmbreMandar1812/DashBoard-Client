import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

const PieChart = ({ data }) => {
  const svgRef = useRef();
  const width = 600;
  const height = 400;
  const radius = Math.min(width, height) / 2 - 10;

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3
      .scaleOrdinal()
      .range(d3.quantize(d3.interpolateRainbow, data.length));

    const pie = d3.pie().value((d) => d.intensity);

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = pie(data);

    svg
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("fill", (d) => colorScale(d.data.sector))
      .attr("d", arcGenerator)
      .append("title")
      .text((d) => `${d.data.sector}: ${d.data.intensity}`);
  }, [data]);

  return (
    <Box
      p={6}
      borderRadius={20}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      mt={50}
      ml={50}
      shadow="md"
      pb={100}
      bg={useColorModeValue("white", "gray.800")}
      maxHeight={700}
      overflow="hidden"
    >
      <Heading as="h2" mb={4}>
        Sector Chart
      </Heading>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default PieChart;
