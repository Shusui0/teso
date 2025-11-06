"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, AlertCircle } from "lucide-react"

export function ReportForm() {
  const [formData, setFormData] = useState({
    violationType: "",
    vehiclePlate: "",
    location: "",
    description: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        violationType: "",
        vehiclePlate: "",
        location: "",
        description: "",
      })
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="h-6 w-6 text-amber-600" />
        <h2 className="text-2xl font-bold">Report a Violation</h2>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <p className="text-green-700 dark:text-green-400 font-semibold">
            Violation reported successfully. Thank you for helping keep our roads safe!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Violation Type</label>
          <Select
            value={formData.violationType}
            onValueChange={(value) => setFormData({ ...formData, violationType: value })}
          >
            <SelectTrigger className="border-amber-300 bg-white dark:bg-slate-900">
              <SelectValue placeholder="Select violation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speeding">Speeding</SelectItem>
              <SelectItem value="red_light">Red Light Violation</SelectItem>
              <SelectItem value="parking">Illegal Parking</SelectItem>
              <SelectItem value="wrong_lane">Wrong Lane Usage</SelectItem>
              <SelectItem value="rash_driving">Rash Driving</SelectItem>
              <SelectItem value="no_helmet">No Helmet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Vehicle Plate Number</label>
          <Input
            placeholder="E.g., KA-01-AB-1234"
            value={formData.vehiclePlate}
            onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
            className="border-amber-300 bg-white dark:bg-slate-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Input
            placeholder="Where did this violation occur?"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="border-amber-300 bg-white dark:bg-slate-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <Textarea
            placeholder="Describe the violation in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border-amber-300 bg-white dark:bg-slate-900 min-h-24"
            required
          />
        </div>

        <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center hover:bg-amber-50 dark:hover:bg-amber-950/10 transition-colors cursor-pointer">
          <Camera className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Click to upload evidence photo/video</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4 up to 50MB</p>
        </div>

        <Button
          type="submit"
          disabled={
            submitted ||
            !formData.violationType ||
            !formData.vehiclePlate ||
            !formData.location ||
            !formData.description
          }
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-300/50"
        >
          {submitted ? "Processing..." : "Submit Violation Report"}
        </Button>
      </form>
    </div>
  )
}
