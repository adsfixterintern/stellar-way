export interface ISalesChartData {
    name: string;    // মাসের নাম (Jan, Feb, etc.)
    revenue: number; // ওই মাসের মোট আয়
    orders: number;  // ওই মাসের মোট অর্ডার সংখ্যা
}

export interface IOverView {
    totalPaidOrders: number;
    orderTrend: number;       
    totalRevenue: number; 
    revenueTrend: number;   
    totalPendingOrders: number;
    pendingTrend: number;
    salesChartData: ISalesChartData[]; // এই নতুন ফিল্ডটি যোগ করা হলো
}