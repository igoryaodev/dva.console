import { queryProductList } from '../services/api';

export default {
  namespace: 'productlist',
  state: {
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryProductList, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false,
      };
    },
  },
};
