import { StatsCard } from '../StatsCard.tsx'
import { TrendingUp } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <StatsCard
        title="Total Sales"
        value="$45,231.89"
        icon={TrendingUp}
        trend={{ value: "+20.1% from last month", positive: true }}
      />
    </div>
  )
}

export default App
