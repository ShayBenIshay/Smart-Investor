"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";

const PieChartBox = ({ data }) => {
  return (
    <div className="pieChartBox">
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "var(--bgSoft)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "var(--textSoft)" }}
            />
            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
              animationDuration={750}
              animationBegin={0}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} className="pie-cell" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {data.map((item) => (
          <div className="option" key={item.name}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span className="name">{item.name}</span>
            </div>
            <span className="value">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
