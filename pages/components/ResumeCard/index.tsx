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
  return (
    <div className="bg-white p-6 rounded-md drop-shadow-md">
      <p className="text-[14px] text-[#516778]">{title}</p>
      <div className="flex justify-between items-center mt-2">
        <h2
          className={`text-3xl ${isBalance ? "text-[#155EEF]" : ""} font-semibold`}
        >
          R$1.000,00
        </h2>
        <span className="border-[#D5DDE2] border-2 px-2 rounded-md flex items-center">
          {/* variation bases on filter */}
          {/* <Image src={upIcon} alt="" width={15} height={15} /> */}
          12,5%
        </span>
      </div>
    </div>
  );
}
