import axiosInstance from "../../utiles/axiosInstance";
import {
  FLAG_REQUEST,
  FLAG_SUCCESS,
  FLAG_FAIL,
} from "../constants/flagConstant";

export default function flagReducer(
  state = { flags: null, loading: false, error: {} },
  action
) {
  switch (action.type) {
    case FLAG_REQUEST:
      return { ...state, loading: true };
    case FLAG_SUCCESS:
      return { loading: false, flags: action.payload };
    case FLAG_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const getFlagsAction = async (dispatch, getState) => {
  try {
    dispatch({ type: FLAG_REQUEST });

    const { data } = await axiosInstance.get("/admin/flags");

    dispatch({
      type: FLAG_SUCCESS,
      payload: data?.data,
    });
  } catch (error) {
    dispatch({
      type: FLAG_FAIL,
      payload: error.response,
    });
  }
};
