import {
  AdminLiabilityFormApi,
  AdminLiabilityFormApiApiV1AdminLiabilityformGetRequest,
  AdminLiabilityFormApiApiV1AdminLiabilityformPostRequest,
  AdminLiabilityFormApiApiV1AdminLiabilityformPutRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const adminLiabilityFormsApi = new AdminLiabilityFormApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (
  data: AdminLiabilityFormApiApiV1AdminLiabilityformGetRequest
) => {
  try {
    const response = await adminLiabilityFormsApi.apiV1AdminLiabilityformGet(
      data
    );
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const getById = async (id: number) => {
  try {
    const response = await adminLiabilityFormsApi.apiV1AdminLiabilityformIdGet({
      id,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const post = async (
  data: AdminLiabilityFormApiApiV1AdminLiabilityformPostRequest
) => {
  try {
    const response = await adminLiabilityFormsApi.apiV1AdminLiabilityformPost(
      data
    );
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const put = async (
  data: AdminLiabilityFormApiApiV1AdminLiabilityformPutRequest
) => {
  try {
    const response = await adminLiabilityFormsApi.apiV1AdminLiabilityformPut(
      data
    );
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const deleteById = async (id: number) => {
  try {
    const response =
      await adminLiabilityFormsApi.apiV1AdminLiabilityformIdDelete({ id });
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
