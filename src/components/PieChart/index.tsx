import dynamic from "next/dynamic";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

// Dynamically import ApexCharts only on the client side
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This will only import the component on the client side
});

export function PieChart() {
  const { series, pieChartData } = useContext(AppContext)

  return (
    <div className="w-[430px] bg-white rounded-xl p-6">
      <h3 className="font-semibold text-[16px]">Despesas por categoria</h3>

      <div className="mt-6 flex flex-col justify-center items-center">
        <Chart options={pieChartData.options} series={series} type="donut" width={430} />
      </div>
    </div>
  );
}
