export interface IElectronicJournal {
  empty: number;
  blank: number;
  skipping: number;
  lineChart: string;
}

export interface IElectronicJournalLineChart {
  date: Date;
  empty: number;
  blank: number;
  skipping: number;
}
