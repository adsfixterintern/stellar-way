export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string; // নতুন যোগ করা হয়েছে
  image?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    token: string; 
  };
}

export interface IRegisterData {
  name: string;
  email: string;
  password?: string;
}

export interface ILoginCredentials {
  email: string;
  password?: string;
}