import React from "react";

export default function LinkStyled({
  title,
  href,
  key,
}: {
  title: string;
  href: string;
  key: number;
}) {
  let linkTitle = title;
  let linkHref = href;

  return (
    <li className="flex justify-center max-w-full h-20 w-96 lg:w-full border-4 border-violet-900 rounded-full self-center shadow-2xl bg-rose-300 hover:bg-rose-400 transition">
      <article className="flex w-full">
        <a
          key={key}
          className="flex justify-center items-center w-full h-full rounded-lg text-slate-900 font-semibold"
          href={linkHref}
        >
          {linkTitle}
        </a>
      </article>
    </li>
  );
}
