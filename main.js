document.addEventListener("DOMContentLoaded", function () {
  const formTambahBuku = document.getElementById("bookForm");
  formTambahBuku.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });
  if (cekStorage()) {
    ambilDataDariStorage();
  }
});

const RENDER = "render-rakbuku";
let rakBuku = [];

document.addEventListener(RENDER, function () {
  const rakBelumSelesaiDibaca = document.getElementById("incompleteBookList");
  rakBelumSelesaiDibaca.innerHTML = "";

  const rakSudahSelesaiDibaca = document.getElementById("completeBookList");
  rakSudahSelesaiDibaca.innerHTML = "";

  for (const buku of rakBuku) {
    const elemenBuku = buatItemBuku(buku);
    if (!buku.isComplete) {
      rakBelumSelesaiDibaca.append(elemenBuku);
    } else {
      rakSudahSelesaiDibaca.append(elemenBuku);
    }
  }
});

function tambahBuku() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;
  const id = buatIdUnik();
  const bukuBaru = buatBukuBaru(id, title, author, year, isComplete);
  rakBuku.push(bukuBaru);

  document.dispatchEvent(new Event(RENDER));
  document.getElementById("bookForm").reset();
  simpanDatas();
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
  judulBuku.classList.add("judul-buku");

  const penulis = document.createElement("p");
  penulis.innerText = `Penulis: ${bukuBaru.author}`;
  penulis.setAttribute("data-testid", "bookItemAuthor");

  const tahunTerbit = document.createElement("p");
  tahunTerbit.innerText = `Tahun: ${bukuBaru.year}`;
  tahunTerbit.setAttribute("data-testid", "bookItemYear");

  const infoBuku = document.createElement("div");
  infoBuku.classList.add("book-info");
  infoBuku.append(judulBuku, penulis, tahunTerbit);

  const tombolsBuku = document.createElement("div");
  tombolsBuku.classList.add("book-buttons");

  const tombolHapus = document.createElement("button");
  tombolHapus.innerText = "Hapus Buku";
  tombolHapus.classList.add("hapus-btn");
  tombolHapus.setAttribute("data-testid", "bookItemDeleteButton");

  tombolHapus.addEventListener("click", function () {
    hapusBuku(bukuBaru.id);
  });

  const tombolEdit = document.createElement("button");
  tombolEdit.innerText = "Edit Buku";
  tombolEdit.classList.add("edit-btn");
  tombolEdit.setAttribute("data-testid", "bookItemEditButton");

  tombolEdit.addEventListener("click", function () {
    editBuku(bukuBaru.id);
  });

  const itemBuku = document.createElement("div");
  itemBuku.classList.add("book-item");
  itemBuku.setAttribute("data-testid", "bookItem");
  itemBuku.append(infoBuku, tombolsBuku);

  if (!bukuBaru.isComplete) {
    const tombolSelesaiDibaca = document.createElement("button");
    tombolSelesaiDibaca.innerText = "Selesai Dibaca";
    tombolSelesaiDibaca.classList.add("dibaca-btn");
    tombolSelesaiDibaca.setAttribute("data-testid", "bookItemIsCompleteButton");

    tombolSelesaiDibaca.addEventListener("click", function () {
      pindahKeSelesaiDibaca(bukuBaru.id);
    });

    tombolsBuku.append(tombolSelesaiDibaca, tombolHapus, tombolEdit);
    itemBuku.setAttribute("data-bookid", `${bukuBaru.id}`);
  } else {
    const tombolBelumSelesaiDibaca = document.createElement("button");
    tombolBelumSelesaiDibaca.innerText = "Belum Selesai Dibaca";
    tombolBelumSelesaiDibaca.classList.add("dibaca-btn");
    tombolBelumSelesaiDibaca.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton"
    );

    tombolBelumSelesaiDibaca.addEventListener("click", function () {
      pindahKeBelumSelesaiDibaca(bukuBaru.id);
    });

    tombolsBuku.append(tombolBelumSelesaiDibaca, tombolHapus, tombolEdit);
    itemBuku.setAttribute("data-bookid", `${bukuBaru.id}`);
  }

  return itemBuku;
}

function cariBuku(idBuku) {
  const findBook = (idBuku) =>
    rakBuku.find((buku) => buku.id === idBuku) || null;
  return findBook(idBuku);
}

