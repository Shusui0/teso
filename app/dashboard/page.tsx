"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViolationCard } from "@/components/ViolationCard"
import { StatsCard } from "@/components/StatsCard"
import { ReportForm } from "@/components/ReportForm"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  LogOut,
  ChevronDown,
  User,
  MapPin,
  Calendar,
} from "lucide-react"
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

// Mock filed reports data (keeping only one for initial display)
const mockFiledReports = [
  {
    id: "1",
    violationType: "Speeding",
    vehiclePlate: "KA-01-AB-1234",
    location: "MG Road, Bangalore",
    date: "2025-11-05 10:30",
    result: true,
    description: "Vehicle speeding through residential area",
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [filedReports, setFiledReports] = useState(mockFiledReports)

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

  // Load filed reports from localStorage on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const storedReports = JSON.parse(localStorage.getItem('filedReports') || '[]')
      if (storedReports.length > 0) {
        setFiledReports([...storedReports, ...mockFiledReports])
      } else {
        setFiledReports(mockFiledReports)
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Navigation Header */}
      <header className="bg-amber-500 shadow-md border-b-4 border-amber-600">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-amber-50 transition-colors">
            TrafficGuard
          </Link>
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <User className="h-5 w-5 text-amber-600" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border-2 border-amber-300 z-50">
                  <div className="p-4 border-b border-amber-200">
                    <h3 className="font-bold text-amber-900 mb-4">Profile Information</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-amber-700 uppercase">Full Name</p>
                        <p className="text-sm text-gray-800">Rajesh Kumar Singh</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-amber-700 uppercase">Email</p>
                        <p className="text-sm text-gray-800">rajesh.kumar@email.com</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase">Address</p>
                          <p className="text-sm text-gray-800">123 MG Road, Bangalore, Karnataka 560001</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-amber-700 uppercase">Aadhar Number</p>
                        <p className="text-sm text-gray-800 font-mono">XXXX-XXXX-1234</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-amber-700 uppercase">Driving License</p>
                        <p className="text-sm text-gray-800 font-mono">KA0820220029107</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase">License Validity</p>
                          <p className="text-sm text-gray-800">Valid until: 15 Aug 2026</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-amber-700 uppercase">Account Status</p>
                        <p className="text-sm text-green-600 font-semibold">Active & Verified</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 flex gap-2">
                    <Button
                      onClick={() => setIsProfileOpen(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>

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
            {/* Fine/payment tracking section at the top */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-amber-900">Traffic Safety Overview</h2>
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <div className="bg-white border-2 border-red-400 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">Total Fine Amount</p>
                      <p className="text-4xl font-bold text-red-700">₹45,500</p>
                      <p className="text-xs text-gray-600 mt-2">Outstanding violations: 12</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-green-400 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">Total Amount Paid</p>
                      <p className="text-4xl font-bold text-green-700">₹38,200</p>
                      <p className="text-xs text-gray-600 mt-2">Resolved violations: 18</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

            {/* Filed Reports and Results */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-amber-900">Filed Reports and Results</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filedReports.map((report) => (
                  <div key={report.id} className="bg-white border-2 border-amber-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-amber-900">{report.violationType}</h3>
                        <p className="text-sm text-gray-600">{report.vehiclePlate}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.result
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {report.result ? 'Valid' : 'Invalid'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-gray-700">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-gray-700">{report.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                    </div>
                  </div>
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
