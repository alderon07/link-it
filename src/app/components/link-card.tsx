import React from 'react';

type LinkCardProps = {
  title: string;
  href: string;
  key: number;
};

export default function LinkCard({
  title,
  href,
  key,
}: LinkCardProps): JSX.Element {
  let linkTitle = title;
  let linkHref = href;

  return (
    <li className="flex h-20 w-96 max-w-full justify-center self-center rounded-full border-4 border-violet-900 bg-rose-300 shadow-2xl transition hover:bg-rose-400 lg:w-full">
      <article className="flex w-full">
        <a
          key={key}
          className="flex h-full w-full items-center justify-center rounded-lg font-semibold text-slate-900"
          href={linkHref}
        >
          {linkTitle}
        </a>
      </article>
    </li>
  );
}
