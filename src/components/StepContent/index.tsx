import { Box, Button, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import dataAnalysisImage from '../../../public/data_analysis.svg';
import stepsImage from '../../../public/steps.svg';
import { useWindowSize } from "../hooks/useWindowSize";

export function StepContentOne() {
  return (
    <div className="mt-5 flex flex-col justify-center text-center items-center">
      <h2 className="font-bold text-2xlarge leading-none sm:text-3xl ">Seja bem-vindo(a) ao <span className="text-[#155EEF]">Resumos Financeiros</span></h2>
      <p className="text-base text-[#516778] mt-1">Um aplicativo criado para visualizar a sua vida financeira de forma simples, fácil e rápido</p>

      <Image src={dataAnalysisImage} alt="" width={700} />
    </div>
  )
}

const steps = [
  {
    label: 'Informar seu nome',
    description: `Com seu nome conseguimos te oferecer uma experiência ainda mais imersiva.`,
  },
  {
    label: 'Acessar a planilha modelo',
    description: `Acesse a planilha modelo e faça uma cópia dela.`,
    instructions: 'OBS: Menu superior esquerdo -> Arquivo -> Fazer uma cópia'
  },
  {
    label: 'Preencher a planilha',
    description: `Nessa etapa você irá preencher a planilha com os seus dados, está será uma etapa
      recorrente enquanto você usa essa aplicação.`
  },
  {
    label: 'Importar a planilha',
    description: `Após preencher a planilha, você irá compartilha-la com qualquer pessoa que tenha
      o link, assim poderemos consumir os dados da planilha e gerar os gráficos e resumos para você.`
  }
]

export function StepContentTwo({ userName, setUserName, spreadsheetURL, setSpreadsheetURL, isValidGoogleSheetsUrl }: StepContentThreeProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [msgNameError, setMsgNameError] = useState({ error: false, msg: null })
  const [msgSpreadsheetURLError, setMsgSpreadsheetURLError] = useState({ error: false, msg: null })
  const { width: windowWidth } = useWindowSize()

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const onChangeName = (e) => {
    if (e.target.value.length < 3) {
      setMsgNameError({ error: true, msg: 'O nome deve ter mais de 3 caracteres' })
      setUserName(e.target.value)
      console.log('e.target.value - name', e.target.value)
    } else {
      setMsgNameError({ error: false, msg: null })
      setUserName(e.target.value)
    }
  }
  const onChangeSpreadsheetURL = (e) => {
    if (!isValidGoogleSheetsUrl(e.target.value)) {
      setMsgSpreadsheetURLError({ error: true, msg: 'O link precisa ser de uma planilha do: Google Planilhas' })
      setSpreadsheetURL(e.target.value)
      console.log('e.target.value - spreadsheeturl', e.target.value)
    } else {
      setMsgSpreadsheetURLError({ error: false, msg: null })
      setSpreadsheetURL(e.target.value)
    }
  }

  const defaultWorksheetURL = "https://docs.google.com/spreadsheets/d/18VHeypfw8WCiqNjldT3koGnjPCZzl3fqGHRw8KBIrvg/edit?gid=0#gid=0"

  const backButtonMargin = activeStep === steps.length - 1 ? 0 : 1
  const backButtonVariant = activeStep === steps.length - 1 ? "contained" : "text"

  const stepMarginBottom = windowWidth < 430 ? 0 : 2

  return (
    <div className="mt-2 sm:mt-5">
      <h2 className="font-bold text-2xl text-center text-black">Aqui é <span className="text-[#155EEF]">TUDO</span> muito <span className="text-[#155EEF]">SIMPLES</span></h2>
      <p className="text-base text-[#516778] mt-1 text-center">Com o passo a passo abaixo você terá uma ideia dos próximos passos.</p>

      <div className="p-1 sm:flex sm:justify-center sm:items-center sm:p-2">
        <div>
          <Box sx={{ maxWidth: 395, minWidth: 350 }} className="mt-2 sm:mt-5">
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === steps.length - 1 ? (
                        <Typography variant="caption">Último passo</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography style={{ fontSize: 13 }}>{step.description}</Typography>
                    <Typography style={{ fontSize: 14 }}>{step.instructions}</Typography>
                    <Box sx={{ mb: stepMarginBottom }}>
                      <div>
                        {index === 1 ?
                          <Button
                            variant="contained"
                            sx={{ mt: 1, mr: 1 }}
                          >
                            <a
                              href={defaultWorksheetURL}
                              target="_blank"
                            >
                              Planilha
                            </a>
                          </Button>
                          : null}

                        {index === 0 ? (
                          <div>
                            <div>
                              <input
                                onChange={onChangeName}
                                type="text"
                                placeholder="ex: John Doe"
                                id="name"
                                value={userName}
                                className="border-[1px] px-2 py-1 rounded-md border-[#155EEF] mt-[2px] w-[94%] focus:outline-none"
                              />
                            </div>
                            {msgNameError.error ? <span className="text-red-500">{msgNameError.msg}</span> : null}
                          </div>
                        ) : null}

                        {index === 3 ? (
                          <div>
                            <div>
                              <input
                                onChange={onChangeSpreadsheetURL}
                                type="text"
                                placeholder="ex: John Doe"
                                id="name"
                                value={spreadsheetURL}
                                className="border-[1px] px-2 py-1 rounded-md border-[#155EEF] mt-[2px] w-[94%] focus:outline-none"
                              />
                            </div>
                            {msgSpreadsheetURLError.error ? <span className="text-red-500">{msgSpreadsheetURLError.msg}</span> : null}
                          </div>
                        ) : null}

                        {index === steps.length - 1 ? null : (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Continue
                          </Button>
                        )}
                        <Button
                          variant={backButtonVariant}
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: backButtonMargin }}
                        >
                          Voltar
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </div>

        {windowWidth < 430 ? null : <Image src={stepsImage} alt="" width={450} />}
      </div>
    </div >
  )
}

type StepContentThreeProps = {
  userName: string
  setUserName: Function
  spreadsheetURL: string
  setSpreadsheetURL: Function
  isValidGoogleSheetsUrl: Function
}