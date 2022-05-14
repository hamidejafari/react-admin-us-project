import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { toast } from "react-toastify";
import Select from "react-select";
import { useParams } from "react-router";
import axiosInstance from "../../../utiles/axiosInstance";
import AddIcon from "@mui/icons-material/Add";
import useGetData from "../../../hooks/useGetData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";

const ProductSort = () => {
  const [fethcProductLoading, setFethcProductLoading] = useState(null);
  const [productStar, setProductStar] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProduct2, setSelectedProduct2] = useState([]);
  const [selectedProduct3, setSelectedProduct3] = useState([]);

  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [rows3, setRows3] = useState([]);

  const [loading, setLoading] = useState(false);
  const [starLoading, setStarLoading] = useState(false);

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const {
    loading: fetchCategoryLoading,
    data: category,
    getData,
  } = useGetData();

  const { _id } = useParams();

  useEffect(() => {
    getData("/admin/categories/" + _id);
  }, [getData, _id]);

  useEffect(() => {
    if (!category) {
      return;
    }
    const opt3 = {};

    if (category?.products) {
      const newRows = [];

      category.products?.forEach((item) => {
        newRows.push({
          productTitle: item?._id?.title,
          productId: item?._id?._id,
          standing: item?.standing,
        });

        opt3[item?._id?._id] = item?._id?.star;
      });

      newRows.sort((a, b) => {
        return a.standing - b.standing;
      });

      setRows(newRows);

      const newRows2 = [];

      category.draftProducts[0]?.forEach((item) => {
        newRows2.push({
          productTitle: item?._id?.title,
          productId: item?._id?._id,
          standing: item?.standing,
        });

        opt3[item?._id?._id] = item?._id?.star;
      });

      newRows2.sort((a, b) => {
        return a.standing - b.standing;
      });

      setRows2(newRows2);

      const newRows3 = [];

      category.draftProducts[1]?.forEach((item) => {
        newRows3.push({
          productTitle: item?._id?.title,
          productId: item?._id?._id,
          standing: item?.standing,
        });

        opt3[item?._id?._id] = item?._id?.star;
      });

      newRows3.sort((a, b) => {
        return a.standing - b.standing;
      });

      setRows3(newRows3);
    }

    setProductStar(opt3);
  }, [category]);

  function addRow() {
    if (!selectedProduct?.value) {
      return;
    }
    const singleRow = {
      productId: selectedProduct.value,
      productTitle: selectedProduct.label,
    };
    const allRows = rows;

    let checkDuplicate = 0;
    rows.forEach((item, index) => {
      if (
        JSON.stringify(item.productId) === JSON.stringify(selectedProduct.value)
      ) {
        checkDuplicate = 1;
      }
    });

    if (checkDuplicate === 0) {
      allRows.push(singleRow);
      setRows([...allRows]);

      console.log(rows);
      setSelectedProduct(null);
      toast.success("successfull");
    } else {
      toast.error("duplicate product row");
    }
  }

  function addRow2() {
    if (!selectedProduct2?.value) {
      return;
    }
    const singleRow2 = {
      productId: selectedProduct2.value,
      productTitle: selectedProduct2.label,
    };

    let checkDuplicate = 0;

    const allRows2 = rows2;
    rows2.forEach((item, index) => {
      if (
        JSON.stringify(item.productId) ===
        JSON.stringify(selectedProduct2.value)
      ) {
        checkDuplicate = 1;
      }
    });

    if (checkDuplicate === 0) {
      allRows2.push(singleRow2);
      setRows2([...allRows2]);

      console.log(rows);
      setSelectedProduct2(null);
      // toast.success("successfull");
    } else {
      toast.error("duplicate product row");
    }
  }

  function addRow3() {
    if (!selectedProduct3?.value) {
      return;
    }
    const singleRow = {
      productId: selectedProduct3.value,
      productTitle: selectedProduct3.label,
    };
    let checkDuplicate = 0;

    const allRows3 = rows3;
    rows3.forEach((item, index) => {
      if (
        JSON.stringify(item.productId) ===
        JSON.stringify(selectedProduct3.value)
      ) {
        checkDuplicate = 1;
      }
    });

    if (checkDuplicate === 0) {
      allRows3.push(singleRow);
      setRows3([...allRows3]);

      setSelectedProduct3(null);
      // toast.success("successfull");
    } else {
      toast.error("duplicate product row");
    }
  }

  const submitStar = async () => {
    const stars = Object.keys(productStar).map((key) => [
      key,
      productStar[key],
    ]);

    setStarLoading(true);

    await axiosInstance.patch("/admin/products/star", { stars });

    setStarLoading(false);
    toast.success("Saved Sucessfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formData = new FormData();

      let standingSortObject = [];

      if (rows) {
        const myObj = [];
        const myObj2 = [];
        const myObj3 = [];
        rows.forEach((item, index) => {
          myObj.push({
            _id: item.productId,
            standing: index + 1,
          });
        });
        rows2.forEach((item, index) => {
          myObj2.push({
            _id: item.productId,
            standing: index + 1,
          });
        });
        rows3.forEach((item, index) => {
          myObj3.push({
            _id: item.productId,
            standing: index + 1,
          });
        });
        standingSortObject = [myObj, myObj2, myObj3];
        formData.append("sortObject", JSON.stringify(standingSortObject));
      }

      formData.append("categoryId", _id);

      await axiosInstance.post("/admin/category-sort-product", formData);

      setLoading(false);

      toast.success("Saved Sucessfully");
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    const af = async () => {
      setFethcProductLoading(true);
      const { data } = await axiosInstance.get(
        "/admin/category-products?category=" + _id
      );
      setFethcProductLoading(false);
      const opt2 = [];
      for (const e2 of data?.data) {
        opt2.push({
          label: e2.title,
          value: e2._id,
        });
      }
      setProductOptions(opt2);
    };

    af();
  }, [_id]);

  function onDragEnd(result) {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const allRows = reorder(
      rows,
      result.source.index,
      result.destination.index
    );

    setRows(allRows);
  }

  function onDragEndSecond(result) {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const allRows = reorder(
      rows2,
      result.source.index,
      result.destination.index
    );

    setRows2(allRows);
  }

  function onDragEndThird(result) {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const allRows = reorder(
      rows3,
      result.source.index,
      result.destination.index
    );

    setRows3(allRows);
  }

  function deleteRow(indexRow) {
    const allRows = rows;
    var filtered = allRows.filter(function (value, index, arr) {
      return index !== indexRow;
    });
    setRows([...filtered]);
  }

  function deleteRow2(indexRow) {
    const allRows2 = rows2;
    var filtered = allRows2.filter(function (value, index, arr) {
      return index !== indexRow;
    });
    setRows2([...filtered]);
  }

  function deleteRow3(indexRow) {
    const allRows3 = rows3;
    var filtered = allRows3.filter(function (value, index, arr) {
      return index !== indexRow;
    });
    setRows3([...filtered]);
  }

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem">
            {fetchCategoryLoading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-5">{category.title}</h3>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="product">
                        Product
                      </label>
                      <Select
                        id="product"
                        isLoading={fethcProductLoading}
                        value={selectedProduct || ""}
                        onChange={(value) => {
                          setSelectedProduct(value);
                        }}
                        options={productOptions}
                        isClearable
                      />
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {rows.map((item, index) => (
                              <Draggable
                                key={item.productId}
                                draggableId={item.productId}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="position-relative"
                                  >
                                    <div
                                      style={{
                                        background: "#ddf",
                                        borderRadius: "15px",
                                        padding: "10px",
                                        fontSize: "19px",
                                        border: "2px solid #1b1b1b",
                                        width: "80%",
                                        textAlign: "center",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <span>
                                        #{index + 1} {item.productTitle}
                                      </span>
                                    </div>
                                    <input
                                      className="form-input mb-3"
                                      type="text"
                                      value={productStar[item.productId]}
                                      onChange={(e) => {
                                        setProductStar((productStar) => {
                                          productStar[item.productId] =
                                            e.target.value;
                                          return { ...productStar };
                                        });
                                      }}
                                    />

                                    <span
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                      }}
                                      className="cursor-pointer me-3"
                                      // onClick={deleteRow(index)}
                                      onClick={() => {
                                        deleteRow(index);
                                      }}
                                    >
                                      <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <div style={{ marginTop: 21 }}>
                      <Button
                        type="button"
                        variant="contained"
                        onClick={addRow}
                        sx={{
                          marginTop: "12px",
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="product">
                        Product
                      </label>
                      <Select
                        id="product"
                        isLoading={fethcProductLoading}
                        value={selectedProduct2 || ""}
                        onChange={(value) => {
                          setSelectedProduct2(value);
                        }}
                        options={productOptions}
                        isClearable
                      />
                    </div>
                    <DragDropContext onDragEnd={onDragEndSecond}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {rows2.map((item, index) => (
                              <Draggable
                                key={item.productId}
                                draggableId={item.productId}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="position-relative"
                                  >
                                    <div
                                      style={{
                                        background: "#ddf",
                                        borderRadius: "15px",
                                        padding: "10px",
                                        fontSize: "19px",
                                        border: "2px solid #1b1b1b",
                                        width: "80%",
                                        textAlign: "center",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <span>
                                        #{index + 1} {item.productTitle}
                                      </span>
                                    </div>
                                    <input
                                      className="form-input mb-3"
                                      type="text"
                                      value={productStar[item.productId]}
                                      onChange={(e) => {
                                        setProductStar((productStar) => {
                                          productStar[item.productId] =
                                            e.target.value;
                                          return { ...productStar };
                                        });
                                      }}
                                    />

                                    <span
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                      }}
                                      className="cursor-pointer me-3"
                                      // onClick={deleteRow(index)}
                                      onClick={() => {
                                        deleteRow2(index);
                                      }}
                                    >
                                      <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <div style={{ marginTop: 21 }}>
                      <Button
                        type="button"
                        variant="contained"
                        className={"rounded-cu-2"}
                        onClick={addRow2}
                        sx={{
                          marginTop: "12px",
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="product">
                        Product
                      </label>
                      <Select
                        id="product"
                        isLoading={fethcProductLoading}
                        value={selectedProduct3 || ""}
                        onChange={(value) => {
                          setSelectedProduct3(value);
                        }}
                        options={productOptions}
                        isClearable
                      />
                    </div>
                    <DragDropContext onDragEnd={onDragEndThird}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {rows3.map((item, index) => (
                              <Draggable
                                key={item.productId}
                                draggableId={item.productId}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="position-relative"
                                  >
                                    <div
                                      style={{
                                        background: "#ddf",
                                        borderRadius: "15px",
                                        padding: "10px",
                                        fontSize: "19px",
                                        border: "2px solid #1b1b1b",
                                        width: "80%",
                                        textAlign: "center",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <span>
                                        #{index + 1} {item.productTitle}
                                      </span>
                                    </div>
                                    <input
                                      className="form-input mb-3"
                                      type="text"
                                      value={productStar[item.productId]}
                                      onChange={(e) => {
                                        setProductStar((productStar) => {
                                          productStar[item.productId] =
                                            e.target.value;
                                          return { ...productStar };
                                        });
                                      }}
                                    />

                                    <span
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                      }}
                                      className="cursor-pointer me-3"
                                      // onClick={deleteRow(index)}
                                      onClick={() => {
                                        deleteRow3(index);
                                      }}
                                    >
                                      <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <div style={{ marginTop: 21 }}>
                      <Button
                        type="button"
                        variant="contained"
                        className={"rounded-cu-2"}
                        onClick={addRow3}
                        sx={{
                          marginTop: "12px",
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      disabled={starLoading}
                      className="ms-auto"
                      type="button"
                      onClick={submitStar}
                    >
                      submit star
                    </Button>
                    {starLoading ? (
                      <CircularProgress className="me-3" color="inherit" />
                    ) : null}
                    {loading ? (
                      <CircularProgress className="me-3" color="inherit" />
                    ) : null}
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

export default ProductSort;
