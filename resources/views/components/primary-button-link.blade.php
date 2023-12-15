<a {{ $attributes->merge([ 'class' => 'rounded-md px-2.5 py-1.5 text-sm shadow-sm
    ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-white dark:text-neutral-400
    dark:shadow-sm dark:ring-neutral-700 dark:bg-neutral-800 dark:hover:bg-[#2a2a2e]
    dark:active:bg-neutral-800']) }}>
    {{ $slot }}
</a>
