const API = "https://pdf-tool-backend-r88g.onrender.com";


// ================= MERGE =================
async function mergePDF() {
  const files = document.getElementById("mergeFiles").files;
  const formData = new FormData();

  for (let file of files) {
    formData.append("files", file);
  }

  const res = await fetch(`${API}/merge`, {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  downloadFile(blob, "merged.pdf");
}


// ================= SPLIT =================
async function splitPDF() {
  const file = document.getElementById("splitFile").files[0];
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/split`, {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  downloadFile(blob, "split.pdf");
}


// ================= COMPRESS =================
async function compressPDF() {
  const file = document.getElementById("compressFile").files[0];
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/compress`, {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  downloadFile(blob, "compressed.pdf");
}


// ================= DOWNLOAD =================
function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
