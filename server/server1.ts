// @ts-ignore
import express from "express";
import * as path from "path";
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/",
    (req: express.Request, res: express.Response) => res.sendFile(
        path.join(__dirname, "build", "index.html")
    ));
app.listen(5000);
