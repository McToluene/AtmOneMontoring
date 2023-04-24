export interface IResponse<T> {
  data: T;
  succeeded: boolean;
  errors: string[];
  message: string;
}
