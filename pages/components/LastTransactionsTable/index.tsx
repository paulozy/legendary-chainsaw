import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type LastTransactionsTableProps = {
  transactions: {
    id: number;
    description: string;
    type: string;
    category: string;
    value: number;
    date: string;
  }[];
};

export function LastTransactionsTable({
  transactions,
}: LastTransactionsTableProps) {
  return (
    <>
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
    </>
  );
}
