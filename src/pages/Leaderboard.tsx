"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"

// Layout & Loader
import { Layout } from "../components/Layout"
import { Loader } from "../components/Loader"

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

// lucide-react icons
import { QrCode, Eye } from "lucide-react"

// For generating QR codes
import QRCode from "react-qr-code"

// Our central milestone config
import { MILESTONES } from "../config/milestones"

interface LeaderboardEntry {
  name: string
  count: number
  total: number
  total_time: number
  tx_id?: string // new
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7200";
const FRONTEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5173";

export function Leaderboard() {
  // Filter for only enabled base milestones
  const enabledMilestones = MILESTONES.filter((m) => m.enabled)

  // Flatten them
  const milestoneDropdownItems = enabledMilestones.flatMap((m) => {
    const items = [
      {
        value: m.id,
        label: m.label,
      },
    ]
    if (m.extendedEnabled) {
      items.push({
        value: `${m.id}_extended`,
        label: `${m.label} Extended`,
      })
    }
    return items
  })

  // default milestone
  const [milestone, setMilestone] = useState(
    milestoneDropdownItems[0]?.value || ""
  )
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const pageData = data.slice(startIndex, endIndex)

  // QR code dialog
  const [qrOpen, setQrOpen] = useState(false)
  const [qrTarget, setQrTarget] = useState("")

  useEffect(() => {
    if (milestone) {
      fetchAndUpdateLeaderboard(milestone)
    }
  }, [milestone])

  async function fetchAndUpdateLeaderboard(ms: string) {
    try {
      setLoading(true)
      const response = await axios.get(
        `${BACKEND_URL}/leaderboard?milestone=${ms}`
      )
      const serverData = response.data
      if (Array.isArray(serverData)) {
        setData(serverData)
      } else {
        setData([])
      }
    } catch (err) {
      console.error("Error fetching leaderboard data:", err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }
  function handlePrevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  // Open the QR code dialog
  function openQrCode(txId: string | undefined) {
    if (!txId) return
    // The full URL for results
    const resultsUrl = `${FRONTEND_URL}/results/${txId}`
    setQrTarget(resultsUrl)
    setQrOpen(true)
  }

  return (
    <Layout>
      <Loader show={loading} text="Loading leaderboard..." />

      <Card className="bg-neutral-900 text-neutral-100 border border-neutral-700 rounded shadow w-full">
        <CardHeader className="flex items-center justify-between w-full">
          <CardTitle className="text-lg text-white">Leaderboard</CardTitle>

          {/* The milestone dropdown */}
          <Select value={milestone} onValueChange={(val) => setMilestone(val)}>
            <SelectTrigger className="w-48 bg-neutral-800 text-white border border-neutral-700 text-sm">
              <SelectValue placeholder="Select Milestone" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border border-neutral-700 text-white">
              {milestoneDropdownItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border border-neutral-700">
            <thead className="bg-neutral-800 text-neutral-300">
              <tr>
                <th className="p-2 text-left border-b border-neutral-700">Rank</th>
                <th className="p-2 text-left border-b border-neutral-700">Submission Name</th>
                <th className="p-2 text-left border-b border-neutral-700">Test Cases Passed</th>
                <th className="p-2 text-left border-b border-neutral-700">Total Time</th>
                <th className="p-2 text-left border-b border-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((entry, index) => {
                const rank = startIndex + index + 1
                return (
                  <tr key={`${entry.name}-${index}`} className="hover:bg-neutral-800">
                    <td className="p-2 border-b border-neutral-700">{rank}</td>
                    <td className="p-2 border-b border-neutral-700">
                      <Badge
                        variant="secondary"
                        className="bg-violet-600 text-white select-none"
                      >
                        {entry.name}
                      </Badge>
                    </td>
                    <td className="p-2 border-b border-neutral-700">
                      {entry.count}/{entry.total}
                    </td>
                    <td className="p-2 border-b border-neutral-700">
                      {entry.total_time} s
                    </td>
                    <td className="p-2 border-b border-neutral-700 flex gap-4 items-center">
                      {/* QR Code button */}
                      {entry.tx_id && (
                        <button
                          onClick={() => openQrCode(entry.tx_id)}
                          className="hover:text-violet-500 transition-colors cursor-pointer"
                          title="Show QR code"
                        >
                          <QrCode className="inline-block h-5 w-5" />
                        </button>
                      )}

                      {/* Eye icon => open /results/<tx_id> in a NEW TAB */}
                      {entry.tx_id && (
                        <a
                          href={`/results/${entry.tx_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-violet-500 transition-colors cursor-pointer"
                          title="View results in new tab"
                        >
                          <Eye className="inline-block h-5 w-5" />
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}

              {pageData.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={handleNextPage}
              className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="bg-neutral-900 border border-neutral-700 text-white sm:max-w-[400px]">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-white">Share Results</DialogTitle>
            <DialogClose asChild>
              {/* Possibly an X button from your UI library */}
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <p className="text-sm text-neutral-400">
              Scan this QR code to view:
            </p>
            <div className="bg-neutral-800 p-4">
              <QRCode
                value={qrTarget || ""}
                fgColor="#FFFFFF"
                bgColor="#202020"
                size={160}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
