import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { NextPage } from "next";
import { useContext } from "react";
import { Header } from "../src/components/Header";
import { useWindowSize } from "../src/components/hooks/useWindowSize";
import { LastTransactionsTable } from "../src/components/LastTransactionsTable";
import { Loading } from "../src/components/Loading";
import { NewTransactionModal } from "../src/components/NewTransactionModal";
import { PieChart } from "../src/components/PieChart";
import { SpeedDialButton, SpeedDialTypeEnum } from '../src/components/SpeedDial';
import { TutorModal } from "../src/components/TutorModal";
import { AppContext } from "../src/contexts/AppContext";
import { ResumeCardGroup } from "../src/ResumeCardGroup";
import { User } from "../src/types";

const Home: NextPage = () => {
  const {
    user,
    setUser,
    userName,
    spreadsheetURL,
    setIsModalOpen,
    isNewTransactionModalOpen,
    setIsNewTransactionModalOpen,
    isLoading,
    setIsLoading,
    setTransactions,
    setSeries,
    setPieChartData,
    setIsToastOpen,
    setCategories,
    fetchTransactions,
    getOptions,
  } = useContext(AppContext)
  const { width: windowWidth } = useWindowSize()

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
      setCategories(categories)
      setIsToastOpen(true)
      setIsModalOpen(false)
      setUser(userObj)
      setSeries(series as any)
      setPieChartData(getOptions(categories) as any)

      localStorage.setItem('user', JSON.stringify(userObj))

      setIsLoading(false)
    } catch (error) {
      if (error.message.includes('timeout')) {
        alert('Tempo de carregamento muito longo, tente novamente! Conexão Lenta.')
      }

      setIsLoading(false)
    }
  }

  const actions = [
    { icon: <SpeedDialButton type={SpeedDialTypeEnum.ADD} action={() => setIsNewTransactionModalOpen(true)} />, name: 'Adicionar' },
    { icon: <SpeedDialButton type={SpeedDialTypeEnum.UPDATE} action={handleSubmitImport} />, name: 'Atualizar' },
  ];

  const speedDialSxBasedOnScreenWidth = windowWidth < 430
    ? { position: 'absolute', bottom: -150, right: 10 }
    : { position: 'absolute', bottom: 30, right: 60 }

  return (
    <>
      {isLoading ? <Loading isModalOpen={isLoading} /> : null}
      {isNewTransactionModalOpen ? <NewTransactionModal handleSubmitImport={handleSubmitImport} /> : null}

      {
        user
          ? (<main className="h-lvh px-3 py-3 bg-[#eff4fa] sm:px-64 sm:py-6">
            <Header />

            {/* cards */}
            <ResumeCardGroup />

            {/* chart and table */}
            <section className=" w-full mt-5 drop-shadow-md sm:flex sm:gap-8 sm:mt-8">
              <PieChart />
              <LastTransactionsTable />
            </section>

            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={speedDialSxBasedOnScreenWidth}
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
