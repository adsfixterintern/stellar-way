import api from "@/utils/apiInstance";

// সেটিংস ফেচ করার জন্য
export const getSettingsApi = async () => {
  const response = await api.get("/settings");
  return response.data;
};

// সেটিংস আপডেট করার জন্য (যেহেতু ইমেজ আছে, তাই এটি FormData গ্রহণ করবে)
export const updateSettingsApi = async (payload: FormData) => {
  const response = await api.patch("/settings/update", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};