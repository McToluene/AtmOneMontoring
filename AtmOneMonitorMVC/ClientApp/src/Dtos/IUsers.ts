export interface IUsers {
  userID: number;
  fullName: string;
  userName: string;
  roleName: string;
  email: string;
  createdBy: string;
  status: boolean;
  approved: boolean;
}

export interface IUser {
  userName: string;
  fullName: string;
  roleId: number;
  status: boolean;
  email: string;
  createdBy: string;
  createdDate: string;
  approvedBy: string;
  approvedDate: string;
  approved: boolean;
}

export interface ILDAPUser {
  isSelected: boolean;
  userName: string;
  fullName: string;
  email: string;
  roleName: string;
}

export interface IUserCreate {
  userName: string;
  fullName: string;
  roleId: number;
  email: string;
}
