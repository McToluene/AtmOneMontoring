import React, { FunctionComponent, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import RenderActiveShape from "./RenderActiveShape";

interface DoughnutProps {
  data: { name: string; value: number }[];
  colors: string[];
  width?: number;
  height?: number;
  cx: number | string;
  cy: number | string;
  style?: object;
  onValueSelected?: (e: any) => void;
}

const Doughnut: FunctionComponent<DoughnutProps> = (props) => {
  const { data, colors, cx, cy, height, width, style, onValueSelected } = props;
  const [state, setState] = useState({ activeIndex: 0 });

  const onPieEnter = (data: any, index: number) => {
    setState({ activeIndex: index });
  };

  return (
    <PieChart width={width} height={height} style={style}>
      <Pie
        dataKey="value"
        activeIndex={state.activeIndex}
        activeShape={RenderActiveShape}
        data={data}
        cx={cx}
        cy={cy}
        innerRadius="50%"
        outerRadius="68%"
        fill="#8884d8"
        onMouseEnter={onPieEnter}
        onClick={onValueSelected}
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};
export default Doughnut;
