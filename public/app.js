const API = location.origin + '/api';

// ---- PRESETS persistentes ----
const LS_PRESETS = 'lu_presets_v1';
function cargarPresets(){
  const base = {
    areas: ["Ali","Boulevares","Laboratorio","Juan","San Carlos","Laboratorio","Emergencias","Casa","Pao","Farmacia","Tarjeta","CosasConsul","Descartables","Varios"],
    categorias: ["Endodoncia","Zirconio","Resina","Limpieza","Luz","Agua","Internet","Telefono","Impuestos","Herramientas","Chicos"]
  };
  try {
    const raw = localStorage.getItem(LS_PRESETS);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return {
      areas: Array.from(new Set([...(parsed.areas||[]), ...base.areas])),
      categorias: Array.from(new Set([...(parsed.categorias||[]), ...base.categorias]))
    };
  } catch { return base; }
}
function guardarPresets(p){ localStorage.setItem(LS_PRESETS, JSON.stringify(p)); }

let PRESETS = cargarPresets();

function poblarDatalist(id, items){
  const dl = document.getElementById(id);
  if (dl) dl.innerHTML = items.map(v => `<option value="${v}"></option>`).join('');
}

function rangoDelMes(yyyy_mm){
  if (!yyyy_mm) return { start:null, end:null };
  const [y,m] = yyyy_mm.split('-').map(Number);
  const start = `${y}-${String(m).padStart(2,'0')}-01`;
  const last = new Date(y, m, 0).getDate();
  const end = `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
  return { start, end };
}
function rangoAnio(y){
  return { start: `${y}-01-01`, end: `${y}-12-31` };
}
function mesLabel(yyyy_mm){
  if (!yyyy_mm) return '';
  const [y,m] = yyyy_mm.split('-').map(Number);
  const dt = new Date(y, m-1, 1);
  return dt.toLocaleDateString('es-AR', { month:'long', year:'numeric' });
}

const $ = (s)=>document.querySelector(s);

const dom = {
  form: $('#form'),
  tipo: $('#tipo'),
  area: $('#area'),
  categoria: $('#categoria'),
  monto: $('#monto'),
  fecha: $('#fecha'),
  q: $('#q'),
  tipoFiltro: $('#tipoFiltro'),
  mes: $('#mes'),
  refrescar: $('#refrescar'),
  exportar: $('#exportar'),
  tbody: $('#tabla tbody'),
  periodoLabel: $('#periodo-label'),
  kpiIngresos: $('#kpi-ingresos'),
  kpiGastos: $('#kpi-gastos'),
  kpiBalance: $('#kpi-balance'),
  topIngresos: $('#top-ingresos'),
  topGastos: $('#top-gastos')
};

function formatear(n){ return (n ?? 0).toLocaleString('es-AR', { style:'currency', currency:'ARS' }); }

// Defaults
dom.fecha.value = new Date().toISOString().slice(0,10);
poblarDatalist('areas', PRESETS.areas);
poblarDatalist('categorias', PRESETS.categorias);
const ahora = new Date();
if (dom.mes) dom.mes.value = `${ahora.getFullYear()}-${String(ahora.getMonth()+1).padStart(2,'0')}`;

// Crear
dom.form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const area = dom.area.value.trim();
  const categoria = dom.categoria.value.trim();
  const body = {
    tipo: dom.tipo.value,
    area,
    categoria,
    monto: Number(dom.monto.value),
    fecha: dom.fecha.value
  };
  const r = await fetch(API + '/movimientos', { method:'POST', headers:{'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(body) });
  if (!r.ok) {
    if (r.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    const data = await r.json().catch(()=>({}));
    alert('Error: ' + JSON.stringify(data));
    return;
  }
  // Aprendizaje de presets: agrega si es nuevo y sube frecuencia (ordenamos luego)
  if (area && !PRESETS.areas.includes(area)) { PRESETS.areas.unshift(area); }
  if (categoria && !PRESETS.categorias.includes(categoria)) { PRESETS.categorias.unshift(categoria); }
  PRESETS.areas = Array.from(new Set(PRESETS.areas)).slice(0,30);
  PRESETS.categorias = Array.from(new Set(PRESETS.categorias)).slice(0,30);
  guardarPresets(PRESETS);
  poblarDatalist('areas', PRESETS.areas);
  poblarDatalist('categorias', PRESETS.categorias);

  dom.form.reset();
  dom.fecha.value = new Date().toISOString().slice(0,10);
  await cargar();
  await cargarResumen();
});

// Filtros
dom.refrescar.addEventListener('click', async ()=>{ await cargar(); await cargarResumen(); });
dom.q.addEventListener('input', cargar);
dom.tipoFiltro.addEventListener('change', cargar);
dom.mes.addEventListener('change', async ()=>{ await cargar(); await cargarResumen(); });
dom.exportar.addEventListener('click', ()=> exportarCSV());

// Chips de períodos rápidos
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', async () => {
    const tipo = chip.dataset.period;
    const now = new Date();
    if (tipo === 'mes-actual'){
      dom.mes.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    } else if (tipo === 'mes-anterior'){
      const prev = new Date(now.getFullYear(), now.getMonth()-1, 1);
      dom.mes.value = `${prev.getFullYear()}-${String(prev.getMonth()+1).padStart(2,'0')}`;
    } else if (tipo === 'anio-actual'){
      dom.mes.value = ''; // usamos año, así que limpiamos mes y manejamos en resumen/lista con start/end del año
      dom.mes.dataset.yearOverride = String(now.getFullYear());
    } else if (tipo === 'todo'){
      dom.mes.value = '';
      delete dom.mes.dataset.yearOverride;
    }
    await cargar();
    await cargarResumen();
  });
});

function buildParams(){
  const p = new URLSearchParams();
  if (dom.tipoFiltro && dom.tipoFiltro.value) p.set('tipo', dom.tipoFiltro.value);
  if (dom.q && dom.q.value.trim()) p.set('q', dom.q.value.trim());

  const yearOverride = dom.mes.dataset.yearOverride;
  if (yearOverride){
    const { start, end } = rangoAnio(Number(yearOverride));
    p.set('start', start); p.set('end', end);
    dom.periodoLabel.textContent = `Período: Año ${yearOverride}`;
    return p;
  }

  const { start, end } = rangoDelMes(dom.mes ? dom.mes.value : '');
  if (start) p.set('start', start);
  if (end) p.set('end', end);
  dom.periodoLabel.textContent = dom.mes && dom.mes.value ? `Período: ${mesLabel(dom.mes.value)}` : (dom.mes.value==='' ? '' : dom.periodoLabel.textContent);
  return p;
}

// Cargar tabla con filtros
async function cargar(){
  const p = buildParams();
  const r = await fetch(API + '/movimientos?' + p.toString(), { credentials: 'include' });
  if (r.status === 401) {
    window.location.href = '/login.html';
    return;
  }
  const lista = await r.json();

  if (!lista.length){
    dom.tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#6b7280;padding:16px">Sin movimientos para el período seleccionado</td></tr>`;
    return;
  }
  dom.tbody.innerHTML = lista.map(m => `
    <tr>
      <td>${m.fecha}</td>
      <td><span class="badge ${m.tipo}">${m.tipo}</span></td>
      <td>${m.area}</td>
      <td>${m.categoria}</td>
      <td class="num">${formatear(m.monto)}</td>
      <td><button class="mini" data-id="${m.id}">🗑</button></td>
    </tr>
  `).join('');

  dom.tbody.querySelectorAll('button.mini').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('¿Borrar movimiento?')) return;
      const r2 = await fetch(API + '/movimientos/' + id, { method:'DELETE', credentials: 'include' });
      if (r2.status === 401) {
        window.location.href = '/login.html';
        return;
      }
      if (!r2.ok) return alert('No se pudo borrar');
      await cargar();
      await cargarResumen();
    });
  });
}

