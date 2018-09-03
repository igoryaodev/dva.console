import { stringify } from 'qs';
import request from '../utils/request';
/*
*@bridge
*/

/*
*@  商品新增
*@/product
*/
export async function addProduct(params) {
  return request(`/api/product`, {
    method: 'POST',
    data: params,
  })
}

/*
*@  商品修改
*@/product
*/
export async function updateProduct(params) {
  return request(`/api/product`, {
    method: 'PUT',
    data: params,
  })
}

/*
*@  单个商品查询
*@/product
*/
export async function queryProduct(params) {
  return request(`/api/product/${params.id}`, {
    method: 'GET',
  })
}

/*
*@  商品列表
*@/products/list
*/

export async function queryProductList(params) {
  return request(`/api/products/list`, {
    method: 'GET',
    params: params,
  })
}




/*
* @vart start
*/

/*
* @login
*/
export async function fakeAccountLogin(params) {
  return request(`/v1/login`, {
    // return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

/*
* @ 新票务列表
* ticketProducts?isActivity=false&page=1
*/
export async function queryNewTicketList(params) {
  // debugger
  return request(`/v1/ticketProducts`, {
    method: 'GET',
    params: params,
  });
}
/*
* @ 新票务详情
* http://cms.vart.cc/api/ticketProducts/2214
*/
export async function queryNewTicketDetail(params) {
  return request(`/v1/ticketProducts/${params.id}`, {
    method: 'GET',
  });
}
/*
* @ 秒杀活动列表
* product?pagesize=30&pageindex=1
*/
export async function querySeckillList(params) {
  // return request(`/d1/product`, {
  // return require('../../mock/seckill.json')
  return request(`/api/product/withspec`, {
    method: 'GET',
    params: params,
  });
}
/*
* @ 秒杀活动详情
* @GET
* product/id
*/
export async function querySeckillDetail(params) {
  // return request(`/d1/product/${params.id}`, {
  // return require('../../mock/seckill.detail.json')
  return request(`/api/product/withspec/${params.id}`, {
    method: 'GET',
  });
}
/*
* @ 修改秒杀活动详情
* @put
* product/id
*/
export async function updateSeckillDetail(params) {
  return request(`/api/product`, {
    method: 'PUT',
    data: params,
  });
}
/*
* @ 新增秒杀活动详情
* @put
* product/id
*/
export async function newSeckillDetail(params) {
  return request(`/api/product`, {
    method: 'POST',
    data: params,
  });
}
/*
* @商品列表
* @get
* Inventory
*/
export async function queryInventoryList(params) {
  return request(`/api/inventory`, {
    method: 'GET',
    params: params,
  });
}
/*
* @商品入库商品详情
* @get
* Inventory
*/
export async function queryInventorySkuList(params) {
  return request(`/api/inventory/${params.id}`, {
    method: 'GET',
  });
}
/*
* @商品入库
* @put
* Inventory
*/
export async function updateInventorySkuList(params) {
  return request(`/api/inventory/ininventory/${params.id}`, {
    method: 'PUT',
    data: params.data,
  });
}
/*
* @订单列表
* @GET
* Order
*/
export async function queryOrderList(params) {
  return request(`/api/Order`, {
    method: 'GET',
    params: params,
  });
}

/*
* @订单详情 
* @GET
* Order
*/
export async function queryOrderDetail(params) {
  return request(`/api/Order/sync/${params.id}`, {
    method: 'GET',
  });
}

/*
* @qiniu
* @GET
* token
*/

export async function queryUploadToken(params) {
  return request(
    `http://BRIDGE.vart.cc/member/BRIDGE/memberapi/upload/token/102?name=${encodeURIComponent(
      params
    )}`,
    {
      method: 'GET',
    }
  );
}
/*
* @qiniu
* @POST
* url
*/

export async function addUploadUrl(params) {
  return request(`http://upload.qiniu.com`, {
    method: 'POST',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/*
* @vart end
*/

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
