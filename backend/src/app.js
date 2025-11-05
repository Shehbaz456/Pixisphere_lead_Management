import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import { errorHandler } from "./middlewares/errorHandler.js"; 

// Routers declaration
app.use("/api/healthcheck", healthcheckRouter);
app.use("/api/auth",userRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found`});
});
app.use(errorHandler);

export { app }