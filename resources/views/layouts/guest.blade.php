<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <style>
            .test {
                background-color: rgb(61, 61, 61);
            }
        </style>
    </head>
    <body class="font-sans bg-neutral-800 text-neutral-400 antialiased">
        <div class="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-neutral-800 p-4">
            <div>
                <a href="/" class="font-semibold text-lg">
                    Roamr
                </a>
            </div>

            <div class="w-full sm:max-w-md mt-6 px-6 py-4 test text-neutral-300 border border-neutral-600 rounded overflow-hidden sm:rounded-lg">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
