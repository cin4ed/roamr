<div class="flex justify-between items-center h-10">
    <x-primary-link href="{{ url('/') }}">Roamr</x-primary-link>
    @if (Route::has('login'))
        <div>
            @auth
                <!-- Settings Dropdown -->
                <div class="hidden sm:flex sm:items-center sm:ml-6">
                    <x-dropdown-simple align="right" width="48">
                        <x-slot name="trigger_content">
                            <div>{{ Auth::user()->name }}</div>
                        </x-slot>
                        <x-slot name="content">
                            @if(!request()->routeIs('profile.show'))
                                <x-dropdown-link href="{{ route('profile.show', auth()->user()->name) }}">
                                    {{ __('Profile') }}
                                </x-dropdown-link>
                            @else
{{--                                <x-dropdown-link :href="route('profile.edit')">--}}
{{--                                    {{ __('Edit Profile') }}--}}
{{--                                </x-dropdown-link>--}}
                            @endif

                            <!-- Authentication -->
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf

                                <x-dropdown-link :href="route('logout')"
                                                 onclick="event.preventDefault();
                                                this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </x-dropdown-link>
                            </form>
                        </x-slot>
                    </x-dropdown-simple>
                </div>
            @else
                <x-primary-link href="{{ route('login') }}">Log in</x-primary-link>
                <x-primary-link href="{{ route('register') }}" class="ml-3">Register</x-primary-link>
            @endauth
        </div>
    @endif
</div>
