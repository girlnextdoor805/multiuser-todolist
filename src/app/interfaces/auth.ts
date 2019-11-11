export interface Auth {}

export interface signUpRequestObject {
  email: string;
  password: string;
}

export interface signUpResponseObject {
  id: string;
  email: string;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface authenticateUMSRequestObject {
  method: string;
  email: string;
  password: string;
}

export interface authenticateUMSResponseObject {
  access_token: string;
  refresh_token: string;
}

export interface UserProfileRequestObject {
  user_id: string;
  first_name: string;
  last_name: string;
}

export interface UserResponseObject {
  id: string;
  email: string;
  active: string;
  created_at: string;
  updated_at: string;
}
export interface UserProfileResponseObject {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}