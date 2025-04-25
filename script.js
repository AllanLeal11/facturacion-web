// script.js

// Array para almacenar los registros
const registros = [];

// Evento submit del formulario
document.getElementById('facturaForm').addEventListener('submit', e => {
  e.preventDefault();

  // Obtener valores del formulario
  const fecha = document.getElementById('fecha').value;
  const desayunos = parseInt(document.getElementById('desayunos').value, 10);
  const almuerzos = parseInt(document.getElementById('almuerzos').value, 10);
  const cenas = parseInt(document.getElementById('cenas').value, 10);
  const bidones = parseInt(document.getElementById('bidones').value, 10);

  // Agregar registro al array
  registros.push({ fecha, desayunos, almuerzos, cenas, bidones });

  // Mostrar recibo actualizado
  mostrarRecibo();

  // Resetear formulario y notificar
  e.target.reset();
  alert('Día agregado correctamente.');
});

// Función para renderizar los registros en pantalla
function mostrarRecibo() {
  const precios = { desayuno: 2500, almuerzo: 3000, cena: 2800, bidon: 2041 };
  const reciboDiv = document.getElementById('recibo');
  reciboDiv.innerHTML = ''; // limpiar contenedor

  // Calcular subtotal combinado para todos los días
  let subtotalCombinado = 0;
  registros.forEach(r => {
    const totalDes = r.desayunos * precios.desayuno;
    const totalAlm = r.almuerzos * precios.almuerzo;
    const totalCen = r.cenas * precios.cena;
    const totalBid = r.bidones * precios.bidon;
    const subtotal = totalDes + totalAlm + totalCen + totalBid;
    subtotalCombinado += subtotal;
  });

  // Renderizar cada día con su subtotal, y en el último, agregar subtotal combinado, IVA y total final
  registros.forEach((r, i) => {
    const totalDes = r.desayunos * precios.desayuno;
    const totalAlm = r.almuerzos * precios.almuerzo;
    const totalCen = r.cenas * precios.cena;
    const totalBid = r.bidones * precios.bidon;
    const subtotal = totalDes + totalAlm + totalCen + totalBid;

    const bloque = document.createElement('div');
    let html = `
      <h3>Factura Acquarello - Día ${i + 1}</h3>
      <p><strong>Fecha:</strong> ${r.fecha}</p>
      <table>
        <thead>
          <tr><th>Ítem</th><th>Cantidad</th><th>Precio U</th><th>Total</th></tr>
        </thead>
        <tbody>
          <tr><td>Desayunos</td><td>${r.desayunos}</td><td>${precios.desayuno}</td><td>${totalDes}</td></tr>
          <tr><td>Almuerzos</td><td>${r.almuerzos}</td><td>${precios.almuerzo}</td><td>${totalAlm}</td></tr>
          <tr><td>Cenas</td><td>${r.cenas}</td><td>${precios.cena}</td><td>${totalCen}</td></tr>
          <tr><td>Bidones</td><td>${r.bidones}</td><td>${precios.bidon}</td><td>${totalBid}</td></tr>
          <tr><td colspan="3"><strong>Subtotal</strong></td><td>${subtotal.toFixed(2)}</td></tr>
    `;

    if (i === registros.length - 1) {
      const ivaTotal = subtotalCombinado * 0.13;
      const totalConIva = subtotalCombinado + ivaTotal;
      html += `
          <tr><td colspan="3"><strong>Subtotal Combinado</strong></td><td>${subtotalCombinado.toFixed(2)}</td></tr>
          <tr><td colspan="3"><strong>IVA (13%)</strong></td><td>${ivaTotal.toFixed(2)}</td></tr>
          <tr><td colspan="3"><strong>Total con IVA</strong></td><td>${totalConIva.toFixed(2)}</td></tr>
      `;
    }

    html += `
        </tbody>
      </table>
      <hr>
    `;
    bloque.innerHTML = html;
    reciboDiv.appendChild(bloque);
  });
}

// Función para descargar el contenido de #recibo como PDF
function descargarPDF() {
  const elemento = document.getElementById('recibo');
  const opciones = {
    margin: 0.5,
    filename: 'recibo.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opciones).from(elemento).save();
}
