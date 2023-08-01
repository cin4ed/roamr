<x-dev-layout>
    <x-slot:head>
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
    </x-slot:head>

    <div class="text-neutral-200 min-h-screen flex flex-col">
        <div class="bg-neutral-800 py-2"><a href="{{ url('/') }}" class="block text-xl text-center font-bold">Roamr</a></div>
        <div class="p-4 bg-neutral-700 flex-1">
            <a href="{{ url('/') }}" class="text-neutral-400">< back</a>
            <h1 class="text-xl font-bold mt-2 text-neutral-300">Add a new location</h1>
            <form class="mt-2" method="POST" action="{{ route('locations.store')}}">
                @csrf
                <div id="map" class="h-48 rounded-md"></div>
                <div class="mt-4">
                    <label for="name">Name</label>
                    <input type="text" name="name" placeholder="Some place..." class="mt-1 block w-full h-10 rounded-md bg-neutral-800 border-none placeholder:text-neutral-400">
                </div>
                <div class="mt-2">
                    <label for="name">Description</label>
                    <input type="text" name="name" placeholder="Some description..." class="mt-1 block w-full h-10 rounded-md bg-neutral-800 border-none placeholder:text-neutral-400">
                </div>
                <div class="mt-2">
                    <label for="name">Tags</label>
                    <input type="text" name="name" placeholder="Some tags..." class="mt-1 block w-full h-10 rounded-md bg-neutral-800 border-none placeholder:text-neutral-400">
                </div>
                <button class="mt-6 bg-neutral-800 px-6 py-2 font-bold rounded-md w-full">Create</button>
            </form>
        </div>
    </div>

    <script>
        mapboxgl.accessToken =
            "pk.eyJ1Ijoia2VubmV0aC1xdWludGVybyIsImEiOiJjbGU1bmlsc2gwOHZvM25wM2NwZXVrZnVhIn0.pWzKCuC-uYwHxJm0vThQFQ";

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/dark-v11",
            center: [-110.31362343661425, 24.103134730434004],
            zoom: 12,
        });

        // Set map to user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                map.setCenter([data.coords.longitude, data.coords.latitude]);
            });
        }
    </script>
</x-dev-layout>