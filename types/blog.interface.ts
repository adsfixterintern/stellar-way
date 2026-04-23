export interface IBlog {
  _id: string;

  blogTitle: string;
  blogSubtitle: string;
  thumbnail: string;

  contentSections: {
    title: string;
    desc: string;
    image?: string;
    _id?: string;
  }[];

  publishDate: string;
  createdAt: string;

  userId?: {
    _id: string;
    name: string;
    image?: string;
  };

  categoryId?: {
    _id: string;
    name: string;
  };
}
