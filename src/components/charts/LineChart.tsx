import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LineChartProps {
  series: ApexAxisChartSeries;
  options: ApexOptions | Record<string, unknown>;
}

const LineChart: React.FC<LineChartProps> = ({ series, options }) => {
  return (
    <Chart
      options={options as ApexOptions}
      type="line"
      width="100%"
      height="100%"
      series={series}
    />
  );
};

export default LineChart;
