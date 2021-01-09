export interface IVendor {
  vendorId: number;
  vendor: string;
}

export interface IVendorConfiguration {
  vendorConfigName: string;
  appId: string;
  vendorId: number;
  imagePath: string;
  imageFilter: string;
  atmLogFilter: string;
  atmLogPath: string;
  ejPath: string;
  ejFilter: string;
  ejectMode: string;
  eventsExclude: string;
  wniServiceTimeout: number;
  remotePort: string;
  remoteIp: string;
}

export interface IVendorConfig {
  vendorConfigId: number;
  appId: string;
  vendorConfigName: string;
  vendorName: string;
  imagePath: string;
  imageFilter: string;
  atmLogPath: string;
  atmLogFilter: string;
  ejectMode: string;
}
