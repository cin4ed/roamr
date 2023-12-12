@props(['disabled' => false])

<input {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'bg-neutral-800 border-none focus:ring-0 placeholder:text-neutral-500']) !!}>
{{-- bloc mt-1 w-full --}}
