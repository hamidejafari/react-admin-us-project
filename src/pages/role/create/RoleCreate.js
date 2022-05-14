import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import permissions from "../../../utiles/permissions";
import axiosInstance from "../../../utiles/axiosInstance";

const RoleCreate = () => {
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [fetchCategoryLoading, setFetchCategoryLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedPermission, setSelectedPermission] = useState(null);

  const navigate = useNavigate();

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

        selectedPermission.forEach((element) => {
          formPermission.push(element.value);
        });
        formData.append("frontPermissions", JSON.stringify(formPermission));

        const formBackPermission = [];

        selectedPermission.forEach((element) => {
          element.back.forEach((back) => {
            formBackPermission.push({ url: back.url, method: back.method });
          });
        });
        formData.append("backPermissions", JSON.stringify(formBackPermission));
      }

      if (selectedCategory) {
        const formCategory = [];

        selectedCategory.forEach((cat, index) => {
          formCategory.push({ _id: cat.value });
        });
        formData.append("categories", JSON.stringify(formCategory));
      }

      await axiosInstance.post("/admin/roles", formData);

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

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <div className="card mb-12rem">
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
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default RoleCreate;
