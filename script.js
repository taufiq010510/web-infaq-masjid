let nominalDipilih = 50000;

document.querySelectorAll(".nominal-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nominal-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    nominalDipilih = parseInt(btn.dataset.val);
    document.getElementById("custom-nominal").value = "";
    updateSummary();
  });
});

document.getElementById("custom-nominal").addEventListener("input", (e) => {
  document.querySelectorAll(".nominal-btn").forEach((b) => b.classList.remove("active"));
  const val = parseInt(e.target.value);
  nominalDipilih = isNaN(val) ? 0 : val;
  updateSummary();
});

document.querySelectorAll('input[name="program"]').forEach((radio) => {
  radio.addEventListener("change", updateSummary);
});

function updateSummary() {
  const programEl = document.querySelector('input[name="program"]:checked');
  const program = programEl ? programEl.value : "Waqaf Tanah";
  document.getElementById("summary-program").textContent = program;
  const fmt = nominalDipilih > 0 ? "Rp " + nominalDipilih.toLocaleString("id-ID") : "Rp 0";
  document.getElementById("summary-nominal").textContent = fmt;
  document.getElementById("summary-total").textContent = fmt;
}

updateSummary();

function validasiForm() {
  const nama = document.getElementById("nama").value.trim();
  const telepon = document.getElementById("telepon").value.trim();
  if (nominalDipilih < 5000) { tampilError("Nominal infaq minimal Rp 5.000."); return false; }
  if (!nama) { tampilError("Nama lengkap wajib diisi."); return false; }
  if (!telepon) { tampilError("Nomor WhatsApp wajib diisi."); return false; }
  sembunyikanError();
  return true;
}

function tampilError(pesan) {
  const el = document.getElementById("error-msg");
  el.textContent = "⚠️ " + pesan;
  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function sembunyikanError() {
  document.getElementById("error-msg").style.display = "none";
}

function prosesBayar() {
  if (!validasiForm()) return;

  const programEl = document.querySelector('input[name="program"]:checked');
  const program = programEl ? programEl.value : "Waqaf Tanah";
  const namaRaw = document.getElementById("nama").value.trim();
  const anon = document.getElementById("anon").checked;
  const nama = anon ? "Anonim" : namaRaw;
  const telepon = document.getElementById("telepon").value.trim();
  const fmt = nominalDipilih.toLocaleString("id-ID");

  // Tampilkan info rekening
  const infoBox = document.getElementById("info-rekening");
  infoBox.style.display = "block";
  infoBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Siapkan pesan WhatsApp
  const pesan = `Assalamualaikum, saya ${nama} ingin berinfaq.\nProgram: ${program}\nNominal: Rp ${fmt}\nNo. HP: ${telepon}`;
  document.getElementById("wa-btn").href = "https://wa.me/6282165878541?text=" + encodeURIComponent(pesan);
}