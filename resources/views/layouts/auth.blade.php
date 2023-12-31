<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="manifest" href="manifest.json" />

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased min-h-screen flex flex-col justify-center items-center p-4 sm:pt-0 dark:bg-neutral-900 dark:text-neutral-400">
    <div>
        <x-primary-link href="/">
            Roamr
        </x-primary-link>
    </div>
    <div class="px-6 py-4 mt-6 w-full sm:max-w-md">
        {{ $slot }}
    </div>
</body>
</html>
