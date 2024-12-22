import {
  AdminFaqApi,
  AdminFaqApiApiV1AdminFaqGetRequest,
  AdminFaqApiApiV1AdminFaqPostRequest,
  AdminFaqApiApiV1AdminFaqPutRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const adminFaqApi = new AdminFaqApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (data: AdminFaqApiApiV1AdminFaqGetRequest) => {
  try {
    const response = await adminFaqApi.apiV1AdminFaqGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const getById = async (id: number) => {
  try {
    const response = await adminFaqApi.apiV1AdminFaqIdGet({ id });
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const post = async (data: AdminFaqApiApiV1AdminFaqPostRequest) => {
  try {
    const response = await adminFaqApi.apiV1AdminFaqPost(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const put = async (data: AdminFaqApiApiV1AdminFaqPutRequest) => {
  try {
    const response = await adminFaqApi.apiV1AdminFaqPut(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const deleteById = async (id: number) => {
  try {
    const response = await adminFaqApi.apiV1AdminFaqDelete({ id });
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
  getById,
  post,
  put,
  deleteById,
};
