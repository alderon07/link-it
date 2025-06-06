export interface Page {
  id: string
  name: string
  username: string
  bio: string
  avatar: string
  category: string
  isActive: boolean
  linkCount: number
  views: number
  createdAt: string
}

export const mockPages: Page[] = [
  {
    id: "page-1",
    name: "Alex Johnson",
    username: "alexcreates",
    bio: "Digital artist and creative director",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "creative",
    isActive: true,
    linkCount: 8,
    views: 12500,
    createdAt: "2023-12-15",
  },
  {
    id: "page-2",
    name: "Sarah Chen",
    username: "sarahtech",
    bio: "Software engineer and tech blogger",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "professional",
    isActive: true,
    linkCount: 6,
    views: 8900,
    createdAt: "2024-01-05",
  },
  {
    id: "page-3",
    name: "Mike Rodriguez",
    username: "mikemusic",
    bio: "Musician and producer",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "creative",
    isActive: false,
    linkCount: 12,
    views: 15600,
    createdAt: "2023-11-20",
  },
  {
    id: "page-4",
    name: "Emma Wilson",
    username: "emmafitness",
    bio: "Fitness coach and wellness advocate",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "health",
    isActive: true,
    linkCount: 5,
    views: 7200,
    createdAt: "2024-02-01",
  },
  {
    id: "page-5",
    name: "David Park",
    username: "davidcooks",
    bio: "Chef and food photographer",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "food",
    isActive: true,
    linkCount: 9,
    views: 10800,
    createdAt: "2023-12-28",
  },
]
