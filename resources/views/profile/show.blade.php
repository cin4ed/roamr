<x-app-layout>
    <div class="max-w-2xl mx-auto p-2">
{{--        <div>--}}
{{--            <a href="/" class="flex items-center gap-1 text-sm hover:text-gray-500 dark:text-neutral-500 dark:hover:text-neutral-400 dark:active:text-neutral-400">--}}
{{--                <iconify-icon icon="heroicons:home-20-solid" class="align-middle"></iconify-icon>--}}
{{--                Home--}}
{{--            </a>--}}
{{--        </div>--}}
        <div class="flex flex-col items-center mt-10" x-data>
            <img src="https://ui-avatars.com/api/?background=262626&color=525252&name={{ $user->name }}"
                 x-show="$store.darkMode.on"
                 alt="User avatar"
                 class="rounded-full border border-solid dark:border-neutral-700 dark:shadow-sm w-32">
            <img src="https://ui-avatars.com/api/?background=fff&color=9ca3af&name={{ $user->name }}"
                 x-show="!$store.darkMode.on"
                 alt="User avatar"
                 class="rounded-full border border-solid dark:border-neutral-700 dark:shadow-sm w-32">
            <h1 class="font-semibold text-sm mt-4 text-gray-500 dark:text-neutral-500">{{ $user->name }}</h1>
        </div>
    </div>
</x-app-layout>
