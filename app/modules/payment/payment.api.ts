import api from "@/utils/apiInstance";

export const updatePaymentStatusApi = async (transactionId: string, status: string) => {
  // আপনার এপিআই এন্ডপয়েন্ট অনুযায়ী কল
  const response = await api.patch(`/orders/status-by-transaction/${transactionId}`, { status });
  return response.data;
};