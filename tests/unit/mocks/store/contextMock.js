const getContextMock = (jest) => ({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  dispatch: jest.fn(),
  commit: jest.fn(),
});

export default getContextMock;
