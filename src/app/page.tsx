import Image from 'next/image';
import { LinksList } from '@/components/LinksList';

// Dummy profile data - would be fetched from an API in a real app
const profile = {
  username: 'sadasspanda',
  bio: 'I like chocolate milk',
  avatar: 'https://picsum.photos/200',
};

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center bg-gradient-to-b from-primary via-primary/90 to-primary/80">
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
          <h1 className="mb-1 text-xl font-bold text-text sm:text-3xl">{profile.username}</h1>
          <p className="text-sm text-text-muted">{profile.bio}</p>
        </div>

        {/* Links Section - Now using tRPC through the LinksList component */}
        <LinksList />
      </div>
    </main>
  );
}
