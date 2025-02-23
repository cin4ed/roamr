interface Location {
    id: number;
    lat: number;
    lng: number;
}

interface Images {
    id: number;
    url: string;
}

interface Place {
    id: number;
    verified: boolean;
    name: string;
    description: string;
    images: Images[];
    location: Location;
    rating: number;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    createdAt: string;
    updatedAt: string;
}

interface Review {
    id: number;
    user_id: number;
    place_id: number;
    rating: number;
    body: string;
    images: Images[];
    createdAt: string;
    updatedAt: string;
}