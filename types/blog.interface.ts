export interface IBlog {
  _id: { $oid: string } | string;
  blogTitle: string;
  blogSubtitle: string;
  thumbnail: string;
  contentSections: {
    title: string;
    desc: string;
    image?: string;
    _id?: { $oid: string };
  }[];
  publishDate: { $date: string };
  createdAt: { $date: string };
}