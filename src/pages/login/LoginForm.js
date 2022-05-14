import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../utiles/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss";
import { USER_DETAILS_RESET } from "../../redux/constants/userConstant";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import Cookies from "js-cookie";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    dispatch({
      type: USER_DETAILS_RESET,
    });
    try {
      const response = await axiosInstance.post("/users/login", {
        username,
        password,
      });
      Cookies.set("admin-token", response.data.token, {
        expires: 30,
        domain: process.env.REACT_APP_COOKIE_URL,
      });

      setLoading(false);
      navigate(`/`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Cookies.get("admin-token")) {
      navigate(`/`);
    }
  }, [navigate]);

  return (
    <div className={"loginFormPage w-100"}>
      <Grid container spacing={2} className={"m-0 w-100 m-0"}>
        <Grid
          item
          xs={12}
          md={6}
          className={"p-0 h-100"}
          sx={{ flexGrow: 1, display: { md: "block", xs: "none" } }}
        >
          <Item className={"p-0 h-100 rounded-0 shadow-none authImg"}>
            <Typography
              variant="h3"
              component="div"
              gutterBottom
              color="white"
              style={{
                fontWeight: "bolder",
                margin: "0px",
                textAlign: "left",
                padding: "20px",
              }}
            >
              Brands Reviews
            </Typography>
          </Item>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className={
            "p-0 h-100 d-flex align-items-center justify-content-center bg-white"
          }
        >
          <Grid
            item
            xs={10}
            sm={7}
            md={10}
            lg={8}
            className={"p-0 m-auto"}
            style={{ margin: "auto" }}
          >
            <div className={"loginFormCard rounded-2"}>
              <form onSubmit={handleSubmit}>
                <Grid item lg={12} className={"p-1"}>
                  <Typography
                    variant="h4"
                    component="div"
                    gutterBottom
                    color="dark"
                    className={"d-flex"}
                    style={{ fontWeight: "bolder" }}
                  >
                    <LockOpenTwoToneIcon
                      style={{ marginRight: "5px", fontSize: "40px" }}
                    />
                    Login
                  </Typography>
                </Grid>
                <Grid item lg={12} className={"p-1"}>
                  <Box
                    sx={{
                      "& > :not(style)": { m: 0, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      label="username"
                      variant="outlined"
                      placeholder="email or phone"
                    />
                  </Box>
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.username) &&
                      errorMessage?.username.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </Grid>
                <Grid item lg={12} className={"p-1"}>
                  <Box
                    sx={{
                      "& > :not(style)": { m: 0, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="password"
                      variant="outlined"
                      placeholder="******"
                    />
                  </Box>
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.password) &&
                      errorMessage?.password.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </Grid>
                <Grid item lg={12} className={"p-1"}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className={"w-100"}
                  >
                    login
                  </Button>
                </Grid>
              </form>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginForm;
