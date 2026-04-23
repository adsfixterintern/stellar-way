export interface IFeedback {
  _id: string;
  name: string;
  description: string;
  designation: string;
  image?: string; 
  userId?: string;
  status: 'pending' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface IFeedbackResponse {
  success: boolean;
  message: string;
  data: IFeedback[]; 
}