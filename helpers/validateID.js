import HttpError from "./HttpError.js";

const idRegexp = /^[a-f\d]{24}$/i;

const validateID = () => {
  const func = (req, _, next) => {
    if (!req.params.contactId.match(idRegexp)) {
      next(HttpError(400, "Not valid id"));
    }
    next();
  };

  return func;
};

export default validateID;
