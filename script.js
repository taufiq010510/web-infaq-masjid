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
  const program = programEl ? programEl.value : "Infaq Bebas";
  document.getElementById("summary-program").textContent = program;
  const fmt = nominalDipilih > 0 ? "Rp " + nominalDipilih.toLocaleString("id-ID") : "Rp 0";
  document.getElementById("summary-nominal").textContent = fmt;
  document.getElementById("summary-total").textContent = fmt;
}

updateSummary();

function validasiForm() {
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const telepon = document.getElementById("telepon").value.trim();
  if (nominalDipilih < 5000) { tampilError("Nominal infaq minimal Rp 5.000."); return false; }
  if (!nama) { tampilError("Nama lengkap wajib diisi."); return false; }
  if (!email || !email.includes("@")) { tampilError("Masukkan alamat email yang valid."); return false; }
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

async function prosesBayar() {
  if (!validasiForm()) return;
  const programEl = document.querySelector('input[name="program"]:checked');
  const program = programEl ? programEl.value : "Infaq Bebas";
  const namaRaw = document.getElementById("nama").value.trim();
  const anon = document.getElementById("anon").checked;
  const nama = anon ? "Anonim" : namaRaw;
  const email = document.getElementById("email").value.trim();
  const telepon = document.getElementById("telepon").value.trim();
  setBtnLoading(true);
  try {
    const res = await fetch("/.netlify/functions/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, telepon, program, nominal: nominalDipilih }),
    });
    const data = await res.json();
    if (!data.token) throw new Error(data.error || "Gagal mendapatkan token pembayaran.");
    window.snap.pay(data.token, {
      onSuccess: function (result) {
        window.location.href = "/terima-kasih.html?order=" + data.orderId;
      },
      onPending: function (result) {
        alert("Terima kasih! Silakan selesaikan pembayaran sesuai instruksi yang dikirim ke email Anda.");
      },
      onError: function (result) {
        tampilError("Pembayaran gagal. Silakan coba lagi.");
      },
      onClose: function () {
        console.log("Popup ditutup.");
      },
    });
  } catch (err) {
    tampilError("Terjadi kesalahan: " + err.message);
  } finally {
    setBtnLoading(false);
  }
}

function setBtnLoading(loading) {
  const btn = document.getElementById("btn-bayar");
  document.getElementById("btn-text").style.display = loading ? "none" : "inline";
  document.getElementById("btn-loader").style.display = loading ? "inline" : "none";
  btn.disabled = loading;
}