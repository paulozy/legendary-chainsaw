import { Box, CircularProgress, Modal } from "@mui/material";

type LoadingProps = {
  isModalOpen: boolean
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  outline: 'none'
};

export function Loading({ isModalOpen }: LoadingProps) {
  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <CircularProgress />
        <p>Carregando Informações</p>
      </Box>
    </Modal>
  );
}