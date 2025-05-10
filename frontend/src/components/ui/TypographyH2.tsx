
interface TypographyH2Props {
    title: string;
}


export function TypographyH2({ title }: TypographyH2Props) {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {title}
      </h2>
    )
  }