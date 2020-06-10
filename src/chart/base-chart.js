export default class BaseChart {
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.marginTop = options.marginTop;
    this.barsCount = options.barsCount;
    this.data = options.data;
    this.$component = null;

    this.setComponent();
    this.setContext();
    this.prepare();
  }

  get component() {
    return this.$component;
  }

  // eslint-disable-next-line class-methods-use-this
  setComponent() {
    throw new Error("Implement setting component");
  }

  // eslint-disable-next-line class-methods-use-this
  setContext() {
    throw new Error("Implement setting context");
  }

  // eslint-disable-next-line class-methods-use-this
  prepare() {
    throw new Error("Implement chart algorithm");
  }
}
