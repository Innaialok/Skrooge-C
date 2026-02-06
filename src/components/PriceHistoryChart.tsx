'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'

interface PriceHistoryData {
    date: string
    price: number
    retailer: string
}

interface PriceHistoryChartProps {
    data: PriceHistoryData[]
    currentPrice: number
    lowestPrice: number
    highestPrice: number
}

export default function PriceHistoryChart({
    data,
    currentPrice,
    lowestPrice,
    highestPrice
}: PriceHistoryChartProps) {
    const formattedData = data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'MMM d'),
        fullDate: format(new Date(item.date), 'MMM d, yyyy'),
    }))

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{payload[0]?.payload?.fullDate}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${payload[0]?.value?.toFixed(2)}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price History</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">
                            Lowest: <span className="font-semibold text-green-600">${lowestPrice.toFixed(2)}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">
                            Highest: <span className="font-semibold text-red-600">${highestPrice.toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            domain={['dataMin - 50', 'dataMax + 50']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="url(#priceGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${currentPrice.toFixed(2)}</p>
                </div>
                {currentPrice <= lowestPrice * 1.05 && (
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium">
                        Near Lowest Price!
                    </span>
                )}
            </div>
        </div>
    )
}
