export type TAxisName = string;

export type TChartValues = number[];

export type TColumn = [TAxisName, ...TChartValues];

export type TColumns = TColumn[];

export interface IChartData {
  columns: TColumns;
  types: {
    [index: string]: string;
  };
  names: {
    [index: string]: string;
  };
  colors: {
    [index: string]: string;
  };
}

export type TChartsDataResponse = IChartData[];

export interface IAbscissa {
  functionName: string;
  values: string[];
}

export interface IAxisOfOrdinates {
  functionName: string;
  values: TChartValues;
  type: string;
  label: string;
  color: string;
}

export interface IParsedChartsData {
  abscissa: IAbscissa;
  axisOfOrdinates: IAxisOfOrdinates[];
}

export interface IChartOptions {
  width: number;
  height: number;
  marginTop: number;
  barsCount: number;
  data: IParsedChartsData;
}

export class BaseChart {
  protected width: number;
  protected height: number;
  protected marginTop: number;
  protected barsCount: number;
  protected data: IParsedChartsData;
  private _component!: HTMLElement;
  private _context!: CanvasRenderingContext2D;

  constructor(options: IChartOptions) {
    this.width = options.width;
    this.height = options.height;
    this.marginTop = options.marginTop;
    this.barsCount = options.barsCount;
    this.data = options.data;

    this.initializeComponent();
    this.initializeContext();
    this.prepare();
  }

  get component() {
    return this._component;
  }

  set component(component: HTMLElement) {
    this._component = component;
  }

  get context() {
    return this._context;
  }

  set context(context: CanvasRenderingContext2D) {
    this._context = context;
  }

  initializeComponent() {
    throw new Error("Implement setting component");
  }

  initializeContext() {
    throw new Error("Implement setting context");
  }

  prepare() {
    throw new Error("Implement chart algorithm");
  }
}
