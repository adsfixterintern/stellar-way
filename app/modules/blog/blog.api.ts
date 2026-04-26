/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";
import {
  IBlog,
  IBlogResponse,
  ICategory,
} from "@/app/modules/blog/blog.interface";

export const getAllBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};
export const getSingleBlog = async (id: string) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

export const BlogApiService = {

  getAllBlogs: async (): Promise<IBlogResponse> => {
    const { data } = await api.get("/blogs");
    return data;
  },

 
  getAllCategories: async (): Promise<{ data: ICategory[] }> => {
    const { data } = await api.get("/categories");
    return data;
  },

  
  createBlog: async (blogData: Partial<IBlog>, thumbnail?: File) => {
    const formData = new FormData();

    
    formData.append("data", JSON.stringify(blogData));

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const { data } = await api.post("/blogs/create-blog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

 
  deleteBlog: async (id: string) => {
    const { data } = await api.delete(`/blogs/${id}`);
    return data;
  },

  updateBlog: async (
    id: string,
    blogData: Partial<IBlog>,
    thumbnail?: File,
  ) => {
    const formData = new FormData();


    const cleanData = {
      ...blogData,
      categoryId:
        typeof blogData.categoryId === "object"
          ? (blogData.categoryId as any)._id
          : blogData.categoryId,
    };

    formData.append("data", JSON.stringify(cleanData));

  
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const { data } = await api.patch(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
