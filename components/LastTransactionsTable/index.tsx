import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Transaction } from "../../types";

type LastTransactionsTableProps = {
  transactions: Transaction[];
};

export function LastTransactionsTable({
  transactions,
}: LastTransactionsTableProps) {

  function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL') {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  }

  return (
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
              <TableCell className="text-[#516778] px-6">Descrição</TableCell>
              <TableCell className="text-[#516778] px-6" align="left">
                Tipo
              </TableCell>
              <TableCell className="text-[#516778] px-6" align="left">
                Categoria
              </TableCell>
              <TableCell className="text-[#516778] px-6" align="left">
                Valor
              </TableCell>
              <TableCell className="text-[#516778] px-6" align="left">
                Data
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" className="px-6">
                  {row.description}
                </TableCell>
                <TableCell className="px-6" align="left">
                  {row.type}
                </TableCell>
                <TableCell className="px-6" align="left">
                  {row.category}
                </TableCell>
                <TableCell className="px-6" align="left">
                  {formatCurrency(row.value)}
                </TableCell>
                <TableCell className="px-6" align="left">
                  {row.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
