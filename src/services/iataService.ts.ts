import { IataApi, IataApiApiV1IataGetRequest } from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const iataApi = new IataApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (data: IataApiApiV1IataGetRequest) => {
  try {
    const response = await iataApi.apiV1IataGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
};
