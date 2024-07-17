import { Box, Modal } from "@mui/material";
import Lottie from 'react-lottie';
import loadingLottie from '../../lotties/finances_loading.json';

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

const defaultLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingLottie,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

export function Loading({ isModalOpen }: LoadingProps) {
  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h2 className="text-2xl font-semibold">Carregando Informações</h2>

        <Lottie
          options={defaultLottieOptions}
          height={250}
          width={400}
        />
      </Box>
    </Modal>
  );
}