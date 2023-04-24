export interface IItems {
  id: string;
  title: string;
  type: string;
  icon: string;
  breadcrumbs: boolean;
  children?: [IItemsChildren];
}

export interface IItemsChildren {
  id: string;
  title: string;
  type: string;
  url: string;
  icon: string;
}

export default IItems;
