import { Category, TransactionType, Theme } from "@prisma/client";

export const transactionsSelect = [
  {
    id: "1",
    name: "Income",
    value: TransactionType.INCOME,
  },

  {
    id: "2",
    name: "Expense",
    value: TransactionType.EXPENSE,
  },
];

export const categoriesSelect = [
  {
    id: "1",
    name: "Food",
    value: Category.FOOD,
  },
  {
    id: "2",
    name: "Transport",
    value: Category.TRANSPORT,
  },
  {
    id: "3",
    name: "Entertainment",
    value: Category.ENTERTAINMENT,
  },
  {
    id: "4",
    name: "Health",
    value: Category.HEALTH,
  },
  {
    id: "5",
    name: "Education",
    value: Category.EDUCATION,
  },
  {
    id: "6",
    name: "Shopping",
    value: Category.SHOPPING,
  },
  {
    id: "7",
    name: "Bills",
    value: Category.BILLS,
  },
  {
    id: "8",
    name: "Others",
    value: Category.OTHER,
  },
];

export const themeColorMap: Record<Theme, string> = {
  [Theme.GREEN]: "#277C78",
  [Theme.CYAN]: "#82C9D7",
  [Theme.YELLOW]: "#F2CDAC",
  [Theme.NAVY]: "#626070",
  [Theme.RED]: "#C94736",
  [Theme.PURPLE]: "#826CB0",
  [Theme.LIGHT_PURPLE]: "#AF81BA",
  [Theme.TORQUOISE]: "#597C7C",
  [Theme.BROWN]: "#93674F",
  [Theme.MAGENTA]: "#934F6F",
  [Theme.BLUE]: "#3F82B2",
  [Theme.NAVY_GRAY]: "#97A0AC",
  [Theme.ARMY_GREEN]: "#7F9161",
  [Theme.GOLD]: "#CAB361",
  [Theme.ORANGE]: "#BE6C49",
};

export const themeSelect = [
  {
    id: "1",
    name: "Green",
    value: Theme.GREEN,
    color: themeColorMap[Theme.GREEN],
  },
  {
    id: "2",
    name: "Cyan",
    value: Theme.CYAN,
    color: themeColorMap[Theme.CYAN],
  },
  {
    id: "3",
    name: "Yellow",
    value: Theme.YELLOW,
    color: themeColorMap[Theme.YELLOW],
  },
  {
    id: "4",
    name: "Navy",
    value: Theme.NAVY,
    color: themeColorMap[Theme.NAVY],
  },
  {
    id: "5",
    name: "Red",
    value: Theme.RED,
    color: themeColorMap[Theme.RED],
  },
  {
    id: "6",
    name: "Purple",
    value: Theme.PURPLE,
    color: themeColorMap[Theme.PURPLE],
  },
  {
    id: "7",
    name: "Light Purple",
    value: Theme.LIGHT_PURPLE,
    color: themeColorMap[Theme.LIGHT_PURPLE],
  },
  {
    id: "8",
    name: "Torquoise",
    value: Theme.TORQUOISE,
    color: themeColorMap[Theme.TORQUOISE],
  },
  {
    id: "9",
    name: "Brown",
    value: Theme.BROWN,
    color: themeColorMap[Theme.BROWN],
  },
  {
    id: "10",
    name: "Magenta",
    value: Theme.MAGENTA,
    color: themeColorMap[Theme.MAGENTA],
  },
  {
    id: "11",
    name: "Blue",
    value: Theme.BLUE,
    color: themeColorMap[Theme.BLUE],
  },
  {
    id: "12",
    name: "Navy Gray",
    value: Theme.NAVY_GRAY,
    color: themeColorMap[Theme.NAVY_GRAY],
  },
  {
    id: "13",
    name: "Army Green",
    value: Theme.ARMY_GREEN,
    color: themeColorMap[Theme.ARMY_GREEN],
  },
  {
    id: "14",
    name: "Gold",
    value: Theme.GOLD,
    color: themeColorMap[Theme.GOLD],
  },
  {
    id: "15",
    name: "Orange",
    value: Theme.ORANGE,
    color: themeColorMap[Theme.ORANGE],
  },
];
