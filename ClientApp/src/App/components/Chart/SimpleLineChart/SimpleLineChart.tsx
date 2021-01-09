import React, { FunctionComponent } from "react";
import { LineChart, XAxis, CartesianGrid, Tooltip, Legend, Line, YAxis } from "recharts";

interface SimpleLineChartProps {
  data: any;
  dataKey: string[];
  width?: number;
}

const SimpleLineChart: FunctionComponent<SimpleLineChartProps> = ({ data, dataKey, width }) => {
  return (
    <LineChart
      width={width ? width : 1510}
      height={450}
      data={data}
      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
    >
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={dataKey[0].toString()} stroke="#F0AD4E" />
      <Line type="monotone" dataKey={dataKey[1].toString()} stroke="#5BC0DE" />
      <Line type="monotone" dataKey={dataKey[2].toString()} stroke="#D9534F" />
    </LineChart>
  );
};
export default SimpleLineChart;
