import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface PieChartProps {
  series: ApexNonAxisChartSeries;
  options: ApexOptions | Record<string, unknown>;
}

const PieChart: React.FC<PieChartProps> = ({ series, options }) => {
  return (
    <Chart
      options={options as ApexOptions}
      type="pie"
      width="100%"
      height="100%"
      series={series}
    />
  );
};

export default PieChart;
