import React, { useEffect, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import { CSSTransition } from "react-transition-group";
import "./AppModal.scss";

const duration = 300;

export default function TransitionsModal(props) {
  let { open, setOpen, width } = props;
  if (!width) {
    width = "width-normal";
  }
  const handleClose = () => setOpen(false);

  const ref = useRef(null);

  const getScrollbarWidth = () => {
    // Creating invisible container
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll"; // forcing scrollbar to appear
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement("div");
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  useEffect(() => {
    const body = document.body;
    const header = document.querySelector("header");

    const scrollWidth = getScrollbarWidth();

    if (window.innerHeight < body.scrollHeight) {
      if (open) {
        body.style.overflow = "hidden";
        body.style.paddingRight = scrollWidth + "px";
        header.style.paddingRight = scrollWidth + "px";
      } else {
        setTimeout(() => {
          body.style.removeProperty("padding-right");
          header.style.removeProperty("padding-right");
          body.style.removeProperty("overflow");
        }, duration);
      }
    }
  }, [open]);

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        alignItems: "stretch",
        overflowY: "auto",
        height: "100%",
      }}
      open={open}
      onClick={handleClose}
    >
      <CSSTransition
        nodeRef={ref}
        in={open}
        timeout={duration}
        classNames={width + " modal-wrapper"}
      >
        <div
          ref={ref}
          className="modal-dialog"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {props.children}
        </div>
      </CSSTransition>
    </Backdrop>
  );
}
