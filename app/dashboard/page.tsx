import { prisma } from "@/lib/prisma"
import { LinksTable } from "@/components/links-table"

export const dynamic = "force-dynamic"

async function getLinks() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      slug: true,
      expiresAt: true,
      createdAt: true,
      _count: {
        select: { clicks: true },
      },
    },
  })

  return links.map((link) => ({
    id: link.id,
    url: link.url,
    slug: link.slug,
    shortLink: `${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`,
    expiresAt: link.expiresAt ? link.expiresAt.toISOString() : null,
    createdAt: link.createdAt.toISOString(),
    totalClicks: link._count.clicks,
  }))
}

export default async function DashboardPage() {
  const links = await getLinks()

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">All links</h1>
            <p className="text-gray-500 text-sm mt-1">
              {links.length} {links.length === 1 ? "link" : "links"} total
            </p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            + New link
          </a>
        </div>

        {/* Links table */}
        <LinksTable initialLinks={links} />

        {/* Footer */}
        <div className="text-center pt-4">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
          >
            ✂️ Snip
          </a>
        </div>

      </div>
    </main>
  )
}
