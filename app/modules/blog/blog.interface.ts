export interface IContentSection {
  title: string;
  desc: string;
  image?: string;
  _id?: string;
}

export interface IBlog {
  _id?: string;
  blogTitle: string;
  blogSubtitle: string;
  userId?: string | null;
  categoryId: string | null;
  status: "published" | "draft";
  thumbnail?: string;
  contentSections: IContentSection[];
  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  sortOrder: number;
}

export interface IBlogResponse {
  success: boolean;
  message: string;
  data: IBlog[];
  meta?: any;
}