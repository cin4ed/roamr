<x-dev-layout>
    <x-slot:head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css" type="text/css">
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js"></script>
        <style>
            #map {
                border-radius: 0.375rem;
                overflow: hidden;
            }
        </style>
    </x-slot:head>

    <div class="text-neutral-200 min-h-screen flex flex-col">
        <div class="bg-neutral-800 py-2"><a href="{{ url('/') }}" class="block text-xl text-center font-bold">Roamr</a></div>
        <div class="p-4 bg-neutral-700 flex-1">
            <div class=" md:w-3/5 mx-auto">
                <a href="{{ url('/') }}" class="text-neutral-400">< back</a>
                <h1 class="text-xl font-bold mt-2 text-neutral-300">Add a new location</h1>
                <form class="mt-2" method="POST" action="{{ route('locations.store')}}">
                    @csrf
                    <div>
                        <label for="location">Location</label>
                        {{-- Search bar --}}
                        {{-- <div class="flex justify-between items-center mt-1 pr-3 w-full h-10 rounded-md overflow-hidden gap-1 bg-neutral-800">
                            <input type="text" name="location" class="flex-1 border-none focus:ring-0 bg-neutral-800 placeholder:text-neutral-500" placeholder="Dr Flores Dentista, Blvd. Agust...">
                            <x-zondicon-search class="h-4 text-neutral-500" />
                        </div> --}}
                        <div class="relative">
                            <div id="map" class="h-52 md:h-96 mt-2 rounded-md overflow-hidden"></div>
                            {{-- Fullscreen and current location --}}
                            {{-- <button type="button" class="bg-neutral-600 absolute z-10 top-1 left-1 p-1 rounded-sm">
                                <x-fluentui-full-screen-maximize-16 class="h-5 text-neutral-400" />
                            </button>
                            <button type="button" class="bg-neutral-600 absolute z-10 top-1 right-1 p-1 rounded-sm">
                                <x-fluentui-my-location-16-o class="h-5 text-neutral-400"/>
                            </button> --}}
                        </div>
                        <div class="mt-2 rounded-md overflow-hidden bg-neutral-800 text-neutral-500">
                            <div class="flex gap-2">
                                <div class="w-10 p-2 bg-neutral-600 text-neutral-400">
                                    <p>lng:</p>
                                </div>
                                <div class="py-2">
                                    <p id="lng-container">-111.3392</p>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <div class="w-10 p-2 bg-neutral-600 text-neutral-400">
                                    <p>lat:</p>
                                </div>
                                <div class="py-2">
                                    <p id=lat-container>26.01461</p>
                                </div>
                            </div>
                        </div>
                            <button type="button" id="btn-curr-loc" class="py-2 rounded-md flex justify-center items-center gap-4 mt-2 w-full bg-neutral-800 text-neutral-300 hover:bg-neutral-900">
                                Use current location <x-fluentui-my-location-16-o class="h-5 text-neutral-300"/>
                            </button>
                    </div>
                    <div class="mt-2">
                        <label for="name">Name</label>
                        <input type="text" name="name" placeholder="Some place..." class="mt-1 block w-full h-10 rounded-md bg-neutral-800 border-none placeholder:text-neutral-400">
                    </div>
                    <div class="mt-2">
                        <label for="name">Description</label>
                        <input type="text" name="name" placeholder="Some description..." class="mt-1 block w-full h-10 rounded-md bg-neutral-800 border-none placeholder:text-neutral-400">
                    </div>
                    {{-- <div class="mt-2">
                        <label for="description">Tags</label>
                        <input type="text" name="description" placeholder="Some tags..." class="mt-1 block w-full h-10 rounded-md bg-neutral-800 border-none placeholder:text-neutral-400">
                    </div> --}}
                    <div class="mt-2">
                        <p>Image</p>
                        <div class="flex items-center justify-center w-full mt-2">
                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-48 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg class="w-8 h-8 mb-4 text-neutral-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p class="mb-2 text-sm text-neutral-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p class="text-xs text-neutral-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" class="hidden" />
                            </label>
                        </div>
                    </div>
                    <button class="mt-6 bg-neutral-800 px-6 py-2 font-bold rounded-md w-full">Create</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        const defaultLocation = [-111.3392, 26.01461];

        // Set map
        mapboxgl.accessToken =
            "pk.eyJ1Ijoia2VubmV0aC1xdWludGVybyIsImEiOiJjbGU1bmlsc2gwOHZvM25wM2NwZXVrZnVhIn0.pWzKCuC-uYwHxJm0vThQFQ";

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/dark-v11",
            center: defaultLocation,
            zoom: 12,
        });

        // Set marker
        const marker = new mapboxgl.Marker({draggable:true})
            .setLngLat(defaultLocation)
            .addTo(map);

        marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            document.getElementById('lng-container').innerHTML = lngLat.lng;
            document.getElementById('lat-container').innerHTML = lngLat.lat;
        });

        // Set map to user's location if allowed
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                marker.setLngLat([data.coords.longitude, data.coords.latitude]);
                document.getElementById('lng-container').innerHTML = data.coords.longitude;
                document.getElementById('lat-container').innerHTML = data.coords.latitude;
                map.setCenter([data.coords.longitude, data.coords.latitude]);
            });
        }

        // Set current coords as location's coords
        document.getElementById('btn-curr-loc').addEventListener('click', () => {
            navigator.geolocation.getCurrentPosition((data) => {
                marker.setLngLat([data.coords.longitude, data.coords.latitude]);

                document.getElementById('lng-container').innerHTML = data.coords.longitude;
                document.getElementById('lat-container').innerHTML = data.coords.latitude;

                map.flyTo({
                    center: [data.coords.longitude, data.coords.latitude],
                    zoom: 12,
                    essential: true
                });
            });
        });
    </script>
</x-dev-layout>