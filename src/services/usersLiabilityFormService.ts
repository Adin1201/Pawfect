import { UsersLiabilityFormApi } from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const usersLiabilityFormApi = new UsersLiabilityFormApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async () => {
  try {
    const response = await usersLiabilityFormApi.apiV1UserLiabilityformGet();
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

const getById = async (id: number) => {
  try {
    const response = await usersLiabilityFormApi.apiV1UserLiabilityformIdGet({
      id,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
  getById,
};
