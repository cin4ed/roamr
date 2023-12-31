<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LocationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get('database/data/locations.json');
        $locations = json_decode($json);

        foreach ($locations as $key => $value) {
            Location::create([
                'name' => $value->name,
                'description' => $value->description,
                'latitude' => $value->latitude,
                'longitude' => $value->longitude,
            ]);
        }
    }
}
