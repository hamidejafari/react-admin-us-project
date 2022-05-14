import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import Select from "react-select";

import axiosInstance from "../../../utiles/axiosInstance";
import useGetData from "../../../hooks/useGetData";

const CategoryCreate = () => {
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [fethcRoleLoading, setFethcRoleLoading] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const navigate = useNavigate();

  const { _id } = useParams();

  const { loading: fetchUserloading, data: user, getData } = useGetData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const data = {
        name,
        family,
        phoneNumber,
        password,
        confirmationPassword,
      };

      if (selectedRole) {
        const formRole = [];

        selectedRole.forEach((cat, index) => {
          formRole.push({ _id: cat.value });
        });

        data.permissions = JSON.stringify(formRole);
      }

      await axiosInstance.put("/admin/update-admin/" + _id, data);
      setLoading(false);

      toast.success("Updated successfully.");
      navigate("/admins");
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  const roles = async () => {
    setFethcRoleLoading(true);
    const { data } = await axiosInstance.get("/admin/roles");

    setFethcRoleLoading(false);

    const opt = [];

    for (const e of data) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }

    setRoleOptions(opt);
  };

  useEffect(() => {
    roles();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    setPhoneNumber(user.phoneNumber);
    setName(user.name);
    setFamily(user.family);
    if (Array.isArray(user.permissions)) {
      const oldSelectedRoles = [];
      user.permissions.forEach((el) => {
        oldSelectedRoles.push({ label: el.title, value: el._id });
      });
      setSelectedRole(oldSelectedRoles);
    }
  }, [user]);

  useEffect(() => {
    getData("/admin/users/" + _id);
  }, [getData, _id]);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <div className="card mb-12rem">
            {fetchUserloading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    className={`form-input ${
                      Array.isArray(errorMessage?.name) ? "is-invalid" : ""
                    }`}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.name) &&
                      errorMessage?.name.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="family">
                    Family
                  </label>
                  <input
                    className={`form-input ${
                      Array.isArray(errorMessage?.family) ? "is-invalid" : ""
                    }`}
                    id="family"
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.family) &&
                      errorMessage?.family.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    className={`form-input ${
                      Array.isArray(errorMessage?.phoneNumber)
                        ? "is-invalid"
                        : ""
                    }`}
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.phoneNumber) &&
                      errorMessage?.phoneNumber.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>

                <div style={{ zIndex: 3 }} className="mb-3 position-relative">
                  <label className="form-label" htmlFor="role">
                    Role
                  </label>
                  <Select
                    id="role"
                    isLoading={fethcRoleLoading}
                    value={selectedRole}
                    onChange={(selectedRole) => {
                      setSelectedRole(selectedRole);
                    }}
                    options={roleOptions}
                    isClearable
                    isMulti
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.role) &&
                      errorMessage?.role.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className={`form-input ${
                      Array.isArray(errorMessage?.password) ? "is-invalid" : ""
                    }`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.password) &&
                      errorMessage?.password.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="confirmationPassword">
                    Confirmation Password
                  </label>
                  <input
                    className={`form-input ${
                      Array.isArray(errorMessage?.confirmationPassword)
                        ? "is-invalid"
                        : ""
                    }`}
                    id="confirmationPassword"
                    value={confirmationPassword}
                    onChange={(e) => setConfirmationPassword(e.target.value)}
                    type="password"
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.confirmationPassword) &&
                      errorMessage?.confirmationPassword.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>
                <div className="d-flex">
                  <Button type="submit" variant="contained" disabled={loading}>
                    Submit
                  </Button>
                  {loading ? (
                    <CircularProgress className="me-3" color="inherit" />
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CategoryCreate;
