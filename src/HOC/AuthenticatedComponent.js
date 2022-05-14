import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { USER_DETAILS_RESET } from "../redux/constants/userConstant";
import { getUserDetails } from "../redux/slices/userSlice";
import Cookies from "js-cookie";

export function requireAuthentication(Component) {
  return function AuthenticatedComponent(props) {
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRole = useSelector(
      (state) => state.user?.user?.role,
      shallowEqual
    );
    const userId = useSelector((state) => state.user?.user?._id, shallowEqual);
    const fetchUserErrorStatus = useSelector(
      (state) => state.user?.error?.status,
      shallowEqual
    );
    const userLoading = useSelector(
      (state) => state.user.loading,
      shallowEqual
    );

    useEffect(() => {
      if (fetchUserErrorStatus && fetchUserErrorStatus === 401) {
        Cookies.remove("admin-token", {
          domain: process.env.REACT_APP_COOKIE_URL,
        });

        dispatch({
          type: USER_DETAILS_RESET,
        });

        navigate(`/login`);
      }
    }, [fetchUserErrorStatus, navigate, dispatch]);

    useEffect(() => {
      if (!Cookies.get("admin-token")) {
        navigate(`/login`);
      }
      if (!userId) {
        dispatch(getUserDetails);
      } else if (userRole === "admin") {
        setIsAdmin(true);
      } else {
        Cookies.remove("admin-token", {
          domain: process.env.REACT_APP_COOKIE_URL,
        });
        dispatch({
          type: USER_DETAILS_RESET,
        });
        navigate(`/login`);
      }
    }, [userRole, userId, dispatch, navigate]);

    const userLoadingSpinner = (
      <div>
        <Backdrop
          sx={{ bgcolor: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
    );

    return (
      <div>
        {userLoading ? (
          userLoadingSpinner
        ) : isAdmin === true ? (
          <Component {...props} />
        ) : null}
      </div>
    );
  };
}

export default requireAuthentication;
