export interface IAuditTrail {
  auditId: number;
  privilegeId: number;
  activity: string;
  userId: number;
  action: string;
  sysIp: string;
  userName: string;
  logDate: string;
}

export interface IAuditTrailDetail extends IAuditTrail {
  oldValues: string;
  newValues: string;
  sysName: string;
}
