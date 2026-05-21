interface TableColumnItem {
  Header: string;
  accessor: string;
}

export const tableColumnsTopCreators: TableColumnItem[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Artworks",
    accessor: "artworks",
  },
  {
    Header: "Rating",
    accessor: "rating",
  },
];
