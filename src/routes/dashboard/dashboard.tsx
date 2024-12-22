import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PetResponseDtoPagedResponse } from '../../api';
import addNewPetImg from '../../assets/images/add-new-pet.png';
import AddPetModal from '../../components/AddPetModal';
import Button from '../../components/Button';
import MyPetCard from '../../components/MyPetCard';
import UserOnboardingModal from '../../components/UserOnboardingModal';
import { AppState } from '../../redux/rootReducer';
import usersPetService from '../../services/usersPetService';
import useStateCallback from '../../utils/use-state-callback';
import './dashboard.scss';

interface State {
  petsData: PetResponseDtoPagedResponse;
  showAddPetModal: boolean;
  showUserOnbardingModal: boolean;
  pending: boolean;
}

export default function Dashboard() {
  const [state, setState] = useStateCallback<State>({
    petsData: {},
    showAddPetModal: false,
    showUserOnbardingModal: false,
    pending: true,
  });

  const history = useHistory();

  const isUserOnboarded = useSelector(
    (state: AppState) => state.auth.user?.isOnboarded
  );

  const loadPets = (loadMore?: boolean) => {
    let page = state.petsData?.page || 1;

    if (loadMore) {
      const nextPage = page + 1;

      if (nextPage <= (state.petsData?.totalPages || 0)) {
        page = nextPage;
      } else {
        return;
      }
    }

    usersPetService
      .get({
        page,
      })
      .then(
        (res) => {
          setState((currentState) => ({
            ...currentState,
            petsData: {
              ...res,
              results:
                page > 1
                  ? [
                      ...(currentState.petsData?.results || []),
                      ...(res.results || []),
                    ]
                  : res.results,
            },
            pending: false,
          }));
        },
        () => {
          setState((currentState) => ({
            ...currentState,
            pending: false,
          }));
        }
      );
  };

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (isUserOnboarded !== undefined && !isUserOnboarded) {
      setState({ ...state, showUserOnbardingModal: true });
    }
  }, [isUserOnboarded]);

  const onAddPetFinish = () => {
    setState({ ...state, showAddPetModal: false });
  };

  return (
    <div className="dashboard-page">
      {/* <div className="title-container title-container-bg">
        <span className="user-pet-text">
          User info -{' '}
          <span style={{ fontWeight: 400 }}>Lorem ipsum dolor sit amet</span>
        </span>
        <img
          src={exclamationImg}
          className="exclamation-img"
          alt="Exclamation icon"
        />
      </div>
      <div className="title-container title-container-bg">
        <span className="user-pet-text">
          Pet info -{' '}
          <span style={{ fontWeight: 400 }}>Lorem ipsum dolor sit amet</span>
        </span>
        <img
          src={exclamationImg}
          className="exclamation-img"
          alt="Exclamation icon"
        />
      </div> */}

      <div className="title-container" style={{ marginBottom: 24 }}>
        <span className="title-text">MY PETS</span>
      </div>

      {state.pending && <div className="spinner" />}
      {state.petsData.results && (
        <div className="row row-pets">
          {state.petsData.results?.map((item) => {
            return (
              <div key={item.id} className="col-auto mb-4">
                <MyPetCard
                  petData={item}
                  onClick={() => {
                    history.push(`/pets/${item.id}`);
                  }}
                />
              </div>
            );
          })}
          <div className="col-auto">
            <div
              onClick={() => setState({ ...state, showAddPetModal: true })}
              role="presentation"
              className="add-new-pet"
            >
              <img
                className="add-new-pet-img"
                src={addNewPetImg}
                alt="Add new pet"
              />
              <span className="add-new-pet-text">Add new pet</span>
            </div>
          </div>
        </div>
      )}

      {(state.petsData?.page || 0) < (state.petsData?.totalPages || 0) && (
        <div className="d-flex justify-content-center mt-4">
          <Button
            title="Load more"
            onClick={() => loadPets(true)}
            color="secondary"
            size="medium"
          />
        </div>
      )}

      <AddPetModal
        isOpen={state.showAddPetModal}
        onFinish={() => onAddPetFinish()}
        onCancel={() => setState({ ...state, showAddPetModal: false })}
      />

      <UserOnboardingModal
        isOpen={state.showUserOnbardingModal}
        onFinish={() => setState({ ...state, showUserOnbardingModal: false })}
        onCancel={() => setState({ ...state, showUserOnbardingModal: false })}
      />
    </div>
  );
}
