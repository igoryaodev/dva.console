import { queryInventoryList } from '../services/api';

export default {
  namespace: 'inventorylist',

  state: {
    loading: true,
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const res = yield call(queryInventoryList, payload);
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
