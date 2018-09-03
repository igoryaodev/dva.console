import request from '../utils/request';

export async function query() {
  let user = window.localStorage['tenantData'];
  user = user ? JSON.parse(user) : [];
  return user;
}

export async function queryCurrent() {
  let user = window.localStorage['tenantData'];
  user = user ? JSON.parse(user) : [];
  return user;
}
