import {
  OrganisationSearchApi,
  OrganisationSearchApiApiV1OrganisationSearchGetRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const searchApi = new OrganisationSearchApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (
  data: OrganisationSearchApiApiV1OrganisationSearchGetRequest
) => {
  try {
    const response = await searchApi.apiV1OrganisationSearchGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
};
