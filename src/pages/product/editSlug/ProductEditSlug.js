import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";

import axiosInstance from "../../../utiles/axiosInstance";
import useGetData from "../../../hooks/useGetData";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";
import AppModal from "../../../components/UI/AppModal/AppModal";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";

const ProductEditSlug = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [initialSlug, setInitialSlug] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { _id } = useParams();
  const { loading: fetchBrandloading, data: product, getData } = useGetData();

  useEffect(() => {
    getData("/admin/products/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!product) {
      return;
    }
    setTitle(product.title);
    setSlug(product.slug);
    setInitialSlug(product.slug);
    if (product.image?.fileName) {
      setImage(
        process.env.REACT_APP_BACKEND_API_URL +
          "/files/images/main/" +
          product.image.fileName
      );
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleConfirm = async (e) => {
    setLoading(true);
    setErrorMessage({});
    setModalOpen(false);
    try {
      const formData = new FormData();

      formData.append("slug", slug);
      await axiosInstance.patch(
        "/admin/products/" + _id + "/slug-edit",
        formData
      );

      setLoading(false);

      toast.success("created successfully.");
      navigate("/products");
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-large">
          <ConfirmModal
            setOpen={setModalOpen}
            content={
              <div>
                this action will create a redirect from{" "}
                <span className="px-2 color-orange-500">{initialSlug}</span> to
                <span className="px-2 color-green-500">{slug}</span>
              </div>
            }
            header={"are you sure?"}
            accept={handleConfirm}
          />
        </AppModal>
        <Grid item xs={12}>
          <div className="card mb-12rem">
            {fetchBrandloading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="title">
                        Name
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.title) ? "is-invalid" : ""
                        }`}
                        id="title"
                        value={title}
                        onChange={(e) =>
                          setTitle(capitalize_first_letter(e.target.value, " "))
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.title) &&
                          errorMessage?.title.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="slug">
                        Slug (URL)
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.slug) ? "is-invalid" : ""
                        }`}
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                      />

                      <div className="text-danger">
                        {Array.isArray(errorMessage?.slug) &&
                          errorMessage?.slug.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  {image && 

                  <Grid item xs={12} md={6}>
                    <img src={image} alt="" width="100" />
                  </Grid>}

                  <Grid item xs={12}>
                    <div className="d-flex">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                      >
                        <CheckCircleTwoToneIcon
                          style={{ marginLeft: "15px" }}
                        />
                        Submit
                      </Button>
                      {loading ? (
                        <CircularProgress className="me-3" color="inherit" />
                      ) : null}
                    </div>
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

export default ProductEditSlug;
