import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { LiabilityFormResponseDto } from '../../api';
import Button from '../../components/Button';
import usersLiabilityFormService from '../../services/usersLiabilityFormService';
import useStateCallback from '../../utils/use-state-callback';
import './liabilityForm.scss';

const LiabilityForm = () => {
  const [state, setState] = useStateCallback<{
    liabilityFormData: LiabilityFormResponseDto[];
    selectedTab: number;
    selectedTabIndex: number;
    pending: boolean;
  }>({
    liabilityFormData: [],
    selectedTab: 0,
    selectedTabIndex: 0,
    pending: false,
  });

  useEffect(() => {
    setState({ ...state, pending: true });

    usersLiabilityFormService.get().then(
      (res) => {
        setState({
          ...state,
          liabilityFormData: res,
          selectedTab: res[0].id || -1,
          pending: false,
        });
      },
      () => setState({ ...state, pending: false })
    );
  }, []);

  return (
    <div className="liability-form-page">
      {state.pending && <div className="spinner" />}
      {state.liabilityFormData && (
        <div className="liability-content-card">
          <div className="card-header">
            <div className="row">
              <div className="col-md ">
                {state.liabilityFormData.map((item, index) => {
                  const selected = state.selectedTab === item.id;
                  return (
                    <button
                      type="button"
                      onClick={() =>
                        setState({
                          ...state,
                          selectedTab: item.id || -1,
                          selectedTabIndex: index,
                        })
                      }
                      className={
                        selected
                          ? 'header-tab-button header-tab-button-active'
                          : 'header-tab-button'
                      }
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {state.liabilityFormData.length > 0 && state.selectedTab && (
            <div className="description-wrapper">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    state.liabilityFormData[state.selectedTabIndex]
                      .description || '',
                }}
              />

              {state.liabilityFormData[state.selectedTabIndex].document && (
                <Button
                  title="Download PDF"
                  color="tertiary"
                  size="small"
                  className="mt-4"
                  onClick={() =>
                    window.open(
                      state.liabilityFormData[state.selectedTabIndex]
                        .document || '',
                      '_blank'
                    )
                  }
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiabilityForm;
