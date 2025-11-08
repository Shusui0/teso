"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Violation {
  id: string
  type: string
  location: string
  date: string
  status: "reported" | "under_review" | "resolved" | "dismissed"
  severity: "high" | "medium" | "low"
  vehiclePlate: string
  description: string
}

interface ViolationCardProps {
  violation: Violation
  onViewDetails: (id: string) => void
}

export function ViolationCard({ violation, onViewDetails }: ViolationCardProps) {
  const severityColors = {
    high: "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300",
    medium: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300",
    low: "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300",
  }

  const statusColors = {
    reported: "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300",
    under_review: "bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300",
    resolved: "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300",
    dismissed: "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-300",
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-foreground text-sm">{violation.type}</h3>
        <Badge className={`text-xs ${severityColors[violation.severity]}`}>
          {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Vehicle Plate</p>
          <p className="font-mono font-bold text-amber-700 dark:text-amber-300">{violation.vehiclePlate}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Location</p>
          <p className="text-foreground">{violation.location}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Date & Time</p>
          <p className="text-foreground">{violation.date}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Badge className={`text-xs ${statusColors[violation.status]}`}>
          {violation.status.replace(/_/g, " ").charAt(0).toUpperCase() + violation.status.slice(1).replace(/_/g, " ")}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails(violation.id)}
          className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/30"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
