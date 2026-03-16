export interface IReview {
  rating: number;
  comment: string;
  userId: string;
  _id: string;
}

export interface IChef {
  _id: string;
  name: string;
  image: string;
  designation: string;
  rating: number;
  status: string;
}

export interface IMenu {
  _id: string;
  title: string;
  price: number;
  stock: number;
  status: string;
  image?: {
    url: string;
    publicId: string;
  };
  chefId?: IChef | null;
  reviews: IReview[];
  createdAt: string;
  updatedAt: string;
}