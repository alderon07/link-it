import Image from 'next/image';
import { LinkButton } from '@/components/ui/LinkButton';

// Dummy data - matching the screenshot
const profile = {
  username: 'sadasspanda',
  bio: 'I like chocolate milk',
  avatar: 'https://picsum.photos/200',
  links: [
    {
      id: 1,
      title: 'Google',
      url: 'https://google.com',
    },
    {
      id: 2,
      title: 'Facebook',
      url: 'https://facebook.com',
    },
    {
      id: 3,
      title: 'Twitter',
      url: 'https://twitter.com',
    },
    {
      id: 4,
      title: 'Instagram',
      url: 'https://instagram.com',
    },
  ],
};

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center bg-gradient-to-b from-purple-900 via-purple-700 to-blue-800">
      <div className="flex w-full max-w-[500px] flex-col items-center px-4 py-12 sm:py-16">
        {/* Profile Section */}
        <div className="mb-8 flex w-full flex-col items-center">
          <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20">
            <Image
              src={profile.avatar}
              alt={profile.username}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 64px, 80px"
            />
          </div>
          <h1 className="mb-1 text-lg font-bold text-white sm:text-xl">{profile.username}</h1>
          <p className="text-sm text-pink-200">{profile.bio}</p>
        </div>

        {/* Links Section */}
        <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
          {profile.links.map((link) => (
            <LinkButton
              key={link.id}
              href={link.url}
              className="bg-pink-400/40 hover:bg-pink-400/60 text-white"
            >
              {link.title}
            </LinkButton>
          ))}
        </div>
      </div>
    </main>
  );
}
