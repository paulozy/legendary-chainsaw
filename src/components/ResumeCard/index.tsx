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
    <div className="w-full flex items-center justify-between bg-white p-3 rounded-md drop-shadow-md sm:block sm:p-6">
      <p className="text-large text-[#516778] sm:text-base">{title}</p>
      <div className="flex justify-between items-center gap-5 mt-2">
        <h2
          className={`text-xlarge ${isBalance ? `${amount > 0 ? "text-green-500" : "text-red-500"}` : ""} font-semibold sm:text-2xlarge`}
        >
          {formattedAmount}
        </h2>
        {/* <span className="border-[#D5DDE2] border-2 px-2 rounded-md flex items-center text-green-500">
          variation bases on filter
          <Image src={upIcon} alt="" width={15} height={15} />
          12,5%
        </span> */}
      </div>
    </div >
  );
}
