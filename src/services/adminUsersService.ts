import { toast } from 'react-toastify';
import {
  AdminUsersApi,
  AdminUsersApiApiV1AdminUsersGetRequest,
  AdminUsersApiApiV1AdminUsersIdGetRequest,
  AdminUsersApiApiV1AdminUsersPostRequest,
  AdminUsersApiApiV1AdminUsersPutRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const adminUsersApi = new AdminUsersApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (data: AdminUsersApiApiV1AdminUsersGetRequest) => {
  try {
    const response = await adminUsersApi.apiV1AdminUsersGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const getById = async (data: AdminUsersApiApiV1AdminUsersIdGetRequest) => {
  try {
    const response = await adminUsersApi.apiV1AdminUsersIdGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const put = async (data: AdminUsersApiApiV1AdminUsersPutRequest) => {
  try {
    const response = await adminUsersApi.apiV1AdminUsersPut(data);
    toast.success('User Profile updated successfully.');
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const post = async (data: AdminUsersApiApiV1AdminUsersPostRequest) => {
  try {
    const response = await adminUsersApi.apiV1AdminUsersPost(data);
    toast.success('Successfully added a new user.');
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
  getById,
  put,
  post,
};
