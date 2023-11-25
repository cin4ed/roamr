<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LocationController extends Controller
{
    /**
     * Instantiate a new controller instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Location::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('locations.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'bail|required|string|max:255',
            'description' => 'bail|required|string|max:255',
            'longitude' => 'bail|required|numeric',
            'latitude' => 'bail|required|numeric',
            'images.*' => 'bail|required|image|mimes:png,jpeg,jpg|max:2048',
        ]);

        // Create a new location
        $location = $request->user()->locations()->create($validated);

        // Generate a path for each image and store it in the images folder
        $images = [];
        foreach ($request->images as $requestImage) {
            $imageName = time().'.'.$requestImage->extension();
            $requestImage->move(public_path('images'), $imageName);
            $image = new Image(['path' => $imageName]);
            array_push($images, $image);
        }

        // Save the images to the database
        $location->images()->saveMany($images);

        // Redirect to the home page with coordinates in the URL
        return redirect()->route('home', [
            'lng' => $location->longitude,
            'lat' => $location->latitude,
        ]);
    }
}
