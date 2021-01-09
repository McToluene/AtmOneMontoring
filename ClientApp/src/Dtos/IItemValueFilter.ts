import { IPaginationFilter } from "./IPaginationFilter";

export interface IITemValuePaginateFilter extends IPaginationFilter {
  item: string;
  value: string;
}

export interface IItemValueFilter {
  item: string;
  value: string;
}
