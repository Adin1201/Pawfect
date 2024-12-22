import {
  OrganisationUsersApi,
  OrganisationUsersApiApiV1OrganisationUsersIdGetRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const usersApi = new OrganisationUsersApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const getById = async (
  data: OrganisationUsersApiApiV1OrganisationUsersIdGetRequest
) => {
  try {
    const response = await usersApi.apiV1OrganisationUsersIdGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  getById,
};
