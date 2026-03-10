(function () {
  const $ = (id) => document.getElementById(id);
  const toolListEl = $("toolList");
  const mount = $("toolMount");
  const title = $("toolTitle");
  const desc = $("toolDesc");

  const downloadBlob = (blob, name) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const tools = [
    { id: "pdf-merge", name: "Merge PDF", desc: "Combine PDF files", render: renderPdfMerge },
    { id: "pdf-split", name: "Split PDF", desc: "Extract page range", render: renderPdfSplit },
    { id: "pdf-rotate", name: "Rotate PDF", desc: "Rotate pages", render: renderPdfRotate },
    { id: "pdf-compress", name: "Compress PDF", desc: "Re-save compact PDF", render: renderPdfCompress },
    { id: "image-to-pdf", name: "Image to PDF", desc: "Convert images into one PDF", render: renderImageToPdf },
    { id: "image-compress", name: "Compress Image", desc: "Lower JPEG quality", render: renderImageCompress },
    { id: "image-resize", name: "Resize Image", desc: "Set width and height", render: renderImageResize },
    { id: "image-crop", name: "Crop Image", desc: "Crop by x/y/w/h", render: renderImageCrop },
    { id: "image-convert", name: "Convert Image", desc: "PNG/JPEG/WebP", render: renderImageConvert },
    { id: "image-filter", name: "Image Filter", desc: "Grayscale/Sepia/Invert", render: renderImageFilter },
    { id: "word-count", name: "Word Count", desc: "Count words/chars", render: renderWordCount },
    { id: "case-converter", name: "Case Converter", desc: "Upper/lower/title", render: renderCaseConverter },
    { id: "markdown-editor", name: "Markdown Editor", desc: "Live markdown preview", render: renderMarkdown },
    { id: "text-diff", name: "Text Diff", desc: "Line-by-line difference", render: renderTextDiff },
    { id: "text-replace", name: "Text Replace", desc: "Find and replace", render: renderTextReplace },
    { id: "json-formatter", name: "JSON Formatter", desc: "Format/minify JSON", render: renderJsonFormatter },
    { id: "base64-encoder", name: "Base64 Encoder", desc: "Encode/decode base64", render: renderBase64 },
    { id: "color-picker", name: "Color Picker", desc: "Pick and convert color", render: renderColorPicker },
    { id: "qr-code", name: "QR Code", desc: "Generate QR images", render: renderQr },
    { id: "password-generator", name: "Password Generator", desc: "Generate secure password", render: renderPassword },
    { id: "unit-converter", name: "Unit Converter", desc: "Length and temperature", render: renderUnitConverter },
  ];

  function renderList(filter = "") {
    toolListEl.innerHTML = "";
    tools
      .filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach((tool) => {
        const btn = document.createElement("button");
        btn.className = "tool-btn";
        btn.textContent = tool.name;
        btn.onclick = () => selectTool(tool.id);
        btn.id = `btn-${tool.id}`;
        toolListEl.appendChild(btn);
      });
  }

  function selectTool(id) {
    const tool = tools.find((t) => t.id === id);
    if (!tool) return;
    document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
    const active = document.getElementById(`btn-${id}`);
    if (active) active.classList.add("active");
    title.textContent = tool.name;
    desc.textContent = tool.desc;
    mount.innerHTML = "";
    tool.render(mount);
    history.replaceState({}, "", `#${id}`);
  }

  function renderPdfMerge(el) {
    el.innerHTML = `<div class="block"><input id="pdfm-files" type="file" accept="application/pdf" multiple /><button id="pdfm-run">Merge & Download</button></div>`;
    $("pdfm-run").onclick = async () => {
      const files = $("pdfm-files").files;
      if (!files.length) return alert("Choose PDF files");
      const out = await PDFLib.PDFDocument.create();
      for (const f of files) {
        const src = await PDFLib.PDFDocument.load(await f.arrayBuffer());
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      downloadBlob(new Blob([await out.save()], { type: "application/pdf" }), "merged.pdf");
    };
  }

  function renderPdfSplit(el) {
    el.innerHTML = `<div class="block"><input id="pdfs-file" type="file" accept="application/pdf" /><div class="row"><input id="pdfs-from" type="number" min="1" placeholder="From page" /><input id="pdfs-to" type="number" min="1" placeholder="To page" /></div><button id="pdfs-run">Split & Download</button></div>`;
    $("pdfs-run").onclick = async () => {
      const f = $("pdfs-file").files[0];
      if (!f) return alert("Choose a PDF");
      const doc = await PDFLib.PDFDocument.load(await f.arrayBuffer());
      const from = Math.max(1, +$("pdfs-from").value || 1);
      const to = Math.min(doc.getPageCount(), +$("pdfs-to").value || doc.getPageCount());
      const out = await PDFLib.PDFDocument.create();
      const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
      const pages = await out.copyPages(doc, indices);
      pages.forEach((p) => out.addPage(p));
      downloadBlob(new Blob([await out.save()], { type: "application/pdf" }), "split.pdf");
    };
  }

  function renderPdfRotate(el) {
    el.innerHTML = `<div class="block"><input id="pdfr-file" type="file" accept="application/pdf" /><input id="pdfr-deg" type="number" value="90" /><button id="pdfr-run">Rotate & Download</button></div>`;
    $("pdfr-run").onclick = async () => {
      const f = $("pdfr-file").files[0];
      if (!f) return alert("Choose a PDF");
      const doc = await PDFLib.PDFDocument.load(await f.arrayBuffer());
      const deg = +$("pdfr-deg").value || 90;
      doc.getPages().forEach((p) => p.setRotation(PDFLib.degrees(deg)));
      downloadBlob(new Blob([await doc.save()], { type: "application/pdf" }), "rotated.pdf");
    };
  }

  function renderPdfCompress(el) {
    el.innerHTML = `<div class="block"><input id="pdfc-file" type="file" accept="application/pdf" /><button id="pdfc-run">Re-save PDF</button><p>Note: Browser PDF compression is limited; this rewrites the file for smaller structure when possible.</p></div>`;
    $("pdfc-run").onclick = async () => {
      const f = $("pdfc-file").files[0];
      if (!f) return alert("Choose a PDF");
      const doc = await PDFLib.PDFDocument.load(await f.arrayBuffer());
      downloadBlob(new Blob([await doc.save({ useObjectStreams: true })], { type: "application/pdf" }), "compressed.pdf");
    };
  }

  function renderImageToPdf(el) {
    el.innerHTML = `<div class="block"><input id="itp-files" type="file" accept="image/*" multiple /><button id="itp-run">Create PDF</button></div>`;
    $("itp-run").onclick = async () => {
      const files = $("itp-files").files;
      if (!files.length) return alert("Choose image files");
      const pdf = await PDFLib.PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const img = f.type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      downloadBlob(new Blob([await pdf.save()], { type: "application/pdf" }), "images.pdf");
    };
  }

  function withImageInput(el, id, cb) {
    el.innerHTML = `<div class="block"><input id="${id}-file" type="file" accept="image/*" /><div id="${id}-controls"></div><canvas class="preview" id="${id}-canvas"></canvas><br/><button id="${id}-run">Process</button></div>`;
    const fileEl = $(`${id}-file`), canvas = $(`${id}-canvas`), ctx = canvas.getContext("2d");
    let img;
    fileEl.onchange = () => {
      const f = fileEl.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = () => {
        img = new Image(); img.onload = () => {
          canvas.width = img.width; canvas.height = img.height; ctx.drawImage(img, 0, 0);
        }; img.src = r.result;
      }; r.readAsDataURL(f);
    };
    $(`${id}-run`).onclick = () => img && cb({ img, canvas, ctx, file: fileEl.files[0] });
  }

  function renderImageCompress(el) {
    withImageInput(el, "imgc", ({ canvas }) => canvas.toBlob((b) => downloadBlob(b, "compressed.jpg"), "image/jpeg", 0.65));
    $("imgc-controls").innerHTML = `<p>Exports JPEG at quality 0.65</p>`;
  }

  function renderImageResize(el) {
    withImageInput(el, "imgr", ({ img, canvas, ctx }) => {
      const w = +$("imgr-w").value || img.width, h = +$("imgr-h").value || img.height;
      canvas.width = w; canvas.height = h; ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((b) => downloadBlob(b, "resized.png"), "image/png");
    });
    $("imgr-controls").innerHTML = `<div class="row"><input id="imgr-w" type="number" placeholder="Width"/><input id="imgr-h" type="number" placeholder="Height"/></div>`;
  }

  function renderImageCrop(el) {
    withImageInput(el, "imgcrop", ({ img, canvas, ctx }) => {
      const x = +$("imgcrop-x").value || 0, y = +$("imgcrop-y").value || 0;
      const w = +$("imgcrop-w").value || img.width, h = +$("imgcrop-h").value || img.height;
      const out = document.createElement("canvas"); out.width = w; out.height = h;
      out.getContext("2d").drawImage(canvas, x, y, w, h, 0, 0, w, h);
      canvas.width = w; canvas.height = h; ctx.drawImage(out, 0, 0);
      canvas.toBlob((b) => downloadBlob(b, "cropped.png"), "image/png");
    });
    $("imgcrop-controls").innerHTML = `<div class="row"><input id="imgcrop-x" type="number" placeholder="X"/><input id="imgcrop-y" type="number" placeholder="Y"/></div><div class="row"><input id="imgcrop-w" type="number" placeholder="Width"/><input id="imgcrop-h" type="number" placeholder="Height"/></div>`;
  }

  function renderImageConvert(el) {
    withImageInput(el, "imgconv", ({ canvas }) => {
      const fmt = $("imgconv-fmt").value;
      canvas.toBlob((b) => downloadBlob(b, `converted.${fmt}`), `image/${fmt === "jpg" ? "jpeg" : fmt}`);
    });
    $("imgconv-controls").innerHTML = `<select id="imgconv-fmt"><option value="png">PNG</option><option value="jpg">JPEG</option><option value="webp">WEBP</option></select>`;
  }

  function renderImageFilter(el) {
    withImageInput(el, "imgf", ({ canvas, ctx }) => {
      const f = $("imgf-filter").value;
      ctx.filter = f; ctx.drawImage(canvas, 0, 0);
      ctx.filter = "none";
      canvas.toBlob((b) => downloadBlob(b, "filtered.png"), "image/png");
    });
    $("imgf-controls").innerHTML = `<select id="imgf-filter"><option value="grayscale(1)">Grayscale</option><option value="sepia(1)">Sepia</option><option value="invert(1)">Invert</option><option value="contrast(1.4)">Contrast</option></select>`;
  }

  function renderWordCount(el) {
    el.innerHTML = `<div class="block"><textarea id="wc-text" rows="8" placeholder="Type text..."></textarea><button id="wc-run">Count</button><pre id="wc-out"></pre></div>`;
    $("wc-run").onclick = () => {
      const t = $("wc-text").value;
      const words = (t.trim().match(/\S+/g) || []).length;
      $("wc-out").textContent = `Words: ${words}\nCharacters: ${t.length}\nLines: ${t ? t.split(/\n/).length : 0}`;
    };
  }

  function renderCaseConverter(el) {
    el.innerHTML = `<div class="block"><textarea id="cc-text" rows="8"></textarea><div class="row"><button id="cc-u">UPPER</button><button id="cc-l">lower</button></div><div class="row"><button id="cc-t">Title</button><button id="cc-c">Copy</button></div></div>`;
    const tx = $("cc-text");
    $("cc-u").onclick = () => tx.value = tx.value.toUpperCase();
    $("cc-l").onclick = () => tx.value = tx.value.toLowerCase();
    $("cc-t").onclick = () => tx.value = tx.value.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
    $("cc-c").onclick = () => navigator.clipboard.writeText(tx.value);
  }

  function renderMarkdown(el) {
    el.innerHTML = `<div class="block"><textarea id="md-text" rows="10"># Hello</textarea><button id="md-run">Preview</button><div class="block" id="md-out"></div></div>`;
    $("md-run").onclick = () => {
      const raw = $("md-text").value
        .replace(/^### (.*)$/gm, "<h3>$1</h3>")
        .replace(/^## (.*)$/gm, "<h2>$1</h2>")
        .replace(/^# (.*)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
      $("md-out").innerHTML = raw;
    };
  }

  function renderTextDiff(el) {
    el.innerHTML = `<div class="block"><div class="row"><textarea id="td-a" rows="8" placeholder="Text A"></textarea><textarea id="td-b" rows="8" placeholder="Text B"></textarea></div><button id="td-run">Compare</button><pre id="td-out"></pre></div>`;
    $("td-run").onclick = () => {
      const a = $("td-a").value.split("\n"), b = $("td-b").value.split("\n");
      const n = Math.max(a.length, b.length), out = [];
      for (let i = 0; i < n; i++) {
        if ((a[i] || "") !== (b[i] || "")) out.push(`- ${a[i] || ""}\n+ ${b[i] || ""}`);
      }
      $("td-out").textContent = out.length ? out.join("\n") : "No differences";
    };
  }

  function renderTextReplace(el) {
    el.innerHTML = `<div class="block"><textarea id="tr-text" rows="8"></textarea><div class="row"><input id="tr-find" type="text" placeholder="Find"/><input id="tr-rep" type="text" placeholder="Replace"/></div><button id="tr-run">Replace All</button></div>`;
    $("tr-run").onclick = () => {
      const f = $("tr-find").value;
      if (!f) return;
      $("tr-text").value = $("tr-text").value.split(f).join($("tr-rep").value);
    };
  }

  function renderJsonFormatter(el) {
    el.innerHTML = `<div class="block"><textarea id="jf-text" rows="10" placeholder='{"a":1}'></textarea><div class="row"><button id="jf-f">Format</button><button id="jf-m" class="secondary">Minify</button></div><pre id="jf-out"></pre></div>`;
    $("jf-f").onclick = () => { try { $("jf-out").textContent = JSON.stringify(JSON.parse($("jf-text").value), null, 2); } catch { $("jf-out").textContent = "Invalid JSON"; } };
    $("jf-m").onclick = () => { try { $("jf-out").textContent = JSON.stringify(JSON.parse($("jf-text").value)); } catch { $("jf-out").textContent = "Invalid JSON"; } };
  }

  function renderBase64(el) {
    el.innerHTML = `<div class="block"><textarea id="b64-text" rows="8"></textarea><div class="row"><button id="b64-e">Encode</button><button id="b64-d" class="secondary">Decode</button></div><pre id="b64-out"></pre></div>`;
    $("b64-e").onclick = () => $("b64-out").textContent = btoa(unescape(encodeURIComponent($("b64-text").value)));
    $("b64-d").onclick = () => { try { $("b64-out").textContent = decodeURIComponent(escape(atob($("b64-text").value))); } catch { $("b64-out").textContent = "Invalid base64"; } };
  }

  function renderColorPicker(el) {
    el.innerHTML = `<div class="block"><input id="cp-color" type="color" value="#0b6bcb"/><pre id="cp-out"></pre></div>`;
    const upd = () => {
      const hex = $("cp-color").value;
      const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      $("cp-out").textContent = `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})`;
    };
    $("cp-color").oninput = upd; upd();
  }

  function renderQr(el) {
    el.innerHTML = `<div class="block"><input id="qr-text" type="text" placeholder="Text or URL"/><button id="qr-run">Generate</button><canvas id="qr-canvas" class="preview"></canvas></div>`;
    $("qr-run").onclick = () => QRCode.toCanvas($("qr-canvas"), $("qr-text").value || "https://example.com", { width: 280 });
  }

  function renderPassword(el) {
    el.innerHTML = `<div class="block"><div class="row"><input id="pw-len" type="number" min="6" value="16" /><button id="pw-run">Generate</button></div><input id="pw-out" type="text" readonly /><button id="pw-copy" class="secondary">Copy</button></div>`;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    $("pw-run").onclick = () => {
      const len = +$("pw-len").value || 16;
      let s = "";
      for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
      $("pw-out").value = s;
    };
    $("pw-copy").onclick = () => navigator.clipboard.writeText($("pw-out").value || "");
  }

  function renderUnitConverter(el) {
    el.innerHTML = `<div class="block"><h3>Length (m ↔ ft)</h3><div class="row"><input id="uc-m" type="number" placeholder="Meters"/><input id="uc-ft" type="number" placeholder="Feet"/></div><h3>Temperature (C ↔ F)</h3><div class="row"><input id="uc-c" type="number" placeholder="Celsius"/><input id="uc-f" type="number" placeholder="Fahrenheit"/></div></div>`;
    $("uc-m").oninput = () => $("uc-ft").value = (($("uc-m").value || 0) * 3.28084).toFixed(4);
    $("uc-ft").oninput = () => $("uc-m").value = (($("uc-ft").value || 0) / 3.28084).toFixed(4);
    $("uc-c").oninput = () => $("uc-f").value = ((+$("uc-c").value * 9) / 5 + 32).toFixed(2);
    $("uc-f").oninput = () => $("uc-c").value = (((+$("uc-f").value - 32) * 5) / 9).toFixed(2);
  }

  $("search").addEventListener("input", (e) => renderList(e.target.value));
  renderList();
  const hash = location.hash.replace("#", "");
  selectTool(hash || "pdf-merge");

  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
})();
