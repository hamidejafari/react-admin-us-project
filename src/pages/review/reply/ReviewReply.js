import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DateTimePicker } from "@mui/lab";

import axiosInstance from "../../../utiles/axiosInstance";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";

const ReviewReply = () => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [createdAt, setCreatedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { _id } = useParams();

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
      await axiosInstance.post("/admin/reviews/reply", {
        title,
        content: window.tinymce?.get(`reviewContent`).getContent(),
        name,
        createdAt,
        replyTo: _id,
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

                <Grid item xs={12} className="pt-3">
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

export default ReviewReply;
