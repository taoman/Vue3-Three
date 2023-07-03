export interface LoginInterface {
  username: string;
  roles: Array<string>;
  refreshToken: string;
  expires: string;
  accessToken: string;
}

