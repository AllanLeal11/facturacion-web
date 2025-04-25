import { jsPDF } from './js/jspdf.umd.min.js';
import autoTable from 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/+esm';

const registros = [];

document.getElementById('facturaForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fecha = document.getElementById('fecha').value;
  const desayunos = parseInt(document.getElementById('desayunos').value);
  const almuerzos = parseInt(document.getElementById('almuerzos').value);
  const cenas = parseInt(document.getElementById('cenas').value);
  const bidones = parseInt(document.getElementById('bidones').value);

  registros.push({ fecha, desayunos, almuerzos, cenas, bidones });

  alert('Día agregado correctamente.');
  e.target.reset();
});

document.getElementById('generarPDF').addEventListener('click', () => {
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
        ['', '', 'Subtotal', subtotal],
        ['', '', 'IVA (13%)', iva.toFixed(2)],
        ['', '', 'Total', total.toFixed(2)]
      ]
    });
  });

  doc.save('factura_multiples_dias.pdf');
});
