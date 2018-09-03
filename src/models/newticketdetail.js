import { queryNewTicketDetail } from '../services/api';

export default {
  namespace: 'newticketdetail',

  state: {
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryNewTicketDetail, payload);
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
        ...paylaod,
        loading: false,
      };
    },
  },
};
