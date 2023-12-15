<a {{ $attributes->merge([
    'class' => 'block w-full px-4 py-2 text-left text-sm leading-5 focus:outline-none transition duration-150 ease-in-out
    text-gray-700 hover:bg-gray-200
    dark:text-neutral-400 dark:hover:bg-neutral-700']) }}>{{ $slot }}</a>
