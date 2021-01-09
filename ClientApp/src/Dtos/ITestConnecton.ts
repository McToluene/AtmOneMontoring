export interface ITestConnection {
  ldapString: string;
  domain: string;
  userId: string;
  password: string;
}

export interface ISearchADUsers extends ITestConnection {
  userName: string;
}
