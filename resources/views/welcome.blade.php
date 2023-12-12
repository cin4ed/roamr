<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <!-- Mapbox -->
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js"></script>
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css" type="text/css">
    </head>
    <body class="antialiased bg-neutral-800 text-neutral-400">
        <div class="p-2 h-screen flex flex-col">
            <div class="flex justify-between items-center h-10 px-1">
                <h1 class="font-semibold text-lg">Roamr</h1>
                @if (Route::has('login'))
                    <div>
                        @auth
                            <a href="{{ url('/profile') }}" class="font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-neutral-500">Profile</a>
                        @else
                            <a href="{{ route('login') }}" class="font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-neutral-500">Log in</a>

                            @if (Route::has('register'))
                                <a href="{{ route('register') }}" class="ml-4 font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-neutral-500">Register</a>
                            @endif
                        @endauth
                    </div>
                @endif
            </div>
            @if (Auth::check())
                <a href="{{ url('/locations/create') }}" id="add-btn" class="px-4 py-1 rounded-md text-center bg-neutral-600 text-neutral-300 hover:bg-neutral-700 active:bg-neutral-400 ">Add +</a>
            @endif
            <div id="map" class="flex-1 rounded-md  border mt-2 border-neutral-700"></div>
        </div>
        <script>
            // Get lng and lat from url params if they exist
            const urlParams = new URLSearchParams(window.location.search);
            const lng = urlParams.get('lng');
            const lat = urlParams.get('lat');

            // Set default coords
            const coords = [lng || -99.13401822374149, lat || 19.431459141613338];

            // Initialize mapbox
            mapboxgl.accessToken =
                "pk.eyJ1Ijoia2VubmV0aC1xdWludGVybyIsImEiOiJjbGU1bmlsc2gwOHZvM25wM2NwZXVrZnVhIn0.pWzKCuC-uYwHxJm0vThQFQ";

            const map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/dark-v11",
                center:  coords,
                zoom: coords ? 13 : 12,
            });

            map.on("load", () => {
                map.loadImage("https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png", (error, image) => {
                    if (error) throw error;
                    map.addImage("custom-marker", image);

                    map.addSource("locations", {
                        type: "geojson",
                        data: "{{ route('api.locations.index') }}",
                    });

                    map.addLayer({
                        id: "locations",
                        type: "symbol",
                        source: "locations",
                        layout: {
                            "icon-image": "custom-marker",
                            "text-field": ["get", "name"],
                            "text-font": [
                                "Open Sans Semibold",
                                "Arial Unicode MS Bold"
                            ],
                            "text-offset": [0, 1.25],
                            "text-anchor": "top",
                        },
                        paint: {
                            "text-color": "#ffffff"
                        }
                    });
                });
            });

            // Add geocoder control to the map.
            // map.addControl(
            //     new MapboxGeocoder({
            //         accessToken: mapboxgl.accessToken,
            //         mapboxgl: mapboxgl
            //     })
            // );

            // Add geolocate control to the map.
            // map.addControl(
            //     new mapboxgl.GeolocateControl({
            //         positionOptions: {
            //         enableHighAccuracy: true
            //         },
            //         // When active the map will receive updates to the device's location as it changes.
            //         trackUserLocation: true,
            //         // Draw an arrow next to the location dot to indicate which direction the device is heading.
            //         showUserHeading: true
            //     })
            // );
        </script>
    </body>
</html>
