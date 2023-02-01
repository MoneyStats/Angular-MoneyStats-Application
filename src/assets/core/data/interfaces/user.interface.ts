export interface UserInterface {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  role: string;
  profilePhoto: string;
  currency: string;
}

export interface GithubInterface {
  id?: number;
  username?: string;
  avatar_url?: string;
  updated_at?: Date;
  created_at?: Date;
  followers?: number;
  following?: number;
  html_url?: string;
}
