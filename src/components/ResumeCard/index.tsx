type ResumeCardProps = {
  amount: number;
  isBalance?: boolean;
  variation: number;
  title: string;
};

export function ResumeCard({
  amount,
  isBalance = false,
  variation,
  title,
}: ResumeCardProps) {

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return (
    <div className="bg-white p-6 rounded-md drop-shadow-md">
      <p className="text-[14px] text-[#516778]">{title}</p>
      <div className="flex justify-between items-center mt-2">
        <h2
          className={`text-3xl ${isBalance ? `${amount > 0 ? "text-green-500" : "text-red-500"}` : ""} font-semibold`}
        >
          {formattedAmount}
        </h2>
        <span className="border-[#D5DDE2] border-2 px-2 rounded-md flex items-center text-green-500">
          {/* variation bases on filter */}
          {/* <Image src={upIcon} alt="" width={15} height={15} /> */}
          {/* 12,5% */}
        </span>
      </div>
    </div >
  );
}
