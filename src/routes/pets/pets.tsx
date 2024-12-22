import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MedicalStatusEnum } from '../../api';
import eyeIcon from '../../assets/images/eye.png';
import Table from '../../components/Table';
import { TableColumn, TableData } from '../../components/Table/Table';
import usersPetsService from '../../services/usersPetService';
import styles from './pets.module.scss';

interface TableRow {
  id: number;
  name: string;
  passportNumber: string;
  microchipNumber: string;
  finalStatus: MedicalStatusEnum;
}

interface PetsTableData extends TableData<TableRow> {
  loading: boolean;
}

const PetsPage = () => {
  const [tableData, setTableData] = useState<PetsTableData>({
    results: [],
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
    query: undefined,
    sort: undefined,
    loading: false,
  });

  const columns: TableColumn[] = [
    {
      Header: 'ID',
      accessor: 'id',
      sortable: true,
    },
    {
      Header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      Header: 'Passport No',
      accessor: 'passportNumber',
    },
    {
      Header: 'Microchip No',
      accessor: 'microchipNumber',
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
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
      Header: 'Actions',
      Cell: (cell) => {
        const id = (cell.row.original as TableRow).id;

        return (
          <>
            <Link to={`/pets/${id}`} className={styles.actionButton}>
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

    usersPetsService
      .get({
        page,
        pageSize: pageSize || 10,
        query,
        orderByKey: sort?.column,
        isDescending: sort?.desc,
      })
      .then(
        (res) => {
          const results: TableRow[] =
            res.results?.map((x) => ({
              id: x.id || 0,
              name: x.name || '',
              microchipNumber: x.microchipNo || '',
              passportNumber: x.passportNo || '',
              finalStatus: x.finalStatus || MedicalStatusEnum.NotVerified,
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
          <h3>Pets</h3>
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
        </div>
      </div>
    </div>
  );
};

export default PetsPage;
