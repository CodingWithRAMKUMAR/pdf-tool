const API = "https://pdf-tool-backend-r88g.onrender.com";

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}

// SETUP DROP + PREVIEW
function setup(dropId, inputId, infoId) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);
  const info = document.getElementById(infoId);

  if (!drop || !input) return;

  drop.onclick = () => input.click();

  input.onchange = () => {
    if (info) {
      info.innerText = [...input.files].map(f => f.name).join(", ");
    }
  };

  drop.ondragover = e => e.preventDefault();

  drop.ondrop = e => {
    e.preventDefault();
    input.files = e.dataTransfer.files;

    if (info) {
      info.innerText = [...input.files].map(f => f.name).join(", ");
    }
  };
}

setup("mergeDrop", "mergeFiles", "mergeInfo");
setup("splitDrop", "splitFile", "splitInfo");
setup("compressDrop", "compressFile", "compressInfo");

// MERGE
const splitBtn = document.getElementById("mergeBtn");

if (splitBtn) {
  splitBtn.onclick = async () => {
  const loader = document.getElementById("mergeLoader");
  loader.style.display = "block";
  };
}
  try {
    const files = document.getElementById("mergeFiles").files;
    if (files.length < 2) return alert("Select 2 files");

    const fd = new FormData();
    [...files].forEach(f => fd.append("files", f));

    const res = await fetch(`${API}/merge`, { method: "POST", body: fd });
    const blob = await res.blob();
    download(blob, "merged.pdf");

  } catch {
    alert("Merge failed");
  }

  loader.style.display = "none";
};

// SPLIT
const splitBtn = document.getElementById("splitBtn");

if (splitBtn) {
  splitBtn.onclick = async () => {
  const loader = document.getElementById("splitLoader");
  loader.style.display = "block";
  };
}
  try {
    const file = document.getElementById("splitFile").files[0];
    if (!file) return alert("Select file");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API}/split`, { method: "POST", body: fd });
    const blob = await res.blob();
    download(blob, "split.pdf");

  } catch {
    alert("Split failed");
  }

  loader.style.display = "none";
};

// COMPRESS
const splitBtn = document.getElementById("compressBtn");

if (splitBtn) {
  splitBtn.onclick = async () => {
  const loader = document.getElementById("compressLoader");
  loader.style.display = "block";
  };
}
  try {
    const file = document.getElementById("compressFile").files[0];
    if (!file) return alert("Select file");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API}/compress`, { method: "POST", body: fd });
    const blob = await res.blob();
    download(blob, "compressed.pdf");

  } catch {
    alert("Compress failed");
  }

  loader.style.display = "none";
};
