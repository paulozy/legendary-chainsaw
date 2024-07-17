import dynamic from "next/dynamic";

// Dynamically import ApexCharts only on the client side
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This will only import the component on the client side
});

type PieChartProps = {
  series: number[];
  options: any;
};

export function PieChart({ series, options }: PieChartProps) {
  return (
    <div className="w-[430px] bg-white rounded-xl p-6">
      <h3 className="font-semibold text-[16px]">Despesas por categoria</h3>

      <div className="mt-6 flex flex-col justify-center items-center">
        <Chart options={options} series={series} type="donut" width={430} />
      </div>
    </div>
  );
}
