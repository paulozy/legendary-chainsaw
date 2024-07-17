import { createContext, useEffect, useState } from 'react';
import { api } from '../../../src/services/axios';
import { Transaction, User } from '../../../src/types';

type AppContextProps = {
  user: User,
  setUser: Function,
  isModalOpen: boolean,
  setIsModalOpen: Function,
  isLoading: boolean,
  setIsLoading: Function,
  transactions: Transaction[],
  setTransactions: Function,
  categories: [string],
  setCategories: Function,
  series: [number],
  setSeries: Function,
  pieChartData: PieChartData,
  setPieChartData: Function,
  userName: string,
  setUserName: Function,
  spreadsheetURL: string,
  setSpreadsheetURL: Function,
  isNewTransactionModalOpen: boolean,
  setIsNewTransactionModalOpen: Function
  isToastOpen: boolean,
  setIsToastOpen: Function,
  fetchTransactions: Function,
  getOptions: Function
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

type PieChartData = { options: any }
type FetchTransactionsReturn = { transactions: Transaction[], categories: [string] }

const fetchTransactions = async (user: User): Promise<FetchTransactionsReturn> => {
  const uriParam = encodeURIComponent(user.spreadsheetURI);

  const response = await api.get(`transactions?uri=${uriParam}`)
    .catch(err => {
      console.log('pqp', err)
      alert(err.error)
    })

  const { transactions, categories } = response.data

  return { transactions, categories }
}

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

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState<User>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState([])
  const [series, setSeries] = useState<[number]>()
  const [pieChartData, setPieChartData] = useState({} as PieChartData)
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState<string>()
  const [spreadsheetURL, setSpreadsheetURL] = useState<string>()
  const [isToastOpen, setIsToastOpen] = useState(false)

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

      const response = await fetch(`/api/transactions?uri=${uriParam}&lastTen=${lastTenParam}`)

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
      setCategories(categories)
      setSeries(series as any)
      setPieChartData(getOptions(categories) as any)
      setIsLoading(false)
    })()

  }, []);

  const value = {
    user,
    setUser,
    isModalOpen,
    setIsModalOpen,
    isLoading,
    setIsLoading,
    transactions,
    setTransactions,
    categories,
    setCategories,
    series,
    setSeries,
    pieChartData,
    setPieChartData,
    userName,
    setUserName,
    spreadsheetURL,
    setSpreadsheetURL,
    isNewTransactionModalOpen,
    setIsNewTransactionModalOpen,
    isToastOpen,
    setIsToastOpen,
    fetchTransactions,
    getOptions
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}