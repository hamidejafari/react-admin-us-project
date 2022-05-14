import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DateTimePicker } from "@mui/lab";

import axiosInstance from "../../../utiles/axiosInstance";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";

const ReviewCreate = () => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [onModel, setOnModel] = useState("");
  const [createdAt, setCreatedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [fethcProductLoading, setFethcProductLoading] = useState(null);
  const [productOptions, setProductOptions] = useState(null);
  const [fethcBrandLoading, setFethcBrandLoading] = useState(null);
  const [brandOptions, setBrandOptions] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [starNum, setStarNum] = useState("");
  const [starDecimal, setStarDecimal] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.tinymce?.remove();

    setTimeout(() => {
      window.tinymce?.init({
        selector: "#reviewContent",
        height: 300,
        menubar: false,
        plugins: "code autolink link",
        toolbar: "undo redo | code | link",
      });
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      let star;
      if (starDecimal) {
        star = starNum + "." + starDecimal;
      } else {
        star = starNum;
      }

      await axiosInstance.post("/admin/reviews", {
        title,
        content: window.tinymce?.get(`reviewContent`).getContent(),
        name,
        onModel,
        createdAt,
        star: +star,
        modelId: selectedModel?.value,
        modelTitle: selectedModel?.label,
      });
      setLoading(false);

      toast.success("Created Successfully.");
      navigate("/reviews");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedModel(null);
    if (onModel === "product") {
      if (productOptions) {
        return;
      }
      setFethcProductLoading(true);
      axiosInstance.get("/admin/products-select-box").then((response) => {
        setFethcProductLoading(false);
        const opt = [];
        for (const e of response.data.data) {
          opt.push({
            label: e.title,
            value: e._id,
          });
        }
        setProductOptions(opt);
      });
    }
    if (onModel === "brand") {
      if (brandOptions) {
        return;
      }
      setFethcBrandLoading(true);
      axiosInstance.get("/admin/brands-select-box").then((response) => {
        setFethcBrandLoading(false);
        const opt = [];
        for (const e of response.data.data) {
          opt.push({
            label: e.title,
            value: e._id,
          });
        }
        setBrandOptions(opt);
      });
    }
  }, [onModel, brandOptions, productOptions]);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem  ">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} className={"w-100 m-0 p-1"}>
                <Grid item xs={12} md={6}>
                  <div>
                    <label className="form-label" htmlFor="title">
                      Title
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="reviewContent">
                      Review Content
                    </label>
                    <textarea
                      className={`form-input ${
                        Array.isArray(errorMessage?.content) ? "is-invalid" : ""
                      }`}
                      id="reviewContent"
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.content) &&
                        errorMessage?.content.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div>
                    <label className="form-label" htmlFor="star">
                      Star
                    </label>

                    <Grid container spacing={2}>
                      <Grid item xs={5} sm={3}>
                        <input
                          className={`form-input ${
                            Array.isArray(errorMessage?.starNum)
                              ? "is-invalid"
                              : ""
                          }`}
                          id="starNum"
                          value={starNum}
                          onChange={(e) => {
                            if (e.target.value.trim() === "") {
                              setStarNum(e.target.value);
                            } else if (+e.target.value === 5) {
                              setStarNum(e.target.value);
                              setStarDecimal("");
                            } else if (/^[0-4]{1,1}$/.test(e.target.value)) {
                              setStarNum(e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <span className="overal-rating__dot">.</span>
                      {+starNum !== 5 ? (
                        <Grid item xs={5} sm={3}>
                          <input
                            className={`form-input ${
                              Array.isArray(errorMessage?.starDecimal)
                                ? "is-invalid"
                                : ""
                            }`}
                            id="starDecimal"
                            value={starDecimal}
                            onChange={(e) => {
                              if (e.target.value.trim() === "") {
                                setStarDecimal(e.target.value);
                              } else if (/^[0-9]{1,2}$/.test(e.target.value)) {
                                setStarDecimal(e.target.value);
                              }
                            }}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.star) &&
                        errorMessage?.star.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div style={{ zIndex: 2 }} className=" position-relative">
                    <label className="form-label">model</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="product"
                        onChange={(event) => {
                          setOnModel("product");
                        }}
                      />
                      <label className="form-check-label" htmlFor="product">
                        Product
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="brand"
                        onChange={(event) => {
                          setOnModel("brand");
                        }}
                      />
                      <label className="form-check-label" htmlFor="brand">
                        Brand
                      </label>
                    </div>
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.onModel) &&
                        errorMessage?.onModel.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                {onModel === "brand" && (
                  <Grid item xs={12} md={6}>
                    <div style={{ zIndex: 2 }} className=" position-relative">
                      <label className="form-label" htmlFor="brand">
                        {onModel}
                      </label>
                      <Select
                        id="brand"
                        isLoading={fethcBrandLoading}
                        value={selectedModel}
                        onChange={(selectedModel) => {
                          setSelectedModel(selectedModel);
                        }}
                        options={brandOptions ? brandOptions : []}
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
                )}
                {onModel === "product" && (
                  <Grid item xs={12} md={6}>
                    <div style={{ zIndex: 2 }} className=" position-relative">
                      <label className="form-label" htmlFor="product">
                        {onModel}
                      </label>
                      <Select
                        id="product"
                        isLoading={fethcProductLoading}
                        value={selectedModel}
                        onChange={(selectedModel) => {
                          setSelectedModel(selectedModel);
                        }}
                        options={productOptions ? productOptions : []}
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
                )}
                <Grid item xs={12} className="pt-5">
                  <label className="form-label" htmlFor="product">
                    Date:
                  </label>
                  <br />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="DateTimePicker"
                      value={createdAt}
                      onChange={(newValue) => {
                        setCreatedAt(newValue);
                      }}
                    />
                  </LocalizationProvider>
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

export default ReviewCreate;
