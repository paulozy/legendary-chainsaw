"use client";

import {
  Box,
  Button,
  Modal,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { Header } from "./components/Header";
import { PieChart } from "./components/PieChart";
import { ResumeCard } from "./components/ResumeCard";
import { StepContentOne, StepContentTwo } from "./components/StepContent";

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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export type User = {
  name: string;
  spreadsheetURI: string;
}

const steps = ['Seja bem vindo(a)', 'Como funcina?'];

const Home: NextPage = () => {
  const [user, setUser] = useState<User>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [activeStep, setActiveStep] = useState(0);
  const [userName, setUserName] = useState<string>()
  const [spreadsheetURL, setSpreadsheetURL] = useState<string>()
  const [transactions, setTransactions] = useState({})

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleSubmit = async () => {
    const sla = await fetch(`/api/worksheet?uri=${spreadsheetURL}`)

    if (sla.status !== 200) {
      const err = await sla.json()
      return alert(err.error)
    }
''
    const json = await sla.json()
    setTransactions(json)
    setUser({ name: userName, spreadsheetURI: spreadsheetURL })
    setIsModalOpen(false)
  }

  return (
    <>
      {/* <TutorStepper /> */}

      <Modal
        open={isModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? <span>Loading Data</span> : (
            <>
              {
                activeStep === 0 ? <StepContentOne /> : <StepContentTwo setUserName={setUserName} userName={userName} setSpreadsheetURL={setSpreadsheetURL} spreadsheetURL={spreadsheetURL} isValidGoogleSheetsUrl={isValidGoogleSheetsUrl} />
              }

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Voltar
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === steps.length - 1
                  ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!userName || userName.length < 3 || !spreadsheetURL || !isValidGoogleSheetsUrl(spreadsheetURL)}
                    >
                      Finalizar
                    </Button>
                  )
                  : (
                    <Button onClick={handleNext} >
                      Próximo
                    </Button>
                  )}
              </Box>
            </>
          )}
        </Box >
      </Modal >

      {!user ? null : (
        <main className="h-lvh px-64 py-6 bg-[#eff4fa]">
          <Header user={user} />

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
      )}
    </>
  );
};

const isValidGoogleSheetsUrl = (url: string) => {
  const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+(\/edit)?(\?[^#]*)?(#gid=\d+)?$/;
  return regex.test(url);
}

export default Home;
