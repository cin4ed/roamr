<x-app-layout>
    <x-slot name="head">
        @include('mapbox-scripts')
    </x-slot>

    <!-- Add new location button -->
    @if (Auth::check())
        <x-primary-button-link href="{{ url('/locations/create') }}" id="add-btn" class="text-center">
            Add +
        </x-primary-button-link>
    @endif

    <!-- Map -->
    <div id="map" class="flex-1 rounded-md border mt-2 border-neutral-700"></div>

    <!-- Scripts -->
    <script>
      // Get lng and lat from url params if they exist
      const urlParams = new URLSearchParams(window.location.search)
      const lng = urlParams.get('lng')
      const lat = urlParams.get('lat')

      // Set default coords
      const coords = [lng || -99.13401822374149, lat || 19.431459141613338]

      // Initialize mapbox
      mapboxgl.accessToken =
        'pk.eyJ1Ijoia2VubmV0aC1xdWludGVybyIsImEiOiJjbGU1bmlsc2gwOHZvM25wM2NwZXVrZnVhIn0.pWzKCuC-uYwHxJm0vThQFQ'

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: coords,
        zoom: coords ? 13 : 12,
      })

      map.on('load', () => {
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
          if (error) throw error
          map.addImage('custom-marker', image)

          map.addSource('locations', {
            type: 'geojson',
            data: "{{ route('api.locations.index') }}",
          })

          map.addLayer({
            id: 'locations',
            type: 'symbol',
            source: 'locations',
            layout: {
              'icon-image': 'custom-marker',
              'text-field': ['get', 'name'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#ffffff'
            }
          })
        })
      })

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
</x-app-layout>
