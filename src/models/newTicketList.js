import { queryNewTicketList } from '../services/api';

export default {
  namespace: 'newTicketList',

  state: {
    list: [],
    ticketData: {},
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryNewTicketList, payload);
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
        list: payload.list,
        loading: false,
        ticketData: {
          ...payload,
        },
      };
    },
  },
};
