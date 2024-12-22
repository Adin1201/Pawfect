import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Truncate from 'react-truncate-html';
import penIcon from '../../../assets/images/pen.png';
import trashcanIcon from '../../../assets/images/trashcan.png';
import Button from '../../../components/Button';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { TableData } from '../../../components/Table/Table';
import TableHeader from '../../../components/TableHeader';
import TablePagination from '../../../components/TablePagination/index';
import adminFaqService from '../../../services/adminFaqService';
import styles from './faq.module.scss';

interface TableRow {
  id: number;
  question: string;
  answer: string;
}

interface PetsTableData extends TableData<TableRow> {
  loading: boolean;
}

const AdminFaqPage = () => {
  const [tableData, setTableData] = useState<PetsTableData>({
    results: [],
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
    query: undefined,
    sort: undefined,
    loading: false,
  });

  const [confirmationModal, setConfirmationModal] = useState<{
    id?: number;
    visible: boolean;
    pending: boolean;
  }>({
    id: undefined,
    visible: false,
    pending: false,
  });

  const history = useHistory();

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

    adminFaqService
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
              question: x.question || '',
              answer: x.answer || '',
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

  const deleteFaq = (id: number) => {
    setConfirmationModal({
      ...confirmationModal,
      pending: true,
    });

    adminFaqService.deleteById(id).then(
      () => {
        setConfirmationModal({
          id: undefined,
          visible: false,
          pending: false,
        });

        toast.success('Successfully deleted FAQ.');
        loadPage({ page: 1 });
      },
      () => {
        setConfirmationModal({
          id: undefined,
          visible: false,
          pending: false,
        });
      }
    );
  };

  const confirmDeletion = (id: number) => {
    setConfirmationModal({
      id,
      visible: true,
      pending: false,
    });
  };

  return (
    <div className="app-page-wrapper">
      <div className="page-card">
        <div className="page-header">
          <h3>FAQ</h3>

          <div className="page-header__actions">
            <Button
              onClick={() => history.push('/admin/faq/new')}
              title="Add new"
              size="small"
            />
          </div>
        </div>
        <div className="page-content">
          <TableHeader
            onPageSizeChange={(pageSize) => loadPage({ page: 1, pageSize })}
            onSearchChange={(query) => loadPage({ page: 1, query })}
          />

          <div className="my-4">
            {tableData.loading && <div className="spinner" />}

            {!tableData.loading && !tableData.results.length && (
              <div className={styles.emptyMessage}>No data found.</div>
            )}

            {tableData.results.map((x) => {
              return (
                <div key={x.id} className={styles.resultItem}>
                  <div className={styles.resultItemContent}>
                    <h3>{x.question}</h3>
                    <Truncate
                      lines={3}
                      dangerouslySetInnerHTML={{
                        __html: x.answer,
                      }}
                    />
                  </div>

                  <div className={styles.resultItemActions}>
                    <Link
                      to={`/admin/faq/${x.id}`}
                      className={styles.actionButton}
                    >
                      <img src={penIcon} alt="See details" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => confirmDeletion(x.id)}
                      className={styles.actionButton}
                    >
                      <img src={trashcanIcon} alt="See details" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <TablePagination
            totalPages={tableData.totalPages}
            currentPage={tableData.currentPage}
            onPageChange={(page) => loadPage({ page })}
          />

          <ConfirmModal
            isOpen={confirmationModal.visible}
            onConfirm={() => deleteFaq(confirmationModal.id || 0)}
            loading={confirmationModal.pending}
            onCancel={() =>
              setConfirmationModal({
                id: undefined,
                visible: false,
                pending: false,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AdminFaqPage;
