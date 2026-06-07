"use client"

import { useState } from "react"
import { formatDate, truncateUrl } from "@/lib/utils"

type LinkRow = {
  id: string
  url: string
  slug: string
  shortLink: string
  expiresAt: string | null
  createdAt: string
  totalClicks: number
}

interface LinksTableProps {
  initialLinks: LinkRow[]
}

export function LinksTable({ initialLinks }: LinksTableProps) {
  const [links, setLinks] = useState<LinkRow[]>(initialLinks)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  function getStatus(expiresAt: string | null): {
    label: string
    className: string
  } {
    if (!expiresAt) {
      return { label: "No expiry", className: "text-gray-500 bg-gray-800" }
    }
    if (new Date(expiresAt) < new Date()) {
      return { label: "Expired", className: "text-red-400 bg-red-950" }
    }
    return { label: "Active", className: "text-green-400 bg-green-950" }
  }

  async function handleDelete(slug: string) {
    if (deletingSlug) return

    const confirmed = window.confirm(
      `Delete /${slug}? This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingSlug(slug)

    try {
      const res = await fetch(`/api/links/${slug}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error?.message ?? "Failed to delete link")
        setDeletingSlug(null)
        return
      }

      // Optimistic update: remove from list immediately without page refresh
      // The server already deleted it — we just update the local state to match
      setLinks((prev) => prev.filter((l) => l.slug !== slug))
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setDeletingSlug(null)
    }
  }

  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-12 text-center space-y-3">
        <p className="text-4xl">🔗</p>
        <p className="text-gray-400">No links yet</p>
        <a
          href="/"
          className="inline-block text-sm text-white hover:text-gray-300 transition-colors underline underline-offset-4"
        >
          Create your first link
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">
                Short link
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">
                Destination
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">
                Clicks
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">
                Status
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">
                Created
              </th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950">
            {links.map((link) => {
              const status = getStatus(link.expiresAt)
              const isDeleting = deletingSlug === link.slug

              return (
                <tr
                  key={link.id}
                  className="hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <a
                      href={link.shortLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors font-medium"
                    >
                      /{link.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400" title={link.url}>
                      {truncateUrl(link.url, 40)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">
                      {link.totalClicks.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(link.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/dashboard/${link.slug}`}
                        className="text-xs px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700"
                      >
                        Analytics
                      </a>
                      <button
                        onClick={() => handleDelete(link.slug)}
                        disabled={isDeleting}
                        className="text-xs px-3 py-1.5 rounded-md bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-300 transition-colors border border-red-900 disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-800">
        {links.map((link) => {
          const status = getStatus(link.expiresAt)
          const isDeleting = deletingSlug === link.slug

          return (
            <div key={link.id} className="p-4 space-y-3 bg-gray-950">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <a
                    href={link.shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-gray-300"
                  >
                    /{link.slug}
                  </a>
                  <p className="text-gray-500 text-xs truncate mt-0.5">
                    {truncateUrl(link.url, 50)}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>{link.totalClicks.toLocaleString()} clicks</p>
                  <p>{formatDate(link.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/dashboard/${link.slug}`}
                    className="text-xs px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  >
                    Analytics
                  </a>
                  <button
                    onClick={() => handleDelete(link.slug)}
                    disabled={isDeleting}
                    className="text-xs px-3 py-1.5 rounded-md bg-red-950 text-red-400 border border-red-900 disabled:opacity-50"
                  >
                    {isDeleting ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
