import PlusIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';

export enum SpeedDialTypeEnum {
  ADD = 'add',
  UPDATE = 'update'
}

type SpeedDialButtonProps = {
  type: SpeedDialTypeEnum
  action: any
}

const children = {
  add: <PlusIcon />,
  update: <UpdateIcon />
}

export function SpeedDialButton({ type, action }: SpeedDialButtonProps) {

  return (
    <button onClick={action}>
      {children[type]}
    </button>
  )
}