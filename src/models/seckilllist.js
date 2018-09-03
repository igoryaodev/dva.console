import { querySeckillList } from '../services/api';

export default {
  namespace: 'seckilllist',

  state: {
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(querySeckillList, payload);
      // const res = require('../../mock/seckill.json')
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
