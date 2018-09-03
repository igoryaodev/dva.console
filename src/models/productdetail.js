import { addProduct, updateProduct, queryProduct } from '../services/api';

export default {
  namespace: 'productdetail',

  state: {
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      debugger
      if (!payload || !payload.id) {
        const res = {};
        yield put({
          type: 'clear',
          payload: res,
        });
      } else {
        const res = yield call(queryProduct, payload);
        yield put({
          type: 'save',
          payload: res,
        });
      }
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateProduct, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },
    *add({ payload }, { call, put }) {
      const res = yield call(addProduct, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },
  },

  reducers: {
    clear(state, { payload }) {
      return {
        ...payload,
        loading: false,
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
