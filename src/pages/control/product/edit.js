import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import axiosInstance from "../../../utiles/axiosInstance";
import useGetData from "../../../hooks/useGetData";

const ProductControlEdit = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { _id } = useParams();

  const {
    loading: fetchBlogCategoryloading,
    data: control,
    getData,
  } = useGetData();

  useEffect(() => {
    getData("/admin/control-products/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!control) {
      return;
    }

    setNewTitle(control.newTitle);
    setNewSlug(control.newSlug);

  }, [control]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formData = new FormData();
      formData.append("newTitle", newTitle);
      formData.append("newSlug", newSlug);
      await axiosInstance.put("/admin/control-products/" + _id, formData);
      setLoading(false);
      toast.success("Updated Successfully.");
      navigate("/control-products");
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
        <Grid item xs={12}>
          <div className="card mb-12rem  ">
            {fetchBlogCategoryloading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>


                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="newTitle">
                       New Product Title
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.newTitle) ? "is-invalid" : ""
                        }`}
                        id="newTitle"
                        value={newTitle}
                        onChange={(e) =>
                          setNewTitle(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.newTitle) &&
                          errorMessage?.newTitle.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="newSlug">
                       New Product Slug
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.newSlug) ? "is-invalid" : ""
                        }`}
                        id="newSlug"
                        value={newSlug}
                        onChange={(e) =>
                            setNewSlug(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.newSlug) &&
                          errorMessage?.newSlug.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  


               


                  <Grid item xs={12} md={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      <CheckCircleTwoToneIcon style={{ marginRight: "5px" }} />
                      Submit
                    </Button>
                    {loading ? (
                      <CircularProgress className="me-3" color="inherit" />
                    ) : null}
                  </Grid>
                </Grid>
              </form>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ProductControlEdit;
