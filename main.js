// Do your work here...
document.addEventListener("DOMContentLoaded", function () {
  const formTambahBuku = document.getElementById("bookForm");
  formTambahBuku.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });
});

const RENDER = "render-rakbuku";
let rakBuku = [];

document.addEventListener(RENDER, function () {
  console.log(rakBuku);
});

function tambahBuku() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;
  const id = buatIdUnik();
  const bukuBaru = buatBukuBaru(id, title, author, year, isComplete);
  rakBuku.push(bukuBaru);

  document.dispatchEvent(new Event(RENDER));
}

function buatIdUnik() {
  return +new Date().getTime();
}

function buatBukuBaru(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function buatItemBuku(bukuBaru) {
  const judulBuku = document.createElement("h3");
  judulBuku.innerText = bukuBaru.title;
  judulBuku.setAttribute("data-testid", "bookItemTitle");

  const penulis = document.createElement("p");
  penulis.innerText = `Penulis: ${bukuBaru.author}`;
  penulis.setAttribute("data-testid", "bookItemAuthor");

  const tahunTerbit = document.createElement("p");
  tahunTerbit.innerText = `Tahun: ${bukuBaru.year}`;
  tahunTerbit.setAttribute("data-testid", "bookItemYear");

  const infoBuku = document.createElement("div");
  infoBuku.classList.add("book-info");
  infoBuku.appendChild(judulBuku, penulis, tahunTerbit);

  const tombolsBuku = document.createElement("div");
  tombolsBuku.classList.add("book-buttons");

  const tombolHapus = document.createElement("button");
  tombolHapus.innerText = "Hapus Buku";
  tombolHapus.classList.add("hapus-btn");
  tombolHapus.setAttribute("data-testid", "bookItemDeleteButton");

  const tombolEdit = document.createElement("button");
  tombolEdit.innerText = "Edit Buku";
  tombolEdit.classList.add("edit-btn");
  tombolEdit.setAttribute("data-testid", "bookItemEditButton");

  if (bukuBaru.isComplete == "false") {
    const tombolSelesaiDibaca = document.createElement("button");
    tombolSelesaiDibaca.innerText = "Selesai Dibaca";
    tombolSelesaiDibaca.classList.add("dibaca-btn");
    tombolSelesaiDibaca.setAttribute("data-testid", "bookItemIsCompleteButton");

    tombolsBuku.appendChild(tombolSelesaiDibaca, tombolHapus, tombolEdit);
    itemBuku.setAttribute("data-bookid", "123123123");
  } else {
    const tombolBelumSelesaiDibaca = document.createElement("button");
    tombolBelumSelesaiDibaca.innerText = "Belum Selesai Dibaca";
    tombolBelumSelesaiDibaca.classList.add("dibaca-btn");
    tombolBelumSelesaiDibaca.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton"
    );
    tombolsBuku.appendChild(tombolBelumSelesaiDibaca, tombolHapus, tombolEdit);
    itemBuku.setAttribute("data-bookid", "456456456");
  }

  const itemBuku = document.createElement("div");
  itemBuku.classList.add("book-item");
  itemBuku.setAttribute("data-testid", "bookItem");
  itemBuku.appendChild(infoBuku, tombolsBuku);
  itemBuku.setAttribute("id", `${bukuBaru.id}`);

  return itemBuku;
}
