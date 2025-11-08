"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Moon, Sun, ArrowLeft, Eye, EyeOff, Lock, Mail, User, FileText, Smartphone, CreditCard } from "lucide-react"
import { useTheme } from "next-themes"

export default function AuthPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpCounter, setOtpCounter] = useState(0)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadharNumber: "",
    drivinglicenseNumber: "",
    otp: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const validateAadhar = (aadhar: string): boolean => {
    const aadharRegex = /^\d{12}$/
    return aadharRegex.test(aadhar)
  }

  const validateDrivingLicense = (license: string): boolean => {
    const licenseRegex = /^[A-Z]{2}\d{13}$/
    return licenseRegex.test(license)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.aadharNumber.trim()) {
      setError("Aadhar number is required")
      return
    }
    if (!validateAadhar(formData.aadharNumber)) {
      setError("Aadhar number must be a valid 12-digit number")
      return
    }

    const simulatedPhoneNumber = "XXXXXXXXX" + formData.aadharNumber.slice(-2)
    setOtpSent(true)
    setOtpCounter(120)
    setFormData((prev) => ({ ...prev, otp: "" }))

    const timer = setInterval(() => {
      setOtpCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setOtpSent(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.otp.trim()) {
      setError("OTP is required")
      return
    }
    if (formData.otp.length !== 6) {
      setError("OTP must be 6 digits")
      return
    }

    if (/^\d{6}$/.test(formData.otp)) {
      setOtpVerified(true)
      setOtpSent(false)
    } else {
      setError("Invalid OTP. Please try again.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      if (!formData.username.trim()) {
        setError("Username is required")
        return
      }
      if (!formData.password) {
        setError("Password is required")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
    } else {
      if (!formData.username.trim()) {
        setError("Username is required")
        return
      }
      if (!formData.email.trim()) {
        setError("Email is required")
        return
      }
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
      if (!formData.password) {
        setError("Password is required")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (!formData.aadharNumber.trim()) {
        setError("Aadhar number is required")
        return
      }
      if (!validateAadhar(formData.aadharNumber)) {
        setError("Aadhar number must be a valid 12-digit number")
        return
      }
      if (!formData.drivinglicenseNumber.trim()) {
        setError("Driving License number is required")
        return
      }
      if (!validateDrivingLicense(formData.drivinglicenseNumber)) {
        setError(
          "Please enter a valid Driving License number (format: 2 letters followed by 13 digits, e.g., KA0820220029107)",
        )
        return
      }
      if (!otpVerified) {
        setError("Please verify your phone number with OTP first")
        return
      }
    }

    setSubmitted(true)

    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-amber-500" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 animate-smooth-scale">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 mb-4">
                <Lock size={24} className="text-black" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Enter your credentials to access TrafficGuard"
                  : "Secure your account with Aadhar verification"}
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-400 font-semibold text-center">
                  {isLogin ? "✓ Login successful!" : "✓ Account created successfully!"}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400 font-semibold text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="aadharNumber" className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        Aadhar Number (Verification Required)
                      </div>
                    </label>
                    <input
                      type="text"
                      id="aadharNumber"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                        handleInputChange({ ...e, target: { ...e.target, value } })
                      }}
                      placeholder="Enter your 12-digit Aadhar number"
                      maxLength={12}
                      disabled={otpSent || otpVerified}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your Aadhar information is encrypted and secure. We only use it for identity verification.
                    </p>
                  </div>

                  {formData.aadharNumber && validateAadhar(formData.aadharNumber) && !otpVerified && (
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <Smartphone size={18} />
                          Send OTP to Registered Phone
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                              OTP sent to your registered phone number
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Expires in:{" "}
                              <span className="font-mono font-bold">
                                {Math.floor(otpCounter / 60)}:{String(otpCounter % 60).padStart(2, "0")}
                              </span>
                            </p>
                          </div>

                          <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                              Enter 6-Digit OTP
                            </label>
                            <input
                              type="text"
                              id="otp"
                              name="otp"
                              value={formData.otp}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                                handleInputChange({ ...e, target: { ...e.target, value } })
                              }}
                              placeholder="000000"
                              maxLength={6}
                              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-center text-lg font-mono tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={formData.otp.length !== 6}
                            className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Verify OTP
                          </button>

                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            Resend OTP
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {otpVerified && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <span className="text-lg">✓</span> Phone number verified successfully
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="drivinglicenseNumber" className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        Driving License Number
                      </div>
                    </label>
                    <input
                      type="text"
                      id="drivinglicenseNumber"
                      name="drivinglicenseNumber"
                      value={formData.drivinglicenseNumber}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().slice(0, 15)
                        handleInputChange({ ...e, target: { ...e.target, value } })
                      }}
                      placeholder="E.g., KA0820220029107"
                      maxLength={15}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: 2 letters (state code) followed by 13 digits
                    </p>
                    {formData.drivinglicenseNumber && !validateDrivingLicense(formData.drivinglicenseNumber) && (
                      <p className="text-xs text-red-500 mt-1">
                        Invalid format. Use: 2 letters + 13 digits (e.g., KA0820220029107)
                      </p>
                    )}
                    {formData.drivinglicenseNumber && validateDrivingLicense(formData.drivinglicenseNumber) && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                        ✓ Valid format
                      </p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={submitted || (!isLogin && !otpVerified && formData.aadharNumber)}
                className="w-full mt-6 px-4 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {submitted ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </button>

              {/* [DEBUG] Skip to Dashboard */}
              <button
                type="button"
                onClick={() => {
                  router.push("/dashboard")
                }}
                className="w-full mt-3 px-4 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-colors duration-300 text-sm"
              >
                [DEBUG] Skip to Dashboard
              </button>

              <div className="pt-4 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setFormData({
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        aadharNumber: "",
                        drivinglicenseNumber: "",
                        otp: "",
                      })
                      setError("")
                      setOtpSent(false)
                      setOtpVerified(false)
                      setOtpCounter(0)
                    }}
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:underline transition-colors"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                <strong>Note:</strong> This is a demonstration form. For production, integrate with real authentication
                services and verified OTP/SMS provider APIs.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
