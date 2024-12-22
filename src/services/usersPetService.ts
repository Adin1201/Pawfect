import { toast } from 'react-toastify';
import {
  UsersPetsApi,
  UsersPetsApiApiV1UserPetsGetRequest,
  UsersPetsApiApiV1UserPetsIdDeleteRequest,
  UsersPetsApiApiV1UserPetsPetIdGetRequest,
  UsersPetsApiApiV1UserPetsPostRequest,
  UsersPetsApiApiV1UserPetsPutRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const usersPetApi = new UsersPetsApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const post = async (data: UsersPetsApiApiV1UserPetsPostRequest) => {
  try {
    const response = await usersPetApi.apiV1UserPetsPost(data);
    toast.success('Pet added successfully');
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const get = async (data: UsersPetsApiApiV1UserPetsGetRequest) => {
  try {
    const response = await usersPetApi.apiV1UserPetsGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const getById = async (data: UsersPetsApiApiV1UserPetsPetIdGetRequest) => {
  try {
    const response = await usersPetApi.apiV1UserPetsPetIdGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const put = async (data: UsersPetsApiApiV1UserPetsPutRequest) => {
  try {
    const response = await usersPetApi.apiV1UserPetsPut(data);
    toast.success('Pet saved successfully');
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const deletePet = async (data: UsersPetsApiApiV1UserPetsIdDeleteRequest) => {
  try {
    const response = await usersPetApi.apiV1UserPetsIdDelete(data);
    toast.success('Pet deleted successfully');
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  post,
  get,
  getById,
  put,
  deletePet,
};
