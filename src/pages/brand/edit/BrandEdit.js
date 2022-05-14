import React, { useState, useEffect, useCallback } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import axiosInstance from "../../../utiles/axiosInstance";
import DropzoneSingleImage from "../../../components/UI/DropzoneSingleImage/DropzoneSingleImage";
// import string_to_slug from "../../../utiles/string_to_slug";
import useGetData from "../../../hooks/useGetData";
import capitalize_first_letter from "../../../utiles/capitalize_first_letter";
import { getFlagsAction } from "../../../redux/slices/flagSlice";
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

const BrandEdit = () => {
  const [descInput, setDescInput] = useState(0);
  const [faqInput, setFaqInput] = useState(0);
  const [prosInput, setProsInput] = useState(0);
  const [consInput, setConsInput] = useState(0);

  const [searchTagInput, setSearchTagInput] = useState(0);
  const [searchTags, setSearchTags] = useState([]);
  const [headerImage, setHeaderImage] = useState([]);
  const [title, setTitle] = useState("");
  const [titleSeo, setTitleSeo] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [description, setDescription] = useState([]);
  const [descriptionSeo, setDescriptionSeo] = useState("");
  const [descriptionHeaderType, setDescriptionHeaderType] = useState([]);
  const [descriptionShort, setDescriptionShort] = useState("");
  const [faq, setFaq] = useState([]);
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);
  const [showHomePage, setShowHomePage] = useState(false);
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
  const [published, setPublished] = useState(true);
  const [noIndex, setNoIndex] = useState(false);

  const [publishDate, setPublishDate] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [flagOptions, setFlagsOptions] = useState([]);

  const { _id } = useParams();

  const { loading: fetchBrandloading, data: brand, getData } = useGetData();

  const addSearchTagHandler = () => {
    setSearchTagInput(searchTagInput + 1);
  };

  useEffect(() => {
    getData("/admin/brands/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!brand) {
      return;
    }
    setTitle(brand.title);
    setTitleSeo(brand.titleSeo);

    const descript = brand.description.map((description, index) => {
      return { ...description, order: index + 1 };
    });

    setDescription(descript);

    setDescriptionSeo(brand.descriptionSeo);
    setDescriptionShort(brand.descriptionShort);
    setSiteUrl(brand.siteUrl);
    setYoutubeVideoLink(brand.youtubeVideoLink);
    setUtmLink(brand.utmLink);
    setPublished(brand.published);
    setNoIndex(brand.noIndex);

    setPublishDate(brand.publishDate);
    if (brand?.searchTags?.length) {
      console.log(brand?.searchTags);
      setSearchTagInput(brand.searchTags.length);
      setSearchTags(brand.searchTags);
    }

    if (brand.overalRating) {
      const overalRatingString = brand.overalRating.toString();
      if (overalRatingString) {
        const overalRatingArr = overalRatingString.split(".");
        if (overalRatingArr[0]) {
          setOveralRatingNum(overalRatingArr[0]);
        }
        if (overalRatingArr[1]) {
          setOveralRatingDecimal(overalRatingArr[1]);
        }
      }
    }

    if (brand.star) {
      const starString = brand.star.toString();
      if (starString) {
        const starArr = starString.split(".");
        if (starArr[0]) {
          setStarNum(starArr[0]);
        }
        if (starArr[1]) {
          setStarDecimal(starArr[1]);
        }
      }
    }

    if (Array.isArray(brand.categories)) {
      const cats = [];

      brand.categories.forEach((element) => {
        if (element?._id?.level === 2) {
          cats.push({
            label: element?._id?.title,
            value: element?._id?._id,
          });
        }
      });

      setSelectedCategory(cats);
    }

    if (brand.special) {
      setSelectedSpecial({
        value: brand.special,
        label: brand.special,
      });
    }

    if (brand?.faq?.length) {
      setFaqInput(brand.faq.length);
      setFaq(brand.faq);
    }
    if (brand?.pros?.length) {
      setProsInput(brand.pros.length);
      setPros(brand.pros);

      setTimeout(() => {
        brand.pros.forEach((element, index) => {
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
    if (brand?.cons?.length) {
      setConsInput(brand.cons.length);
      setCons(brand.cons);

      setTimeout(() => {
        brand.cons.forEach((element, index) => {
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
    setSlug(brand.slug);
    setActive(brand.active);
    setShowHomePage(brand.showHomePage);
    if (brand.flag && brand.flag.name) {
      setSelectedFlag({
        label: brand.flag.name + " " + brand.flag.emoji,
        value: {
          _id: brand.flag._id,
          code: brand.flag.code,
          emoji: brand.flag.emoji,
          name: brand.flag.name,
        },
      });
    }
    setH1(brand.h1);
    if (brand?.description?.length) {
      setDescInput(brand.description.length);

      const arr = [];

      for (const head of brand.description) {
        arr.push({ label: head.headerType, value: head.headerType });
      }
      setDescriptionHeaderType(arr);

      setTimeout(() => {
        brand.description.forEach((element, index) => {
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
    setTimeout(() => {
      window.tinymce?.init({
        selector: "#descriptionShort",
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    }, 100);

    if (brand.image?.fileName) {
      setImage([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            brand.image?.fileName,
          name: brand.image?.fileName,
          alt: brand.image?.alt,
        },
      ]);
    }
    if (brand.imageProduct?.fileName) {
      setImageProduct([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            brand.imageProduct?.fileName,
          name: brand.imageProduct?.fileName,
          alt: brand.imageProduct?.alt,
        },
      ]);
    }

    if (brand.headerImage?.fileName) {
      setHeaderImage([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            brand.headerImage?.fileName,
          name: brand.headerImage?.fileName,
          alt: brand.headerImage?.alt,
        },
      ]);
    }

    if (brand.imageSeo?.fileName) {
      setImageSeo([
        {
          preview:
            process.env.REACT_APP_BACKEND_API_URL +
            "/files/images/main/" +
            brand.imageSeo?.fileName,
          name: brand.imageSeo?.fileName,
          alt: brand.imageSeo?.alt,
        },
      ]);
    }
  }, [brand]);

  const navigate = useNavigate();

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

      if (image[0] && image[0].type) {
        formData.append("image", image[0]);
      }
      image[0]?.alt && formData.append("imageAlt", image[0].alt);

      if (imageProduct[0] && imageProduct[0].type) {
        formData.append("imageProduct", imageProduct[0]);
      }
      imageProduct[0]?.alt &&
        formData.append("imageProductAlt", imageProduct[0].alt);

      if (headerImage[0] && headerImage[0].type) {
        formData.append("headerImage", headerImage[0]);
      }

      headerImage[0]?.alt &&
        formData.append("headerImageAlt", headerImage[0].alt);

      if (imageSeo[0] && imageSeo[0].type) {
        formData.append("imageSeo", imageSeo[0]);
      }

      imageSeo[0]?.alt && formData.append("imageSeoAlt", imageSeo[0].alt);

      if (userRoutes.includes("/brands/other")) {
        formData.append("title", title);
        formData.append("titleSeo", titleSeo);
        formData.append("searchTags", JSON.stringify(searchTags));

        if (userRoutes.includes("/brands/slug-edit")) {
          formData.append("slug", slug);
        }

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
        formData.append(
          "descriptionShort",
          window.tinymce?.get(`descriptionShort`).getContent()
        );
        // formData.append("slug", slug);
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
        if (brand.active && brand.published) {
          formData.append("showHomePage", showHomePage);
        } else {
          formData.append("showHomePage", false);
        }
        formData.append("published", published);
        formData.append("noIndex", noIndex);

        formData.append("publishDate", publishDate);
        if (selectedCategory?.value) {
          formData.append("parentId", selectedCategory.value);
        }

        if (selectedFlag?.value) {
          formData.append("flag", JSON.stringify(selectedFlag.value));
        }

        if (youtubeVideoLink) {
          formData.append("youtubeVideoLink", youtubeVideoLink);
        }
        if (utmLink) {
          formData.append("utmLink", utmLink);
        }
        await axiosInstance.put("/admin/brands/" + _id, formData);
      } else if (userRoutes.includes("/brands/image")) {
        await axiosInstance.patch(
          "/admin/brands/image-update/" + _id,
          formData
        );
      }

      setLoading(false);

      toast.success("Updated Successfully.");
      navigate("/brands");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
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
  }, []);

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
                  {userRoutes.includes("/brands/other") && (
                    <>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="title">
                            Name
                          </label>
                          <input
                            className={`form-input ${
                              Array.isArray(errorMessage?.title)
                                ? "is-invalid"
                                : ""
                            }`}
                            id="title"
                            value={title}
                            onChange={(e) => {
                              // setSlug(
                              //   string_to_slug(e.target.value.trim()) + "-reviews"
                              // );
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
                        <div>
                          <label className="form-label" htmlFor="slug">
                            Slug (URL)
                          </label>
                          {userRoutes.includes("/brands/slug-edit") ? (
                            <input
                              className={`form-input ${
                                Array.isArray(errorMessage?.slug)
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="slug"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
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
                        <div
                          style={{ zIndex: 3 }}
                          className="mb-3 position-relative"
                        >
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
                        <div
                          style={{ zIndex: 2 }}
                          className="mb-3 position-relative"
                        >
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
                        <div
                          style={{ zIndex: 2 }}
                          className="mb-3 position-relative"
                        >
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
                          <label
                            className="form-label"
                            htmlFor="youtubeVideoLink"
                          >
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
                            onChange={(e) =>
                              setYoutubeVideoLink(e.target.value)
                            }
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.youtubeVideoLink) &&
                              errorMessage?.youtubeVideoLink.map(
                                (error, index) => <p key={index}>{error}</p>
                              )}
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
                                  <Grid
                                    container
                                    spacing={1}
                                    className={"w-100"}
                                  >
                                    <Grid
                                      item
                                      md={
                                        index === searchTagInput - 1 ? 10 : 12
                                      }
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
                                            setSearchTagInput(
                                              searchTagInput - 1
                                            );
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
                              <AddCircleTwoToneIcon
                                style={{ marginRight: "5px" }}
                              />
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
                                    <label className="form-label">Pros</label>
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
                                    <label className="form-label">Cons</label>
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
                                  <div className="mb-3">
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
                              Array.isArray(errorMessage?.descriptionSeo)
                                ? "is-invalid"
                                : ""
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
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="descriptionShort"
                          >
                            Short Description
                          </label>
                          <textarea
                            className={`form-input`}
                            defaultValue={descriptionShort}
                            id="descriptionShort"
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.descriptionShort) &&
                              errorMessage?.descriptionShort.map(
                                (error, index) => <p key={index}>{error}</p>
                              )}
                          </div>
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
                              Array.isArray(errorMessage?.h1)
                                ? "is-invalid"
                                : ""
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
                          <label className="form-label" htmlFor="utmLink">
                            UTM Link
                          </label>
                          <input
                            className={`form-input ${
                              Array.isArray(errorMessage?.utmLink)
                                ? "is-invalid"
                                : ""
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
                                  let isOk = false;
                                  if (e.target.value.trim() === "") {
                                    setStarNum(e.target.value);
                                    isOk = true;
                                  } else if (+e.target.value === 5) {
                                    setStarNum(e.target.value);
                                    setStarDecimal("");
                                    isOk = true;
                                  } else if (
                                    /^[0-4]{1,1}$/.test(e.target.value)
                                  ) {
                                    setStarNum(e.target.value);
                                    isOk = true;
                                  }
                                  if (isOk) {
                                    const star =
                                      e.target.value.trim() + "." + starDecimal;
                                    if (star !== ".") {
                                      const overalRatingNewValue = +star * 2;
                                      const overalRatingNewValueArray =
                                        overalRatingNewValue
                                          .toString()
                                          .split(".");
                                      overalRatingNewValueArray[0]
                                        ? setOveralRatingNum(
                                            overalRatingNewValueArray[0]
                                          )
                                        : setOveralRatingNum("");
                                      overalRatingNewValueArray[1]
                                        ? setOveralRatingDecimal(
                                            overalRatingNewValueArray[1]
                                          )
                                        : setOveralRatingDecimal("");
                                    }
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
                                    let isOk = false;
                                    if (e.target.value.trim() === "") {
                                      isOk = true;
                                      setStarDecimal(e.target.value);
                                    } else if (
                                      /^[0-9]{1,2}$/.test(e.target.value)
                                    ) {
                                      isOk = true;

                                      setStarDecimal(e.target.value);
                                    }
                                    if (isOk) {
                                      const star =
                                        starNum + "." + e.target.value.trim();
                                      if (star !== ".") {
                                        const overalRatingNewValue = +star * 2;
                                        const overalRatingNewValueArray =
                                          overalRatingNewValue
                                            .toString()
                                            .split(".");
                                        overalRatingNewValueArray[0]
                                          ? setOveralRatingNum(
                                              overalRatingNewValueArray[0]
                                            )
                                          : setOveralRatingNum("");
                                        overalRatingNewValueArray[1]
                                          ? setOveralRatingDecimal(
                                              overalRatingNewValueArray[1]
                                            )
                                          : setOveralRatingDecimal("");
                                      }
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
                                  } else if (
                                    /^[0-9]{1,1}$/.test(e.target.value)
                                  ) {
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
                                    Array.isArray(
                                      errorMessage?.overalRatingDecimal
                                    )
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="overalRatingDecimal"
                                  value={overalRatingDecimal}
                                  onChange={(e) => {
                                    if (e.target.value.trim() === "") {
                                      setOveralRatingDecimal(e.target.value);
                                    } else if (
                                      /^[0-9]{1,2}$/.test(e.target.value)
                                    ) {
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
                        {brand.active && brand.published && (
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

                  {userRoutes.includes("/brands/image") && (
                    <>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="image">
                            Image
                          </label>
                          <DropzoneSingleImage
                            files={image}
                            setFiles={setImage}
                          />
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
                    </>
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

export default BrandEdit;
