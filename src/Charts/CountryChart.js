import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Box,
  Flex,
  Heading,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

const CountryChart = ({ data }) => {
  const { colorMode } = useColorMode();
  const [selectedCountry, setSelectedCountry] = useState("Russia");

  const svgRef = useRef();

  useEffect(() => {
    const countryData = data.filter(
      (entry) => entry.country === selectedCountry
    );

    const sectors = {};
    countryData.forEach((entry) => {
      if (!sectors[entry.sector]) {
        sectors[entry.sector] = [];
      }
      sectors[entry.sector].push(entry.intensity);
    });

    const sectorLabels = Object.keys(sectors);
    const sectorIntensities = sectorLabels.map((sector) => sectors[sector]);

    drawChart(sectorLabels, sectorIntensities);
  }, [selectedCountry, data, colorMode]);

  const drawChart = (labels, data) => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.flat())])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    const chartBackgroundColor =
      colorMode === "light"
        ? "rgba(79, 59, 169, 0.7)"
        : "rgba(144, 104, 190, 0.7)";

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(labels[i]) + margin.left)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d) + margin.top)
      .attr("height", (d) => height - y(d))
      .attr("fill", chartBackgroundColor);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <Box p={6} shadow="md" bg={useColorModeValue("white", "gray.800")} m={50}>
      <Flex direction="column" margin={"auto"}>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          mb={4}
          w="200px"
          colorScheme="purple"
        >
          <option value="United States of America">
            United States of America
          </option>
          <option value="Mexico">Mexico</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Lebanon">Lebanon</option>
          <option value="Russia">Russia</option>
          <option value="Saudi Arabia">Saudi Arabia</option>
        </Select>
        <svg
          ref={svgRef}
          width={600}
          height={500}
          style={{ backgroundColor: useColorModeValue("white", "gray.800") }}
        ></svg>
      </Flex>
    </Box>
  );
};

export default CountryChart;
