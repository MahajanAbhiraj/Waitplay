"use client"; // Ensures it runs on the client in Next.js App Router

import React from "react";
import { Snackbar, Alert } from "@mui/material";

const Notification = ({ message, severity, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
