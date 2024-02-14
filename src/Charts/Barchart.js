import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Heading, Input, Button,Box } from "@chakra-ui/react";

const Barchart = ({ data }) => {
  const svgRef = useRef();
  const [startYear, setStartYear] = useState(2013);
  const [endYear, setEndYear] = useState(2022);
  const [intensity, setIntensity] = useState(null);

  useEffect(() => {
    if (!data || !data.length) return;

    const filteredData = data.filter(
      (item) => item.start_year >= startYear && item.start_year <= endYear
    );

    const intensitySum = filteredData.reduce(
      (total, item) => total + item.intensity,
      0
    );
    const averageIntensity = intensitySum / filteredData.length;
    setIntensity(averageIntensity);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(filteredData.map((item) => item.start_year))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.intensity)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.start_year))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.intensity))
      .attr("height", (d) => height - y(d.intensity))
      .attr("fill", getColor);
  }, [data, startYear, endYear]);

  const getColor = (value) => {
    const threshold = d3.max(data, (d) => d.intensity) / 4;
    if (value < threshold) {
      return "#7F00FF"; // Green
    } else if (value < threshold * 2) {
      return "#F2B93B"; // Yellow
    } else if (value < threshold * 3) {
      return "#FF8000"; // Orange
    } else {
      return "#FF453A"; // Red
    }
  };

  const handleStartYearChange = (event) => {
    setStartYear(parseInt(event.target.value));
  };

  const handleEndYearChange = (event) => {
    setEndYear(parseInt(event.target.value));
  };

  const clearFilter = () => {
    setStartYear(2013);
    setEndYear(2022);
  };

  return (
    <div
      style={{
        margin: "50px",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* <Heading as="h2" mb={4}>
        Intensity Chart
      </Heading>
      <Input
        type="number"
        placeholder="Enter start year"
        value={startYear}
        onChange={handleStartYearChange}
        mb={4}
      />
      <Input
        type="number"
        placeholder="Enter end year"
        value={endYear}
        onChange={handleEndYearChange}
        mb={4}
      />
      <Button onClick={clearFilter} colorScheme="teal" size="sm" mb={4}>
        Clear Filter
      </Button>
      <p>Average Intensity: {intensity}</p> */}

      <svg ref={svgRef}></svg>
    
    </div>
  );
};

export default Barchart;
