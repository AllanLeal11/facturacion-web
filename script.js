import { jsPDF } from './js/jspdf.umd.min.js';
import autoTable from 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/+esm';

const registros = [];

document.getElementById('facturaForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fecha = document.getElementById('fecha').value;
  const desayunos = parseInt(document.getElementById('desayunos').value);
  const almuerzos = parseInt(document.getElementById('almuerzos').value);
  const cenas = parseInt(document.getElementById('cenas').value);
  const bidones = parseInt(document.getElementById('bidones').value);

  const registro = { fecha, desayunos, almuerzos, cenas, bidones };
  registros.push(registro);

  mostrarRecibo();

  alert('Día agregado correctamente.');
  e.target.reset();
});

function mostrarRecibo() {
  const precios = { desayuno: 2500, almuerzo: 3000, cena: 2800, bidon: 2041 };
  const reciboDiv = document.getElementById('recibo');
  reciboDiv.innerHTML = ''; // Limpiar

  registros.forEach((r, i) => {
    const totalDes = r.desayunos * precios.desayuno;
    const totalAlm = r.almuerzos * precios.almuerzo;
    const totalCen = r.cenas * precios.cena;
    const totalBid = r.bidones * precios.bidon;
    const subtotal = totalDes + totalAlm + totalCen + totalBid;
    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    const bloque = document.createElement('div');
    bloque.innerHTML = `
      <h3>Factura Acquarello - Día ${i + 1}</h3>
      <p><strong>Fecha:</strong> ${r.fecha}</p>
      <table border="1" cellspacing="0" cellpadding="4">
        <thead>
          <tr>
            <th>Ítem</th><th>Cantidad</th><th>Precio U</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Desayunos</td><td>${r.desayunos}</td><td>${precios.desayuno}</td><td>${totalDes}</td></tr>
          <tr><td>Almuerzos</td><td>${r.almuerzos}</td><td>${precios.almuerzo}</td><td>${totalAlm}</td></tr>
          <tr><td>Cenas</td><td>${r.cenas}</td><td>${precios.cena}</td><td>${totalCen}</td></tr>
          <tr><td>Bidones</td><td>${r.bidones}</td><td>${precios.bidon}</td><td>${totalBid}</td></tr>
          <tr><td colspan="3"><strong>Subtotal</strong></td><td>${subtotal.toFixed(2)}</td></tr>
          <tr><td colspan="3"><strong>IVA (13%)</strong></td><td>${iva.toFixed(2)}</td></tr>
          <tr><td colspan="3"><strong>Total</strong></td><td>${total.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <hr>
    `;
    reciboDiv.appendChild(bloque);
  });
}

// Tu función para generar PDF directamente con jsPDF (opcional)
document.getElementById('generarPDF')?.addEventListener('click', async () => {
  if (registros.length === 0) {
    alert('No hay días registrados.');
    return;
  }

  const doc = new jsPDF();
  const precios = { desayuno: 2500, almuerzo: 3000, cena: 2800, bidon: 2041 };

  registros.forEach((r, i) => {
    const totalDes = r.desayunos * precios.desayuno;
    const totalAlm = r.almuerzos * precios.almuerzo;
    const totalCen = r.cenas * precios.cena;
    const totalBid = r.bidones * precios.bidon;
    const subtotal = totalDes + totalAlm + totalCen + totalBid;
    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    if (i > 0) doc.addPage();

    doc.setFontSize(14);
    doc.text(`Factura Acquarello`, 20, 20);
    doc.text(`Fecha: ${r.fecha}`, 20, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Ítem', 'Cantidad', 'Precio U', 'Total']],
      body: [
        ['Desayunos', r.desayunos, precios.desayuno, totalDes],
        ['Almuerzos', r.almuerzos, precios.almuerzo, totalAlm],
        ['Cenas', r.cenas, precios.cena, totalCen],
        ['Bidones', r.bidones, precios.bidon, totalBid],
        ['', '', 'Subtotal', subtotal.toFixed(2)],
        ['', '', 'IVA (13%)', iva.toFixed(2)],
        ['', '', 'Total', total.toFixed(2)],
      ],
    });
  });

  doc.save('factura_multiples_dias.pdf');
});


