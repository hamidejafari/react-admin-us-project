import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import Select from "react-select";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../../../../utiles/axiosInstance";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
};

const CreateBrandVS = () => {
  const [fethcCategotyBrandLoading, setFethcCategotyBrandLoading] =
    useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fixedCategory, setFixedCategory] = useState(false);
  const [fixedCategoryLoading, setFixedCategoryLoading] = useState(false);

  const [selectedbrands, setSelectedbrands] = useState(null);
  const [brandOptions, setbrandOptions] = useState(false);
  const [fixedbrands, setFixedbrands] = useState(false);
  const [fixedbrandsLoading, setFixedbrandsLoading] = useState(false);

  const [patchAttrubuteLoading, setPatchAttrubuteLoading] = useState(false);
  const [comparisons, setComparisons] = useState([]);

  const [attributeValue, setAttributeValue] = useState({});

  const categorybrands = async () => {
    setFethcCategotyBrandLoading(true);
    const { data } = await axiosInstance.get(
      "/admin/brandComparisonCategories-all-select"
    );

    setFethcCategotyBrandLoading(false);

    const opt = [];

    for (const e of data) {
      opt.push({
        label: e.title,
        slug: e.slug,
        attributes: e.attributes,
        value: e._id,
        isFixed: true,
      });
    }
    setCategoryOptions(opt);
  };

  useEffect(() => {
    categorybrands();
  }, []);

  const fixCategoryHandler = async () => {
    setFixedCategoryLoading(true);

    const { data } = await axiosInstance.get(
      "/admin/brandComparisonCategories/vs/" +
        selectedCategory.value +
        "/brands"
    );

    const opt = [];

    for (const e of data.brands) {
      opt.push({
        label: e.title,
        value: e._id,
        attributes: e.attributes,
      });
    }

    const selectedP = opt.filter((el) => {
      return data.selectedBrands.includes(el.value);
    });

    selectedP.forEach((element) => {
      element.isFixed = true;
    });

    setbrandOptions(opt);
    setSelectedbrands(selectedP);

    setFixedCategory(true);
  };

  const fixbrandHandler = async () => {
    setFixedbrandsLoading(true);

    const obj = {};
    selectedbrands.forEach((selectedbrand) => {
      if (Array.isArray(selectedbrand.attributes)) {
        selectedbrand.attributes.forEach((attr) => {
          obj[selectedbrand.value] = {
            ...obj[selectedbrand.value],
            [attr.attributeId]: attr.attributeValue,
          };
        });
      }
    });

    setAttributeValue(obj);

    const vsArr = [];

    for (let i = 0; i < selectedbrands.length; i++) {
      for (let j = i + 1; j < selectedbrands.length; j++) {
        vsArr.push({
          first: {
            _id: selectedbrands[i].value,
            title: selectedbrands[i].label,
            slug: selectedbrands[i].slug,
          },
          second: {
            _id: selectedbrands[j].value,
            title: selectedbrands[j].label,
            slug: selectedbrands[j].slug,
          },
        });
      }
    }

    const { data } = await axiosInstance.post("/admin/comparisons", {
      vs: vsArr,
      onModel: "brand",
      categoryId: selectedCategory.value,
    });

    setComparisons(data);
    setFixedbrands(true);
    setFixedCategoryLoading(false);
    setFixedbrandsLoading(false);
  };

  const submitAttribute = async () => {
    const obj = {};

    for (const va in attributeValue) {
      for (const va2 in attributeValue[va]) {
        if (Array.isArray(obj[va])) {
          obj[va].push({
            attributeId: va2,
            attributeValue: attributeValue[va][va2],
          });
        } else {
          obj[va] = [
            {
              attributeId: va2,
              attributeValue: attributeValue[va][va2],
            },
          ];
        }
      }
    }

    setPatchAttrubuteLoading(true);

    await axiosInstance.patch("/admin/brands/add-attribute", {
      attributes: obj,
    });

    setPatchAttrubuteLoading(false);
    toast.success("added successfully.");
  };

  const updateArributeValue = (e, brand, attribute) => {
    const proArttArray = attributeValue[brand.value];

    if (!proArttArray) {
      setAttributeValue({
        ...attributeValue,
        [brand.value]: { [attribute._id]: e.target.value },
      });
    } else {
      setAttributeValue({
        ...attributeValue,
        [brand.value]: {
          ...attributeValue[brand.value],
          [attribute._id]: e.target.value,
        },
      });
    }
  };

  const onChange = (value, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        value = selectedbrands.filter((v) => v.isFixed);
        break;
      default:
    }

    setSelectedbrands(value);
  };

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs>
          <div className="card mb-12rem">
            <Grid container spacing={2} alignItems={"end"}>
              <Grid item xs={12} md={6}>
                <label className="form-label" htmlFor="category">
                  Category
                </label>
                <Select
                  id="category"
                  isLoading={fethcCategotyBrandLoading}
                  value={selectedCategory}
                  onChange={(selectedCategory) => {
                    setSelectedCategory(selectedCategory);
                  }}
                  options={categoryOptions}
                  isDisabled={fixedCategory}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {!fixedCategory && (
                  <div className="d-flex">
                    <Button
                      type="button"
                      onClick={fixCategoryHandler}
                      variant="contained"
                      disabled={fixedCategoryLoading}
                    >
                      submit
                    </Button>
                    {fixedCategoryLoading ? (
                      <CircularProgress className="ms-3" color="inherit" />
                    ) : null}
                  </div>
                )}
              </Grid>
              {fixedCategory && (
                <React.Fragment>
                  <Grid item xs={12} md={6}>
                    <label className="form-label" htmlFor="brand">
                      brands
                    </label>
                    <Select
                      id="brand"
                      value={selectedbrands}
                      onChange={onChange}
                      options={brandOptions}
                      isMulti
                      styles={styles}
                      isDisabled={fixedbrands}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {!fixedbrands && (
                      <div className="d-flex">
                        <Button
                          type="button"
                          onClick={fixbrandHandler}
                          variant="contained"
                          disabled={fixedbrandsLoading}
                        >
                          submit
                        </Button>
                        {fixedbrandsLoading ? (
                          <CircularProgress className="ms-3" color="inherit" />
                        ) : null}
                      </div>
                    )}
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
            {fixedbrands && Array.isArray(selectedCategory?.attributes) && (
              <React.Fragment>
                <div className="scroll-x mt-4 vsTable">
                  <table>
                    <tr>
                      <td item xs={12} md={3} />
                      {selectedbrands.map((brand) => {
                        return (
                          <td key={brand.value} item xs={12} md={3}>
                            {brand.label}
                          </td>
                        );
                      })}
                    </tr>
                    {selectedCategory.attributes.map((attribute) => {
                      return (
                        <tr
                          key={attribute._id}
                          container
                          spacing={2}
                          className={"mt-2"}
                        >
                          <td item xs={12} md={3}>
                            <label className="form-label">
                              {attribute.title}
                            </label>
                          </td>
                          {selectedbrands.map((brand) => {
                            return (
                              <td key={brand.value} item xs={12} md={3}>
                                <textarea
                                  className={`form-input`}
                                  style={{ minWidth: 200, resize: "both" }}
                                  value={
                                    (attributeValue[brand.value] &&
                                      attributeValue[brand.value][
                                        attribute._id
                                      ]) ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateArributeValue(e, brand, attribute)
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <div className="d-flex" style={{ marginTop: "2.1rem" }}>
                  <Button
                    type="button"
                    onClick={submitAttribute}
                    variant="contained"
                    disabled={patchAttrubuteLoading}
                  >
                    submit
                  </Button>
                  {patchAttrubuteLoading ? (
                    <CircularProgress className="me-3" color="inherit" />
                  ) : null}
                </div>
                <div className="mt-5">
                  {comparisons.map((v, i) => {
                    return (
                      <Grid key={i} container spacing={2} className={"mt-2"}>
                        <Grid item xs>
                          <p>{v.compare1Id?.title}</p>
                        </Grid>
                        <Grid item xs>
                          <p>vs</p>
                        </Grid>
                        <Grid item xs>
                          <p>{v.compare2Id?.title}</p>
                        </Grid>
                        <Grid item xs>
                          <Button
                            as={Link}
                            to={"/vs/" + v._id}
                            type="button"
                            variant="contained"
                          >
                            vs
                          </Button>
                        </Grid>
                      </Grid>
                    );
                  })}
                </div>
              </React.Fragment>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CreateBrandVS;
