export interface ICamera {
  notCapturing: number;
  indeterminate: number;
  stopped: number;
  lineChart: string;
}

export interface CameraLineChart {
  name: Date;
  currently: number;
  indeterminate: number;
  stopped: number;
}
