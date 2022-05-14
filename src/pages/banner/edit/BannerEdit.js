import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Select from "react-select";

import axiosInstance from "../../../utiles/axiosInstance";
import DropzoneSingleImage from "../../../components/UI/DropzoneSingleImage/DropzoneSingleImage";
import useGetData from "../../../hooks/useGetData";

const BannerEdit = () => {
  const [expireDate, setExpireDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [image, setImage] = useState([]);
  const [url, setUrl] = useState("");

  const [fethcBrandLoading, setFethcBrandLoading] = useState(false);
  const [brandOptions, setBrandOptions] = useState(null);

  const [fethcProductLoading, setFethcProductLoading] = useState(false);
  const [productOptions, setProductOptions] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [selected, setSelected] = useState(false);

  const [model, setModel] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);

  const navigate = useNavigate();
  const { _id } = useParams();

  const { loading: fetchBannerLoading, data: banner, getData } = useGetData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formData = new FormData();
      formData.append("expireDate", expireDate);
      formData.append("startDate", startDate);
      formData.append("url", url);
      formData.append("selected", selected);

      if (image[0] && image[0].type) {
        formData.append("image", image[0]);
      }
      if (image[0] && image[0].alt) {
        formData.append("imageAlt", image[0].alt);
      }

      const prIds = selectedProduct.map((prs) => prs.value);
      const brIds = selectedBrand.map((brs) => brs.value);

      formData.append("productIds", JSON.stringify(prIds));
      formData.append("brandIds", JSON.stringify(brIds));

      await axiosInstance.put("/admin/banners/" + _id, formData);
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
    if (!banner) {
      return;
    }

    if (banner.expireDate) {
      setExpireDate(banner.expireDate);
    }
    if (banner.startDate) {
      setStartDate(banner.startDate);
    }
    if (banner.selected) {
      setSelected(banner.selected);
    }
    if (banner.image?.fileName) {
      setImage([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            banner.image?.fileName,
          alt: banner.image?.alt,
        },
      ]);
    }

    setModel(banner.modelId?.title);

    setUrl(banner.url);

    const opt1 = [];
    for (const e of banner.productExceptions) {
      opt1.push({
        label: e.title,
        value: e._id,
      });
    }
    setSelectedProduct(opt1);

    const opt2 = [];
    for (const e of banner.brandExceptions) {
      opt2.push({
        label: e.title,
        value: e._id,
      });
    }
    setSelectedBrand(opt2);
  }, [banner]);

  useEffect(() => {
    getData("/admin/banners/" + _id);
  }, [getData, _id]);

  useEffect(() => {
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
            {fetchBannerLoading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
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
                    <div style={{ zIndex: 2 }} className=" position-relative">
                      <label className="form-label" htmlFor="category">
                        category
                      </label>
                      <input
                        className={`form-input`}
                        defaultValue={model}
                        disabled
                      />
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
                          defaultChecked={selected}
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
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BannerEdit;
