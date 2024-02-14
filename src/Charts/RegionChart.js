import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Heading } from "@chakra-ui/react";

const RegionChart = ({ data }) => {
  const svgRef = useRef();
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };

  useEffect(() => {
    if (!data || !data.length) return;

    const regionCounts = {};
    data.forEach((item) => {
      if (item.region in regionCounts) {
        regionCounts[item.region]++;
      } else {
        regionCounts[item.region] = 1;
      }
    });

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 40;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = pie(
      Object.entries(regionCounts).map(([key, value]) => ({ name: key, value }))
    );

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("fill", (d, i) => colorScale(i))
      .attr("d", arc)
      .on("mouseover", (event, d) => {
        // Show tooltip
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("visibility", "visible")
          .html(`${d.data.name}: ${d.data.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        // Hide tooltip
        const tooltip = d3.select("#tooltip");
        tooltip.style("visibility", "hidden");
      });
  }, [data]);

  return (
    <Box>
      <Heading as="h2" mb={4}>
        Region Distribution (Radial Area Chart)
      </Heading>
      <svg ref={svgRef}></svg>
      <div
        id="tooltip"
        style={{
          visibility: "hidden",
          position: "absolute",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      ></div>
    </Box>
  );
};

export default RegionChart;
