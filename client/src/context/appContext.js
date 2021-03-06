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
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
} from './actions';
import reducer from './reducers';

// MARK: LOCAL STORAGE
const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const userLocation = localStorage.getItem('location');

const initialState = {
  // MARK: GLOBAL STATE
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  showSidebar: false,

  // MARK: USER STATE
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',

  // MARK: SINGLE JOB STATE
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',

  // MARK: ALL JOBS STATE
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,

  // MARK: STATS STATE
  stats: {},
  monthlyApplications: [],

  // MARK: SEARCH FILTERS
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
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
    const { page, search, searchStatus, searchType, sort } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }

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
      // logoutUser();
    }
    clearAlert();
  }

  // MARK: EDIT JOB
  function setEditJob(jobId) {
    dispatch({ type: SET_EDIT_JOB, payload: { jobId } });
  }

  async function editJob() {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { message: error.response.data.message },
      });
    }
    clearAlert();
  }

  // MARK: DELETE JOB
  async function deleteJob(jobId) {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
  }

  // MARK: SHOW STATS
  async function showStats() {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      console.log(error.response);
    }
    clearAlert();
  }

  // MARK: SEARCH FILTERS
  function clearFilters() {
    dispatch({ type: CLEAR_FILTERS });
  }

  // MARK: PAGE NUMBER
  function changePage(page) {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
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
    editJob,
    deleteJob,
    showStats,
    clearFilters,
    changePage,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
