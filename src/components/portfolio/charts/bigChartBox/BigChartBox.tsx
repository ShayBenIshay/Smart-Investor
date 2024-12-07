"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./bigChartBox.scss";
import React from "react";

const BigChartBox = ({ colors, stocks }) => {
  const tickersArr = Object.keys(stocks[0]).filter((key) => key !== "name");
  return (
    <div className="bigChartBox">
      <h1>Holdings Over 7 (trading) days</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={stocks}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {tickersArr.map((ticker, index) => {
              return (
                <Area
                  type="monotone"
                  dataKey={ticker}
                  key={ticker}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
