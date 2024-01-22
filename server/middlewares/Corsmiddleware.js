const Corsmiddleware = (req, res, next) => {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "YOUR_URL"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Custom-Header"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }

  return next();
};

export default Corsmiddleware;
