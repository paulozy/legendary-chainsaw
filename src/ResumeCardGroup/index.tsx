import { useContext } from "react";
import { ResumeCard } from "../components/ResumeCard";
import { AppContext } from "../contexts/AppContext";
import { TransactionType } from "../types";

export function ResumeCardGroup() {
  const { transactions } = useContext(AppContext)

  const receipts = transactions.filter(({ type }) => type === TransactionType.INCOME).reduce((acc, cur) => {
    return acc + cur.value
  }, 0)
  const expenses = transactions.filter(({ type }) => type === TransactionType.EXPENSE).reduce((acc, cur) => {
    return acc + cur.value
  }, 0)
  const invests = transactions.filter(({ type }) => type === TransactionType.INVEST).reduce((acc, cur) => {
    return acc + cur.value
  }, 0)
  const balance = receipts - (expenses + invests)

  return (
    <section className="w-full grid grid-cols-4 gap-8 mt-10">
      <ResumeCard isBalance={true} title="Balanço" amount={balance} variation={10} />
      <ResumeCard title="Receitas" amount={receipts} variation={12} />
      <ResumeCard title="Despesas" amount={expenses} variation={-1} />
      <ResumeCard title="Investimentos" amount={invests} variation={20} />
    </section>
  )
}