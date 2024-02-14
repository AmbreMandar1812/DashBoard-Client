import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

const TreeMap = ({ data }) => {
  const svgRef = useRef();
  const width = 800;
  const height = 500;

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const root = d3.hierarchy({ children: data }).sum((d) => d.intensity);

    const treeMapLayout = d3
      .treemap()
      .size([width, height])
      .padding(1)
      .round(true);

    treeMapLayout(root);

    const cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    cell
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => colorScale(d.data.sector))
      .append("title")
      .text((d) => `${d.data.sector}: ${d.data.intensity}`);

    cell
      .append("text")
      .attr("x", 3)
      .attr("y", 15)
      .text((d) => d.data.sector)
      .attr("font-size", "12px")
      .attr("fill", "white");
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
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default TreeMap;
