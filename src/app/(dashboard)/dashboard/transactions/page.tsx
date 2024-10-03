import * as React from "react";

interface TransactionsPageProps {
  params: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({
  params,
  searchParams,
}) => {
  return <div>TransactionsPage</div>;
};

export default TransactionsPage;
