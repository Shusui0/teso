import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViolationCard } from "@/components/ViolationCard";
import { StatsCard } from "@/components/StatsCard";
import { ReportForm } from "@/components/ReportForm";
import { AlertCircle, CheckCircle, Clock, FileText, Search, Plus } from "lucide-react";
import heroImage from "@/assets/hero-traffic.jpg";

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
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  const filteredViolations = mockViolations.filter((violation) => {
    const matchesSearch =
      violation.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || violation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    console.log("View details for violation:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative h-[400px] bg-gradient-primary overflow-hidden">
        <img
          src={heroImage}
          alt="Traffic monitoring"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            Smart Traffic Violation Detection
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mb-8">
            Advanced monitoring and reporting system for safer roads
          </p>
          <Button size="lg" variant="secondary" onClick={() => setActiveTab("report")}>
            <Plus className="mr-2 h-5 w-5" />
            Report Violation
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
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
              <h2 className="text-2xl font-bold mb-4">Recent Violations</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockViolations.slice(0, 3).map((violation) => (
                  <ViolationCard
                    key={violation.id}
                    violation={violation}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by plate, location, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
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
                <ViolationCard
                  key={violation.id}
                  violation={violation}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {filteredViolations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No violations found matching your criteria.</p>
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
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Smart Traffic Violation Detection System © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
