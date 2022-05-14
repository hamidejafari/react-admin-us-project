import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";

import axiosInstance from "../../../utiles/axiosInstance";
import useGetData from "../../../hooks/useGetData";

const Attribute = () => {
  const [attribute, setAttribute] = useState("");

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState({});

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const { _id } = useParams();
  const navigate = useNavigate();

  const {
    loading: fetchCategoryloading,
    data: category,
    getData,
  } = useGetData();

  useEffect(() => {
    if (!category) {
      return;
    }

    if (category.level !== 3) {
      navigate("/categories");
    }

    if (Array.isArray(category.attributes)) {
      category.attributes.sort(function (a, b) {
        return a.position - b.position;
      });

      const newRows = category.attributes.map((element) => {
        return { title: element.title, _id: element._id };
      });

      setRows(newRows);
    }

    // setRows(category.attribute);
  }, [category, navigate]);

  function addRow() {
    const allRows = rows;
    let checkDuplicate = 0;
    rows.forEach((item, index) => {
      if (item === attribute) {
        checkDuplicate = 1;
      }
    });
    if (checkDuplicate === 0) {
      allRows.push({ title: attribute });
      setRows(allRows);
      setAttribute("");
    } else {
      toast.error("duplicate attribute row");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    // setErrorMessage({});
    try {
      const attributeSortObject = [];

      if (rows) {
        rows.forEach((item, index) => {
          const ob = {
            title: item.title,
            position: index + 1,
          };

          if (item._id) {
            ob._id = item._id;
          }
          attributeSortObject.push(ob);
        });
      }

      await axiosInstance.patch("/admin/categories/" + _id + "/attributes", {
        attributeSortObject,
      });

      setLoading(false);

      toast.success("Saved Sucessfully");
    } catch (error) {
      if (error.response?.data?.error) {
        // setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getData("/admin/categories/" + _id);
  }, [_id, getData]);

  function onDragEnd(result) {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const rows2 = reorder(rows, result.source.index, result.destination.index);

    setRows(rows2);
  }

  function deleteRow(indexRow) {
    console.log(indexRow);
    setRows((oldVal) => {
      const arr = [...oldVal];
      arr.splice(+indexRow, 1);
      return arr;
    });
  }

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
              <React.Fragment>
                <p>category name : {category.title}</p>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="attribute">
                          Attribute
                        </label>
                        <input
                          className={`form-input`}
                          type="text"
                          value={attribute}
                          onChange={(e) => setAttribute(e.target.value)}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ marginTop: 21 }}>
                        <Button
                          type="button"
                          variant="contained"
                          onClick={addRow}
                        >
                          <AddIcon />
                        </Button>
                      </div>
                    </Grid>
                  </Grid>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {rows.map((item, index) => (
                            <Draggable
                              key={item.title}
                              draggableId={item.title}
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
                                      padding: "10px",
                                      fontSize: "19px",
                                      border: "1px solid #1b1b1b",
                                      width: "20%",
                                      textAlign: "center",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <span>
                                      #{index + 1} {item.title}
                                    </span>
                                  </div>

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
                  <br></br>

                  <div className="d-flex">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      Save
                    </Button>
                    {loading ? (
                      <CircularProgress className="me-3" color="inherit" />
                    ) : null}
                  </div>
                </form>
              </React.Fragment>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Attribute;
