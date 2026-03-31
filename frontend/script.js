// USE THE CORRECT API - test which one works
const API = "https://pdf-tool-backend-r88g.onrender.com";
// Alternative: const API = "https://pdf-backend.onrender.com";

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setup(dropId, inputId, infoId) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);
  const info = document.getElementById(infoId);

  if (!drop || !input) {
    console.log(`Setup skipped for ${dropId} - elements not found`);
    return false;
  }

  drop.onclick = () => input.click();

  if (info) {
    input.onchange = () => {
      const files = [...input.files];
      if (files.length === 0) {
        info.innerText = "";
      } else if (files.length === 1) {
        info.innerText = files[0].name;
      } else {
        info.innerText = `${files.length} files selected: ${files.map(f => f.name).join(", ")}`;
      }
    };
  }

  drop.ondragover = e => {
    e.preventDefault();
    drop.style.borderColor = "#60a5fa";
  };

  drop.ondragleave = e => {
    e.preventDefault();
    drop.style.borderColor = "#3b82f6";
  };

  drop.ondrop = e => {
    e.preventDefault();
    drop.style.borderColor = "#3b82f6";
    input.files = e.dataTransfer.files;
    if (info) {
      const files = [...input.files];
      if (files.length === 0) {
        info.innerText = "";
      } else if (files.length === 1) {
        info.innerText = files[0].name;
      } else {
        info.innerText = `${files.length} files selected: ${files.map(f => f.name).join(", ")}`;
      }
    }
  };

  return true;
}

// Setup all tools
console.log("Setting up tools...");
setup("mergeDrop", "mergeFiles", "mergeInfo");
setup("splitDrop", "splitFile", "splitInfo");
setup("compressDrop", "compressFile", "compressInfo");

// MERGE
const mergeBtn = document.getElementById("mergeBtn");
if (mergeBtn) {
  mergeBtn.onclick = async () => {
    const loader = document.getElementById("mergeLoader");
    if (loader) loader.style.display = "block";

    try {
      const files = document.getElementById("mergeFiles")?.files;
      if (!files || files.length < 2) {
        alert("Please select at least 2 PDF files to merge");
        if (loader) loader.style.display = "none";
        return;
      }

      const fd = new FormData();
      [...files].forEach(f => fd.append("files", f));

      console.log("Sending merge request...");
      const res = await fetch(`${API}/merge`, { method: "POST", body: fd });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const blob = await res.blob();
      download(blob, "merged.pdf");
      alert("Merge successful! Check your downloads folder.");

    } catch (err) {
      console.error("Merge error:", err);
      alert(`Merge failed: ${err.message}. Make sure backend is running.`);
    }

    if (loader) loader.style.display = "none";
  };
}

// SPLIT
const splitBtn = document.getElementById("splitBtn");
if (splitBtn) {
  splitBtn.onclick = async () => {
    const loader = document.getElementById("splitLoader");
    if (loader) loader.style.display = "block";

    try {
      const file = document.getElementById("splitFile")?.files[0];
      if (!file) {
        alert("Please select a PDF file to split");
        if (loader) loader.style.display = "none";
        return;
      }

      const fd = new FormData();
      fd.append("file", file);

      console.log("Sending split request...");
      const res = await fetch(`${API}/split`, { method: "POST", body: fd });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const blob = await res.blob();
      download(blob, "split.pdf");
      alert("Split successful! Check your downloads folder.");

    } catch (err) {
      console.error("Split error:", err);
      alert(`Split failed: ${err.message}. Make sure backend is running.`);
    }

    if (loader) loader.style.display = "none";
  };
}

// COMPRESS
const compressBtn = document.getElementById("compressBtn");
if (compressBtn) {
  compressBtn.onclick = async () => {
    const loader = document.getElementById("compressLoader");
    if (loader) loader.style.display = "block";

    try {
      const file = document.getElementById("compressFile")?.files[0];
      if (!file) {
        alert("Please select a PDF file to compress");
        if (loader) loader.style.display = "none";
        return;
      }

      const fd = new FormData();
      fd.append("file", file);

      console.log("Sending compress request...");
      const res = await fetch(`${API}/compress`, { method: "POST", body: fd });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const blob = await res.blob();
      download(blob, "compressed.pdf");
      alert("Compress successful! Check your downloads folder.");

    } catch (err) {
      console.error("Compress error:", err);
      alert(`Compress failed: ${err.message}. Make sure backend is running.`);
    }

    if (loader) loader.style.display = "none";
  };
}

console.log("All tools initialized!");
