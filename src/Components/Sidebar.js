import { useState, useEffect } from "react";
import axios from "axios";
import { Heading, Input, Button } from "@chakra-ui/react";
import Barchart from "../Charts/Barchart";
import LikelihoodBubbleChart from "../Charts/LikelihoodBubbleChart";
import CountryChart from "../Charts/CountryChart";
import RelevanceBubbleChart from "../Charts/RelevanceBubbleChart";
import TreeMap from "../Charts/TreeMap";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [insights, setInsights] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("BarChart");

  const Menus = [
    { title: "BarChart", src: "Chart_fill" },
    { title: "LikelihoodBubbleChart", src: "Chat" },
    { title: "CountryChart", src: "User" },
    { title: "RelevanceBubbleChart", src: "Search" },
    { title: "TreeMap", src: "Chart" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/");
      setInsights(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMenuClick = (title) => {
    setSelectedMenu(title);
  };

  const renderChart = () => {
    switch (selectedMenu) {
      case "BarChart":
        return <Barchart data={insights} />;
      case "LikelihoodBubbleChart":
        return <LikelihoodBubbleChart data={insights} />;
      case "CountryChart":
        return <CountryChart data={insights} />;
      case "RelevanceBubbleChart":
        return <RelevanceBubbleChart data={insights} />;
      case "TreeMap":
        return <TreeMap data={insights} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <h1
            className={`text-black origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            DashBoard
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-900 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
              onClick={() => handleMenuClick(Menu.title)}
            >
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-screen flex-1 p-7">
        <h1 className="text-2xl font-semibold ">{selectedMenu}</h1>
        {renderChart()}
      </div>
    </div>
  );
};
export default Sidebar;
