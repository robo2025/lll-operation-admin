import {CONTRACT_URL,SUPPLIERLIST_URL} from "../constant/config";
import lyRequest from "../utils/lyRequest";
import {queryString} from '../utils/tools';

//请求合同列表
export async function queryContractList({params, offset = 0, limit = 10}) {
    return lyRequest(`${CONTRACT_URL}?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`)
}
// 请求合同详情
export async function queryContractDetail({id}) {
    return lyRequest(`${CONTRACT_URL}/${id}`)
}
// 请求供应商列表
export async function querySupplierList({params,offset = 0, limit = 10}) {
    return lyRequest(`${SUPPLIERLIST_URL}?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`)
}

// 新增合同
export async function addContract({params}){
    return lyRequest(`${CONTRACT_URL}`,{
        method:"post",
        data:params
    })
}