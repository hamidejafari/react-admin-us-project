import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import Select from "react-select";
import { useNavigate, useParams } from "react-router";

import useGetData from "../../../hooks/useGetData";
import axiosInstance from "../../../utiles/axiosInstance";
import { toast } from "react-toastify";

const EditVs = () => {
  const [titleSeo, setTitleSeo] = useState("");
  const [descriptionSeo, setDescriptionSeo] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionShort, setDescriptionShort] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [selectedWinner, setSelectedWinner] = useState({});
  const [winnerOptions, setWinnerOptions] = useState([]);
  const [showHomePage, setShowHomePage] = useState(false);

  const { _id } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let formShowHomePage;
      if (
        vs.onModel === "product" &&
        vs.compare1Id.attributes &&
        Array.isArray(vs.compare1Id.attributes) &&
        vs.compare1Id.attributes.length > 0 &&
        vs.compare2Id.attributes &&
        Array.isArray(vs.compare2Id.attributes) &&
        vs.compare2Id.attributes.length > 0
      ) {
        formShowHomePage = showHomePage;
      } else {
        formShowHomePage = false;
      }
      await axiosInstance.put("/admin/comparisons/" + _id, {
        titleSeo,
        descriptionSeo,
        slug,
        showHomePage: formShowHomePage,
        winner: selectedWinner.value,
        descriptionShort:
          window.tinymce?.get(`descriptionShort`) &&
          window.tinymce?.get(`descriptionShort`).getContent(),
      });
      setLoading(false);
      toast.success("created successfully.");
      navigate("/vs/products");
    } catch (err) {
      if (err.response?.data?.error) {
        setErrorMessage(err.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    document.body.appendChild(script);
  }, []);

  const { loading: fetchVSloading, data: vs, getData } = useGetData();

  useEffect(() => {
    getData("/admin/comparisons/" + _id);
  }, [_id, getData]);

  useEffect(() => {
    if (!vs) {
      return;
    }

    const opt = [];
    opt.push({
      label: vs.compare1Id?.title,
      value: vs.compare1Id?._id,
    });
    opt.push({
      label: vs.compare2Id?.title,
      value: vs.compare2Id?._id,
    });

    setWinnerOptions(opt);
    if (vs.titleSeo) {
      setTitleSeo(vs.titleSeo);
    }
    if (vs.descriptionSeo) {
      setDescriptionSeo(vs.descriptionSeo);
    }
    if (vs.slug) {
      setSlug(vs.slug);
    }
    if (vs.descriptionShort) {
      setDescriptionShort(vs.descriptionShort);
    }
    if (vs.winnerId) {
      if (vs.compare1Id?._id === vs.winnerId) {
        setSelectedWinner({
          label: vs.compare1Id?.title,
          value: vs.winnerId,
        });
      } else {
        setSelectedWinner({
          label: vs.compare2Id?.title,
          value: vs.winnerId,
        });
      }
    }

    setShowHomePage(vs.showHomePage);

    setTimeout(() => {
      window.tinymce?.init({
        selector: "#descriptionShort",
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    }, 100);
  }, [vs]);

  return (
    <React.Fragment>
      {" "}
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem">
            {fetchVSloading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4">
                  {vs?.compare1Id?.title} vs {vs?.compare2Id?.title}
                </h3>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="titleSeo">
                        SEO title
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.titleSeo)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="titleSeo"
                        value={titleSeo}
                        onChange={(e) => setTitleSeo(e.target.value)}
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.titleSeo) &&
                          errorMessage?.titleSeo.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="slug">
                        slug
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.slug) ? "is-invalid" : ""
                        }`}
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e?.target?.value, " ")}
                      />
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
                        onChange={(e) =>
                          setDescriptionSeo(e?.target?.value, " ")
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.descriptionSeo) &&
                          errorMessage?.descriptionSeo.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="descriptionShort">
                        Short Description
                      </label>
                      <textarea
                        className={`form-input ${
                          Array.isArray(errorMessage?.descriptionShort)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="descriptionShort"
                        defaultValue={descriptionShort}
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.descriptionShort) &&
                          errorMessage?.descriptionShort.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="winner">
                        winner
                      </label>
                      <Select
                        id="winner"
                        value={selectedWinner}
                        onChange={(selected) => {
                          setSelectedWinner(selected);
                        }}
                        options={winnerOptions}
                      />

                      <div className="text-danger">
                        {Array.isArray(errorMessage?.winner) &&
                          errorMessage?.winner.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  {vs.onModel === "product" &&
                    vs.compare1Id.attributes &&
                    Array.isArray(vs.compare1Id.attributes) &&
                    vs.compare1Id.attributes.length > 0 &&
                    vs.compare2Id.attributes &&
                    Array.isArray(vs.compare2Id.attributes) &&
                    vs.compare2Id.attributes.length > 0 && (
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
                    )}

                  <Grid item xs={12}>
                    <div className="d-flex">
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

export default EditVs;
