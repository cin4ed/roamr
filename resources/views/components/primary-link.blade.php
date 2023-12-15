<a {{ $attributes->merge([
    'class' => '
    text-sm cursor-pointer
    text-gray-400 hover:text-gray-500
    dark:text-neutral-500 dark:hover:text-neutral-400 dark:active:text-neutral-400']) }} >
    {{ $slot }}
</a>
