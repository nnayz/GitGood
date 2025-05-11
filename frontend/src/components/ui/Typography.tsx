
interface TypographyProps {
  text?: string;
  title?: string;
}



export function TypographyH2({ title }: TypographyProps) {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {title}
      </h2>
    )
  }

export function TypographyH3({ title }: TypographyProps) {
    return (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {title}
      </h3>
    )
  }

  export function TypographyP({ text }: TypographyProps) {
    return (
      <p className="leading-7 [&:not(:first-child)]:mt-1">
        {text}
      </p>
    )
  }

  export function TypographySmall({ text }: TypographyProps) {
    return (
      <small className="text-sm font-medium leading-none">
        {text}
      </small>
    )
  } 
  