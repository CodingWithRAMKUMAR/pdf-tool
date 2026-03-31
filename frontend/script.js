const API = "https://pdf-tool-backend-r88g.onrender.com";

// download helper
function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

// MERGE
async function mergePDF() {
  try {
    const files = document.getElementById("mergeFiles").files;

    if (files.length < 2) {
      alert("Select at least 2 PDFs");
      return;
    }

    const formData = new FormData();
    for (let f of files) formData.append("files", f);

    const res = await fetch(`${API}/merge`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const blob = await res.blob();
    downloadFile(blob, "merged.pdf");

  } catch (err) {
    alert("Merge failed");
    console.log(err);
  }
}

// SPLIT
async function splitPDF() {
  try {
    const file = document.getElementById("splitFile").files[0];

    if (!file) {
      alert("Select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/split`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const blob = await res.blob();
    downloadFile(blob, "split.pdf");

  } catch (err) {
    alert("Split failed");
    console.log(err);
  }
}

// COMPRESS
async function compressPDF() {
  try {
    const file = document.getElementById("compressFile").files[0];

    if (!file) {
      alert("Select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/compress`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const blob = await res.blob();
    downloadFile(blob, "compressed.pdf");

  } catch (err) {
    alert("Compress failed");
    console.log(err);
  }
}
