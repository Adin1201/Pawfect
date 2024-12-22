import { toast } from 'react-toastify';
import {
  AdminPetsApi,
  AdminPetsApiApiV1AdminPetsGetRequest,
  AdminPetsApiApiV1AdminPetsIdDeleteRequest,
  AdminPetsApiApiV1AdminPetsIdGetRequest,
  AdminPetsApiApiV1AdminPetsPutRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const adminPetsApi = new AdminPetsApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (data: AdminPetsApiApiV1AdminPetsGetRequest) => {
  try {
    const response = await adminPetsApi.apiV1AdminPetsGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const getById = async (data: AdminPetsApiApiV1AdminPetsIdGetRequest) => {
  try {
    const response = await adminPetsApi.apiV1AdminPetsIdGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const put = async (data: AdminPetsApiApiV1AdminPetsPutRequest) => {
  try {
    const response = await adminPetsApi.apiV1AdminPetsPut(data);
    toast.success('Pet updated successfully.');
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const deletePet = async (data: AdminPetsApiApiV1AdminPetsIdDeleteRequest) => {
  try {
    const response = await adminPetsApi.apiV1AdminPetsIdDelete(data);
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
  deletePet,
};
