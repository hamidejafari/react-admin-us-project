import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import { useParams } from "react-router";

import permissions from "../../../utiles/permissions";
import axiosInstance from "../../../utiles/axiosInstance";
import useGetData from "../../../hooks/useGetData";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../../redux/slices/userSlice";

const RoleCreate = () => {
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [fetchCategoryLoading, setFetchCategoryLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedPermission, setSelectedPermission] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { _id } = useParams();

  const { loading: fetchRoleloading, data: role, getData } = useGetData();

  const categories = async () => {
    setFetchCategoryLoading(true);
    const { data } = await axiosInstance.get("/admin/category-level-one");

    setFetchCategoryLoading(false);

    const opt = [];

    for (const e of data) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }

    setCategoryOptions(opt);
  };

  useEffect(() => {
    categories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formData = new FormData();
      formData.append("title", title);

      if (selectedPermission) {
        const formPermission = [];

        selectedPermission.forEach((cat, index) => {
          formPermission.push({ _id: cat.value });
        });
        formData.append("frontPermissions", JSON.stringify(formPermission));
      }

      if (selectedCategory) {
        const formCategory = [];

        selectedCategory.forEach((cat, index) => {
          formCategory.push(cat.value);
        });
        formData.append("categories", JSON.stringify(formCategory));
      }

      await axiosInstance.put("/admin/roles/" + _id, formData);

      dispatch(getUserDetails);

      setLoading(false);

      toast.success("Created Successfully.");
      navigate("/roles/");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getData("/admin/roles/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!role) {
      return;
    }
    setTitle(role.title);

    if (Array.isArray(role.frontPermissions)) {
      const oldPermissions = [];
      role.frontPermissions.forEach((element) => {
        const permission = permissions.find((el) => el.value === element);
        oldPermissions.push(permission);
      });

      setSelectedPermission(oldPermissions);
    }

    if (Array.isArray(role.categories)) {
      const oldCategory = [];
      role.categories.forEach((element) => {
        oldCategory.push({ value: element._id, label: element.title });
      });

      setSelectedCategory(oldCategory);
    }
  }, [role]);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <div className="card mb-12rem">
            {fetchRoleloading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="title">
                    Name
                  </label>
                  <input
                    className={`form-input ${
                      Array.isArray(errorMessage?.title) ? "is-invalid" : ""
                    }`}
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.title) &&
                      errorMessage?.title.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>

                <Grid item xs={12} md={12}>
                  <div style={{ zIndex: 6 }} className="mb-3 position-relative">
                    <label className="form-label" htmlFor="role">
                      Permissions
                    </label>
                    <Select
                      id="role"
                      value={selectedPermission}
                      onChange={(selectedPermission) => {
                        setSelectedPermission(selectedPermission);
                      }}
                      options={permissions}
                      isClearable
                      isMulti
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.permission) &&
                        errorMessage?.permission.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={12}>
                  <div style={{ zIndex: 3 }} className="mb-3 position-relative">
                    <label className="form-label" htmlFor="role">
                      Category
                    </label>
                    <Select
                      id="role"
                      isLoading={fetchCategoryLoading}
                      value={selectedCategory}
                      onChange={(selectedCategory) => {
                        setSelectedCategory(selectedCategory);
                      }}
                      options={categoryOptions}
                      isClearable
                      isMulti
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.category) &&
                        errorMessage?.category.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

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

export default RoleCreate;
