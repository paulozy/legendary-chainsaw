import { Autocomplete, Box, Button, createFilterOptions, FormControl, InputAdornment, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField } from "@mui/material";
import Image from "next/image";
import { useContext, useState } from "react";
import addNewImage from "../../../public/add_new.svg";
import { AppContext } from "../../contexts/AppContext";
import { api } from "../../services/axios";
import { TransactionType } from "../../types";

type NewTransactionModalProps = {
  handleSubmitImport: Function
}

const filter = createFilterOptions();

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
    transactions,
    setIsNewTransactionModalOpen,
    isNewTransactionModalOpen
  } = useContext(AppContext)

  const [type, setType] = useState(TransactionType.EXPENSE)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [amount, setAmount] = useState(0)

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };
  const handleChangeCategory = (_, newValue) => {
    if (typeof newValue === 'string') {
      setCategory({
        title: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setCategory({
        title: newValue.inputValue,
      });
    } else {
      setCategory(newValue);
    }
  };
  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };
  const isDisabled = (description === "" || category === "" || amount < 1) ? true : false

  const handleSubmit = async () => {
    const categoryFinded = categories.find((ctg: { title: string }) => ctg.title.toLowerCase() === category.title)

    const transaction = {
      type: type.toUpperCase(),
      description,
      value: amount,
      category: categoryFinded ? categoryFinded : category.title,
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
  const handleOptionalLabel = (option) => {
    if (typeof option === 'string') {
      return option
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.title
  }
  const handleFilter = (options, params) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        title: `Adicionar "${inputValue}"`,
      });
    }

    return filtered;
  }

  const categoriesSet = new Set()
  for (const transaction of transactions) {
    if (transaction) categoriesSet.add(transaction.category)
  }

  const categories = Array.from(categoriesSet).map(e => ({ title: e }))

  return (
    <>
      <Modal
        open={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
        >
          <h1 className="text-xlarge font-semibold text-center sm:text-xl">Adicionar um novo registro</h1>
          <p className="text-small text-[#155EEF] text-center sm:text-sm">Lembre-se de compartilhar a planilha no modo <strong>Editor</strong>, caso contrário não será possível adicionar os dados.</p>

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
                  <Autocomplete
                    size="small"
                    disablePortal
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    freeSolo
                    id="free-solo-with-text-demo"
                    value={category}
                    onChange={handleChangeCategory}
                    options={categories.sort()}
                    renderInput={(params) => <TextField {...params} label="Categoria" />}
                    getOptionLabel={handleOptionalLabel}
                    filterOptions={handleFilter}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps}>
                          {option.title}
                        </li>
                      );
                    }}
                  />
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
    </>
  )
}