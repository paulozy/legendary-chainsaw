import { Button, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type HeaderProps = {
  update: any,
  addNew: any
}

export function Header({ update, addNew }: HeaderProps) {
  const { user } = useContext(AppContext)
  const { width } = useWindowSize()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const normalizedName = user.name.toLowerCase().replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  }).split(' ')[0]

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-semibold">Olá, {normalizedName}!</h1>

      {width < 430 ? (
        <div>
          <Button
            variant="contained"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Ações
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => { update(); setAnchorEl(null) }}>Atualizar</MenuItem>
            <MenuItem onClick={() => { addNew(true); setAnchorEl(null) }}>Adicionar</MenuItem>
          </Menu>
        </div>
      ) : null}

      {/* <div className="flex justify-center items-center gap-3">
        <ul className="flex bg-white rounded-md text-[14px] overflow-hidden">
          <li className="border-r-2 border-blue-300 p-2 transition-all cursor-pointer hover:bg-blue-400 hover:border-none">
            Este mês
          </li>
          <li className="border-r-2 border-blue-300 p-2 transition-all cursor-pointer hover:bg-blue-400 hover:border-none">
            Último mês
          </li>
          <li className="border-r-2 border-blue-300 p-2 transition-all cursor-pointer hover:bg-blue-400 hover:border-none">
            Este ano
          </li>
          <li className="p-2 transition-all cursor-pointer hover:bg-blue-400 hover:border-none">
            Últimos 12 meses
          </li>
        </ul>
      </div> */}
      {/* <div></div> */}
    </header>
  );
}
