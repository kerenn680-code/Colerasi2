function hitungKorelasi() {
  let x = document.getElementById("dataX").value.split(",").map(Number);
  let y = document.getElementById("dataY").value.split(",").map(Number);

  if (x.length !== y.length) {
    document.getElementById("hasil").innerText = "⚠️ Jumlah data X dan Y harus sama!";
    document.getElementById("hasil").style.color = "#e74c3c";
    return;
  }

  let n = x.length;
  let sumX = x.reduce((a,b) => a+b, 0);
  let sumY = y.reduce((a,b) => a+b, 0);
  let sumXY = x.map((xi, i) => xi*y[i]).reduce((a,b) => a+b, 0);
  let sumX2 = x.map(xi => xi*xi).reduce((a,b) => a+b, 0);
  let sumY2 = y.map(yi => yi*yi).reduce((a,b) => a+b, 0);

  let r = (n*sumXY - sumX*sumY) / 
          Math.sqrt((n*sumX2 - sumX*sumX) * (n*sumY2 - sumY*sumY));

  document.getElementById("hasil").innerText = "✅ Koefisien Korelasi (r) = " + r.toFixed(4);
  document.getElementById("hasil").style.color = "#27ae60";
}
