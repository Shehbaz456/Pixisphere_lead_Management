import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.js";

const app =express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    methods:["GET","HEAD","PUT","PATCH","POST","DELETE"],
    credentials:true,
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// Router import
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import partnerRouter from "./routes/partner.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import reviewRouter from "./routes/review.routes.js";
import adminRouter from "./routes/admin.routes.js";

// Routers declaration
app.use("/api/healthcheck", healthcheckRouter);
app.use("/api/auth",userRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the our backend service Pixisphere" });
});

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

export { app }