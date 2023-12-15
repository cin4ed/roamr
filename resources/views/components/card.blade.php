<div {{ $attributes->merge([
    'class' => 'shadow-sm dark:shadow-md ring-1 ring-inset overflow-hidden
    rounded-md ring-gray-300 dark:ring-neutral-700 dark:bg-neutral-800']) }}>
    {{ $slot }}
</div>
