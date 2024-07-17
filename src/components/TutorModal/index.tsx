import { Box, Button, Modal, Step, StepLabel, Stepper } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { StepContentOne, StepContentTwo } from "../StepContent";

export const modalDefaultStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  outline: 'none'
}

const steps = ['Seja bem-vindo(a)', 'Como funciona?'];

type TutorModalProps = {
  handleSubmit: any
}

export const TutorModal = ({ handleSubmit }: TutorModalProps) => {
  const {
    isModalOpen,
    userName,
    setUserName,
    spreadsheetURL,
    setSpreadsheetURL
  } = useContext(AppContext)

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalDefaultStyle}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? null : (
          <>
            {
              activeStep === 0
                ? <StepContentOne />
                :
                <StepContentTwo
                  setUserName={setUserName}
                  userName={userName}
                  setSpreadsheetURL={setSpreadsheetURL}
                  spreadsheetURL={spreadsheetURL}
                  isValidGoogleSheetsUrl={isValidGoogleSheetsUrl}
                />
            }

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Voltar
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1
                ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!userName || userName.length < 3 || !spreadsheetURL || !isValidGoogleSheetsUrl(spreadsheetURL)}
                  >
                    Finalizar
                  </Button>
                )
                : (
                  <Button onClick={handleNext} >
                    Próximo
                  </Button>
                )}
            </Box>
          </>
        )}
      </Box >
    </Modal >
  )
}

const isValidGoogleSheetsUrl = (url: string) => {
  const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+(\/edit)?(\?[^#]*)?(#gid=\d+)?$/;
  return regex.test(url);
}
