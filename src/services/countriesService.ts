import { CountriesApi, CountriesApiApiV1CountriesGetRequest } from '../api/api';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const countriesApi = new CountriesApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const get = async (
  CountriesApiApiV1CountriesGetRequest: CountriesApiApiV1CountriesGetRequest
) => {
  try {
    const response = await countriesApi.apiV1CountriesGet(
      CountriesApiApiV1CountriesGetRequest
    );
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  get,
};
