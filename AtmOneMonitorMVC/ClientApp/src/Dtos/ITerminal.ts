export interface ITerminal {
  ip: string;
  terminalId: string;
  title: string;
  vendor: string;
  vendorId: number;
  onlineDate: Date;
}

export interface ITerminalCreate {
  id: number;
  vendorId: number;
  ip: string;
  title: string;
  terminalId: string;
  branchId: number;
}

export interface IOnlineTerminal {
  ip: string;
  terminalId: string;
  vendor: string;
  onlineDate: Date;
}

export interface ITerminalConfiguration {
  vendorConfigId: number;
  vendorId: number;
  imageBrightness: number;
  nightSensitivity: number;
  manageCapturing: boolean;
  validationMode: string;
  intelliCamEnabled: boolean;
  escalationDelayTimeInMin: number;
  sendAlert: boolean;
  debugLevel: number;
}

export interface ITerminalConfigurationCreate {
  vendorConfigId: number;
  imageBrightness: number;
  nightSensitivity: number;
  manageCapturing: boolean;
  validationMode: string;
  intelliCamEnabled: boolean;
  escalationDelayTimeInMin: number;
  sendAlert: boolean;
  debugLevel: number;
  selectedTerminals: ITerminalVendor[];
}

export interface ITerminalConfig {
  configId: number;
  vendorConfigId: number;
  appId: string;
  ip: string;
  vendor: string;
  imagePath: string;
  validationMode: string;
  manageCapturing: boolean;
}

export interface ITerminalVendor {
  ip: string;
  terminalId: string;
}

export interface IApproveTerminal {
  vendorName: string;
  vendorConfigName: string;
  imageBrightness: number;
  nightSensitivity: number;
  manageCapturing: boolean;
  sendAlert: boolean;
  ejectMode: string;
  intelliCamEnabled: boolean;
  validationMode: string;
  ip: string;
  escalationDelayTimeInMin: number;
  imagePath: string;
  ejPath: string;
  updatedBy: string;
  updateDate: Date;
  terminalId: string;
}

export interface ITerminalConfigApproval {
  configId: number;
  ip: string;
  vendorName: string;
  terminalId: string;
  ejectMode: string;
  validationMode: string;
  intelliCamEnabled: boolean;
  manageCapturing: boolean;
  imageBrightness: number;
  nightSensitivity: number;
  approved: boolean;
}

export interface IBlurredTerminal {
  logId: string;
  terminalID: string;
  ip: string;
  logMsg: string;
  incidentDate: Date;
  imgBytes: any;
}

export interface OnlineStats {
  onlineTerminals: number;
  totalTerminals: number;
}
