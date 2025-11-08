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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [reportResult, setReportResult] = useState<boolean | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('violationType', formData.violationType)
      formDataToSend.append('vehiclePlate', formData.vehiclePlate)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('description', formData.description)

      // Add the first selected file if any
      if (selectedFiles.length > 0) {
        formDataToSend.append('file', selectedFiles[0])
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const result = await response.json()
        setReportResult(true)

        // Store the report result in localStorage for dashboard display
        const newReport = {
          id: result.report.id,
          violationType: formData.violationType,
          vehiclePlate: formData.vehiclePlate,
          location: formData.location,
          date: new Date().toLocaleString(),
          result: true,
          description: formData.description,
        }

        const existingReports = JSON.parse(localStorage.getItem('filedReports') || '[]')
        existingReports.unshift(newReport)
        localStorage.setItem('filedReports', JSON.stringify(existingReports))

        setFormData({
          violationType: "",
          vehiclePlate: "",
          location: "",
          description: "",
        })
        setSelectedFiles([])
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit report')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setReportResult(false)
    } finally {
      setSubmitted(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleUploadClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*'
    input.multiple = true
    input.onchange = (e) => handleFileSelect(e as any)
    input.click()
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="h-6 w-6 text-amber-600" />
        <h2 className="text-2xl font-bold">Report a Violation</h2>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-400 font-semibold">
            Processing your report with AI analysis...
          </p>
        </div>
      )}

      {reportResult !== null && !submitted && (
        <div className={`mb-6 p-4 rounded-lg border ${
          reportResult
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
        }`}>
          <p className={`font-semibold ${
            reportResult
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            Report Result: {reportResult ? 'Valid Violation Detected' : 'No Violation Found'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {reportResult
              ? 'Your report has been verified and will be processed accordingly.'
              : 'Based on the analysis, no violation was detected in the provided evidence.'
            }
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

        <div
          className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center hover:bg-amber-50 dark:hover:bg-amber-950/10 transition-colors cursor-pointer"
          onClick={handleUploadClick}
        >
          {selectedFiles.length === 0 ? (
            <>
              <Camera className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Click to upload evidence photo/video</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4 up to 50MB</p>
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-amber-200">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-100">
                        <Camera className="h-8 w-8 text-amber-600" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-amber-300 rounded-lg flex items-center justify-center hover:bg-amber-50 transition-colors">
                <div className="text-center">
                  <Camera className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                  <p className="text-xs text-amber-600">Add more</p>
                </div>
              </div>
            </div>
          )}
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
