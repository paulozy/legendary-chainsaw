"use client";

import type { NextPage } from "next";
import { Header } from "./components/Header";
import { ResumeCard } from "./components/ResumeCard";
import { PieChart } from "./components/PieChart";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const data = {
  series: [40, 20, 10, 10, 20],
  options: {
    labels: ["Alimentação", "Entretenimento", "Saúde", "Vestuário", "Casa"],
    legend: {
      position: "bottom" as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  },
};

const Home: NextPage = () => {
  return (
    <main className="h-lvh px-64 py-6 bg-[#eff4fa]">
      <Header />

      {/* cards */}
      <section className="w-full grid grid-cols-4 gap-8 mt-10">
        <ResumeCard isBalance={true} title="Balanço" />
        <ResumeCard title="Receitas" />
        <ResumeCard title="Despesas" />
        <ResumeCard title="Investimentos" />
      </section>

      <section className="flex gap-8 mt-8">
        <PieChart series={data.series} options={data.options} />

        <div className="flex-1 bg-white rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="font-semibold text-[18px]">Últimos registros</h3>
            <p className="text-[#516778] text-sm">
              Aqui estão os seus ultimos registros
            </p>
          </div>

          <TableContainer component={Paper}>
            <Table padding="normal">
              <TableHead className="bg-[#f9fafb]">
                <TableRow>
                  <TableCell className="text-[#516778] px-6">
                    Descrição
                  </TableCell>
                  <TableCell className="text-[#516778] px-6" align="right">
                    Tipo
                  </TableCell>
                  <TableCell className="text-[#516778] px-6" align="right">
                    Categoria
                  </TableCell>
                  <TableCell className="text-[#516778] px-6" align="right">
                    Valor
                  </TableCell>
                  <TableCell className="text-[#516778] px-6" align="right">
                    Data
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" className="px-6">
                      {row.name}
                    </TableCell>
                    <TableCell className="px-6" align="right">
                      {row.calories}
                    </TableCell>
                    <TableCell className="px-6" align="right">
                      {row.fat}
                    </TableCell>
                    <TableCell className="px-6" align="right">
                      {row.carbs}
                    </TableCell>
                    <TableCell className="px-6" align="right">
                      {row.protein}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
    </main>
  );
};

export default Home;
