import { cn } from "@/lib/utils";

interface TypographyProps {
  text?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
}



export function TypographyH2({ title }: TypographyProps) {
    return (
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
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

  export function TypographySmall({ text, className, onClick }: TypographyProps) {
    return (
      <small className={cn("text-sm font-medium leading-none", className)} onClick={onClick}>
        {text}
      </small>
    )
  } 
  