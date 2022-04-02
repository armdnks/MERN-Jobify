import React, { useReducer, useContext } from 'react';
import axios from 'axios';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  TOGGLE_SIDEBAR,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
} from './actions';
import reducer from './reducers';

// MARK: INITIAL STATE
const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const userLocation = localStorage.getItem('location');

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  showSidebar: false,

  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',

  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'intership'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',

  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // MARK: AXIOS SETUP
  const authFetch = axios.create({ baseURL: '/api/v1' });
  // REQUEST INTERCEPTORS
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // RESPONSE INTERCEPTORS
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response);
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // MARK: GLOBAL FUNCTION
  function displayAlert() {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  }

  function clearAlert() {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  }

  function toggleSidebar() {
    dispatch({ type: TOGGLE_SIDEBAR });
  }

  function handleChange({ name, value }) {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  }

  function clearValues() {
    dispatch({ type: CLEAR_VALUES });
  }

  // MARK: LOCAL STORAGE
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('location');
  };

  // MARK: SETUP USER
  async function setupUser({ currentUser, endPoint, alertText }) {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(`api/v1/auth/${endPoint}`, currentUser);
      const { user, token, location } = data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });

      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { message: error.response.data.message },
      });
    }
    clearAlert();
  }

  // MARK: LOGOUT USER
  function logoutUser() {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  }

  // MARK: UPDATE USER
  async function updateUser(currentUser) {
    dispatch({ type: UPDATE_USER_BEGIN });

    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, token, location } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, location },
      });

      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { message: error.response.data.message },
        });
      }
    }
    clearAlert();
  }

  // MARK: CREATE JOB
  async function createJob() {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      console.log(error.response);

      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { message: error.response.data.message },
      });
    }
    clearAlert();
  }

  // MARK: GET ALL JOBS
  async function getJobs() {
    let url = `/jobs`;
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
    clearAlert();
  }

  // MARK: EDIT JOB
  function setEditJob(id) {
    console.log(`SET EDIT JOB : ${id}`);
  }

  // MARK: DELETE JOB
  function deleteJob(id) {
    console.log(`DELETE : ${id}`);
  }

  const value = {
    ...state,
    displayAlert,
    toggleSidebar,
    handleChange,
    clearValues,
    setupUser,
    updateUser,
    logoutUser,
    createJob,
    getJobs,
    setEditJob,
    deleteJob,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
