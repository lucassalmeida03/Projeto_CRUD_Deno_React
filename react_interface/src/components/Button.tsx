type Props = React.ComponentProps<"button"> & {
  isLoading?: boolean
}

export function Button({
  children,
  isLoading,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      className="px-2 h-12 flex items-center justify-center bg-indigo-600
       rounded-lg text-white hover:bg-indigo-700 hover:cursor-pointer
       transition ease-linear disabled:opacity-50"
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? "Enviando..." : children}
    </button>
  )
}
