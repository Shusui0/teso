"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViolationCard } from "@/components/ViolationCard"
import { StatsCard } from "@/components/StatsCard"
import { ReportForm } from "@/components/ReportForm"
import { AlertCircle, CheckCircle, Clock, FileText, Search, LogOut } from "lucide-react"
import Link from "next/link"

// Mock data
const mockViolations = [
  {
    id: "1",
    type: "Speeding",
    location: "Main Street & 5th Avenue",
    date: "2025-11-05 14:30",
    status: "under_review" as const,
    severity: "high" as const,
    vehiclePlate: "ABC-1234",
    description: "Vehicle exceeded speed limit by 25 km/h in a school zone",
  },
  {
    id: "2",
    type: "Red Light Violation",
    location: "Park Boulevard & Oak Street",
    date: "2025-11-05 09:15",
    status: "reported" as const,
    severity: "medium" as const,
    vehiclePlate: "XYZ-9876",
    description: "Vehicle ran red light at intersection during rush hour",
  },
  {
    id: "3",
    type: "Illegal Parking",
    location: "City Center, Zone A",
    date: "2025-11-04 16:45",
    status: "resolved" as const,
    severity: "low" as const,
    vehiclePlate: "DEF-5555",
    description: "Vehicle parked in no-parking zone blocking fire hydrant access",
  },
  {
    id: "4",
    type: "Wrong Lane Usage",
    location: "Highway 101, Exit 12",
    date: "2025-11-04 11:20",
    status: "dismissed" as const,
    severity: "medium" as const,
    vehiclePlate: "GHI-7890",
    description: "Vehicle traveled in emergency lane without authorization",
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("dashboard")

  const filteredViolations = mockViolations.filter((violation) => {
    const matchesSearch =
      violation.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || violation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (id: string) => {
    console.log("View details for violation:", id)
  }

  const handleLogout = () => {
    // Clear session and redirect to auth
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Navigation Header */}
      <header className="bg-amber-500 shadow-md border-b-4 border-amber-600">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-amber-50 transition-colors">
            TrafficGuard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Welcome, User</span>
            <Button onClick={handleLogout} variant="destructive" size="sm" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-amber-200 border-2 border-amber-400">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="violations" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Violations
            </TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Violations"
                value="1,247"
                icon={FileText}
                trend={{ value: "+12% from last month", positive: false }}
              />
              <StatsCard
                title="Under Review"
                value="89"
                icon={Clock}
                trend={{ value: "+5% from last week", positive: false }}
              />
              <StatsCard
                title="Resolved"
                value="1,089"
                icon={CheckCircle}
                trend={{ value: "+18% from last month", positive: true }}
              />
              <StatsCard
                title="Pending Action"
                value="69"
                icon={AlertCircle}
                trend={{ value: "-3% from last week", positive: true }}
              />
            </div>

            {/* Recent Violations */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-amber-900">Recent Violations</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockViolations.slice(0, 3).map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                <Input
                  placeholder="Search by plate, location, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-amber-300 bg-white focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] border-2 border-amber-300 bg-white focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Violations List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredViolations.map((violation) => (
                <ViolationCard key={violation.id} violation={violation} onViewDetails={handleViewDetails} />
              ))}
            </div>

            {filteredViolations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-amber-700 font-medium">No violations found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="report">
            <div className="max-w-2xl mx-auto">
              <ReportForm />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 border-t-4 border-amber-950 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-amber-50">
            Smart Traffic Violation Detection System © 2025 | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
