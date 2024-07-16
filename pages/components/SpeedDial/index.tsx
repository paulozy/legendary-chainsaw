import PlusIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import { MouseEventHandler } from 'react';

export enum SpeedDialTypeEnum {
  ADD = 'add',
  UPDATE = 'update'
}

type SpeedDialButtonProps = {
  type: SpeedDialTypeEnum
  action: MouseEventHandler
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