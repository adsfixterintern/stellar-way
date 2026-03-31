// export interface IFeedback {
//   _id: string;
//   name: string;
//   description: string;
//   companyLogo: string;
//   designation: string;
//   userId: string;
//   __v: number;
// }

// export interface IFeedbackResponse {
//   success: boolean;
//   message: string;
//   meta: null | any;
//   data: IFeedback[];
// }

export interface IFeedback {
  _id: string;
  name: string;
  description: string;
  companyLogo?: string; // Optional রাখা হয়েছে
  designation: string;
  userImage?: string; // যদি API তে ইমেজ ফিল্ড থাকে
  userId: string;
}

export interface IFeedbackResponse {
  success: boolean;
  message: string;
  data: IFeedback[];
}