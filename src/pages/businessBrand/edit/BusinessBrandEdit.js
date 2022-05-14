import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import axiosInstance from "../../../utiles/axiosInstance";
import DropzoneSingleImage from "../../../components/UI/DropzoneSingleImage/DropzoneSingleImage";
import useGetData from "../../../hooks/useGetData";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";

const BusinessBrandEdit = () => {
  const [faqInput, setFaqInput] = useState(0);
  const [prosInput, setProsInput] = useState(0);
  const [consInput, setConsInput] = useState(0);

  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [descriptionShort, setDescriptionShort] = useState("");
  const [faq, setFaq] = useState([]);
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);
  const [image, setImage] = useState([]);
  const [published, setPublished] = useState(true);
  const [noIndex, setNoIndex] = useState(false);

  const [publishDate, setPublishDate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { _id } = useParams();

  const {
    loading: fetchBrandloading,
    data: businessBrand,
    getData,
  } = useGetData();

  useEffect(() => {
    getData("/admin/business-brands/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!businessBrand) {
      return;
    }
    setTitle(businessBrand.title);
    setDescriptionShort(businessBrand.descriptionShort);
    setSiteUrl(businessBrand.siteUrl);
    setPublished(businessBrand.published);
    setNoIndex(businessBrand.noIndex);
    setBrandId(businessBrand.brandId?._id);

    setPublishDate(businessBrand.publishDate);

    if (businessBrand?.faq?.length) {
      setFaqInput(businessBrand.faq.length);
      setFaq(businessBrand.faq);
    }
    if (businessBrand?.pros?.length) {
      setProsInput(businessBrand.pros.length);
      setPros(businessBrand.pros);

      setTimeout(() => {
        businessBrand.pros.forEach((element, index) => {
          window.tinymce?.init({
            selector: "#myeditabledivPros_" + index,
            setup: function (ed) {
              ed.on("keydown", function (e) {
                if (e.keyCode === 13) {
                  e.preventDefault();
                }
              });
            },
            height: 150,
            menubar: false,
            plugins: "code autolink link ",
            toolbar: "undo redo | code | link | Bold",
          });
        });
      }, 100);
    }
    if (businessBrand?.cons?.length) {
      setConsInput(businessBrand.cons.length);
      setCons(businessBrand.cons);

      setTimeout(() => {
        businessBrand.cons.forEach((element, index) => {
          window.tinymce?.init({
            selector: "#myeditabledivCons_" + index,
            setup: function (ed) {
              ed.on("keydown", function (e) {
                if (e.keyCode === 13) {
                  e.preventDefault();
                }
              });
            },
            height: 150,
            menubar: false,
            plugins: "code autolink link ",
            toolbar: "undo redo | code | link | Bold",
          });
        });
      }, 100);
    }
    setSlug(businessBrand.slug);
    setActive(businessBrand.active);
    setTimeout(() => {
      window.tinymce?.init({
        selector: "#descriptionShort",
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    }, 100);

    if (businessBrand.image) {
      setImage([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            businessBrand.image,
          name: businessBrand.image,
        },
      ]);
    }
  }, [businessBrand]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formData = new FormData();

      if (image[0] && image[0].type) {
        formData.append("image", image[0]);
      }
      image[0]?.alt && formData.append("imageAlt", image[0].alt);

      formData.append("title", title);
      formData.append("brandId", brandId);

      if (userRoutes.includes("/business-brands/slug-edit")) {
        formData.append("slug", slug);
      }

      formData.append("faq", JSON.stringify(faq));

      if (prosInput > 0) {
        const formpros = [];

        new Array(prosInput).fill(undefined).forEach((_, index) => {
          if (window.tinymce?.get(`myeditabledivPros_${index}`)) {
            formpros.push(
              window.tinymce?.get(`myeditabledivPros_${index}`).getContent()
            );
          }
        });

        formData.append("pros", JSON.stringify(formpros));
      }

      if (consInput > 0) {
        const formcons = [];

        new Array(consInput).fill(undefined).forEach((_, index) => {
          if (window.tinymce?.get(`myeditabledivCons_${index}`)) {
            formcons.push(
              window.tinymce?.get(`myeditabledivCons_${index}`).getContent()
            );
          }
        });

        formData.append("cons", JSON.stringify(formcons));
      }

      formData.append(
        "descriptionShort",
        window.tinymce?.get(`descriptionShort`).getContent()
      );

      formData.append("siteUrl", siteUrl);
      formData.append("active", active);
      formData.append("published", published);
      formData.append("noIndex", noIndex);

      formData.append("publishDate", publishDate);
      await axiosInstance.put("/admin/business-brands/" + _id, formData);

      setLoading(false);

      toast.success("Updated Successfully.");
      navigate("/business-brands");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    document.body.appendChild(script);
  }, []);

  const addFaqHandler = () => {
    setFaqInput(faqInput + 1);
  };

  const addProsHandler = () => {
    const newProsInput = prosInput + 1;

    setProsInput(newProsInput);

    setTimeout(() => {
      window.tinymce?.init({
        selector: "#myeditabledivPros_" + prosInput,
        setup: function (ed) {
          ed.on("keydown", function (e) {
            if (e.keyCode === 13) {
              e.preventDefault();
            }
          });
        },
        height: 150,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    }, 100);
  };

  const addConsHandler = () => {
    const newConsInput = consInput + 1;

    setConsInput(newConsInput);

    setTimeout(() => {
      window.tinymce?.init({
        selector: "#myeditabledivCons_" + consInput,
        setup: function (ed) {
          ed.on("keydown", function (e) {
            if (e.keyCode === 13) {
              e.preventDefault();
            }
          });
        },
        height: 150,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    }, 100);
  };

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
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
                        onChange={(e) => {
                          setTitle(
                            capitalize_first_letter(e.target.value, " ")
                          );
                        }}
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
                    <div className="mb-3">
                      <label className="form-label" htmlFor="siteUrl">
                        Brand Website
                      </label>
                      <input
                        className={`form-input ${
                          Array.isArray(errorMessage?.siteUrl)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="siteUrl"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.siteUrl) &&
                          errorMessage?.siteUrl.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="pros">
                        Pros
                      </label>
                      <div className="p-2 bg-gray">
                        {new Array(prosInput)
                          .fill(undefined)
                          .map((_, index) => (
                            <React.Fragment key={index}>
                              <hr />
                              {index === prosInput - 1 && (
                                <div className="d-flex">
                                  <Button
                                    onClick={() => {
                                      setProsInput(prosInput - 1);

                                      window.tinymce.EditorManager.execCommand(
                                        "mceRemoveEditor",
                                        true,
                                        `myeditabledivPros_${prosInput - 1}`
                                      );

                                      const newPros = [...pros];
                                      newPros.splice(index, 1);

                                      setPros(newPros);
                                    }}
                                    className="ms-auto border-raduis-0"
                                    variant="contained"
                                    color="error"
                                  >
                                    <ClearTwoToneIcon />
                                  </Button>
                                </div>
                              )}
                              <div className="mb-3">
                                <textarea
                                  rows="4"
                                  className={`form-input`}
                                  id={`myeditabledivPros_${index}`}
                                  defaultValue={pros[index]}
                                />
                                <div className="text-danger">
                                  {Array.isArray(errorMessage?.pros) &&
                                    Array.isArray(errorMessage?.pros[0]) &&
                                    errorMessage?.pros[0][index]}
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                        <Button
                          onClick={addProsHandler}
                          variant="contained"
                          className={"w-100 border-raduis-0"}
                        >
                          <AddCircleTwoToneIcon
                            style={{ marginRight: "5px" }}
                          />
                          Add
                        </Button>
                        <div className="text-danger">
                          {Array.isArray(errorMessage?.pros) &&
                            errorMessage?.pros[0] &&
                            errorMessage?.pros[0] &&
                            typeof errorMessage?.pros[0] !== "object" &&
                            errorMessage?.pros}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="cons">
                        Cons
                      </label>
                      <div className="p-2 bg-gray">
                        {new Array(consInput)
                          .fill(undefined)
                          .map((_, index) => (
                            <React.Fragment key={index}>
                              <hr />
                              {index === consInput - 1 && (
                                <div className="d-flex">
                                  <Button
                                    onClick={() => {
                                      setConsInput(consInput - 1);

                                      window.tinymce.EditorManager.execCommand(
                                        "mceRemoveEditor",
                                        true,
                                        `myeditabledivCons_${consInput - 1}`
                                      );

                                      const newCons = [...cons];
                                      newCons.splice(index, 1);

                                      setCons(newCons);
                                    }}
                                    className="ms-auto border-raduis-0"
                                    variant="contained"
                                    color="error"
                                  >
                                    <ClearTwoToneIcon />
                                  </Button>
                                </div>
                              )}
                              <div className="mb-3">
                                <textarea
                                  rows="4"
                                  className={`form-input`}
                                  id={`myeditabledivCons_${index}`}
                                  defaultValue={cons[index]}
                                />
                                <div className="text-danger">
                                  {Array.isArray(errorMessage?.cons) &&
                                    Array.isArray(errorMessage?.cons[0]) &&
                                    errorMessage?.cons[0][index]}
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                        <Button
                          onClick={addConsHandler}
                          variant="contained"
                          className={"w-100 border-raduis-0"}
                        >
                          <AddCircleTwoToneIcon
                            style={{ marginRight: "5px" }}
                          />
                          Add
                        </Button>
                        <div className="text-danger">
                          {Array.isArray(errorMessage?.cons) &&
                            errorMessage?.cons[0] &&
                            !Array.isArray(errorMessage?.cons[0]) &&
                            errorMessage?.cons}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="faq">
                        FAQ
                      </label>
                      <div className="p-2 bg-gray">
                        {new Array(faqInput).fill(undefined).map((_, index) => (
                          <React.Fragment key={index}>
                            <hr />
                            {index === faqInput - 1 && (
                              <div className="d-flex">
                                <Button
                                  onClick={() => {
                                    setFaqInput(faqInput - 1);

                                    const newFaq = [...faq];

                                    newFaq.splice(index, 1);

                                    setFaq(newFaq);
                                  }}
                                  className="ms-auto border-raduis-0"
                                  variant="contained"
                                  color="error"
                                >
                                  <ClearTwoToneIcon />
                                </Button>
                              </div>
                            )}
                            <div className="mb-3">
                              <label className="form-label">Question</label>
                              <input
                                key={index}
                                className={`form-input`}
                                value={faq[index]?.question || ""}
                                onChange={(e) => {
                                  const obj = {
                                    question: e.target.value,
                                  };
                                  faq[index] = {
                                    ...faq[index],
                                    ...obj,
                                  };
                                  setFaq([...faq]);
                                }}
                              />
                              <div className="text-danger">
                                {Array.isArray(errorMessage?.faq) &&
                                  Array.isArray(errorMessage?.faq[0]) &&
                                  errorMessage?.faq[0][index] &&
                                  typeof errorMessage?.faq[0][index] ===
                                    "object" &&
                                  errorMessage?.faq[0][index].question}
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Answer</label>
                              <textarea
                                key={index}
                                className={`form-input`}
                                value={faq[index]?.answer || ""}
                                onChange={(e) => {
                                  const obj = { answer: e.target.value };
                                  faq[index] = {
                                    ...faq[index],
                                    ...obj,
                                  };
                                  setFaq([...faq]);
                                }}
                              />
                              <div className="text-danger">
                                {Array.isArray(errorMessage?.faq) &&
                                  Array.isArray(errorMessage?.faq[0]) &&
                                  errorMessage?.faq[0][index] &&
                                  typeof errorMessage?.faq[0][index] ===
                                    "object" &&
                                  errorMessage?.faq[0][index].answer}
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                        <Button
                          onClick={addFaqHandler}
                          variant="contained"
                          className={"w-100 border-raduis-0"}
                        >
                          <AddCircleTwoToneIcon
                            style={{ marginRight: "5px" }}
                          />
                          Add
                        </Button>
                        <div className="text-danger">
                          {Array.isArray(errorMessage?.faq) &&
                            errorMessage?.faq[0] &&
                            typeof errorMessage?.faq[0] !== "object" &&
                            errorMessage?.faq}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="descriptionShort">
                        Short Description
                      </label>
                      <textarea
                        className={`form-input`}
                        defaultValue={descriptionShort}
                        id="descriptionShort"
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.descriptionShort) &&
                          errorMessage?.descriptionShort.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>
                  {published ? (
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDateTimePicker
                          clearable
                          value={publishDate}
                          onChange={(newValue) => {
                            setPublishDate(newValue);
                          }}
                          renderInput={({
                            inputRef,
                            inputProps,
                            InputProps,
                          }) => (
                            <div>
                              <label className="form-label" htmlFor="title">
                                Publish Date
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
                  ) : (
                    <Grid item xs={12} md={6}>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="publishDate">
                          Publish Date
                        </label>
                        <input
                          className={`form-input`}
                          id="publishDate"
                          value={publishDate}
                          disabled
                        />
                      </div>
                    </Grid>
                  )}

                  <Grid item xs={12} md={6}>
                    <div className="my-4 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={published}
                        onChange={(e) => {
                          setPublished(e.target.checked);
                        }}
                        id="published"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="published"
                        style={{ fontSize: "22px", marginLeft: "16px" }}
                      >
                        Published
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="my-4 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={active}
                        onChange={(e) => {
                          setActive(e.target.checked);
                        }}
                        id="active"
                      />
                      <label className="form-check-label" htmlFor="active">
                        Is Active
                      </label>
                    </div>
                    <div className="my-4 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={noIndex}
                        onChange={(e) => {
                          setNoIndex(e.target.checked);
                        }}
                        id="noindex"
                      />
                      <label className="form-check-label" htmlFor="noindex">
                        No Index
                      </label>
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

export default BusinessBrandEdit;
