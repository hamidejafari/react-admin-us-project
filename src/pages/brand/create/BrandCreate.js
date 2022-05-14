import React, { useState, useEffect, useCallback } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";

import axiosInstance from "../../../utiles/axiosInstance";
import DropzoneSingleImage from "../../../components/UI/DropzoneSingleImage/DropzoneSingleImage";
import string_to_slug from "../../../utiles/string_to_slug";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";
import { getFlagsAction } from "../../../redux/slices/flagSlice";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import description_header_capitalize from "../../../utiles/description_header_capitalize";

const headerType = [
  { label: "h2", value: "h2" },
  { label: "h3", value: "h3" },
  { label: "h4", value: "h4" },
  { label: "h5", value: "h5" },
  { label: "h6", value: "h6" },
];

const specialOptions = [
  { label: "Normal", value: "normal" },
  { label: "Friend", value: "friend" },
  { label: "Our Brand", value: "ourBrand" },
  { label: "Enemy", value: "enemy" },
];

const CategoryCreate = () => {
  const [descInput, setDescInput] = useState(0);
  const [faqInput, setFaqInput] = useState(0);
  const [prosInput, setProsInput] = useState(0);
  const [consInput, setConsInput] = useState(0);

  const [title, setTitle] = useState("");
  const [titleSeo, setTitleSeo] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [description, setDescription] = useState([]);
  const [descriptionHeaderType, setDescriptionHeaderType] = useState([]);
  const [descriptionSeo, setDescriptionSeo] = useState("");
  const [faq, setFaq] = useState([]);
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);
  // const [showHomePage, setShowHomePage] = useState(false);
  const [h1, setH1] = useState("");
  const [overalRatingNum, setOveralRatingNum] = useState("");
  const [overalRatingDecimal, setOveralRatingDecimal] = useState("");
  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");
  const [utmLink, setUtmLink] = useState("");
  const [starNum, setStarNum] = useState("");
  const [starDecimal, setStarDecimal] = useState("");
  const [image, setImage] = useState([]);
  const [imageProduct, setImageProduct] = useState([]);
  const [imageSeo, setImageSeo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [flagOptions, setFlagsOptions] = useState([]);
  const [headerImage, setHeaderImage] = useState([]);
  const [published, setPublished] = useState(true);
  const [noIndex, setNoIndex] = useState(false);

  const [publishDate, setPublishDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [searchTagInput, setSearchTagInput] = useState(0);
  const [searchTags, setSearchTags] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formDescriptions = [...description];

      formDescriptions.forEach((formDescription, index) => {
        if (formDescription) {
          formDescription.desc =
            window.tinymce?.get(`myeditablediv_${index}`) &&
            window.tinymce?.get(`myeditablediv_${index}`).getContent();
        }
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("titleSeo", titleSeo);
      formData.append("searchTags", JSON.stringify(searchTags));

      if (selectedCategory) {
        const formCategory = [];

        selectedCategory.forEach((cat, index) => {
          formCategory.push({ _id: cat.value });
        });
        formData.append("category", JSON.stringify(formCategory));
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

      formData.append("description", JSON.stringify(formDescriptions));
      formData.append("descriptionSeo", descriptionSeo);
      formData.append("published", published);
      formData.append("noIndex", noIndex);

      formData.append("publishDate", publishDate);
      formData.append(
        "descriptionShort",
        window.tinymce?.get(`descriptionShort`).getContent()
      );
      formData.append("slug", slug);
      if (h1) {
        formData.append("h1", h1);
      }
      if (selectedSpecial && selectedSpecial.value) {
        formData.append("special", selectedSpecial.value);
      }
      let overalRating;
      if (overalRatingDecimal) {
        overalRating = overalRatingNum + "." + overalRatingDecimal;
      } else {
        overalRating = overalRatingNum;
      }
      formData.append("overalRating", +overalRating);

      let star;
      if (starDecimal) {
        star = starNum + "." + starDecimal;
      } else {
        star = starNum;
      }
      formData.append("star", +star);
      formData.append("siteUrl", siteUrl);
      formData.append("active", active);
      formData.append("showHomePage", false);
      if (youtubeVideoLink) {
        formData.append("youtubeVideoLink", youtubeVideoLink);
      }
      if (utmLink) {
        formData.append("utmLink", utmLink);
      }
      if (selectedCategory?.value) {
        formData.append("parentId", selectedCategory.value);
      }

      if (selectedFlag?.value) {
        formData.append("flag", JSON.stringify(selectedFlag.value));
      }

      if (image[0]) {
        formData.append("image", image[0]);
        formData.append("imageAlt", image[0].alt);
      }

      if (imageProduct[0]) {
        formData.append("imageProduct", imageProduct[0]);
        formData.append("imageProductAlt", imageProduct[0].alt);
      }

      if (headerImage[0]) {
        formData.append("headerImage", headerImage[0]);
        formData.append("headerImageAlt", headerImage[0].alt);
      }
      if (imageSeo[0]) {
        formData.append("imageSeo", imageSeo[0]);
        formData.append("imageSeoAlt", imageSeo[0].alt);
      }

      await axiosInstance.post("/admin/brands", formData);
      setLoading(false);

      toast.success("Created Successfully.");
      navigate("/brands");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  const addSearchTagHandler = () => {
    setSearchTagInput(searchTagInput + 1);
  };

  const flags = useSelector((state) => state.flag?.flags, shallowEqual);
  const dispatch = useDispatch();

  const categories = async () => {
    setFethcCategotyLoading(true);
    const { data } = await axiosInstance.get("/admin/category-level-two");

    setFethcCategotyLoading(false);

    const opt = [];

    for (const e of data) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }

    setCategoryOptions(opt);
  };

  const getFlagsHandler = useCallback(async () => {
    if (!flags) {
      dispatch(getFlagsAction);
      return;
    }

    const opt = [];

    for (const e of flags) {
      opt.push({
        label: e.name + " " + e.emoji,
        value: { _id: e._id, code: e.code, emoji: e.emoji, name: e.name },
      });
    }

    setFlagsOptions(opt);
  }, [dispatch, flags]);

  useEffect(() => {
    getFlagsHandler();
  }, [getFlagsHandler]);

  useEffect(() => {
    categories();
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.tinymce?.init({
        selector: "#descriptionShort",
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    };
  }, []);

  const addDescHandler = () => {
    const newDescInput = descInput + 1;

    setDescInput(newDescInput);

    setTimeout(() => {
      window.tinymce?.init({
        selector: "#myeditablediv_" + descInput,
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    }, 100);
  };

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

  useEffect(() => {
    const star = starNum + "." + starDecimal;
    if (star !== ".") {
      const overalRatingNewValue = +star * 2;
      const overalRatingNewValueArray = overalRatingNewValue
        .toString()
        .split(".");
      overalRatingNewValueArray[0]
        ? setOveralRatingNum(overalRatingNewValueArray[0])
        : setOveralRatingNum("");
      overalRatingNewValueArray[1]
        ? setOveralRatingDecimal(overalRatingNewValueArray[1])
        : setOveralRatingDecimal("");
    }
  }, [starNum, starDecimal]);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem">
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
                        setSlug(
                          string_to_slug(e.target.value.trim()) + "-reviews"
                        );
                        setTitle(capitalize_first_letter(e.target.value, " "));
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
                    <label className="form-label" htmlFor="slug">
                      Slug
                    </label>

                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.slug) ? "is-invalid" : ""
                      }`}
                      id="slug"
                      value={slug}
                      disabled
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
                    <label className="form-label" htmlFor="titleSeo">
                      Title Seo
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.titleSeo)
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <div style={{ zIndex: 3 }} className="mb-3 position-relative">
                    <label className="form-label" htmlFor="category">
                      Category
                    </label>
                    <Select
                      id="category"
                      isLoading={fethcCategotyLoading}
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
                <Grid item xs={12} md={6}>
                  <div style={{ zIndex: 2 }} className="mb-3 position-relative">
                    <label className="form-label" htmlFor="special">
                      Special
                    </label>
                    <Select
                      id="special"
                      value={selectedSpecial}
                      onChange={(selectedSpecial) => {
                        setSelectedSpecial(selectedSpecial);
                      }}
                      options={specialOptions}
                      isClearable
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.special) &&
                        errorMessage?.special.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div style={{ zIndex: 2 }} className="mb-3 position-relative">
                    <label className="form-label" htmlFor="flag">
                      Flag
                    </label>
                    <Select
                      id="flag"
                      value={selectedFlag}
                      onChange={(selectedFlag) => {
                        setSelectedFlag(selectedFlag);
                      }}
                      options={flagOptions}
                      isClearable
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.flag) &&
                        errorMessage?.flag.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="youtubeVideoLink">
                      Youtube Video Link
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.youtubeVideoLink)
                          ? "is-invalid"
                          : ""
                      }`}
                      id="youtubeVideoLink"
                      value={youtubeVideoLink}
                      onChange={(e) => setYoutubeVideoLink(e.target.value)}
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.youtubeVideoLink) &&
                        errorMessage?.youtubeVideoLink.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div>
                    <label className="form-label" htmlFor="video">
                      Search Tags
                    </label>
                    <div className="p-2 bg-gray">
                      {new Array(searchTagInput)
                        .fill(undefined)
                        .map((_, index) => (
                          <React.Fragment key={index}>
                            <hr />
                            <Grid container spacing={1} className={"w-100"}>
                              <Grid
                                item
                                md={index === searchTagInput - 1 ? 10 : 12}
                              >
                                <label className="form-label">
                                  tag content
                                </label>
                                <input
                                  key={index}
                                  className={`form-input`}
                                  value={searchTags[index] || ""}
                                  onChange={(e) => {
                                    searchTags[index] = e.target.value;
                                    setSearchTags([...searchTags]);
                                  }}
                                />
                              </Grid>

                              {index === searchTagInput - 1 && (
                                <Grid item md={2}>
                                  <Button
                                    onClick={() => {
                                      setSearchTagInput(searchTagInput - 1);
                                      const newTags = [...searchTags];
                                      newTags.splice(index, 1);
                                      setSearchTags(newTags);
                                    }}
                                    className="ms-auto border-raduis-0"
                                    variant="contained"
                                    color="error"
                                    style={{ marginTop: "2.1rem" }}
                                  >
                                    <ClearTwoToneIcon />
                                  </Button>
                                </Grid>
                              )}
                            </Grid>
                          </React.Fragment>
                        ))}
                      <Button
                        onClick={addSearchTagHandler}
                        variant="contained"
                        className={"w-100 border-raduis-0"}
                        style={{ marginTop: 2 }}
                      >
                        <AddCircleTwoToneIcon style={{ marginRight: "5px" }} />
                        Add
                      </Button>
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.videos) &&
                          errorMessage?.videos[0] &&
                          typeof errorMessage?.videos[0] !== "object" &&
                          errorMessage?.videos}
                      </div>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="pros">
                      Pros
                    </label>
                    <div className="p-2 bg-gray">
                      {new Array(prosInput).fill(undefined).map((_, index) => (
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
                            <label className="form-label">Pros</label>
                            <textarea
                              rows="4"
                              className={`form-input`}
                              id={`myeditabledivPros_${index}`}
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
                        <AddCircleTwoToneIcon style={{ marginRight: "5px" }} />
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
                      {new Array(consInput).fill(undefined).map((_, index) => (
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
                            <label className="form-label">Cons</label>
                            <textarea
                              rows="4"
                              className={`form-input`}
                              id={`myeditabledivCons_${index}`}
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
                        <AddCircleTwoToneIcon style={{ marginRight: "5px" }} />
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
                                const obj = { question: e.target.value };
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
                        <AddCircleTwoToneIcon style={{ marginRight: "5px" }} />
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
                    <label className="form-label" htmlFor="description">
                      Description
                    </label>
                    <div className="p-2 bg-gray">
                      {new Array(descInput).fill(undefined).map((_, index) => (
                        <React.Fragment key={index}>
                          <hr />
                          {index === descInput - 1 && (
                            <div className="d-flex">
                              <Button
                                onClick={() => {
                                  const newDescription = [...description];
                                  newDescription.splice(index, 1);
                                  setDescription(newDescription);

                                  const newDescriptionHeaderType = [
                                    ...descriptionHeaderType,
                                  ];
                                  newDescriptionHeaderType.splice(index, 1);
                                  setDescriptionHeaderType(
                                    newDescriptionHeaderType
                                  );

                                  setDescInput(descInput - 1);

                                  window.tinymce.EditorManager.execCommand(
                                    "mceRemoveEditor",
                                    true,
                                    `myeditablediv_${descInput - 1}`
                                  );
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
                            <label className="form-label">Header</label>
                            <input
                              key={index}
                              className={`form-input`}
                              value={description[index]?.header || ""}
                              onChange={(e) => {
                                const obj = {
                                  header: description_header_capitalize(
                                    e.target.value
                                  ),
                                };
                                description[index] = {
                                  ...description[index],
                                  ...obj,
                                };
                                setDescription([...description]);
                              }}
                            />
                            <div className="text-danger">
                              {Array.isArray(errorMessage?.description) &&
                                Array.isArray(errorMessage?.description[0]) &&
                                errorMessage?.description[0][index] &&
                                typeof errorMessage?.description[0][index] ===
                                  "object" &&
                                errorMessage?.description[0][index].header}
                            </div>
                          </div>
                          <div
                            style={{ zIndex: 2 }}
                            className="mb-3 position-relative"
                          >
                            <label className="form-label">Header Type</label>
                            <Select
                              onChange={(selected) => {
                                const newDescriptionHeaderType = [
                                  ...descriptionHeaderType,
                                ];
                                newDescriptionHeaderType[index] = selected;
                                setDescriptionHeaderType(
                                  newDescriptionHeaderType
                                );
                                const obj = { headerType: selected?.value };
                                description[index] = {
                                  ...description[index],
                                  ...obj,
                                };
                                setDescription([...description]);
                              }}
                              options={headerType}
                              value={descriptionHeaderType[index]}
                              isClearable
                            />
                            <div className="text-danger">
                              {Array.isArray(errorMessage?.description) &&
                                Array.isArray(errorMessage?.description[0]) &&
                                errorMessage?.description[0][index] &&
                                typeof errorMessage?.description[0][index] ===
                                  "object" &&
                                errorMessage?.description[0][index].headerType}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                              rows="4"
                              className={`form-input`}
                              id={`myeditablediv_${index}`}
                            />
                            <div className="text-danger">
                              {Array.isArray(errorMessage?.description) &&
                                Array.isArray(errorMessage?.description[0]) &&
                                errorMessage?.description[0][index] &&
                                typeof errorMessage?.description[0][index] ===
                                  "object" &&
                                errorMessage?.description[0][index].desc}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                      <Button
                        onClick={addDescHandler}
                        variant="contained"
                        className={"w-100 border-raduis-0"}
                      >
                        <AddCircleTwoToneIcon style={{ marginRight: "5px" }} />
                        Add
                      </Button>
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.description) &&
                          errorMessage?.description[0] &&
                          typeof errorMessage?.description[0] !== "object" &&
                          errorMessage?.description}
                      </div>
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
                      onChange={(e) => setDescriptionSeo(e?.target?.value)}
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
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
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
                    <label className="form-label" htmlFor="descriptionSeo">
                      H1
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.h1) ? "is-invalid" : ""
                      }`}
                      id="h1"
                      value={h1}
                      onChange={(e) =>
                        setH1(capitalize_first_letter(e?.target?.value, " "))
                      }
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.h1) &&
                        errorMessage?.h1.map((error, index) => (
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
                        Array.isArray(errorMessage?.siteUrl) ? "is-invalid" : ""
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
                    <label className="form-label" htmlFor="utmLink">
                      UTM Link
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.utmLink) ? "is-invalid" : ""
                      }`}
                      id="utmLink"
                      value={utmLink}
                      onChange={(e) => setUtmLink(e.target.value)}
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.utmLink) &&
                        errorMessage?.utmLink.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="mb-3">
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
                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="overalRating">
                      Overal Rating
                    </label>
                    <Grid container spacing={2}>
                      <Grid item xs={5} sm={3}>
                        <input
                          className={`form-input ${
                            Array.isArray(errorMessage?.overalRatingNum)
                              ? "is-invalid"
                              : ""
                          }`}
                          id="overalRatingNum"
                          value={overalRatingNum}
                          onChange={(e) => {
                            if (e.target.value.trim() === "") {
                              setOveralRatingNum(e.target.value);
                            } else if (+e.target.value === 10) {
                              setOveralRatingNum(e.target.value);
                              setOveralRatingDecimal("");
                            } else if (/^[0-9]{1,1}$/.test(e.target.value)) {
                              setOveralRatingNum(e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <span className="overal-rating__dot">.</span>
                      {+overalRatingNum !== 10 ? (
                        <Grid item xs={5} sm={3}>
                          <input
                            className={`form-input ${
                              Array.isArray(errorMessage?.overalRatingDecimal)
                                ? "is-invalid"
                                : ""
                            }`}
                            id="overalRatingDecimal"
                            value={overalRatingDecimal}
                            onChange={(e) => {
                              if (e.target.value.trim() === "") {
                                setOveralRatingDecimal(e.target.value);
                              } else if (/^[0-9]{1,2}$/.test(e.target.value)) {
                                setOveralRatingDecimal(e.target.value);
                              }
                            }}
                          />
                        </Grid>
                      ) : null}
                    </Grid>

                    <div className="text-danger">
                      {Array.isArray(errorMessage?.overalRating) &&
                        errorMessage?.overalRating.map((error, index) => (
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
{/* 
                  <div className="my-4 form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showHomePage}
                      onChange={(e) => setShowHomePage(e.target.checked)}
                      id="showHomePage"
                    />
                    <label className="form-check-label" htmlFor="showHomePage">
                      Show Home Page
                    </label>
                  </div> */}
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
                        renderInput={({ inputRef, inputProps, InputProps }) => (
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
                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="imageSeo">
                      Image Seo
                    </label>
                    <DropzoneSingleImage
                      files={imageSeo}
                      setFiles={setImageSeo}
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.imageSeo) &&
                        errorMessage?.imageSeo.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="imageProduct">
                      Product Image
                    </label>
                    <DropzoneSingleImage
                      files={imageProduct}
                      setFiles={setImageProduct}
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.imageProduct) &&
                        errorMessage?.imageProduct.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="headerImage">
                      Header Image
                    </label>
                    <DropzoneSingleImage
                      files={headerImage}
                      setFiles={setHeaderImage}
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.headerImage) &&
                        errorMessage?.headerImage.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
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
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CategoryCreate;
