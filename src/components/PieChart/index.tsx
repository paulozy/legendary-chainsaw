import dynamic from "next/dynamic";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

// Dynamically import ApexCharts only on the client side
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This will only import the component on the client side
});

export function PieChart() {
  const { series, pieChartData } = useContext(AppContext)
  const { width: windowWidth } = useWindowSize()

  const chartWidth = windowWidth < 430 ? 400 : 430

  return (
    <div className="w-full bg-white rounded-md p-6 sm:w-[430px] sm:p-6 sm:rounded-xl">
      <h3 className="font-semibold text-large sm:text-large">Despesas por categoria</h3>

      <div className="flex flex-col items-center justify-center mt-3 sm:mt-6 sm:flex sm:flex-col sm:justify-center sm:items-center">
        <Chart options={pieChartData.options} series={series} type="donut" width={chartWidth} />
      </div>
    </div>
  );
}
