import React, { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Column } from 'react-table';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import {
  MedicalStatusEnum,
  UserRoleEnum,
  UserStatusEnum,
} from '../../../api/api';
import eyeIcon from '../../../assets/images/eye.png';
import petIcon from '../../../assets/images/pet-icon.png';
import userIcon from '../../../assets/images/user-icon.png';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import ScanQrCodeModal from '../../../components/ScanQrCodeModal';
import Table from '../../../components/Table';
import { TableData } from '../../../components/Table/Table';
import organisationSearchService from '../../../services/organisationSearchService';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import SavePet from '../../savePet/savePet';
import UserProfile from '../../userProfile/userProfile';
import './organisationSearchResults.scss';

type SearchFormValues = {
  petChipNumber: string;
  userAccountNumber?: string;
};

interface TableRow {
  id: number;
  userName: string;
  petName: string;
  microchipNumber: string;
  passportNumber: string;
  finalStatus: MedicalStatusEnum;
  userStatus?: UserStatusEnum;
  userId?: number;
}

interface OrganisationSearchTableData extends TableData<TableRow> {
  loading: boolean;
}

const OrganisationSearchResultsPage = () => {
  const [showingState, setShowingState] = useState<{
    userId: number | null;
    petId: number | null;
  }>({
    userId: null,
    petId: null,
  });

  const [qrModalVisible, setQrModalVisible] = useState(false);

  const location = useLocation<SearchFormValues>();
  const history = useHistory();

  const onlyPetColumns: Column[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Pet name',
      accessor: 'petName',
    },
    {
      Header: 'Microchip No.',
      accessor: 'microchipNumber',
    },
    {
      Header: 'Passport No.',
      accessor: 'passportNumber',
    },
    {
      Header: 'Pet status',
      Cell: (cell) => {
        const status = (cell.row.original as TableRow).finalStatus;
        let elem: ReactElement | null = null;

        switch (status) {
          case MedicalStatusEnum.NotVerified:
            elem = <div className="status status--not-verified">Pending</div>;
            break;
          case MedicalStatusEnum.Verified:
            elem = <div className="status status--verified">Verified</div>;
            break;
          case MedicalStatusEnum.Declined:
            elem = <div className="status status--declined">Declined</div>;
            break;
          case MedicalStatusEnum.Expired:
            elem = <div className="status status--declined">Expired</div>;
            break;
          default:
            break;
        }

        return elem;
      },
    },
    {
      Header: 'Preview',
      Cell: (cell) => {
        const petId = (cell.row.original as TableRow).id || 0;

        return (
          <button
            type="button"
            className="action-button"
            onClick={() => setShowingState({ userId: null, petId })}
          >
            <img src={eyeIcon} alt="See Pet details" />
          </button>
        );
      },
    },
  ];

  const petAndUserColumns: Column[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'userName',
    },
    {
      Header: 'Status',
      Cell: (cell) => {
        const status = (cell.row.original as TableRow).userStatus;
        let elem: ReactElement | null = null;

        switch (status) {
          case UserStatusEnum.NotVerified:
            elem = <div className="status status--not-verified">Pending</div>;
            break;
          case UserStatusEnum.Verified:
            elem = <div className="status status--verified">Verified</div>;
            break;
          case UserStatusEnum.Deceased:
            elem = <div className="status status--deceased">Deceased</div>;
            break;
          default:
            break;
        }

        return elem;
      },
    },
    {
      Header: 'Pet name',
      accessor: 'petName',
    },
    {
      Header: 'Microchip No.',
      accessor: 'microchipNumber',
    },
    {
      Header: 'Pet status',
      Cell: (cell) => {
        const status = (cell.row.original as TableRow).finalStatus;
        let elem: ReactElement | null = null;

        switch (status) {
          case MedicalStatusEnum.NotVerified:
            elem = <div className="status status--not-verified">Pending</div>;
            break;
          case MedicalStatusEnum.Verified:
            elem = <div className="status status--verified">Verified</div>;
            break;
          case MedicalStatusEnum.Declined:
            elem = <div className="status status--declined">Declined</div>;
            break;
          case MedicalStatusEnum.Expired:
            elem = <div className="status status--declined">Expired</div>;
            break;
          default:
            break;
        }

        return elem;
      },
    },
    {
      Header: 'Preview',
      Cell: (cell) => {
        const userId = (cell.row.original as TableRow).userId || 0;
        const petId = (cell.row.original as TableRow).id || 0;

        return (
          <>
            <button
              type="button"
              className="action-button"
              onClick={() => setShowingState({ petId: null, userId })}
            >
              <img src={userIcon} alt="See User details" />
            </button>
            <button
              type="button"
              className="action-button"
              onClick={() => setShowingState({ userId: null, petId })}
            >
              <img src={petIcon} alt="See Pet details" />
            </button>
          </>
        );
      },
    },
  ];

  const [columns, setColumns] = useState<Column[]>(onlyPetColumns);

  const [tableData, setTableData] = useState<OrganisationSearchTableData>({
    results: [],
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
    loading: false,
  });

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

  useEffect(() => {
    setValue('petChipNumber', location.state?.petChipNumber);
    setValue('userAccountNumber', location.state?.userAccountNumber);
    setShowingState({
      userId: null,
      petId: null,
    });

    if (location.state) {
      setTableData({
        ...tableData,
        loading: true,
      });

      organisationSearchService
        .get({
          microchipNo: location.state.petChipNumber,
          userExternalId: location.state.userAccountNumber,
        })
        .then(
          (res) => {
            if (res.find((x) => x.userId)) {
              setColumns(petAndUserColumns);
            } else {
              setColumns(onlyPetColumns);
            }

            setTableData({
              results: res.map((x) => ({
                id: x.id || -1,
                userName: x.user?.name || '',
                petName: x.name || '',
                microchipNumber: x.microchipNo || '',
                passportNumber: x.passportNo || '',
                finalStatus: x.finalStatus || MedicalStatusEnum.NotVerified,
                userStatus: x.user?.status,
                userId: x.user?.id,
              })),
              totalPages: 1,
              currentPage: 1,
              pageSize: 1,
              loading: false,
            });
          },
          () => {
            setTableData({
              results: [],
              totalPages: 0,
              currentPage: 0,
              pageSize: 0,
              loading: false,
            });
          }
        );
    }
  }, [location.state]);

  const onSearch = (data: SearchFormValues) => {
    history.push('/database/search/results', data);
  };

  return (
    <div className="organisation-search-results">
      <div className="row">
        <div className="col-md-3">
          <form onSubmit={handleSubmit(onSearch)} className="search-form">
            <Input
              {...register('petChipNumber')}
              type="text"
              placeholder="Pet Chip Number"
              inputStyle="background-light"
              inputSize="large"
              error={errors.petChipNumber}
            />
            <Input
              {...register('userAccountNumber')}
              type="text"
              placeholder="User Account Number"
              inputStyle="background-light"
              inputSize="large"
              error={errors.userAccountNumber}
              className="mt-3"
            />
            <Button
              onClick={() => {}}
              title="Search"
              type="submit"
              color="secondary"
              style={{ width: '100%', marginTop: 16 }}
            />
            <Button
              onClick={() => setQrModalVisible(true)}
              title="Scan QR Code"
              type="button"
              color="tertiary"
              style={{ width: '100%', marginTop: 16 }}
            />
          </form>
        </div>
        <div className="col-md-9 mt-4 mt-md-0">
          {!showingState.userId && !showingState.petId && (
            <div className="table-wrapper">
              <Table
                columns={columns}
                data={tableData}
                isLoading={tableData.loading}
                showHeader={false}
              />
            </div>
          )}

          {showingState.userId && (
            <UserProfile
              userRole={UserRoleEnum.Organisation}
              editable={false}
              id={showingState.userId}
              onBackClick={() => setShowingState({ userId: null, petId: null })}
            />
          )}

          {showingState.petId && (
            <SavePet
              userRole={UserRoleEnum.Organisation}
              id={showingState.petId}
              onBackClick={() => setShowingState({ userId: null, petId: null })}
            />
          )}
        </div>
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

export default OrganisationSearchResultsPage;
