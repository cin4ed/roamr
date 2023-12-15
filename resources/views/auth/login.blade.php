<x-auth-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full rounded"
                          type="email" name="email" :value="old('email')"
                          required autofocus autocomplete="username"
                          placeholder="Your Digital Postbox" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-5">
            <x-input-label for="password" :value="__('Password')" />
            <x-text-input id="password" class="block mt-1 w-full rounded"
                          type="password"
                          name="password"
                          required autocomplete="current-password"
                          placeholder="Your Secret Key"/>
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <x-checkbox-input id="remember_me" name="remember"/>
                <span class="ml-2 text-sm text-neutral-500">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-between mt-4">
           <div>
               <x-primary-link href="{{ url('/register') }}" class="underline">
                   {{ __('Register') }}
               </x-primary-link>
           </div>
            <div>
                @if (Route::has('password.request'))
                    <x-primary-link href="{{ route('password.request') }}" class="underline">
                        {{ __('Forgot your password?') }}
                    </x-primary-link>
                @endif

                <x-primary-button class="ml-3">
                    {{ __('Log in') }}
                </x-primary-button>

            </div>
        </div>
    </form>
</x-auth-layout>
