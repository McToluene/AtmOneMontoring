export interface IIssueFilter {
  appId: string;
  range: number;
  item: string;
  value: string;
}

export interface ISelectedIIssueFilter extends IIssueFilter {
  msgCat: string;
}

export interface IIssuePagingFilter {
  appId: string;
  range: number;
  item: string;
  value: string;
  pageSize: number;
  pageNumber: number;
}

export interface ISelectedIIssuePagingFilter extends IIssuePagingFilter {
  msgCat: string;
}