// Cargar resumen con mismos filtros
async function cargarResumen(){
  const p = buildParams();
  const r = await fetch(API + '/resumen?' + p.toString(), { credentials: 'include' });
  if (r.status === 401) {
    window.location.href = '/login.html';
    return;
  }
  const data = await r.json();

  const kIng = document.getElementById('kpi-ingresos');
  const kGas = document.getElementById('kpi-gastos');
  const kBal = document.getElementById('kpi-balance');

  kIng.textContent = formatear(data.totalIngresos || 0);
  kGas.textContent = formatear(data.totalGastos || 0);
  kBal.textContent = formatear((data.balance ?? 0));
  kBal.classList.remove('positivo','negativo','neutro');
  kBal.classList.add((data.balance ?? 0) > 0 ? 'positivo' : (data.balance ?? 0) < 0 ? 'negativo' : 'neutro');

  const topIn = (data.topIngresos || []).map(([area,total]) => `<li><strong>${area}</strong>: ${formatear(total)}</li>`).join('');
  const topGa = (data.topGastos || []).map(([area,total]) => `<li><strong>${area}</strong>: ${formatear(total)}</li>`).join('');
  document.getElementById('top-ingresos').innerHTML = topIn || '<li>—</li>';
  document.getElementById('top-gastos').innerHTML = topGa || '<li>—</li>';
  
  // Renderizar desglose por área
  const desgloseContainer = document.getElementById('desglose');
  if (data.desglose && data.desglose.length > 0) {
    desgloseContainer.innerHTML = data.desglose.map(area => {
      const categoriasHtml = area.categorias.map(cat => 
        `<div class="desglose-categoria ${cat.tipo}">
          <span class="desglose-categoria-nombre">${cat.categoria}</span>
          <span class="desglose-categoria-monto">${formatear(cat.monto)}</span>
        </div>`
      ).join('');
      
      return `
        <div class="desglose-área">
          <div class="desglose-área-header">
            <div class="desglose-área-name">${area.area}</div>
            <div class="desglose-área-totales">
              <span class="desglose-ingresos">Ingresos: ${formatear(area.ingresos)}</span>
              <span class="desglose-gastos">Gastos: ${formatear(area.gastos)}</span>
              <span class="desglose-balance">Balance: ${formatear(area.balance)}</span>
            </div>
          </div>
          <div class="desglose-categorias">${categoriasHtml}</div>
        </div>
      `;
    }).join('');
  } else {
    desgloseContainer.innerHTML = '<p style="text-align:center;color:#6b7280;padding:16px">No hay datos para mostrar</p>';
  }
}

// Export respetando filtros
async function exportarCSV(){
  const p = buildParams();
  const r = await fetch(API + '/export.csv?' + p.toString(), { credentials: 'include' });
  if (r.status === 401) {
    window.location.href = '/login.html';
    return;
  }
  const blob = await r.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'movimientos.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/login.html';
});

// Init
(async function init(){
  await cargar();
  await cargarResumen();
})();
