import axiosInstance from "../../utiles/axiosInstance";
import {
  COUNT_REQUEST,
  COUNT_SUCCESS,
  COUNT_FAIL,
} from "../constants/countConstant";

export default function countReducer(
  state = { count: null, loading: false, error: {} },
  action
) {
  switch (action.type) {
    case COUNT_REQUEST:
      return { ...state, loading: true };
    case COUNT_SUCCESS:
      return { loading: false, ...action.payload };
    case COUNT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const getCountAction = async (dispatch, getState) => {
  try {
    dispatch({ type: COUNT_REQUEST });

    let { data } = await axiosInstance.get("/admin/sidebar-badges");

    data.reviewCounts =
      data.productReviewsCount + data.brandReviewsCount + data.blogReviewsCount;

    dispatch({
      type: COUNT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUNT_FAIL,
      payload: error.response,
    });
  }
};
