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

const BrandSort = () => {
  const [fethcBrandLoading, setFethcBrandLoading] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedBrand2, setSelectedBrand2] = useState([]);
  const [selectedBrand3, setSelectedBrand3] = useState([]);

  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [rows3, setRows3] = useState([]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    console.log(result);
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

    if (category?.brands) {
      const newRows = [];

      category.brands?.forEach((item) => {
        newRows.push({
          brandTitle: item?._id?.title,
          brandId: item?._id?._id,
          standing: item?.standing,
        });
      });

      newRows.sort((a, b) => {
        return a.standing - b.standing;
      });

      const newRows2 = [];

      category.draftBrands[0]?.forEach((item) => {
        newRows2.push({
          brandTitle: item?._id?.title,
          brandId: item?._id?._id,
          standing: item?.standing,
        });
      });

      newRows2.sort((a, b) => {
        return a.standing - b.standing;
      });

      const newRows3 = [];

      category.draftBrands[1]?.forEach((item) => {
        newRows3.push({
          brandTitle: item?._id?.title,
          brandId: item?._id?._id,
          standing: item?.standing,
        });
      });

      newRows3.sort((a, b) => {
        return a.standing - b.standing;
      });

      setRows(newRows);
      setRows2(newRows2);
      setRows3(newRows3);
    }
  }, [category]);

  const categorybrands = async () => {
    setFethcBrandLoading(true);
    const { data } = await axiosInstance.get("/admin/product-parents");
    setFethcBrandLoading(false);
    const opt2 = [];
    for (const e2 of data.brands) {
      opt2.push({
        label: e2.title,
        value: e2._id,
      });
    }
    setBrandOptions(opt2);
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
            _id: item.brandId,
            standing: index + 1,
          });
        });
        rows2.forEach((item, index) => {
          myObj2.push({
            _id: item.brandId,
            standing: index + 1,
          });
        });
        rows3.forEach((item, index) => {
          myObj3.push({
            _id: item.brandId,
            standing: index + 1,
          });
        });
        standingSortObject = [myObj, myObj2, myObj3];
        formData.append("sortObject", JSON.stringify(standingSortObject));
      }

      formData.append("categoryId", _id);

      await axiosInstance.post("/admin/category-sort-brand", formData);
      setLoading(false);

      toast.success("Saved Sucessfully");
    } catch (error) {
      setLoading(false);

      // console.log(error);
      // if (error.response?.data?.error) {
      //   setErrorMessage(error.response?.data?.error);
      // }
    }
  };

  useEffect(() => {
    categorybrands();
  }, []);

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

  function addRow() {
    if (!selectedBrand?.value) {
      return;
    }
    const singleRow = {
      brandId: selectedBrand.value,
      brandTitle: selectedBrand.label,
    };
    const allRows = rows;
    let checkDuplicate = 0;

    rows.forEach((item, index) => {
      if (
        JSON.stringify(item.brandId) === JSON.stringify(selectedBrand.value)
      ) {
        checkDuplicate = 1;
      }
    });

    if (checkDuplicate === 0) {
      allRows.push(singleRow);
      setRows([...allRows]);

      console.log(rows);
      setSelectedBrand(null);
      // toast.success("successfull");
    } else {
      toast.error("duplicate brand row");
    }
  }

  function addRow2() {
    if (!selectedBrand2?.value) {
      return;
    }
    const singleRow2 = {
      brandId: selectedBrand2.value,
      brandTitle: selectedBrand2.label,
    };
    let checkDuplicate2 = 0;

    const allRows2 = [...rows2];
    allRows2.forEach((item, index) => {
      if (
        JSON.stringify(item.brandId) === JSON.stringify(selectedBrand2.value)
      ) {
        checkDuplicate2 = 1;
      }
    });
    if (checkDuplicate2 === 0) {
      allRows2.push(singleRow2);
      setRows2(allRows2);

      console.log(rows2);
      setSelectedBrand2(null);
      // toast.success("successfull");
    } else {
      toast.error("duplicate brand row");
    }
  }

  function addRow3() {
    if (!selectedBrand3?.value) {
      return;
    }
    const singleRow = {
      brandId: selectedBrand3.value,
      brandTitle: selectedBrand3.label,
    };
    let checkDuplicate3 = 0;

    const allRows3 = rows3;
    rows3.forEach((item, index) => {
      if (
        JSON.stringify(item.brandId) === JSON.stringify(selectedBrand3.value)
      ) {
        checkDuplicate3 = 1;
      }
    });

    if (checkDuplicate3 === 0) {
      allRows3.push(singleRow);
      setRows3([...allRows3]);

      setSelectedBrand3(null);
      // toast.success("successfull");
    } else {
      toast.error("duplicate brand row");
    }
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
                      <label className="form-label" htmlFor="brand">
                        Brand
                      </label>
                      <Select
                        id="brand"
                        isLoading={fethcBrandLoading}
                        value={selectedBrand || ""}
                        onChange={(value) => {
                          setSelectedBrand(value);
                        }}
                        options={brandOptions}
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
                              <>
                                <Draggable
                                  key={item.brandId}
                                  draggableId={item.brandId}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
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
                                          #{index + 1} {item.brandTitle}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>

                                <span
                                  style={{ float: "right", marginTop: "-16%" }}
                                  className="cursor-pointer me-3"
                                  // onClick={deleteRow(index)}
                                  onClick={() => {
                                    deleteRow(index);
                                  }}
                                >
                                  <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                                </span>
                              </>
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
                      <label className="form-label" htmlFor="brand">
                        Brand
                      </label>
                      <Select
                        id="brand"
                        isLoading={fethcBrandLoading}
                        value={selectedBrand2 || ""}
                        onChange={(value) => {
                          setSelectedBrand2(value);
                        }}
                        options={brandOptions}
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
                              <>
                                <Draggable
                                  key={item.brandId}
                                  draggableId={item.brandId}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
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
                                          #{index + 1} {item.brandTitle}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>

                                <span
                                  style={{ float: "right", marginTop: "-16%" }}
                                  className="cursor-pointer me-3"
                                  // onClick={deleteRow(index)}
                                  onClick={() => {
                                    deleteRow2(index);
                                  }}
                                >
                                  <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                                </span>
                              </>
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
                      <label className="form-label" htmlFor="brand">
                        Brand
                      </label>
                      <Select
                        id="brand"
                        isLoading={fethcBrandLoading}
                        value={selectedBrand3 || ""}
                        onChange={(value) => {
                          setSelectedBrand3(value);
                        }}
                        options={brandOptions}
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
                              <>
                                <Draggable
                                  key={item.brandId}
                                  draggableId={item.brandId}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
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
                                          #{index + 1} {item.brandTitle}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>

                                <span
                                  style={{ float: "right", marginTop: "-16%" }}
                                  className="cursor-pointer me-3"
                                  // onClick={deleteRow(index)}
                                  onClick={() => {
                                    deleteRow3(index);
                                  }}
                                >
                                  <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                                </span>
                              </>
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
                </Grid>

                <Grid item xs={12} md={2}>
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
              </form>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BrandSort;
