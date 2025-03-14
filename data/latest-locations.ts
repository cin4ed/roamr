interface User {
  name: string;
  lastName: string;
  profileImage: string;
}

export interface Location {
  id: number;
  name: string;
  dateAdded: string;
  description: string;
  addedBy: User;
  country: string;
  status: string;
  rating: number;
  images: string[];
}

export const latestLocations = [
  {
    id: 1,
    name: 'Hotel Los Arcos',
    dateAdded: '2025-2-21',
    description:
      'Abandoned hotel in the middle of La Paz Malecon with a beautiful view of the sea.',
    country: 'México',
    status: 'inReview',
    rating: 4,
    images: ['https://www.diarioelindependiente.mx/uploads/2023/11/16998640951cc2a.jpg'],
    addedBy: {
      name: 'Damian',
      lastName: 'Pérez',
      profileImage: 'https://xsgames.co/randomusers/avatar.php?g=male',
    },
  },
  {
    id: 3,
    name: 'Haludovo Palace Hotel',
    dateAdded: '2025-2-21',
    description: 'An abandoned luxury hotel in Croatia, a relic of the Yugoslav era.',
    country: 'Croacia',
    status: 'verified',
    rating: 4,
    images: [
      'https://lh5.googleusercontent.com/p/AF1QipPapX_dqbn7sP9r7wF17WXJ7o_ibUZInMFwe8V4=w426-h240-k-no',
    ],
    addedBy: {
      name: 'Nelson',
      lastName: 'Figueroa',
      profileImage: 'https://xsgames.co/randomusers/avatar.php?g=male',
    },
  },
  {
    id: 4,
    name: 'The Baker Hotel',
    dateAdded: '2025-2-21',
    description: 'An iconic abandoned hotel in Texas, famous for its history and mineral springs.',
    country: 'United States',
    status: 'inReview',
    rating: 4,
    images: ['https://lh5.googleusercontent.com/p/AF1QipMXPxOMaO94JivMONhHJPAnRYP1t7AEk_eTOYyw'],
    addedBy: {
      name: 'Carlos',
      lastName: 'Mendoza',
      profileImage: 'https://xsgames.co/randomusers/avatar.php?g=male',
    },
  },
  {
    id: 2,
    name: 'Hospital El Carrizalito',
    dateAdded: '2025-2-21',
    description:
      'An abandoned hospital in the middle of nowhere, built to combat the tuberculosis pandemic.',
    country: 'México',
    status: 'verified',
    rating: 4,
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5CtFjSD42S-S8syxkb5qdivXs0b92UD9Qhw&s',
    ],
    addedBy: {
      name: 'Ana Karen',
      lastName: 'Galvan',
      profileImage: 'https://xsgames.co/randomusers/avatar.php?g=female',
    },
  },
  {
    id: 5,
    name: "St. Mary's Evangelical Lutheran Cathedral",
    dateAdded: '2025-2-21',
    description:
      'The largest Lutheran cathedral in Estonia, with a history dating back to the 13th century.',
    country: 'Estonia',
    status: 'inReview',
    rating: 4,
    images: ['https://lh5.googleusercontent.com/p/AF1QipPLDmWTsjGe_jNanl_PG2kFbc7uHxYXb6cM3W9R'],
    addedBy: {
      name: 'Carlos',
      lastName: 'Rodarte',
      profileImage: 'https://xsgames.co/randomusers/avatar.php?g=male',
    },
  },
];
