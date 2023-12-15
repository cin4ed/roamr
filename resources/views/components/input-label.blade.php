@props(['value'])

<label {{ $attributes->merge([ 'class' => 'text-sm text-gray-700 dark:text-neutral-500']) }}>
    {{ $value ?? $slot }}
</label>
