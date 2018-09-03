import { queryOrderDetail } from '../services/api';

export default {
  namespace: 'orderdetail',

  state: {
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryOrderDetail, payload);
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
