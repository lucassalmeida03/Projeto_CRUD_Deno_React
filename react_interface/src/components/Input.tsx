type Props = React.ComponentProps<'input'> & {
  legend?: string;
};

export function Input({ legend, ...rest }: Props) {
  return (
    <fieldset className="flex flex-1 max-h-20 focus-within:text-indigo-600">
      {legend && (
        <legend className="text-xxs font-sans mb-2 text-inherit">
          {legend}
        </legend>
      )}

      <input
        type="text"
        className="w-full h-12 rounded-lg border border-gray-300 px-4 
        text-sm text-gray-600 bg-transparent outline-none focus:border-2
         focus:border-indigo-600 placeholder:text-gray-600"
        {...rest}
      />
    </fieldset>
  );
}
