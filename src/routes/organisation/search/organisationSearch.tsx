import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import logo from '../../../assets/images/logo-white.png';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import ScanQrCodeModal from '../../../components/ScanQrCodeModal';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import './organisationSearch.scss';

type SearchFormValues = {
  petChipNumber: string;
  userAccountNumber?: string;
};

const OrganisationSearchPage = () => {
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const history = useHistory();

  const validationSchema: SchemaOf<SearchFormValues> = Yup.object({
    petChipNumber: Yup.string().required('Field Pet Chip Number is required.'),
    userAccountNumber: Yup.string(),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<SearchFormValues>({
    resolver,
  });

  const onSearch = (data: SearchFormValues) => {
    history.push('/database/search/results', data);
  };

  return (
    <div className="organisation-search-wrapper">
      <div className="organisation-search-card">
        <img src={logo} alt="Pawfect logo" className="logo" />

        <form onSubmit={handleSubmit(onSearch)} className="search-form">
          <div className="row">
            <div className="col-md-4">
              <Input
                {...register('petChipNumber')}
                type="text"
                placeholder="Pet Chip Number"
                inputStyle="background-light"
                inputSize="large"
                error={errors.petChipNumber}
              />
            </div>

            <div className="col-md-4 mt-4 mt-md-0">
              <Input
                {...register('userAccountNumber')}
                type="text"
                placeholder="User Account Number"
                inputStyle="background-light"
                inputSize="large"
                error={errors.userAccountNumber}
              />
            </div>

            <div className="col-md-4 mt-4 mt-md-0">
              <Button
                onClick={() => {}}
                title="Search"
                type="submit"
                color="secondary"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="mt-4">- or -</div>

      <div className="mt-4">
        <Button
          onClick={() => setQrModalVisible(true)}
          title="Scan QR Code"
          type="button"
          color="tertiary"
          style={{ width: '100%' }}
        />
      </div>

      <ScanQrCodeModal
        isOpen={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        onSuccess={(microchipNumber) => {
          setQrModalVisible(false);
          setValue('petChipNumber', microchipNumber);
          onSearch(getValues());
        }}
      />
    </div>
  );
};

export default OrganisationSearchPage;
