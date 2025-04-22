import Image from 'next/image';
import { LinkButton } from '@/components/ui/LinkButton';

// Dummy data - will be replaced with real data later
const profile = {
  username: '@johndoe',
  bio: 'Digital Creator & Tech Enthusiast',
  avatar: 'https://picsum.photos/200',
  links: [
    {
      id: 1,
      title: 'My Portfolio',
      url: 'https://example.com/portfolio',
    },
    {
      id: 2,
      title: 'Follow me on Twitter',
      url: 'https://twitter.com/example',
    },
    {
      id: 3,
      title: 'Check out my GitHub',
      url: 'https://github.com/example',
    },
    {
      id: 4,
      title: 'Connect on LinkedIn',
      url: 'https://linkedin.com/in/example',
    },
    {
      id: 5,
      title: 'Read my Blog',
      url: 'https://example.com/blog',
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-purple-600 via-purple-900 to-indigo-900 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Profile Section */}
        <div className="mb-12 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full ring-4 ring-white/20">
            <Image
              src={profile.avatar}
              alt={profile.username}
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">{profile.username}</h1>
          <p className="text-lg text-white/80">{profile.bio}</p>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {profile.links.map((link) => (
            <LinkButton
              key={link.id}
              href={link.url}
              variant={link.id % 2 === 0 ? 'outline' : 'default'}
            >
              {link.title}
            </LinkButton>
          ))}
        </div>
      </div>
    </main>
  );
}
