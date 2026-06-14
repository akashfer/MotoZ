const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSSz-oWF0jOFFWhMFm5TFmxGdXarww3evJeYjz6oz2ojDRxLCLggivu-bU4xYa5q4YBNEbef1S_png0/pub?gid=0&single=true&output=csv";

window.PRODUCTS = [];
window.PRODUCTS_READY = null;

function getThumbnailUrl(src) {
  if (!src) return src;

  const driveMatch = src.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w400`;
  }

  return src;
}

function getFullImageUrl(src) {
  if (!src) return src;

  const driveMatch = src.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  return src;
}

function parseCSV(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((row) => {
    const cols = row.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || "").trim();
    });
    return obj;
  });
}

function normalizeProduct(row) {
  const parsePrice = (value) => {
    if (!value) return 0;
    const cleaned = String(value)
      .replace(/,/g, "")
      .match(/[\d.]+/g);
    if (!cleaned) return 0;
    return Number(cleaned.join("")) || 0;
  };

  const imageField = row.images || row.image || "";
  const images = imageField
    ? imageField
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const colorField = row.colors || row.color || "";
  const colors = colorField
    ? colorField
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return {
    id: Number(row.id) || row.id,
    name: row.title || row.name || "Unnamed Product",
    price: parsePrice(row.price),
    category: row.category || "",
    description: row.description || "",
    in_stock: (row.in_stock || "yes").toLowerCase() === "yes",
    images: images.length ? images : ["logo.png"],
    colors,
  };
}

async function loadProducts() {
  try {
    const res = await fetch(SHEET_CSV_URL + "&t=" + Date.now());
    const data = await res.text();
    const rows = parseCSV(data);
    window.PRODUCTS = rows.map(normalizeProduct);
  } catch (err) {
    console.error("CSV load error:", err);
    window.PRODUCTS = [];
  }
}

window.PRODUCTS_READY = loadProducts();
