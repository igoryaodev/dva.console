import { queryOrderList } from '../services/api';

export default {
  namespace: 'orderlist',

  state: {
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryOrderList, payload);
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
