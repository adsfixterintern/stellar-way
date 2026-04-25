import api from "@/utils/apiInstance";

// Types
export interface IOwnerMessage {
  _id: string;
  message: string;
  ownerName: string;
  designation: string;
  image: string;
}

// GET
// GET
export const getOwnerMessage = async (): Promise<IOwnerMessage | null> => {
  try {
    const response = await api.get("/owner-message");
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching owner message:", error);
    return null;
  }
};
// CREATE
export const createOwnerMessageApi = async (formData: FormData) => {
  try {
    const response = await api.post("/owner-message/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating owner message:", error);
    throw error;
  }
};

// UPDATE
export const updateOwnerMessageApi = async (formData: FormData) => {
  try {
    const response = await api.patch("/owner-message/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating owner message:", error);
    throw error;
  }
};

// RESET / DELETE
export const resetOwnerMessageApi = async () => {
  try {
    const response = await api.delete("/owner-message/reset");
    return response.data;
  } catch (error) {
    console.error("Error resetting owner message:", error);
    throw error;
  }
};
