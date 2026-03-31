import { Area, AreaChart, ResponsiveContainer } from 'recharts';

// ডাটার স্ট্রাকচার অনুযায়ী একটি ইন্টারফেস তৈরি করুন
interface ChartDataItem {
  uv: number;
}

interface MiniChartProps {
  // এখানে any[] এর বদলে ChartDataItem[] ব্যবহার করুন
  data: ChartDataItem[];
  color: string;
}

export const MiniChart = ({ data, color }: MiniChartProps) => {
  const gradientId = `colorGradient-${color.replace('#', '')}`;

  return (
    <div className="h-16 w-full absolute bottom-0 left-0 overflow-hidden rounded-b-3xl opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="uv" 
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};