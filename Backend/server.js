const cors = require("cors");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const upload = multer({ dest: "uploads/" });


// ================= MERGE =================
app.post("/merge", upload.array("files"), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (let file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    fs.writeFileSync("merged.pdf", mergedBytes);

    res.download("merged.pdf");
  } catch (err) {
    res.status(500).send("Error merging PDF");
  }
});


// ================= SPLIT =================
app.post("/split", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const newPdf = await PDFDocument.create();
    const [firstPage] = await newPdf.copyPages(pdfDoc, [0]);
    newPdf.addPage(firstPage);

    const newBytes = await newPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=split.pdf");
    res.send(Buffer.from(newBytes));

  } catch (err) {
    console.error(err);
    res.status(500).send("Error splitting PDF");
  }
});


// ================= COMPRESS =================
app.post("/compress", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    res.send(Buffer.from(compressedBytes));

  } catch (err) {
    console.error(err);
    res.status(500).send("Error compressing PDF");
  }
});

// ================= START SERVER =================
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
