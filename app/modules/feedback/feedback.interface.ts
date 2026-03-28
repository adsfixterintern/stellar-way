export interface IFeedback {
  _id: string;
  name: string;
  description: string;
  companyLogo: string;
  designation: string;
  userId: string;
  __v: number;
}

export interface IFeedbackResponse {
  success: boolean;
  message: string;
  meta: null | any;
  data: IFeedback[];
}