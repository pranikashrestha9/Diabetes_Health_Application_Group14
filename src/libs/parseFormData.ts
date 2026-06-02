import { Exception } from "./exceptionHandler";

export const parseFormData = (req: any, res: any, next: any) => {
  try {
    if (req.body.skills && typeof req.body.skills === "string") {
      req.body.skills = JSON.parse(req.body.skills);
    }

    if (req.body.companyId) {
      req.body.companyId = Number(req.body.companyId);
    }
    console.log("Parsed form data:", req.body);
    next();
  } catch (err) {
    next(new Exception("Invalid form-data format", 400));
  }
};
