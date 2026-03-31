const API = "https://pdf-tool-backend-r88g.onrender.com";// 🔁 replace with your URL

function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

// MERGE
async function mergePDF() {
  const loader = document.getElementById("mergeLoader");
  loader.style.display = "block";

  try {
    const files = document.getElementById("mergeFiles").files;
    if (files.length < 2) {
      alert("Select at least 2 files");
      loader.style.display = "none";
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

  } catch {
    alert("Merge failed");
  }

  loader.style.display = "none";
}

// SPLIT
async function splitPDF() {
  const loader = document.getElementById("splitLoader");
  loader.style.display = "block";

  try {
    const file = document.getElementById("splitFile").files[0];
    if (!file) {
      alert("Select a file");
      loader.style.display = "none";
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

  } catch {
    alert("Split failed");
  }

  loader.style.display = "none";
}

// COMPRESS
async function compressPDF() {
  const loader = document.getElementById("compressLoader");
  loader.style.display = "block";

  try {
    const file = document.getElementById("compressFile").files[0];
    if (!file) {
      alert("Select a file");
      loader.style.display = "none";
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

  } catch {
    alert("Compress failed");
  }

  loader.style.display = "none";
}
