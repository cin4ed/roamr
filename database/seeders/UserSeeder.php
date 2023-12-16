<?php

namespace Database\Seeders;

use Illuminate\Auth\Events\Registered;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get('database/data/users.json');
        $users = json_decode($json);

        foreach ($users as $key => $value) {
            $user = User::create([
                'name' => $value->name,
                'email' => $value->email,
                'password' => Hash::make($value->password),
            ]);

            event(new Registered($user));
        }
    }
}
