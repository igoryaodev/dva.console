import { queryInventorySkuList, updateInventorySkuList } from '../services/api';

export default {
  namespace: 'inventoryskulist',

  state: {
    loading: true,
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const res = yield call(queryInventorySkuList, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },
    *update({ payload }, { put, call }) {
      yield put({
        type: 'loading',
      });
      const res = yield call(updateInventorySkuList, payload);
      if (res && res.status === 1) {
        const data = yield call(queryInventorySkuList, payload);
        yield put({
          type: 'save',
          payload: data,
        });
      } else {
        alert('error');
      }
    },
  },

  reducers: {
    loading(state) {
      return {
        ...state,
        loading: true,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false,
      };
    },
  },
};
