// ===== Data menu =====
const menuMakanan = [
    ["Mie Ayam", 10000],
    ["Mie Rebus + Nasi", 10000],
    ["Indomie Goreng", 3500],
    ["Nasi + Telur", 5000],
    ["Nasi Uduk", 5000],
    ["Gorengan", 1000],
    ["Siomay", 1000],
    ["Pempek", 1000],
];

const menuMinuman = [
    ["Aqua", 3000],
    ["Ultra Mimi", 6000],
    ["Teajus Apel", 2000],
    ["Teh Sisri", 2000],
    ["Marimas Mangga", 2000],
    ["Marimas Jeruk", 2000],
    ["Pop Ice", 5000],
];

// ===== State keranjang =====
let keranjang = []; 
let selectedMenuRow = { makanan: null, minuman: null };
let selectedKeranjangIndex = null;

// ===== Util =====
function formatRupiah(angka) {
    return "Rp" + (angka || 0).toLocaleString("id-ID");
}

function nowString() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ===== Render menu =====
function renderTable(tableId, data, typeKey) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";
    
    data.forEach(([nama, harga], idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${nama}</td>
            <td style="text-align:right; font-weight:600; color:#3b82f6;">${formatRupiah(harga)}</td>
            <td><button class="btn btn-primary btn-sm" style="padding: 5px 10px; margin:0; font-size:12px;">Pilih</button></td>
        `;
        
        tr.addEventListener("click", () => {
            [...tbody.children].forEach((row) => row.classList.remove("selected"));
            tr.classList.add("selected");
            selectedMenuRow[typeKey] = { idx, nama, harga };
        });
        
        tr.querySelector("button").addEventListener("click", (e) => {
            e.stopPropagation();
            selectedMenuRow[typeKey] = { idx, nama, harga };
            tambahKeKeranjang(typeKey);
        });
        
        tbody.appendChild(tr);
    });
}

// ===== Keranjang ops =====
function tambahKeKeranjang(typeKey) {
    const selected = selectedMenuRow[typeKey];
    if (!selected) {
        alert("Pilih menu terlebih dahulu!");
        return;
    }
    
    let jumlah = parseInt(prompt(`Masukkan jumlah untuk ${selected.nama}:`), 10);
    if (isNaN(jumlah) || jumlah <= 0) return;
    
    const existing = keranjang.find(it => it.nama === selected.nama);
    if (existing) {
        existing.jumlah += jumlah;
    } else {
        keranjang.push({ nama: selected.nama, harga: selected.harga, jumlah });
    }
    
    renderKeranjang();
    updateTotal();
}

function renderKeranjang() {
    const ul = document.getElementById("list-keranjang");
    ul.innerHTML = "";
    keranjang.forEach((item, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.nama} <b style="color:#3b82f6">x${item.jumlah}</b></span>
            <span style="font-weight:600;">${formatRupiah(item.harga * item.jumlah)}</span>
        `;
        li.addEventListener("click", () => {
            [...ul.children].forEach((el) => el.classList.remove("selected"));
            li.classList.add("selected");
            selectedKeranjangIndex = idx;
        });
        ul.appendChild(li);
    });
}

// ===== Hapus Item =====
function hapusItemTerpilih() {
    if (selectedKeranjangIndex === null) {
        alert("Pilih item di keranjang untuk dihapus!");
        return;
    }
    
    const item = keranjang[selectedKeranjangIndex];
    let jumlahHapus = parseInt(prompt(`Masukkan jumlah yang ingin dihapus untuk ${item.nama} (jumlah saat ini: ${item.jumlah})`), 10);
    if (isNaN(jumlahHapus) || jumlahHapus <= 0) return;
    
    if (jumlahHapus >= item.jumlah) {
        keranjang.splice(selectedKeranjangIndex, 1);
    } else {
        item.jumlah -= jumlahHapus;
    }
    
    selectedKeranjangIndex = null;
    renderKeranjang();
    updateTotal();
}

function updateTotal() {
    const total = keranjang.reduce((acc, it) => acc + it.harga * it.jumlah, 0);
    document.getElementById("lbl-total").textContent = formatRupiah(total);
}

// ===== Formulasi Teks Struk =====
function buatStrukText() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return null;
    }
    
    const uangStr = document.getElementById("input-uang").value.trim();
    const uang = parseInt(uangStr, 10);
    if (isNaN(uang)) {
        alert("Masukkan nominal uang yang valid!");
        return null;
    }
    
    const total = keranjang.reduce((acc, it) => acc + it.harga * it.jumlah, 0);
    if (uang < total) {
        alert(`Total: ${formatRupiah(total)}\nUang tidak cukup!`);
        return null;
    }
    
    const kembalian = uang - total;
    const garis = "-".repeat(30);
    const header = "===== STRUK PEMBAYARAN =====";
    const toko = "Warung Bude";
    const waktu = nowString();
    
    const lines = [
        header,
        toko,
        waktu,
        garis,
        ...keranjang.map((it) => `${(it.nama + " x" + it.jumlah).padEnd(20, ".")} ${formatRupiah(it.harga * it.jumlah)}`),
        garis,
        `Total Belanja : ${formatRupiah(total)}`,
        `Uang Diberikan: ${formatRupiah(uang)}`,
        `Kembalian     : ${formatRupiah(kembalian)}`,
        "=".repeat(30),
        "Terima kasih telah berbelanja!",
    ];
    return lines.join("\n");
}

function tampilkanStruk() {
    const struk = buatStrukText();
    if (!struk) return;
    
    const modal = document.getElementById("modal-struk");
    const pre = document.getElementById("struk-text");
    pre.textContent = struk;
    modal.setAttribute("aria-hidden", "false");
}

function simpanStrukTxt() {
    const struk = buatStrukText();
    if (!struk) return;
    
    const blob = new Blob([struk], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    const ts = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const filename = `struk_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.txt`;
    
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
}

// ===== Fungsi Fitur Cetak / Print =====
function cetakStruk() {
    const struk = buatStrukText();
    if (!struk) return;

    const printWindow = window.open('', '_blank', 'height=600,width=400');
    
    printWindow.document.write('<html><head><title>Cetak Struk - Warung Bude</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Consolas, Menlo, monospace; font-size: 14px; padding: 20px; white-space: pre-wrap; margin: 0; color: #000; background: #fff; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(struk);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    printWindow.print();
    printWindow.close();
}

function closeModal() {
    document.getElementById("modal-struk").setAttribute("aria-hidden", "true");
}

// ===== Pengaktifan saat Aplikasi Siap =====
document.addEventListener("DOMContentLoaded", () => {
    renderTable("table-makanan", menuMakanan, "makanan");
    renderTable("table-minuman", menuMinuman, "minuman");
    
    document.getElementById("btn-hapus").addEventListener("click", hapusItemTerpilih);
    document.getElementById("btn-struk").addEventListener("click", tampilkanStruk);
    document.getElementById("btn-simpan").addEventListener("click", simpanStrukTxt);
    document.getElementById("btn-print").addEventListener("click", cetakStruk); 
    
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-ok").addEventListener("click", closeModal);
    document.getElementById("modal-print").addEventListener("click", cetakStruk); 
    
    document.getElementById("modal-struk").addEventListener("click", (e) => {
        if (e.target.id === "modal-struk") closeModal();
    });
    
    updateTotal();
});