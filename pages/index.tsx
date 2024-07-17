import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { NextPage } from "next";
import { useContext } from "react";
import { Header } from "../src/components/Header";
import { LastTransactionsTable } from "../src/components/LastTransactionsTable";
import { Loading } from "../src/components/Loading";
import { PieChart } from "../src/components/PieChart";
import { SpeedDialButton, SpeedDialTypeEnum } from '../src/components/SpeedDial';
import { TutorModal } from "../src/components/TutorModal";
import { ResumeCardGroup } from "../src/ResumeCardGroup";
import { api } from "../src/services/axios";
import { User } from "../src/types";
import { AppContext } from "./contexts/AppContext";

const Home: NextPage = () => {
  const {
    user,
    setUser,
    userName,
    spreadsheetURL,
    setIsModalOpen,
    isLoading,
    setIsLoading,
    transactions,
    setTransactions,
    setSeries,
    setPieChartData,
    fetchTransactions,
    getOptions
  } = useContext(AppContext)

  const handleSubmitImport = async () => {
    try {
      setIsModalOpen(false)
      setIsLoading(true)

      let userObj = {} as User

      if (!userName || !spreadsheetURL) {
        userObj = JSON.parse(localStorage.getItem('user'))
      } else {
        userObj = { name: userName, spreadsheetURI: spreadsheetURL }
      }

      const { transactions, categories } = await fetchTransactions(userObj)

      const totalsPerCategory = {};

      for (const ctg of categories) {
        totalsPerCategory[ctg] = 0
      }

      for (const transaction of transactions) {
        if (totalsPerCategory.hasOwnProperty(transaction.category)) {
          totalsPerCategory[transaction.category] += transaction.value
        }
      }

      const series = Object.entries(totalsPerCategory).map(([_, total]) => (total));

      setTransactions(transactions)
      setIsModalOpen(false)
      setUser(userObj)
      setSeries(series as any)
      setPieChartData(getOptions(categories) as any)

      localStorage.setItem('user', JSON.stringify(userObj))

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const addNewTransaction = async () => {
    const transaction = {
      id: crypto.randomUUID(),
      type: 'DESPESA',
      description: 'Teste insert',
      value: 200,
      category: 'Vestuário',
      date: '16/07/2024'
    }

    await api.post('transactions/add', {
      transaction,
      spreadsheetUrl: user.spreadsheetURI
    }, { timeout: 3000 })
      .catch(err => alert(err))

    alert('adicionado com sucesso')
    return
  }

  const actions = [
    { icon: <SpeedDialButton type={SpeedDialTypeEnum.ADD} action={addNewTransaction} />, name: 'Adicionar' },
    { icon: <SpeedDialButton type={SpeedDialTypeEnum.UPDATE} action={handleSubmitImport} />, name: 'Atualizar' },
  ];

  return (
    <>
      {isLoading ? <Loading isModalOpen={isLoading} /> : null}

      {
        user
          ? (<main className="h-lvh px-64 py-6 bg-[#eff4fa]">
            <Header />

            {/* cards */}
            <ResumeCardGroup />

            {/* chart and table */}
            <section className="flex gap-8 mt-8">
              <PieChart />
              <LastTransactionsTable />
            </section>

            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{ position: 'absolute', bottom: 30, right: 60 }}
              icon={<SpeedDialIcon />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                />
              ))}
            </SpeedDial>
          </main>)
          : <TutorModal handleSubmit={handleSubmitImport} />
      }
    </>
  );
};

export default Home;
