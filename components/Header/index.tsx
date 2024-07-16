import { User } from "../../types";

type HeaderProps = {
  user: User
}

export function Header({ user }: HeaderProps) {
  const normalizedName = user.name.toLowerCase().replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  })

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl">Olá, {normalizedName}!</h1>


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

      <div></div>
    </header>
  );
}
