import { querySeckillDetail, updateSeckillDetail, newSeckillDetail } from '../services/api';

export default {
  namespace: 'seckilldetail',

  state: {
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      if (!payload || !payload.id || payload.id < 1) {
        const res = { productSpecs: [] };
        yield put({
          type: 'clear',
          payload: res,
        });
      } else {
        const res = yield call(querySeckillDetail, payload);
        yield put({
          type: 'save',
          payload: res,
        });
      }
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateSeckillDetail, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },
    *add({ payload }, { call, put }) {
      const res = yield call(newSeckillDetail, payload);
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
