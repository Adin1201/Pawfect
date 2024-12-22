import { UsersFaqApi, UsersFaqApiApiV1UserFaqGetRequest } from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const usersFaqApi = new UsersFaqApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (data: UsersFaqApiApiV1UserFaqGetRequest) => {
  try {
    const response = await usersFaqApi.apiV1UserFaqGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
};
