<x-auth-layout>
    <form method="POST" action="{{ route('register') }}" class="">
        @csrf

        <!-- Name -->
        <div>
            <x-input-label for="name" :value="__('Name')" />
            <x-text-input id="name" class="block mt-1 w-full rounded"
                          type="text" name="name" :value="old('name')"
                          required autofocus autocomplete="name"
                          placeholder="Your Alter Ego Here" />
            <x-input-error :messages="$errors->get('name')" class="mt-2" />
        </div>

        <!-- Email Address -->
        <div class="mt-4">
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full rounded"
                          type="email" name="email" :value="old('email')"
                          required autocomplete="username"
                          placeholder="Your Digital Postbox"/>
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="block mt-1 w-full rounded"
                            type="password"
                            name="password"
                            required autocomplete="new-password"
                            placeholder="Craft Your Secret Key"/>

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Confirm Password -->
        <div class="mt-4">
            <x-input-label for="password_confirmation" :value="__('Confirm Password')" />

            <x-text-input id="password_confirmation" class="block mt-1 w-full rounded"
                          type="password"
                          name="password_confirmation"
                          placeholder="Lock it in Once More"
                          required autocomplete="new-password" />

            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
        </div>

        <div class="flex items-center justify-end mt-4">
            <x-primary-link href="{{ url('/login') }}" class="underline">
                {{ __('Already registered?') }}
            </x-primary-link>

            <x-primary-button class="ml-4">
                {{ __('Register') }}
            </x-primary-button>
        </div>
    </form>
</x-auth-layout>
