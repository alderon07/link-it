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
    <main className="min-h-screen w-full bg-gradient-to-b from-purple-900 via-purple-700 to-blue-800 flex flex-col items-center justify-start py-16 px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="relative w-20 h-20 overflow-hidden rounded-full mb-4">
            <Image
              src={profile.avatar}
              alt={profile.username}
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">{profile.username}</h1>
          <p className="text-sm text-pink-200 mb-6">{profile.bio}</p>
        </div>

        {/* Links Section */}
        <div className="space-y-4 w-full">
          {profile.links.map((link) => (
            <LinkButton
              key={link.id}
              href={link.url}
              className={`${
                link.id % 2 === 0 
                  ? 'bg-pink-300/50 hover:bg-pink-300/70' 
                  : 'bg-pink-400/60 hover:bg-pink-400/80'
              } text-white font-normal rounded-xl`}
            >
              {link.title}
            </LinkButton>
          ))}
        </div>
      </div>
    </main>
  );
}