function cariIndexBuku(idBuku) {
  const findBookIndex = (idBuku) =>
    rakBuku.findIndex((buku) => buku.id === idBuku);
  return findBookIndex(idBuku);
}

function hapusBuku(idBuku) {
  const bukuYangDicari = cariIndexBuku(idBuku);
  if (bukuYangDicari === -1) {
    return;
  }
  rakBuku.splice(bukuYangDicari, 1);
  document.dispatchEvent(new Event(RENDER));
  simpanDatas();
}

function pindahKeSelesaiDibaca(idBuku) {
  const bukuYangAkanDipindah = cariBuku(idBuku);
  if (bukuYangAkanDipindah === null) {
    return;
  }
  bukuYangAkanDipindah.isComplete = true;
  document.dispatchEvent(new Event(RENDER));
  simpanDatas();
}

function pindahKeBelumSelesaiDibaca(idBuku) {
  const bukuYangAkanDipindah = cariBuku(idBuku);
  if (bukuYangAkanDipindah === null) {
    return;
  }
  bukuYangAkanDipindah.isComplete = false;
  document.dispatchEvent(new Event(RENDER));
  simpanDatas();
}

function editBuku(idBuku) {
  const bukuYangDicari = cariIndexBuku(idBuku);
  if (bukuYangDicari === -1) {
    return;
  }

  const title = document.getElementById("bookFormTitle");
  const author = document.getElementById("bookFormAuthor");
  const year = document.getElementById("bookFormYear");
  const isComplete = document.getElementById("bookFormIsComplete");

  title.value = rakBuku[bukuYangDicari].title;
  author.value = rakBuku[bukuYangDicari].author;
  year.value = rakBuku[bukuYangDicari].year;
  isComplete.checked = rakBuku[bukuYangDicari].isComplete;

  rakBuku.splice(bukuYangDicari, 1);
  document.dispatchEvent(new Event(RENDER));
  simpanDatas();
}

const tombolCariBuku = document.getElementById("searchSubmit");
const submitCariBuku = document.getElementById("searchBook");

tombolCariBuku.addEventListener("click", function () {
  submitCariBuku.click();
});

submitCariBuku.addEventListener("submit", function (event) {
  event.preventDefault();

  const judulBukuDicari =
    event.target.elements.searchBookTitle.value.toLowerCase();

  const bukuDicari = rakBuku.filter((buku) =>
    buku.title.toLowerCase().includes(judulBukuDicari)
  );

  if (bukuDicari.length) {
    hasilPencarian(bukuDicari);
  } else {
    document.dispatchEvent(new Event(RENDER));
  }

  event.target.reset();
});

function hasilPencarian(daftarBuku) {
  const rakBelumSelesaiDibaca = document.getElementById("incompleteBookList");
  rakBelumSelesaiDibaca.innerHTML = "";

  const rakSudahSelesaiDibaca = document.getElementById("completeBookList");
  rakSudahSelesaiDibaca.innerHTML = "";

  for (const buku of daftarBuku) {
    const elemenBuku = buatItemBuku(buku);
    if (!buku.isComplete) {
      rakBelumSelesaiDibaca.append(elemenBuku);
    } else {
      rakSudahSelesaiDibaca.append(elemenBuku);
    }
  }
}

//STORAGE

const STORAGE_KEY = "Daftar_Buku";
const DATA = "Data_Tersimpan";

function cekStorage() {
  const isStorageAvailable = typeof Storage !== "undefined";
  if (!isStorageAvailable) {
    alert("Browser anda tidak mendukung storage local");
    return false;
  }
  return true;
}

function simpanDatas() {
  if (cekStorage()) {
    const stringDaftarBuku = JSON.stringify(rakBuku);
    localStorage.setItem(STORAGE_KEY, stringDaftarBuku);
    document.dispatchEvent(new Event(DATA));
  }
}

const ambilDataDariStorage = () => {
  const stringDaftarBuku = localStorage.getItem(STORAGE_KEY);
  const daftarBuku = stringDaftarBuku ? JSON.parse(stringDaftarBuku) : [];
  rakBuku.push(...daftarBuku);
  document.dispatchEvent(new Event(RENDER));
};

document.addEventListener(DATA, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
