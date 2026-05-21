import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BarChartProps {
  chartData: ApexAxisChartSeries;
  chartOptions: ApexOptions;
}

class BarChart extends React.Component<BarChartProps, { chartData: ApexAxisChartSeries; chartOptions: ApexOptions }> {
  constructor(props: BarChartProps) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default BarChart;
