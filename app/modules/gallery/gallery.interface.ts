export interface IGalleryItem {
  _id: string;
  image: string;
  categoryId: {
    _id: string;
    name: string; 
  };
  sortOrder: number;
}