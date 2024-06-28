import LinkStyled from "./link-styled";

export default function LinkList() {
  const links = [
    { linkHref: "https://www.google.com", linkTitle: "Google" },
    { linkHref: "https://www.facebook.com", linkTitle: "Facebook" },
    { linkHref: "https://www.twitter.com", linkTitle: "Twitter" },
    { linkHref: "https://www.instagram.com", linkTitle: "Instagram" },
  ];

  return (
    <div>
      <ul className="flex flex-col items-center gap-8">
        {links.map((link, index) => {
          return (
            <LinkStyled
              key={index}
              title={link.linkTitle}
              href={link.linkHref}
            />
          );
        })}
      </ul>
    </div>
  );
}
