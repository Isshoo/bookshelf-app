// Do your work here...
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
  const year = document.getElementById("bookFormYear").value;
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
  itemBuku.setAttribute("id", `${bukuBaru.id}`);

  if (!bukuBaru.isComplete) {
    const tombolSelesaiDibaca = document.createElement("button");
    tombolSelesaiDibaca.innerText = "Selesai Dibaca";
    tombolSelesaiDibaca.classList.add("dibaca-btn");
    tombolSelesaiDibaca.setAttribute("data-testid", "bookItemIsCompleteButton");

    tombolSelesaiDibaca.addEventListener("click", function () {
      pindahKeSelesaiDibaca(bukuBaru.id);
    });

    tombolsBuku.append(tombolSelesaiDibaca, tombolHapus, tombolEdit);
    itemBuku.setAttribute("data-bookid", "123123123");
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
    itemBuku.setAttribute("data-bookid", "456456456");
  }

  return itemBuku;
}

function cariBuku(idBuku) {
  for (const buku of rakBuku) {
    if (buku.id === idBuku) {
      return buku;
    }
  }
  return null;
}

function cariIndexBuku(idBuku) {
  for (const index in rakBuku) {
    if (rakBuku[index].id === idBuku) {
      return index;
    }
  }
  return -1;
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

//STORAGE

const STORAGE_KEY = "Daftar_Buku";
const DATA = "Data_Tersimpan"; //event untuk mempermudah debugging

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

function ambilDataDariStorage() {
  if (cekStorage()) {
    const stringDaftarBuku = localStorage.getItem(STORAGE_KEY);
    let daftarBuku = JSON.parse(stringDaftarBuku);
    if (daftarBuku !== null) {
      for (const buku of daftarBuku) {
        rakBuku.push(buku);
      }
    }
  }
  document.dispatchEvent(new Event(RENDER));
}

document.addEventListener(DATA, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

const judulBukuDicari = document.getElementById("searchBookTitle").value;
const tombolCariBuku = document.getElementById("searchSubmit");

tombolCariBuku.addEventListener("click", function (event) {
  const bukuYangDicari = rakBuku.find((buku) => buku.title === judulBukuDicari);
  event.preventDefault();
  console.log(bukuYangDicari);
  return bukuYangDicari;
});
