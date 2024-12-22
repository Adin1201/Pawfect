import { AdminDashboardApi } from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const adminDashboardApi = new AdminDashboardApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async () => {
  try {
    const response = await adminDashboardApi.apiV1AdminDashboardGet();
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
};
