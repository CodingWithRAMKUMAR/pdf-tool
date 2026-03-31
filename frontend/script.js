const API = "https://pdf-tool-backend-r88g.onrender.com";

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// SAFE setup - only runs if elements exist
function setup(dropId, inputId, infoId) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);
  const info = document.getElementById(infoId);

  if (!drop || !input) return false;

  drop.onclick = () => input.click();

  if (info) {
    input.onchange = () => {
      info.innerText = [...input.files].map(f => f.name).join(", ");
    };
  }

  drop.ondragover = e => e.preventDefault();

  drop.ondrop = e => {
    e.preventDefault();
    input.files = e.dataTransfer.files;
    if (info) {
      info.innerText = [...input.files].map(f => f.name).join(", ");
    }
  };

  return true;
}

// Setup each tool only if elements exist on this page
setup("mergeDrop", "mergeFiles", "mergeInfo");
setup("splitDrop", "splitFile", "splitInfo");
setup("compressDrop", "compressFile", "compressInfo");

// MERGE - safe
const mergeBtn = document.getElementById("mergeBtn");
if (mergeBtn) {
  mergeBtn.onclick = async () => {
    const loader = document.getElementById("mergeLoader");
    if (loader) loader.style.display = "block";

    try {
      const files = document.getElementById("mergeFiles")?.files;
      if (!files || files.length < 2) {
        alert("Select at least 2 files");
        return;
      }

      const fd = new FormData();
      [...files].forEach(f => fd.append("files", f));

      const res = await fetch(`${API}/merge`, { method: "POST", body: fd });
      const blob = await res.blob();
      download(blob, "merged.pdf");

    } catch {
      alert("Merge failed");
    }

    if (loader) loader.style.display = "none";
  };
}

// SPLIT - safe
const splitBtn = document.getElementById("splitBtn");
if (splitBtn) {
  splitBtn.onclick = async () => {
    const loader = document.getElementById("splitLoader");
    if (loader) loader.style.display = "block";

    try {
      const file = document.getElementById("splitFile")?.files[0];
      if (!file) {
        alert("Select a file");
        return;
      }

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API}/split`, { method: "POST", body: fd });
      const blob = await res.blob();
      download(blob, "split.pdf");

    } catch {
      alert("Split failed");
    }

    if (loader) loader.style.display = "none";
  };
}

// COMPRESS - safe
const compressBtn = document.getElementById("compressBtn");
if (compressBtn) {
  compressBtn.onclick = async () => {
    const loader = document.getElementById("compressLoader");
    if (loader) loader.style.display = "block";

    try {
      const file = document.getElementById("compressFile")?.files[0];
      if (!file) {
        alert("Select a file");
        return;
      }

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API}/compress`, { method: "POST", body: fd });
      const blob = await res.blob();
      download(blob, "compressed.pdf");

    } catch {
      alert("Compress failed");
    }

    if (loader) loader.style.display = "none";
  };
}
