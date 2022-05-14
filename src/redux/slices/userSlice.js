import axiosInstance from "../../utiles/axiosInstance";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
} from "../constants/userConstant";
import Cookies from "js-cookie";

export default function userReducer(
  state = { user: {}, loading: false, error: {} },
  action
) {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { user: {}, error: {} };
    default:
      return state;
  }
}

export const getUserDetails = async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    if (!Cookies.get('admin-token')) {
      return;
    }

    const { data } = await axiosInstance.get("/admin-details");

    data.routes = [];

    if (Array.isArray(data.permissions)) {
      data.permissions.forEach((element) => {
        data.routes = [...data.routes, ...element.frontPermissions];
      });
    }
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response,
    });
  }
};
