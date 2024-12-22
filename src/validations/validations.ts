const email =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // RFC 5322 Official Standard

const nameAndSurname = /^[a-zA-Z '.-]*$/i;

const onlyLettersAndNumbers = /^[a-zA-Z0-9]*$/i;

const onlyDigits = /^[0-9]*$/i;

export { email, nameAndSurname, onlyLettersAndNumbers, onlyDigits };
