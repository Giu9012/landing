export interface Profile {
  id: string;
  userId: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  address?: string;
}