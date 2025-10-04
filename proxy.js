import express from "express";

const cachingProxy = (port, target) => {
  const app = express();

  app.get("/hello", (req, res, next) => {
    console.log(req.url);
    res.send("ok");
  });
  app.listen(port, () => {
    console.log(`Caching proxy server is running on port ${port}`);
  });
};

export default cachingProxy;
