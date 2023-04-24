import { IPaginationFilter } from "./IPaginationFilter";

export interface IDateItemValuePaginateFilter extends IPaginationFilter {
  item: string;
  value: string;
  dateFrom: string;
  dateTo: string;
}

export interface IDateItemValueFilter {
  item: string;
  value: string;
  dateFrom: string;
  dateTo: string;
}
