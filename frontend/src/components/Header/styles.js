import { styled } from "@stitches/react";

// HEADER
export const StyledHeader = styled("header", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  height: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#5cb0f4",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  zIndex: 10,

  ".headerContent": {
    width: "90%",
    maxWidth: "900px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ".menuButton": {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#000",
  },

  "p": {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#000000",
  },

  ".logo": {
  display: "flex",
  alignItems: "center",
  gap: "10px",

  img: {
    height: "90px",
    width: "auto",
    objectFit: "contain",
    cursor: "pointer",
    transition: "transform 0.3s ease",

    "&:hover": {
      transform: "scale(1.05)",
    },
  },
},

  "nav.links": {
    display: "flex",
    gap: 20,

    "a": {
      backgroundColor: "#5aaaebff",
      color: "#232323",
      padding: "2px 15px",
      borderRadius: "5px",
      border: "1px solid #232323",
      transition: "all 0.3s ease-out",

      "&:hover": {
        backgroundColor: "#5aaaebff",
      },
    },
  },
});

// SIDEBAR
export const Sidebar = styled("nav", {
  position: "fixed",
  top: 0,
  left: "-230px",
  width: "200px",
  height: "100vh",
  backgroundColor: "#3f5063",
  color: "white",
  display: "flex",
  flexDirection: "column",
  paddingTop: "70px",
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
  transition: "left 0.3s ease",
  zIndex: 9,

  a: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    color: "white",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "background 0.2s",

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },

  '&[data-open="true"]': {
    left: "0",
  },
});
