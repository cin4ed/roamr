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
        <script src="https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js"></script>

        <!-- Scripts and styles -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <!-- Extra  -->
        @if (isset($head))
            {{ $head }}
        @endif
    </head>
    <body class="font-sans h-screen flex flex-col antialiased p-2  dark:bg-neutral-900 dark:text-neutral-400">
    @include('layouts.navigation')
    {{ $slot }}
    </body>
</html>
