export interface UserInformation {
  username: string;
  bio: string;
  fullName: string;
  profilePicture: string;
}

export const userInformation: UserInformation = {
  username: 'john_doe',
  bio: 'A software developer from NY',
  fullName: 'John Doe',
  profilePicture: 'https://xsgames.co/randomusers/avatar.php?g=male',
};
