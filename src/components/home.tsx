import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Star, TrendingUp, Users, Palette, ExternalLink, Sparkles, Zap, Heart, ArrowRight, LinkIcon } from "lucide-react"
import Link from "next/link"

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
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl">
                <LinkIcon className="w-5 h-5 text-white"/>
              </div>
              <span className="text-2xl font-bold gradient-text">link-it</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="soft-shadow-lg bg-primary hover:bg-primary/90">
                <Link href="/admin">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-bg py-24 px-4 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-3xl rotate-12 blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-chart-5/20 to-primary/20 rounded-2xl -rotate-12 blur-xl"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 px-6 py-3 glass rounded-full border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">New: Custom themes & analytics</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text leading-tight">
              One link to
              <br />
              rule them all
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Share your content, grow your audience, and connect your world with link-it. Create beautiful,
              customizable profiles that showcase all your links in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {/*
              <Button
                size="lg"
                className="text-lg px-10 py-7 soft-shadow-lg bg-primary hover:bg-primary/90 group"
                asChild
              >
                <Link href="/admin">
                  <Zap className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Create Your Profile
                </Link>
              </Button> 
              */}
              <Button variant="outline" size="lg" className="text-lg px-10 py-7 border-border hover:bg-accent" asChild>
                <Link href="#explore">
                  Create Your Link-It
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span>10,000+ creators</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chart-3/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-chart-3" />
                </div>
                <span>1M+ clicks</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-chart-2" />
                </div>
                <span>50+ themes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      {/*<section id="explore" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Profiles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing creators and their link-it profiles
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                className="pl-12 py-7 text-lg bg-card border-border focus:border-primary/50 rounded-2xl"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {featuredProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 floating-card border-0 overflow-hidden"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-primary/30 shadow-xl">
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {profile.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-chart-3 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-1">@{profile.username}</CardDescription>
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <Badge
                      variant="secondary"
                      className="capitalize bg-primary/10 text-primary border-primary/20 px-4 py-1"
                    >
                      {profile.category}
                    </Badge>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground bg-accent/30 rounded-lg p-3">
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-3 h-3" />
                      {profile.linkCount} links
                    </span>
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      {profile.views.toLocaleString()} views
                    </span>
                  </div>

                  <Button
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-chart-2 transition-all duration-300 py-6 rounded-xl"
                    asChild
                  >
                    <Link href={`/${profile.username}`}>
                      View Profile
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="border-border hover:bg-accent px-8 py-4">
              View All Profiles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      */}

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-accent/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose link-it?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to share your content beautifully and grow your audience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="text-center floating-card border-0 p-8 group hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-chart-2 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Custom Themes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from 50+ beautiful themes or create your own with our advanced theme editor
                </p>
              </CardContent>
            </Card>

            <Card className="text-center floating-card border-0 p-8 group hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track clicks, views, and engagement with detailed analytics and insights
                </p>
              </CardContent>
            </Card>

            <Card className="text-center floating-card border-0 p-8 group hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-2 to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Multiple Profiles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create separate profiles for different purposes - personal, business, creative
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-5/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join thousands of creators who use link-it to share their content and grow their audience.
            </p>
            <Button
              size="lg"
              className="text-xl px-12 py-8 soft-shadow-lg bg-primary hover:bg-primary/90 group"
              asChild
            >
              <Link href="/admin">
                <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                Create Your Profile Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">link-it</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The easiest way to share all your links in one place.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4 text-chart-2" />
              <p>&copy; 2024 link-it. Made with love for creators.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
