import { classMerge } from '../utils/classMerge';

type Props = React.ComponentProps<'button'> & {
  isLoading?: boolean;
};

export function Button({
  children,
  className,
  isLoading,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      className={classMerge([
        `w-full px-2 h-12 flex items-center justify-center bg-indigo-600
       rounded-lg text-white hover:bg-indigo-700 hover:cursor-pointer
       transition ease-linear disabled:opacity-5`,
        className,
      ])}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Enviando...' : children}
    </button>
  );
}
