import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface HeadingTitleProps {
  title: string;
  href: string;
  hrefText: string;
}

const HeadingTitle: React.FC<HeadingTitleProps> = ({
  title,
  href,
  hrefText,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">{title}</h2>
      <Link href={href} className="flex items-center gap-1 transition-all ">
        {hrefText}
        <ChevronRightIcon className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default HeadingTitle;
