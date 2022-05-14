import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import Select from "react-select";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../../../utiles/axiosInstance";

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

const ProductVS = () => {
  const [fethcCategotyBrandLoading, setFethcCategotyBrandLoading] =
    useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fixedCategory, setFixedCategory] = useState(false);
  const [fixedCategoryLoading, setFixedCategoryLoading] = useState(false);

  const [selectedproducts, setSelectedproducts] = useState(null);
  const [productOptions, setProductOptions] = useState(false);
  const [fixedProducts, setFixedProducts] = useState(false);
  const [fixedProductsLoading, setFixedProductsLoading] = useState(false);

  const [patchAttrubuteLoading, setPatchAttrubuteLoading] = useState(false);
  const [comparisons, setComparisons] = useState([]);

  const [attributeValue, setAttributeValue] = useState({});

  const categorybrands = async () => {
    setFethcCategotyBrandLoading(true);
    const { data } = await axiosInstance.get("/admin/category-level-three");

    setFethcCategotyBrandLoading(false);

    const opt = [];

    for (const e of data) {
      opt.push({
        label: e.title,
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
      "/admin/categories/vs/" + selectedCategory.value + "/products"
    );

    const opt = [];

    for (const e of data.products) {
      opt.push({
        label: e.title,
        value: e._id,
        attributes: e.attributes,
      });
    }

    const selectedP = opt.filter((el) => {
      return data.selectedProducts.includes(el.value);
    });

    selectedP.forEach((element) => {
      element.isFixed = true;
    });

    setProductOptions(opt);
    setSelectedproducts(selectedP);

    setFixedCategory(true);
  };

  const fixProductHandler = async () => {
    setFixedProductsLoading(true);

    const obj = {};
    selectedproducts.forEach((selectedproduct) => {
      if (Array.isArray(selectedproduct.attributes)) {
        selectedproduct.attributes.forEach((attr) => {
          obj[selectedproduct.value] = {
            ...obj[selectedproduct.value],
            [attr.attributeId]: attr.attributeValue,
          };
        });
      }
    });

    setAttributeValue(obj);

    const vsArr = [];

    for (let i = 0; i < selectedproducts.length; i++) {
      for (let j = i + 1; j < selectedproducts.length; j++) {
        vsArr.push({
          first: {
            _id: selectedproducts[i].value,
            title: selectedproducts[i].label,
          },
          second: {
            _id: selectedproducts[j].value,
            title: selectedproducts[j].label,
          },
        });
      }
    }

    const { data } = await axiosInstance.post("/admin/comparisons", {
      vs: vsArr,
      onModel: "product",
      categoryId: selectedCategory.value,
    });

    setComparisons(data);
    setFixedProducts(true);
    setFixedCategoryLoading(false);
    setFixedProductsLoading(false);
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

    await axiosInstance.patch("/admin/products/add-attribute", {
      attributes: obj,
    });

    setPatchAttrubuteLoading(false);
    toast.success("added successfully.");
  };

  const updateArributeValue = (e, product, attribute) => {
    const proArttArray = attributeValue[product.value];

    if (!proArttArray) {
      setAttributeValue({
        ...attributeValue,
        [product.value]: { [attribute._id]: e.target.value },
      });
    } else {
      setAttributeValue({
        ...attributeValue,
        [product.value]: {
          ...attributeValue[product.value],
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
        value = selectedproducts.filter((v) => v.isFixed);
        break;
      default:
    }

    setSelectedproducts(value);
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
                    <label className="form-label" htmlFor="product">
                      Products
                    </label>
                    <Select
                      id="product"
                      value={selectedproducts}
                      onChange={onChange}
                      options={productOptions}
                      isMulti
                      styles={styles}
                      isDisabled={fixedProducts}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {!fixedProducts && (
                      <div className="d-flex">
                        <Button
                          type="button"
                          onClick={fixProductHandler}
                          variant="contained"
                          disabled={fixedProductsLoading}
                        >
                          submit
                        </Button>
                        {fixedProductsLoading ? (
                          <CircularProgress className="ms-3" color="inherit" />
                        ) : null}
                      </div>
                    )}
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
            {fixedProducts && Array.isArray(selectedCategory?.attributes) && (
              <React.Fragment>
                <div className="scroll-x mt-4 vsTable">
                  <table>
                    <tr className={"mt-2"}>
                      <td item xs={12} md={3} />
                      {selectedproducts.map((product) => {
                        return (
                          <td key={product.value} item xs={12} md={3}>
                            {product.label}
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
                          {selectedproducts.map((product) => {
                            return (
                              <td key={product.value} item xs={12} md={3}>
                                <textarea
                                  className={`form-input`}
                                  style={{ minWidth: 200, resize: "both" }}
                                  value={
                                    (attributeValue[product.value] &&
                                      attributeValue[product.value][
                                        attribute._id
                                      ]) ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateArributeValue(e, product, attribute)
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

export default ProductVS;
