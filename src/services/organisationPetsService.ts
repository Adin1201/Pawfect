import {
  OrganisationPetsApi,
  OrganisationPetsApiApiV1OrganisationPetsIdGetRequest,
} from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const petsApi = new OrganisationPetsApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const getById = async (
  data: OrganisationPetsApiApiV1OrganisationPetsIdGetRequest
) => {
  try {
    const response = await petsApi.apiV1OrganisationPetsIdGet(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  getById,
};
