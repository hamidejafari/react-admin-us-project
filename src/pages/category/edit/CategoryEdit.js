import { Button, CircularProgress, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import { useSelector, shallowEqual } from "react-redux";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import DropzoneSingleImage from "../../../components/UI/DropzoneSingleImage/DropzoneSingleImage";
import axiosInstance from "../../../utiles/axiosInstance";
import useGetData from "../../../hooks/useGetData";
import { string_to_slug_cat } from "../../../utiles/string_to_slug";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";
import description_header_capitalize from "../../../utiles/description_header_capitalize";

const headerType = [
  { label: "h2", value: "h2" },
  { label: "h3", value: "h3" },
  { label: "h4", value: "h4" },
  { label: "h5", value: "h5" },
  { label: "h6", value: "h6" },
];

const CategoryCreate = () => {
  const [descInput, setDescInput] = useState(0);
  const [faqInput, setFaqInput] = useState(0);

  const [title, setTitle] = useState("");
  const [titleSeo, setTitleSeo] = useState("");
  const [description, setDescription] = useState([]);
  const [faq, setFaq] = useState([]);
  const [descriptionHeaderType, setDescriptionHeaderType] = useState([]);
  const [descriptionSeo, setDescriptionSeo] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugOld, setSlugOld] = useState(false);
  const [active, setActive] = useState(true);
  const [published, setPublished] = useState(true);
  const [noIndex, setNoIndex] = useState(true);

  const [publishDate, setPublishDate] = useState(null);

  const [showHomePage, setShowHomePage] = useState(false);
  const [h1, setH1] = useState("");
  const [icon, setIcon] = useState([]);
  const [headerImage, setHeaderImage] = useState([]);

  const [iconSeo, setIconSeo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { _id } = useParams();

  const {
    loading: fetchCategoryloading,
    data: category,
    getData,
  } = useGetData();

  useEffect(() => {
    getData("/admin/categories/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!category) {
      return;
    }
    setTitle(category.title);
    setTitleSeo(category.titleSeo);

    const descript = category.description.map((description, index) => {
      return { ...description, order: index + 1 };
    });

    setDescription(descript);

    if (category?.faq?.length) {
      setFaqInput(category.faq.length);
      setFaq(category.faq);
    }
    setDescriptionSeo(category.descriptionSeo);
    setShortDescription(category.shortDescription);
    setSlug(category.slug);
    setSlugOld(category.isOldSlug);
    setActive(category.active);
    setPublished(category.published);
    setNoIndex(category.noIndex);

    setPublishDate(category.publishDate);

    setShowHomePage(category.showHomePage);
    setH1(category.h1);

    if (category.parentId?._id) {
      setSelectedCategory({
        value: category.parentId?._id,
        label: category.parentId?.title,
      });
    }

    if (category?.description?.length) {
      setDescInput(category.description.length);

      const arr = [];

      for (const head of category.description) {
        arr.push({ label: head.headerType, value: head.headerType });
      }
      setDescriptionHeaderType(arr);

      setTimeout(() => {
        category.description.forEach((element, index) => {
          window.tinymce?.init({
            selector: "#myeditablediv_" + index,
            height: 300,
            menubar: false,
            plugins: "code autolink link ",
            toolbar: "undo redo | code | link | Bold",
          });
        });
      }, 100);
    }

    if (category.icon?.fileName) {
      setIcon([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            category.icon?.fileName,
          name: category.icon?.fileName,
          alt: category.icon?.alt,
        },
      ]);
    }
    if (category.headerImage?.fileName) {
      setHeaderImage([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            category.headerImage?.fileName,
          name: category.headerImage?.fileName,
          alt: category.headerImage?.alt,
        },
      ]);
    }

    if (category.iconSeo?.fileName) {
      setIconSeo([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            category.iconSeo?.fileName,
          name: category.iconSeo?.fileName,
          alt: category.iconSeo?.alt,
        },
      ]);
    }

    setTimeout(() => {
      window.tinymce?.init({
        selector: "#shortDescription",
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | bold",
      });
    }, 100);
  }, [category]);

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formDescriptions = [...description];

      formDescriptions.forEach((formDescription, index) => {
        formDescription.desc =
          window.tinymce?.get(`myeditablediv_${index}`) &&
          window.tinymce?.get(`myeditablediv_${index}`).getContent();
      });

      formDescriptions.sort((a, b) => {
        return a.order - b.order;
      });

      const formData = new FormData();

      if (icon[0] && icon[0].type) {
        formData.append("icon", icon[0]);
      }
      icon[0]?.alt && formData.append("iconAlt", icon[0].alt);

      if (headerImage[0] && headerImage[0].type) {
        formData.append("headerImage", headerImage[0]);
      }

      headerImage[0]?.alt &&
        formData.append("headerImageAlt", headerImage[0].alt);

      if (iconSeo[0] && iconSeo[0].type) {
        formData.append("iconSeo", iconSeo[0]);
      }

      iconSeo[0]?.alt && formData.append("iconSeoAlt", iconSeo[0].alt);

      if (userRoutes.includes("/categories/other")) {
        formData.append("title", title);
        formData.append("titleSeo", titleSeo);
        formData.append("description", JSON.stringify(formDescriptions));
        formData.append("descriptionSeo", descriptionSeo);

        if (userRoutes.includes("/categories/slug-edit")) {
          formData.append("slug", slug);
        }
        formData.append("faq", JSON.stringify(faq));

        // formData.append("slug", slug);
        formData.append("slugOld", slugOld);
        formData.append("h1", h1);
        formData.append("active", active);
        formData.append("published", published);
        formData.append("noIndex", noIndex);

        formData.append("publishDate", publishDate);

        if (category.active && category.published) {
          formData.append("showHomePage", showHomePage);
        } else {
          formData.append("showHomePage", false);
        }
        formData.append(
          "shortDescription",
          window.tinymce?.get(`shortDescription`) &&
            window.tinymce?.get(`shortDescription`).getContent()
        );
        if (selectedCategory?.value) {
          formData.append("parentId", selectedCategory.value);
        }
        await axiosInstance.put("/admin/categories/" + _id, formData);
      } else if (userRoutes.includes("/categories/image")) {
        await axiosInstance.patch(
          "/admin/categories/image-update/" + _id,
          formData
        );
      }
      setLoading(false);

      toast.success("Edited Successfully.");

      navigate("/categories");
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
      setLoading(false);
    }
  };
  const addFaqHandler = () => {
    setFaqInput(faqInput + 1);
  };
  const categories = useCallback(async () => {
    setFethcCategotyLoading(true);
    const { data } = await axiosInstance.get("/admin/category-parents");

    setFethcCategotyLoading(false);

    const opt = [];

    for (const e of data) {
      if (e._id === _id) {
        continue;
      }
      if (e.level === 1) {
        opt.push({
          label: e.title,
          value: e._id,
        });

        for (const e2 of data) {
          if (e2.parentId === e._id) {
            opt.push({
              label: "\xa0\xa0\xa0\xa0" + e2.title,
              value: e2._id,
            });
          }
        }
      }
    }

    setCategoryOptions(opt);
  }, [_id]);

  useEffect(() => {
    categories();
  }, [categories]);

  const addDescHandler = () => {
    const newDescInput = descInput + 1;

    setDescInput(newDescInput);

    setDescription((descript) => {
      const newVal = [...descript];
      newVal.push({ order: newDescInput });
      return newVal;
    });

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

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem">
            {fetchCategoryloading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {userRoutes.includes("/categories/other") && (
                    <>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="title">
                            Name
                          </label>
                          <input
                            className={`form-input ${
                              errorMessage?.title ? "is-invalid" : ""
                            }`}
                            id="title"
                            value={title}
                            onChange={(e) =>
                              setTitle(
                                capitalize_first_letter(e.target.value, " ")
                              )
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
                        <div className="mb-3">
                          <label className="form-label" htmlFor="titleSeo">
                            Title Seo
                          </label>
                          <input
                            className={`form-input ${
                              errorMessage?.titleSeo ? "is-invalid" : ""
                            }`}
                            id="titleSeo"
                            value={titleSeo}
                            onChange={(e) => setTitleSeo(e?.target?.value)}
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
                        <div>
                          <label className="form-label" htmlFor="faq">
                            FAQ
                          </label>
                          <div className="p-2 bg-gray">
                            {new Array(faqInput)
                              .fill(undefined)
                              .map((_, index) => (
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
                                  <div className=" my-3">
                                    <label className="form-label">
                                      Question
                                    </label>
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
                                  <div className=" my-3">
                                    <label className="form-label">Answer</label>
                                    <textarea
                                      key={index}
                                      className={`form-input`}
                                      value={faq[index]?.answer || ""}
                                      onChange={(e) => {
                                        const obj = {
                                          answer: e.target.value,
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
                          <label className="form-label" htmlFor="description">
                            Description
                          </label>
                          <div className="p-2 bg-gray">
                            {new Array(descInput)
                              .fill(undefined)
                              .map((_, index) => (
                                <React.Fragment key={index}>
                                  <hr />
                                  {index === descInput - 1 && (
                                    <div className="d-flex">
                                      <Button
                                        onClick={() => {
                                          const newDescription = [
                                            ...description,
                                          ];
                                          newDescription.splice(index, 1);
                                          setDescription(newDescription);

                                          const newDescriptionHeaderType = [
                                            ...descriptionHeaderType,
                                          ];
                                          newDescriptionHeaderType.splice(
                                            index,
                                            1
                                          );
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
                                  <div className=" my-3  ">
                                    <label className="form-label">order</label>
                                    <input
                                      key={index}
                                      className={`form-input`}
                                      value={description[index]?.order}
                                      onChange={(e) => {
                                        const obj = {
                                          order: +e.target.value,
                                        };
                                        description[index] = {
                                          ...description[index],
                                          ...obj,
                                        };
                                        setDescription([...description]);
                                      }}
                                    />
                                  </div>
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
                                      {Array.isArray(
                                        errorMessage?.description
                                      ) &&
                                        Array.isArray(
                                          errorMessage?.description[0]
                                        ) &&
                                        errorMessage?.description[0][index] &&
                                        typeof errorMessage?.description[0][
                                          index
                                        ] === "object" &&
                                        errorMessage?.description[0][index]
                                          .header}
                                    </div>
                                  </div>
                                  <div
                                    style={{ zIndex: 2 }}
                                    className="mb-3 position-relative"
                                  >
                                    <label className="form-label">
                                      Header Type
                                    </label>
                                    <Select
                                      onChange={(selected) => {
                                        const newDescriptionHeaderType = [
                                          ...descriptionHeaderType,
                                        ];
                                        newDescriptionHeaderType[index] =
                                          selected;
                                        setDescriptionHeaderType(
                                          newDescriptionHeaderType
                                        );
                                        const obj = {
                                          headerType: selected.value,
                                        };
                                        description[index] = {
                                          ...description[index],
                                          ...obj,
                                        };
                                        setDescription([...description]);
                                      }}
                                      options={headerType}
                                      value={descriptionHeaderType[index]}
                                    />
                                    <div className="text-danger">
                                      {Array.isArray(
                                        errorMessage?.description
                                      ) &&
                                        Array.isArray(
                                          errorMessage?.description[0]
                                        ) &&
                                        errorMessage?.description[0][index] &&
                                        typeof errorMessage?.description[0][
                                          index
                                        ] === "object" &&
                                        errorMessage?.description[0][index]
                                          .headerType}
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Description
                                    </label>
                                    <textarea
                                      rows="4"
                                      className={`form-input`}
                                      id={`myeditablediv_${index}`}
                                      defaultValue={
                                        description[index]?.desc || ""
                                      }
                                    />
                                    <div className="text-danger">
                                      {Array.isArray(
                                        errorMessage?.description
                                      ) &&
                                        Array.isArray(
                                          errorMessage?.description[0]
                                        ) &&
                                        errorMessage?.description[0][index] &&
                                        typeof errorMessage?.description[0][
                                          index
                                        ] === "object" &&
                                        errorMessage?.description[0][index]
                                          .desc}
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            <Button
                              onClick={addDescHandler}
                              variant="contained"
                              className={"w-100 border-raduis-0"}
                            >
                              <AddCircleTwoToneIcon
                                style={{ marginRight: "5px" }}
                              />
                              Add
                            </Button>
                            <div className="text-danger">
                              {Array.isArray(errorMessage?.description) &&
                                errorMessage?.description[0] &&
                                typeof errorMessage?.description[0] !==
                                  "object" &&
                                errorMessage?.description}
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="descriptionSeo"
                          >
                            Meta Description
                          </label>
                          <textarea
                            className={`form-input ${
                              errorMessage?.descriptionSeo ? "is-invalid" : ""
                            }`}
                            id="descriptionSeo"
                            value={descriptionSeo}
                            onChange={(e) =>
                              setDescriptionSeo(e?.target?.value)
                            }
                            onBlur={(e) =>
                              setDescriptionSeo(
                                capitalize_first_letter(e?.target?.value, ". ")
                              )
                            }
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.descriptionSeo) &&
                              errorMessage?.descriptionSeo.map(
                                (error, index) => <p key={index}>{error}</p>
                              )}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="shortDescription"
                          >
                            Short Description
                          </label>
                          <textarea
                            className={`form-input ${
                              Array.isArray(errorMessage?.shortDescription)
                                ? "is-invalid"
                                : ""
                            }`}
                            id="shortDescription"
                            defaultValue={shortDescription}
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.shortDescription) &&
                              errorMessage?.shortDescription.map(
                                (error, index) => <p key={index}>{error}</p>
                              )}
                          </div>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="slug">
                            Slug
                          </label>
                          <div className="d-flex align-items-center">
                            <div className="me-3 form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={slugOld}
                                onChange={(e) => {
                                  setSlugOld(e.target.checked);
                                  // if (e.target.checked) {
                                  //   setSlug(slug);
                                  // } else {
                                  //   setSlug(
                                  //     capitalize_first_letter(
                                  //       string_to_slug(slug),
                                  //       "-"
                                  //     )
                                  //   );
                                  // }
                                }}
                                id="slugOld"
                              />
                              <label
                                className="form-check-label white-space-nowrap"
                                htmlFor="slugOld"
                              >
                                is old
                              </label>
                            </div>

                            {userRoutes.includes("/categories/slug-edit") ? (
                              <input
                                className={`form-input ${
                                  Array.isArray(errorMessage?.slug)
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="slug"
                                value={slug}
                                onChange={(e) => {
                                  setSlug(string_to_slug_cat(e.target.value));
                                  // if (slugOld) {
                                  //   setSlug(e.target.value);
                                  // } else {
                                  //   setSlug(
                                  //     capitalize_first_letter(
                                  //       string_to_slug(e.target.value),
                                  //       "-"
                                  //     )
                                  //   );
                                  // }
                                }}
                                onBlur={(e) => {
                                  if (!slugOld) {
                                    setSlug(e.target.value.replace(/-$/g, ""));
                                  }
                                }}
                              />
                            ) : (
                              <input
                                className={`form-input ${
                                  Array.isArray(errorMessage?.slug)
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="slug"
                                value={slug}
                                disabled
                              />
                            )}
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
                          <label
                            className="form-label"
                            htmlFor="parent_category"
                          >
                            Parent Category
                          </label>
                          {/* <p>{selectedCategory?.label}</p> */}
                          <Select
                            id="parent_category"
                            isLoading={fethcCategotyLoading}
                            value={selectedCategory}
                            onChange={(selectedCategory) => {
                              setSelectedCategory(selectedCategory);
                            }}
                            options={categoryOptions}
                            isClearable={true}
                          />
                          {errorMessage?.service_category_id}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="descriptionSeo"
                          >
                            H1
                          </label>
                          <input
                            className={`form-input ${
                              errorMessage?.h1 ? "is-invalid" : ""
                            }`}
                            id="h1"
                            value={h1}
                            onChange={(e) =>
                              setH1(
                                capitalize_first_letter(e?.target?.value, " ")
                              )
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

                        {category.active && category.published && (
                          <div className="my-4 form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={showHomePage}
                              onChange={(e) =>
                                setShowHomePage(e.target.checked)
                              }
                              id="showHomePage"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="showHomePage"
                            >
                              Show Home Page
                            </label>
                          </div>
                        )}
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
                    </>
                  )}

                  {userRoutes.includes("/categories/image") && (
                    <>
                      <Grid item xs={12}>
                        {title}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="icon">
                            Icon
                          </label>
                          <DropzoneSingleImage
                            files={icon}
                            setFiles={setIcon}
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.icon) &&
                              errorMessage?.icon.map((error, index) => (
                                <p key={index}>{error}</p>
                              ))}
                          </div>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="iconSeo">
                            Icon Seo
                          </label>
                          <DropzoneSingleImage
                            files={iconSeo}
                            setFiles={setIconSeo}
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.iconSeo) &&
                              errorMessage?.iconSeo.map((error, index) => (
                                <p key={index}>{error}</p>
                              ))}
                          </div>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={12}>
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
                    </>
                  )}
                </Grid>

                <div className="d-flex">
                  <Button type="submit" variant="contained" disabled={loading}>
                    Submit
                  </Button>
                  {loading ? (
                    <CircularProgress className="me-3" color="inherit" />
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CategoryCreate;
