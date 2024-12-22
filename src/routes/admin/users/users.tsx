import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserStatusEnum } from '../../../api/api';
import eyeIcon from '../../../assets/images/eye.png';
import AddUserModal from '../../../components/AddUserModal';
import Button from '../../../components/Button';
import Table from '../../../components/Table';
import { TableColumn, TableData } from '../../../components/Table/Table';
import adminUsersService from '../../../services/adminUsersService';
import useQuery from '../../../utils/use-query';
import styles from './users.module.scss';

interface TableRow {
  id: number;
  name: string;
  passportNumber: string;
  status: UserStatusEnum;
}

interface PetsTableData extends TableData<TableRow> {
  loading: boolean;
}

const AdminUsersPage = () => {
  const [tableData, setTableData] = useState<PetsTableData>({
    results: [],
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
    query: undefined,
    sort: undefined,
    loading: false,
  });

  const [addUserModalVisible, setAddUserModalVisible] = useState(false);

  const urlQuery = useQuery();

  const columns: TableColumn[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Passport No',
      accessor: 'passportNumber',
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
      Cell: (cell) => {
        const status = (cell.row.original as TableRow).status;
        let elem: ReactElement | null = null;

        switch (status) {
          case UserStatusEnum.NotVerified:
            elem = <div className="status status--not-verified">Pending</div>;
            break;
          case UserStatusEnum.Verified:
            elem = <div className="status status--verified">Verified</div>;
            break;
          case UserStatusEnum.Deceased:
            elem = <div className="status status--declined">Deceased</div>;
            break;
          case UserStatusEnum.Expired:
            elem = <div className="status status--declined">Expired</div>;
            break;
          default:
            break;
        }

        return elem;
      },
    },
    {
      Header: 'Actions',
      Cell: (cell) => {
        const id = (cell.row.original as TableRow).id;

        return (
          <>
            <Link to={`/admin/users/${id}`} className={styles.actionButton}>
              <img src={eyeIcon} alt="See details" />
            </Link>
          </>
        );
      },
    },
  ];

  const loadPage = ({
    page = tableData.currentPage,
    pageSize = tableData.pageSize,
    sort = tableData.sort,
    query = tableData.query,
  }: {
    page?: number;
    pageSize?: number;
    sort?: { column: string; desc: boolean };
    query?: string;
  }) => {
    setTableData({
      ...tableData,
      results: [],
      query,
      sort,
      loading: true,
    });

    let filter;

    const queryStatus = urlQuery.get('status');

    if (queryStatus) {
      filter = JSON.stringify({
        status: [UserStatusEnum[queryStatus as any]],
      });
    }

    adminUsersService
      .get({
        page,
        pageSize: pageSize || 10,
        query,
        orderByKey: sort?.column,
        isDescending: sort?.desc,
        filter,
      })
      .then(
        (res) => {
          const results: TableRow[] =
            res.results?.map((x) => ({
              id: x.id || 0,
              name: [x.name, x.surname].join(' ') || '-',
              passportNumber: x.passportNo || '-',
              status: x.status || UserStatusEnum.NotVerified,
            })) || [];

          setTableData({
            results,
            totalPages: res.totalPages || 0,
            currentPage: res.page || 0,
            pageSize: res.pageSize || 0,
            query,
            sort,
            loading: false,
          });
        },
        () => {
          setTableData({
            ...tableData,
            loading: false,
          });
        }
      );
  };

  useEffect(() => {
    loadPage({
      page: 1,
    });
  }, []);

  return (
    <div className="app-page-wrapper">
      <div className="page-card">
        <div className="page-header">
          <h3>Users</h3>
          <div className="page-header__actions">
            <Button
              onClick={() => setAddUserModalVisible(true)}
              title="Add new"
              size="small"
            />
          </div>
        </div>
        <div className="page-content">
          <Table
            columns={columns}
            data={tableData}
            isLoading={tableData.loading}
            onPageChange={(page, pageSize) => loadPage({ page, pageSize })}
            onSearchChange={(query) => loadPage({ page: 1, query })}
            onSortChange={(sort) => loadPage({ page: 1, sort })}
          />

          <AddUserModal
            isOpen={addUserModalVisible}
            onFinish={() => {
              setAddUserModalVisible(false);
              loadPage({ page: 1 });
            }}
            onCancel={() => setAddUserModalVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
