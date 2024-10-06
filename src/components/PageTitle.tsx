import * as React from "react";

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return <h1 className="text-3xl font-semibold text-primary">{title}</h1>;
};

export default PageTitle;
