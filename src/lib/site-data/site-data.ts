interface SiteData {
  personalFinance: {
    id: string;
    name: string;
    value: string;
  }[];
}

{
  /* current,balance, income, expenses */
}

export const siteData: SiteData = {
  personalFinance: [
    {
      id: "1",
      name: "Current Balance",
      value: "",
    },

    {
      id: "2",
      name: "Income",
      value: "",
    },
    {
      id: "3",
      name: "Expenses",
      value: "",
    },
  ],
};
