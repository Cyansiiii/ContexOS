import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ActivityChart({ chartData }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="d"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
          dy={10}
        />
        <Tooltip
          cursor={{ fill: 'transparent', opacity: 0.1 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-[#212121] dark:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl -translate-y-4">
                  {payload[0].payload.val || `${(payload[0].value / 10).toFixed(1)}h`}
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="h" radius={[6, 6, 6, 6]} animationDuration={1000}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.active ? '#2563eb' : '#3b82f6'}
              style={{ opacity: entry.active ? 1 : 0.6 }}
              className="hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
