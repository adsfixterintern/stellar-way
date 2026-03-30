import api from "@/utils/apiInstance";


export const getUserNotifications = async (email: string) => {
  try {
    const { data } = await api.get(`/notifications/${email}`);
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};


export const markNotificationAsReadApi = async (id: string) => {
  try {
    const { data } = await api.patch(`/notifications/${id}`);
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};


export const deleteNotificationApi = async (id: string) => {
  try {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};


export const clearAllNotificationsApi = async (email: string) => {
  try {
    const { data } = await api.delete(`/notifications/clear/${email}`);
    return data;
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    throw error;
  }
};