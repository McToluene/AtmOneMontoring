export interface IAccessRight {
  roleId: number;
  privilegeId: number;
  roleName: string;
  privilegeName: string;
  add: boolean;
  update: boolean;
  view: boolean;
}
