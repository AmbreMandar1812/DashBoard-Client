import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const LikelihoodRadarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(data, (d) => d.likelihood);

    const angleSlice = (Math.PI * 2) / data.length;

    const rScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, width / 2]);

    const line = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.likelihood))
      .angle((d, i) => i * angleSlice);

    const axes = svg
      .selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axes
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2)
      .attr(
        "x2",
        (d, i) => width / 2 + Math.cos(angleSlice * i) * rScale(maxValue)
      )
      .attr(
        "y2",
        (d, i) => height / 2 + Math.sin(angleSlice * i) * rScale(maxValue)
      )
      .style("stroke", "black")
      .style("stroke-width", "2px");

    const path = svg
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "rgba(79, 59, 169, 0.7)")
      .attr("stroke", "rgba(79, 59, 169, 1)")
      .attr("stroke-width", 2);
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
      <Heading as="h2" mb={4} ml={6}>
        Likelihood Chart
      </Heading>

      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default LikelihoodRadarChart;
