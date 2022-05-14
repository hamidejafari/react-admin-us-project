import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import axiosInstance from "../../../utiles/axiosInstance";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";
import useGetData from "../../../hooks/useGetData";

const CouponEdit = () => {
  const [title, setTitle] = useState("");
  const [titleSeo] = useState("");

  const [occasion, setOccasion] = useState("");
  const [expireDate, setExpireDate] = useState(null);
  const [amount, setAmount] = useState("");

  const [code, setCode] = useState("");
  const [descriptionSeo, setDescriptionSeo] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [selectedModel, setSelectedModel] = useState(null);
  const [showHomePage, setShowHomePage] = useState(false);

  const navigate = useNavigate();
  const { _id } = useParams();

  const { loading: fetchCouponLoading, data: coupon, getData } = useGetData();

  useEffect(() => {
    getData("/admin/coupons/" + _id);
  }, [getData, _id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      await axiosInstance.put("/admin/coupons/" + _id, {
        title,
        amount,
        occasion,
        titleSeo,
        descriptionSeo,
        expireDate,
        code,
        showHomePage,
      });
      setLoading(false);

      toast.success("Created Successfully.");
      navigate("/coupons");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!coupon) {
      return;
    }
    setTitle(coupon.title);
    setAmount(coupon.amount);

    setOccasion(coupon.occasion);
    setDescriptionSeo(coupon.descriptionSeo);
    setExpireDate(coupon.expireDate);
    setCode(coupon.code);
    setShowHomePage(coupon.showHomePage);

    setSelectedModel({
      label: coupon?.productId?.title,
      value: coupon?.productId?._id,
    });
  }, [coupon]);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem  ">
            {fetchCouponLoading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
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
                      <label className="form-label" htmlFor="occasion">
                        Occasion
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.occasion)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="occasion"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.occasion) &&
                          errorMessage?.occasion.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  {/* <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="titleSeo">
                        Title Seo
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.titleSeo)
                            ? "is-invalid"
                            : ""
                          }`}
                        id="titleSeo"
                        value={titleSeo}
                        onChange={(e) =>
                          setTitleSeo(
                            capitalize_first_letter(e?.target?.value, " ")
                          )
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.titleSeo) &&
                          errorMessage?.titleSeo.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid> */}

                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="code">
                        Code
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.code) ? "is-invalid" : ""
                        }`}
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e?.target?.value)}
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.code) &&
                          errorMessage?.code.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="amount">
                        Amount
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.amount)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.amount) &&
                          errorMessage?.amount.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
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
                  {/* <Grid item xs={12} md={12}>
                      <label className="form-label" htmlFor="descriptionSeo">
                        Meta Description
                      </label>
                      <textarea
                        className={`form-input ${
                          Array.isArray(errorMessage?.descriptionSeo)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="descriptionSeo"
                        value={descriptionSeo}
                        onChange={(e) => setDescriptionSeo(e.target.value)}
                        onBlur={(e) =>
                          setDescriptionSeo(
                            capitalize_first_letter(e?.target?.value, ". ")
                          )
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.descriptionSeo) &&
                          errorMessage?.descriptionSeo.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                  </Grid> */}
                  <Grid item xs={12} md={6}>
                    <div style={{ zIndex: 2 }} className=" position-relative">
                      <label className="form-label" htmlFor="product">
                        Product
                      </label>
                      <input
                        type="text"
                        className={`form-input`}
                        value={selectedModel.label}
                        disabled={true}
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
                    <div className="my-4 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={showHomePage}
                        onChange={(e) => setShowHomePage(e.target.checked)}
                        id="showHomePage"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showHomePage"
                      >
                        Show Home Page
                      </label>
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

export default CouponEdit;
