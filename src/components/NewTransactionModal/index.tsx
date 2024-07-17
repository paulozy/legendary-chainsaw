import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material";
import Image from "next/image";
import { useContext, useState } from "react";
import { AppContext } from "../../../pages/contexts/AppContext";
import addNewImage from "../../../public/add_new.svg";
import { api } from "../../services/axios";
import { TransactionType } from "../../types";

type NewTransactionModalProps = {
  handleSubmitImport: Function
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 2,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

export function NewTransactionModal({ handleSubmitImport }: NewTransactionModalProps) {
  const {
    user,
    categories,
    setIsNewTransactionModalOpen,
    isNewTransactionModalOpen,
    isToastOpen,
    setIsToastOpen
  } = useContext(AppContext)

  const [type, setType] = useState(TransactionType.EXPENSE)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState(0)

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };
  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };
  const isDisabled = (description === "" || category === "" || amount < 1) ? true : false

  const handleSubmit = async () => {
    const transaction = {
      type: type.toUpperCase(),
      description,
      value: amount,
      category: categories.find(ctg => ctg.toLowerCase() === category),
      date: new Date().toISOString().split('T')[0]
    }

    await api.post('transactions/add', {
      transaction,
      spreadsheetUrl: user.spreadsheetURI
    }, { timeout: 3000 })
      .catch(err => alert(err))

    setIsNewTransactionModalOpen(false)
    setType(TransactionType.EXPENSE)
    setDescription('')
    setCategory('')
    setAmount(0)

    await handleSubmitImport()

    return
  }

  return (
    <>
      <Modal
        open={isNewTransactionModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
        >
          <h1 className="mb-3 text-xl font-semibold">Adicionar um novo registro</h1>
          <p>Lembre-se de compartilhar a planilha no modo "Leitor", caso contrário não será possível adicionar os dados</p>

          <div className="flex flex-col justify-center items-center">
            <Image src={addNewImage} alt="" width={300} />

            <Box>
              <div className="flex justify-between items-center gap-3">
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="type-input">Tipo</InputLabel>
                  <Select
                    labelId="type-input"
                    id="demo-select-small"
                    value={type}
                    label="Tipo"
                    onChange={handleChangeType}
                  >
                    <MenuItem value={TransactionType.EXPENSE}>Despesa</MenuItem>
                    <MenuItem value={TransactionType.INCOME}>Receita</MenuItem>
                    <MenuItem value={TransactionType.INVEST}>Investimento</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  id="outlined-start-adornment"
                  label="Descricao"
                  value={description}
                  onChange={handleChangeDescription}
                  InputProps={{
                    startAdornment: <InputAdornment position="end"></InputAdornment>
                  }}
                />
              </div>

              <div className="mt-5 flex justify-between items-center gap-3">
                <FormControl sx={{ minWidth: 120, width: '100%' }} size="small">
                  <InputLabel htmlFor="category-input">Categoria</InputLabel>
                  <Select
                    labelId="category-input"
                    id="demo-select-small"
                    value={category}
                    label="Categoria"
                    onChange={handleChangeCategory}
                  >
                    {categories.sort().map((ctg, i) => (
                      <MenuItem value={ctg.toLowerCase()} key={i}>{ctg}</MenuItem>
                    ))}
                  </Select>
                </FormControl>


                <TextField
                  size="small"
                  id="outlined-start-adornment"
                  label="Valor"
                  type="number"
                  value={amount}
                  onChange={handleChangeAmount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>
                  }}
                />
              </div>

              <div className="mt-2 w-full">
                <Button
                  variant="contained"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isDisabled}
                >
                  Registrar
                </Button>
              </div>
            </Box>
          </div>
        </Box >
      </Modal >

      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        message="Registro criado com sucesso"
        key={'top' + 'center'}
      />
    </>
  )
}