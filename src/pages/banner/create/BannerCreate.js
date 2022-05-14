import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import axiosInstance from "../../../utiles/axiosInstance";
import DropzoneSingleImage from "../../../components/UI/DropzoneSingleImage/DropzoneSingleImage";

const BannerCreate = () => {
  const [expireDate, setExpireDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [url, setUrl] = useState("");
  const [image, setImage] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [fethcCategoryLoading, setFethcCategoryLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(null);

  const [fethcBrandLoading, setFethcBrandLoading] = useState(false);
  const [brandOptions, setBrandOptions] = useState(null);

  const [fethcProductLoading, setFethcProductLoading] = useState(false);
  const [productOptions, setProductOptions] = useState(null);

  const [selectedModel, setSelectedModel] = useState(null);
  const [selected, setSelected] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formData = new FormData();
      formData.append("expireDate", expireDate);
      formData.append("startDate", startDate);
      formData.append("url", url);
      formData.append("modelId", selectedModel?.value);
      formData.append("selected", selected);

      const prIds = selectedProduct.map((prs) => prs.value);
      const brIds = selectedBrand.map((brs) => brs.value);

      formData.append("productIds", JSON.stringify(prIds));
      formData.append("brandIds", JSON.stringify(brIds));

      if (image[0] && image[0].type) {
        formData.append("image", image[0]);
      }
      if (image[0] && image[0].alt) {
        formData.append("imageAlt", image[0].alt);
      }

      await axiosInstance.post("/admin/banners", formData);
      setLoading(false);

      toast.success("Created Successfully.");
      navigate("/banners");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setFethcCategoryLoading(true);
    axiosInstance.get("/admin/categories/all-select").then((response) => {
      const opt = [];
      for (const e of response.data.data) {
        opt.push({
          label: e.title,
          value: e._id,
        });
      }
      setCategoryOptions(opt);
      setFethcCategoryLoading(false);
    });

    setFethcBrandLoading(true);
    axiosInstance.get("/admin/brands-select-box").then((response) => {
      const opt = [];
      for (const e of response.data.data) {
        opt.push({
          label: e.title,
          value: e._id,
        });
      }
      setBrandOptions(opt);
      setFethcBrandLoading(false);
    });

    setFethcProductLoading(true);
    axiosInstance.get("/admin/products-select-box").then((response) => {
      const opt = [];
      for (const e of response.data.data) {
        opt.push({
          label: e.title,
          value: e._id,
        });
      }
      setProductOptions(opt);
      setFethcProductLoading(false);
    });
  }, []);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem  ">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} className={"w-100 m-0 p-1"}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                      clearable
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <div>
                          <label className="form-label" htmlFor="title">
                            start date
                          </label>
                          <input
                            className={`form-input`}
                            ref={inputRef}
                            {...inputProps}
                          />
                          {InputProps?.endAdornment}
                        </div>
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                      clearable
                      value={expireDate}
                      onChange={(newValue) => {
                        setExpireDate(newValue);
                      }}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <div>
                          <label className="form-label" htmlFor="title">
                            expiration
                          </label>
                          <input
                            className={`form-input`}
                            ref={inputRef}
                            {...inputProps}
                          />
                          {InputProps?.endAdornment}
                        </div>
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div>
                    <label className="form-label" htmlFor="url">
                      Url
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.url) ? "is-invalid" : ""
                      }`}
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.url) &&
                        errorMessage?.url.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div style={{ zIndex: 3 }} className=" position-relative">
                    <label className="form-label" htmlFor="category">
                      category
                    </label>
                    <Select
                      id="category"
                      isLoading={fethcCategoryLoading}
                      value={selectedModel}
                      onChange={(selectedModel) => {
                        setSelectedModel(selectedModel);
                      }}
                      options={categoryOptions}
                      isClearable
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.modelId) &&
                        errorMessage?.modelId.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div style={{ zIndex: 2 }} className=" position-relative">
                    <label className="form-label" htmlFor="product">
                      product exception
                    </label>
                    <Select
                      id="product"
                      isLoading={fethcProductLoading}
                      value={selectedProduct}
                      onChange={(selectedModel) => {
                        setSelectedProduct(selectedModel);
                      }}
                      options={productOptions}
                      isClearable
                      isMulti
                    />
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div style={{ zIndex: 2 }} className=" position-relative">
                    <label className="form-label" htmlFor="brand">
                      brand exception
                    </label>
                    <Select
                      id="brand"
                      isLoading={fethcBrandLoading}
                      value={selectedBrand}
                      onChange={(selectedModel) => {
                        setSelectedBrand(selectedModel);
                      }}
                      options={brandOptions}
                      isClearable
                      isMulti
                    />
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="selected">
                      reverse exception?
                    </label>
                    <div className="me-3 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          setSelected(e.target.checked);
                        }}
                        id="selected"
                      />
                      <label
                        className="form-check-label white-space-nowrap"
                        htmlFor="selected"
                      >
                        reverse exception?
                      </label>
                    </div>
                    <p>by selecting this option, banner will also be display in selected products and brands</p>
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.slug) &&
                        errorMessage?.slug.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="image">
                      Image
                    </label>
                    <DropzoneSingleImage files={image} setFiles={setImage} />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.image) &&
                        errorMessage?.image.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className="d-flex pt-2">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      Submit
                    </Button>
                    {loading ? (
                      <CircularProgress className="me-3" color="inherit" />
                    ) : null}
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BannerCreate;
