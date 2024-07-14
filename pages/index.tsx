import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { LastTransactionsTable } from "./components/LastTransactionsTable";
import { Loading } from "./components/Loading";
import { PieChart } from "./components/PieChart";
import { ResumeCard } from "./components/ResumeCard";
import { TutorModal } from "./components/TutorModal";
import { Transaction, User } from "./types";

const getOptions = (categories: [string]) => {
  return {
    options: {
      labels: categories,
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
      tooltip: {
        y: {
          formatter: function (value) {
            return `R$ ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
          }
        }
      },
    }
  }
};

type FetchTransactionsReturn = { transactions: Transaction[], categories: [string] }

const fetchTransactions = async (user: User): Promise<FetchTransactionsReturn> => {
  const uriParam = encodeURIComponent(user.spreadsheetURI);

  const response = await fetch(`/api/worksheet?uri=${uriParam}`)

  if (response.status !== 200) {
    const err = await response.json()
    return alert(err.error)
  }

  const { transactions, categories } = await response.json()

  return { transactions, categories }
}

const Home: NextPage = () => {
  const [user, setUser] = useState<User>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userName, setUserName] = useState<string>()
  const [spreadsheetURL, setSpreadsheetURL] = useState<string>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [series, setSeries] = useState<[number]>()
  const [pieChartData, setPieChartData] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const userObj = { name: userName, spreadsheetURI: spreadsheetURL }

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
  }

  const tutorModalProps = {
    isModalOpen,
    userName,
    spreadsheetURL,
    setUserName,
    setSpreadsheetURL,
    handleSubmit
  }

  const receipts = transactions.filter(({ type }) => type === 'RECEITA').reduce((acc, cur) => {
    return acc + cur.value
  }, 0)
  const expenses = transactions.filter(({ type }) => type === 'DESPESA').reduce((acc, cur) => {
    return acc + cur.value
  }, 0)
  const invests = transactions.filter(({ type }) => type === 'INVESTIMENTO').reduce((acc, cur) => {
    return acc + cur.value
  }, 0)
  const balance = receipts - (expenses + invests)

  useEffect(() => {
    setIsLoading(true)

    const userFromLocalStorage = localStorage.getItem('user')
    if (!userFromLocalStorage) {
      setIsLoading(false)
      setIsModalOpen(true)
      return
    }

    (async () => {
      const parsedUser = JSON.parse(localStorage.getItem('user')) as User

      const uriParam = encodeURIComponent(parsedUser.spreadsheetURI);
      const lastTenParam = encodeURIComponent('true');

      const response = await fetch(`/api/worksheet?uri=${uriParam}&lastTen=${lastTenParam}`)

      if (response.status !== 200) {
        const err = await response.json()
        return alert(err.error)
      }

      const { transactions, categories } = await fetchTransactions(parsedUser)

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

      setUser(parsedUser)
      setTransactions(transactions)
      setSeries(series as any)
      setPieChartData(getOptions(categories) as any)
      setIsLoading(false)
    })()

  }, []);

  return (
    <>
      {isLoading ? <Loading isModalOpen={isLoading} /> : null}

      {
        user ? (
          <main className="h-lvh px-64 py-6 bg-[#eff4fa]">
            <Header user={user} />

            {/* cards */}
            <section className="w-full grid grid-cols-4 gap-8 mt-10">
              <ResumeCard isBalance={true} title="Balanço" amount={balance} variation={10} />
              <ResumeCard title="Receitas" amount={receipts} variation={12} />
              <ResumeCard title="Despesas" amount={expenses} variation={-1} />
              <ResumeCard title="Investimentos" amount={invests} variation={20} />
            </section>

            {/* chart and table */}
            <section className="flex gap-8 mt-8">
              <PieChart series={series as any} options={pieChartData.options} />
              <LastTransactionsTable transactions={transactions.slice(0, 5)} />
            </section>
          </main>
        ) : <TutorModal props={tutorModalProps} />
      }
    </>
  );
};

export default Home;
