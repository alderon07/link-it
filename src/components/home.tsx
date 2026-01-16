"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  TrendingUp,
  Users,
  Palette,
  ExternalLink,
  Sparkles,
  Heart,
  ArrowRight,
  LinkIcon,
  Zap,
  BarChart3,
  Layers
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { FadeIn, SlideUp } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"

const featuredProfiles = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexcreates",
    bio: "Digital artist and creative director",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "Creative",
    verified: true,
    linkCount: 8,
    views: 12500,
    color: "pink",
  },
  {
    id: "2",
    name: "Sarah Chen",
    username: "sarahtech",
    bio: "Software engineer and tech blogger",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "Professional",
    verified: true,
    linkCount: 6,
    views: 8900,
    color: "teal",
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    username: "mikemusic",
    bio: "Musician and producer",
    avatar: "/placeholder.svg?height=300&width=300",
    category: "Creative",
    verified: false,
    linkCount: 12,
    views: 15600,
    color: "yellow",
  },
]

const features = [
  {
    icon: Palette,
    title: "Custom Themes",
    description: "50+ pixel-perfect themes or create your own with our retro theme editor",
    color: "bg-pixel-pink",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track clicks, views, and engagement with detailed pixel-art dashboards",
    color: "bg-pixel-teal",
  },
  {
    icon: Layers,
    title: "Multiple Pages",
    description: "Create separate pages for different purposes - personal, business, creative",
    color: "bg-pixel-yellow",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden max-w-full">
      {/* Pixel Grid Background */}
      <div className="fixed inset-0 pixel-grid opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm pixel-border border-x-0 border-t-0">
        <div className="container mx-auto px-4 py-4 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <motion.div
              className="flex items-center gap-2 sm:gap-3 shrink-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-pixel-pink pixel-border pixel-shadow-sm">
                <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground"/>
              </div>
              <span className="text-xl sm:text-2xl font-bold pixel-text-shadow">link-it</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 sm:gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button variant="ghost" asChild className="font-bold uppercase text-xs sm:text-sm tracking-wide px-2 sm:px-4">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="pixel" asChild className="text-xs sm:text-sm px-3 sm:px-4">
                <Link href="/admin">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <PixelIcon icon="arrow" className="w-4 h-4 ml-1 sm:ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 relative">
        {/* Floating pixel decorations */}
        <motion.div
          className="absolute top-20 right-20 hidden lg:block"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelIcon icon="star" size="lg" color="yellow" />
        </motion.div>
        <motion.div
          className="absolute top-40 left-16 hidden lg:block"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <PixelIcon icon="heart" size="lg" color="pink" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-32 hidden lg:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <PixelIcon icon="sparkle" size="lg" color="teal" />
        </motion.div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeIn delay={0.2}>
              <div className="flex justify-center mb-8 px-4">
                <Badge variant="retro" className="px-4 sm:px-6 py-2 text-xs sm:text-sm pixel-bounce whitespace-normal text-center">
                  <Sparkles className="h-4 w-4 mr-2 shrink-0" />
                  New: Pixel Art Themes & Analytics
                </Badge>
              </div>
            </FadeIn>

            <SlideUp delay={0.3}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
                <span className="block">One Link to</span>
                <span className="block text-pixel-pink pixel-text-shadow">Rule Them All</span>
              </h1>
            </SlideUp>

            <FadeIn delay={0.5}>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                Share your content, grow your audience, and connect your world with link-it.
                Create beautiful, pixel-perfect pages that showcase all your links in one place.
              </p>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button variant="pixel" size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/admin">
                    <Zap className="h-5 w-5 mr-2" />
                    Create Your Page
                  </Link>
                </Button>
                <Button variant="pixel-outline" size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="#explore">
                    Explore
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.7}>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 md:gap-12">
                <PixelBorder variant="solid" shadow="sm" className="px-3 sm:px-6 py-2 sm:py-3 bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-pixel-pink" />
                    <span className="font-bold text-sm sm:text-base">
                      <CountUp value={10000} suffix="+" />
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">creators</span>
                  </div>
                </PixelBorder>
                <PixelBorder variant="solid" shadow="sm" className="px-3 sm:px-6 py-2 sm:py-3 bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-pixel-teal" />
                    <span className="font-bold text-sm sm:text-base">
                      <CountUp value={1000000} suffix="+" />
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">clicks</span>
                  </div>
                </PixelBorder>
                <PixelBorder variant="solid" shadow="sm" className="px-3 sm:px-6 py-2 sm:py-3 bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pixel-yellow" />
                    <span className="font-bold text-sm sm:text-base">
                      <CountUp value={50} suffix="+" />
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">themes</span>
                  </div>
                </PixelBorder>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <PixelDivider variant="stars" className="my-8" />

      {/* Featured Profiles */}
      <section id="explore" className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <Badge variant="retro" className="mb-4">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Featured <span className="text-pixel-teal">Creators</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Discover amazing creators and their pixel-perfect link-it pages
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {featuredProfiles.map((profile) => (
              <StaggerItem key={profile.id}>
                <Card variant="pixel-interactive" className="h-full group">
                  <CardContent className="p-6">
                    <div className="text-center">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <Avatar className={`w-20 h-20 pixel-border border-pixel-${profile.color}`}>
                            <AvatarImage src={profile.avatar} alt={profile.name} />
                            <AvatarFallback className={`text-xl font-bold bg-pixel-${profile.color}`}>
                              {profile.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {profile.verified && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-pixel-yellow pixel-border flex items-center justify-center">
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="text-lg font-bold mb-1">{profile.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">@{profile.username}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>

                      {/* Badge */}
                      <Badge variant="retro" className="mb-4">
                        {profile.category}
                      </Badge>

                      {/* Stats */}
                      <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          {profile.linkCount} links
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {profile.views.toLocaleString()}
                        </span>
                      </div>

                      {/* CTA */}
                      <Button variant="pixel-secondary" className="w-full" asChild>
                        <Link href={`/${profile.username}`}>
                          View Page
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <PixelDivider variant="dashed" className="my-8" />

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <Badge variant="retro" className="mb-4">
                <Zap className="h-3 w-3 mr-1" />
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Why Choose <span className="text-pixel-pink">link-it</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to share your content beautifully and grow your audience
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <PixelBorder variant="solid" shadow="default" className="p-6 bg-card h-full group hover:-translate-y-1 transition-transform">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${feature.color} pixel-border mx-auto mb-4 flex items-center justify-center group-hover:pixel-shake`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </PixelBorder>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <PixelDivider variant="solid" className="my-8" />

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="absolute inset-0 bg-pixel-pink/5" />
        <div className="container mx-auto text-center relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <PixelBorder variant="solid" shadow="lg" className="p-8 md:p-12 bg-card">
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PixelIcon icon="sparkle" size="xl" color="pink" />
                  </motion.div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Join thousands of creators who use link-it to share their content
                  and grow their audience.
                </p>
                <Button variant="pixel" size="lg" className="text-lg px-10 py-6" asChild>
                  <Link href="/admin">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create Your Page Now
                  </Link>
                </Button>
              </PixelBorder>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="pixel-border border-x-0 border-b-0 bg-card/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-pixel-pink pixel-border">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">link-it</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The easiest way to share all your links in one pixel-perfect place.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Templates</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Status</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-pixel-pink transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>

          <PixelDivider variant="dashed" className="mb-8" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Heart className="h-4 w-4 text-pixel-coral" />
              <p>&copy; 2024 link-it. Made with love for creators.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
