import { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ErrorResponseDto, ValidationFieldErrorDto } from '../api/api';

const errorMessageHandler = (error: ValidationFieldErrorDto) => {
  switch (error.error) {
    case 'UserNotFound':
      return 'User is not found.';
    case 'PetNotFound':
      return 'Pet is not found.';
    case 'PetNotFoundForUser':
      return 'Pet is not found for the user.';
    case 'PetMedicalDatalNotFound':
      return 'Pet medicala data is not found.';
    case 'EmailInUse':
      return 'Email address is already in use.';
    case 'InvalidEmailOrPassword':
      return 'Invalid email or password.';
    case 'ActionForbidden':
      return 'This action is unauthorized.';
    case 'NotFound':
      return 'Item not found.';
    case 'FaqNotFound':
      return 'FAQ is not found.';
    case 'CantReauthenticate':
      return 'Reauthentication test failed.';
    case 'InvalidOrExpiredCode':
      return 'Code is invalid or expired.';
    case 'PasswordConfirmationNotSame':
      return `Field ${error.field} does not match with  ${error.extra.comparisonValue}. The fields must match.`;
    case 'SyncRequestAlreadyExists':
      return 'Duplicate request. Sync request already exists.';
    case 'EmailNotVerified':
      return 'Email is not verified.';
    case 'CodeResendTimeout':
      return 'Code has been recently sent, please check your Email.';
    case 'BadRequest':
      return 'Invalid request.';
    case 'ValidationErrors':
      return 'There are validations errors.';
    case 'Required':
      return `Field ${error.field} is required.`;
    case 'NotValidEmailAddress':
      return 'Email address is not valid.';
    case 'MinLength':
      return `The length of ${error.field} must be at least ${error.extra.MinLength} character. You entered ${error.extra.TotalLength} characters.`;
    case 'MaxLength':
      return `The length of ${error.field} must be at least ${error.extra.MaxLength} character or fewer. You entered ${error.extra.TotalLength} characters.`;
    case 'Length':
      return `Field ${error.field} must be between ${error.extra.MinLength} and ${error.extra.MaxLength} characters. You entered ${error.extra.TotalLength}  characters.`;
    case 'GreaterThanOrEqual':
      return `Field ${error.field} must be greater than or equal to ${error.extra.comparisonValue}.`;
    case 'GreaterThan':
      return `Field ${error.field} must be greater than ${error.extra.comparisonValue}.`;
    case 'LessThanOrEqual':
      return `Field ${error.field} must be less or equal to ${error.extra.comparisonValue}.`;
    case 'LessThan':
      return `Field ${error.field} must be less than ${error.extra.comparisonValue}.`;
    case 'NotEqual':
      return `Field ${error.field} must not be equal to ${error.extra.comparisonValue}.`;
    case 'Predicate':
      return `The specified condition was not met for ${error.field}.`;
    case 'Regex':
      return `Field ${error.field} is not in the correct format.`;
    case 'Equal':
      return `Field ${error.field} must be equal to ${error.extra.comparisonValue}.`;
    case 'ExactLength':
      return `Field ${error.field} must be ${error.extra.MaxLength} characters in length. You entered ${error.extra.TotalLength} characters.`;
    case 'Between':
      return `Field ${error.field} must be between ${error.extra.From} and ${error.extra.To}. You entered ${error.extra.Value}.`;
    case 'Empty':
      return 'Please fill out this field.';
    case 'Invalid':
      return 'You have entered and ivalid value. Please try again.';

    default:
      break;
  }

  return null;
};

const defaultErrorHandler = (errorResponse: ErrorResponseDto) => {
  const messageError = errorResponse?.message;
  const translatedMessage = errorMessageHandler({ error: messageError });

  if (messageError && translatedMessage) {
    toast.error(translatedMessage);
  } else {
    toast.error('Oops! Something went wrong.');
  }
};

const formErrorHandler = <T>(
  formErrors: ErrorResponseDto | null,
  setError: UseFormSetError<any>,
  fields: T
): void => {
  if (!formErrors || formErrors.message !== 'ValidationErrors') {
    return;
  }

  formErrors.errors?.forEach((x) => {
    let field = Object.keys(fields).find(
      (f) => f.toLowerCase() === x.field?.toLowerCase()
    );

    if (x.field?.includes('.')) {
      const splitted = x.field.split('.');

      field = Object.keys(fields).find(
        (f) => f.toLowerCase() === splitted[1]?.toLowerCase()
      );
    }

    if (field) {
      setError(field, {
        type: 'manual',
        message: errorMessageHandler(x) || '',
      });
    }
  });
};

export { defaultErrorHandler, formErrorHandler, errorMessageHandler };
