const tablasISR = {
    mensual: [
        { limiteInferior: 0.01, cuotaFija: 0.00, porcentaje: 1.92 },
        { limiteInferior: 850.01, cuotaFija: 16.32, porcentaje: 6.40 },
        { limiteInferior: 7200.01, cuotaFija: 422.72, porcentaje: 10.88 },
        { limiteInferior: 12600.01, cuotaFija: 1010.16, porcentaje: 16.00 },
        { limiteInferior: 14700.01, cuotaFija: 1346.16, porcentaje: 17.92 },
        { limiteInferior: 17600.01, cuotaFija: 1865.84, porcentaje: 21.36 },
        { limiteInferior: 35500.01, cuotaFija: 5689.28, porcentaje: 23.52 },
        { limiteInferior: 56000.01, cuotaFija: 10510.88, porcentaje: 30.00 },
        { limiteInferior: 107000.01, cuotaFija: 25810.88, porcentaje: 32.00 },
        { limiteInferior: 142000.01, cuotaFija: 37010.88, porcentaje: 34.00 },
        { limiteInferior: 428000.01, cuotaFija: 134250.88, porcentaje: 35.00 }
    ],
    quincenal: [
        { limiteInferior: 0.01, cuotaFija: 0.00, porcentaje: 1.92 },
        { limiteInferior: 425.01, cuotaFija: 8.16, porcentaje: 6.40 },
        { limiteInferior: 3600.01, cuotaFija: 211.36, porcentaje: 10.88 },
        { limiteInferior: 6300.01, cuotaFija: 505.08, porcentaje: 16.00 },
        { limiteInferior: 7350.01, cuotaFija: 673.08, porcentaje: 17.92 },
        { limiteInferior: 8800.01, cuotaFija: 932.92, porcentaje: 21.36 },
        { limiteInferior: 17750.01, cuotaFija: 2844.64, porcentaje: 23.52 },
        { limiteInferior: 28000.01, cuotaFija: 5255.44, porcentaje: 30.00 },
        { limiteInferior: 53500.01, cuotaFija: 12905.44, porcentaje: 32.00 },
        { limiteInferior: 71000.01, cuotaFija: 18505.44, porcentaje: 34.00 },
        { limiteInferior: 214000.01, cuotaFija: 67125.44, porcentaje: 35.00 }
    ],
    semanal: [
        { limiteInferior: 0.01, cuotaFija: 0.00, porcentaje: 1.92 },
        { limiteInferior: 195.66, cuotaFija: 3.76, porcentaje: 6.40 },
        { limiteInferior: 1657.89, cuotaFija: 97.34, porcentaje: 10.88 },
        { limiteInferior: 2901.32, cuotaFija: 232.61, porcentaje: 16.00 },
        { limiteInferior: 3384.87, cuotaFija: 309.97, porcentaje: 17.92 },
        { limiteInferior: 4052.63, cuotaFija: 429.63, porcentaje: 21.36 },
        { limiteInferior: 8174.34, cuotaFija: 1309.84, porcentaje: 23.52 },
        { limiteInferior: 12894.74, cuotaFija: 2420.26, porcentaje: 30.00 },
        { limiteInferior: 24638.16, cuotaFija: 5943.29, porcentaje: 32.00 },
        { limiteInferior: 32697.37, cuotaFija: 8522.23, porcentaje: 34.00 },
        { limiteInferior: 98552.63, cuotaFija: 30913.03, porcentaje: 35.00 }
    ]
};

const diasPeriodo = { mensual: 30.4, quincenal: 15.2, semanal: 7 };
const SALARIO_MINIMO_DIARIO = 315.04; 

const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cantidad);
};

let graficaPastel = null;

const checkboxes = ['chkVales', 'chkAhorro', 'chkInfonavit', 'chkFonacot', 'chkPension'];
checkboxes.forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        const inputId = id.replace('chk', 'val');
        const inputElement = document.getElementById(inputId);
        inputElement.style.display = this.checked ? 'block' : 'none';
        if(!this.checked) inputElement.value = '';
    });
});

document.getElementById('chkInverso').addEventListener('change', function() {
    const lbl = document.getElementById('lblSueldo');
    const input = document.getElementById('sueldoBase');
    if(this.checked) {
        lbl.innerText = "Sueldo Neto DESEADO (Libre):"; input.placeholder = "Ej. 20000";
    } else {
        lbl.innerText = "Sueldo Bruto (MXN):"; input.placeholder = "Ej. 15000";
    }
});

const btnContador = document.getElementById('btnModoContador');
const contenedor = document.getElementById('tarjetaPrincipal');
const controlColores = document.querySelector('.control-colores');
const chkColoresLocos = document.getElementById('chkColoresLocos');
const panelContador = document.getElementById('panelContador');
const desgloseUI = document.getElementById('desgloseContador');

let modoContadorActivo = false;
let modoAguinaldoActivo = false;

btnContador.addEventListener('click', function() {
    modoContadorActivo = !modoContadorActivo;
    if (modoContadorActivo) {
        btnContador.innerText = 'Cerrar Modo Contador'; btnContador.classList.add('activo');
        contenedor.classList.add('ancho-contador'); 
        if(!modoAguinaldoActivo) {
            document.body.classList.add('modo-invertido'); chkColoresLocos.checked = true; 
        }
        controlColores.classList.add('visible'); panelContador.classList.add('desplegado'); desgloseUI.style.display = 'block'; 
    } else {
        btnContador.innerText = '🕵️‍♂️ Modo Contador'; btnContador.classList.remove('activo');
        contenedor.classList.remove('ancho-contador'); document.body.classList.remove('modo-invertido');
        controlColores.classList.remove('visible'); chkColoresLocos.checked = false;
        panelContador.classList.remove('desplegado'); desgloseUI.style.display = 'none';
    }
});

chkColoresLocos.addEventListener('change', function() {
    if (this.checked) document.body.classList.add('modo-invertido');
    else document.body.classList.remove('modo-invertido');
});

const btnAguinaldo = document.getElementById('btnModoAguinaldo');
btnAguinaldo.addEventListener('click', function() {
    modoAguinaldoActivo = !modoAguinaldoActivo;
    const titulo = document.getElementById('tituloPrincipal'), lblSueldo = document.getElementById('lblSueldo');
    const cajaExtra = document.getElementById('cajaOpcionesExtra'), cajaToggle = document.getElementById('cajaToggleInverso');
    
    if(modoAguinaldoActivo) {
        document.body.classList.add('modo-navideno'); document.body.classList.remove('modo-invertido'); chkColoresLocos.checked = false;
        btnAguinaldo.innerText = 'Volver a Nómina Normal'; btnAguinaldo.classList.add('activo');
        titulo.innerText = "CalculadoraISR.com.mx - Aguinaldo 2026"; lblSueldo.innerText = "Monto de Aguinaldo Bruto (MXN):";
        cajaExtra.style.display = 'none'; cajaToggle.style.display = 'none'; document.getElementById('filaImssUI').style.display = 'none';
        document.getElementById('lblNetoFinal').innerText = "Aguinaldo Libre a Recibir:";
    } else {
        document.body.classList.remove('modo-navideno'); btnAguinaldo.innerText = '🎄 Calcular Aguinaldo'; btnAguinaldo.classList.remove('activo');
        titulo.innerText = "CalculadoraISR.com.mx";
        lblSueldo.innerText = document.getElementById('chkInverso').checked ? "Sueldo Neto DESEADO (Libre):" : "Sueldo Bruto (MXN):";
        cajaExtra.style.display = 'block'; cajaToggle.style.display = 'flex'; document.getElementById('filaImssUI').style.display = 'flex';
        document.getElementById('lblNetoFinal').innerText = "Sueldo Neto a Recibir:";
        if(modoContadorActivo) { document.body.classList.add('modo-invertido'); chkColoresLocos.checked = true; }
    }
    document.getElementById('seccionResultados').style.display = 'none'; 
});

function obtenerDiasVacaciones(anios) {
    if (anios === 1) return 12; if (anios === 2) return 14; if (anios === 3) return 16;
    if (anios === 4) return 18; if (anios === 5) return 20; if (anios >= 6 && anios <= 10) return 22;
    if (anios >= 11 && anios <= 15) return 24; if (anios >= 16 && anios <= 20) return 26; return 28; 
}

function calcularFactorIntegracion(anios) { return 1 + (15 / 365) + ((obtenerDiasVacaciones(anios) * 0.25) / 365); }

function calcularImpuestosAvanzado(brutoPeriodo, tipoPeriodo) {
    const umaDiaria = parseFloat(document.getElementById('valUma').value) || 117.31;
    
    if(modoAguinaldoActivo) {
        let montoExento = 30 * umaDiaria; 
        let aguinaldoGravado = brutoPeriodo - montoExento;
        if(aguinaldoGravado < 0) aguinaldoGravado = 0;
        
        let cuotaISR = 0, base = 0, limite = 0, tasa = 0, marginal = 0, cuota = 0;
        if (aguinaldoGravado > 0) {
            const tabla = tablasISR['mensual'];
            for (let i = tabla.length - 1; i >= 0; i--) {
                if (aguinaldoGravado >= tabla[i].limiteInferior) {
                    limite = tabla[i].limiteInferior; base = aguinaldoGravado - limite;
                    tasa = tabla[i].porcentaje; marginal = base * (tasa / 100);
                    cuota = tabla[i].cuotaFija; cuotaISR = cuota + marginal; break;
                }
            }
        }
        let desglose = { sbcMensual: 0, gravable: aguinaldoGravado, limite, base, tasa, marginal, cuota, subsidio: 0, exentoAguinaldo: montoExento };
        return { isr: cuotaISR, imss: 0, netoBase: brutoPeriodo - cuotaISR, desglose };
    }

    const dias = diasPeriodo[tipoPeriodo], sueldoDiario = brutoPeriodo / dias;
    const aniosEmpresa = parseInt(document.getElementById('valAnios').value) || 1;
    let factorManual = parseFloat(document.getElementById('valFactorManual').value);
    const factorIntegracion = factorManual ? factorManual : calcularFactorIntegracion(aniosEmpresa);
    
    let sbcDiario = sueldoDiario * factorIntegracion;
    if (sbcDiario > (umaDiaria * 25)) sbcDiario = umaDiaria * 25;
    
    let cuotaIMSS = 0;
    if (sueldoDiario > SALARIO_MINIMO_DIARIO) {
        const imssFijo = sbcDiario * 0.02375 * dias; 
        let imssExcedente = 0;
        if (sbcDiario > (umaDiaria * 3)) imssExcedente = (sbcDiario - (umaDiaria * 3)) * 0.004 * dias;
        cuotaIMSS = imssFijo + imssExcedente;
    }

    let cuotaISR = 0, subsidioAlEmpleo = 0, base = 0, limite = 0, tasa = 0, marginal = 0, cuota = 0;
    const tabla = tablasISR[tipoPeriodo];
    
    if (sueldoDiario * 30.4 <= 9081.00) subsidioAlEmpleo = (390.12 / 30.4) * dias;

    if (sueldoDiario > SALARIO_MINIMO_DIARIO) {
        for (let i = tabla.length - 1; i >= 0; i--) {
            if (brutoPeriodo >= tabla[i].limiteInferior) {
                limite = tabla[i].limiteInferior; base = brutoPeriodo - limite;
                tasa = tabla[i].porcentaje; marginal = base * (tasa / 100);
                cuota = tabla[i].cuotaFija; cuotaISR = cuota + marginal; break;
            }
        }
    }
    let isrNetoARetener = cuotaISR - subsidioAlEmpleo;
    if (isrNetoARetener < 0) isrNetoARetener = 0;

    let desglose = { sbcMensual: sbcDiario * dias, gravable: brutoPeriodo, limite, base, tasa, marginal, cuota, subsidio: subsidioAlEmpleo, exentoAguinaldo: 0 };
    return { isr: isrNetoARetener, imss: cuotaIMSS, netoBase: brutoPeriodo - isrNetoARetener - cuotaIMSS, desglose };
}

function encontrarBrutoDesdeNeto(netoObjetivo, tipoPeriodo) {
    let min = netoObjetivo, max = netoObjetivo * 2, brutoEstimado = 0;
    for (let i = 0; i < 45; i++) { 
        brutoEstimado = (min + max) / 2;
        let simulacion = calcularImpuestosAvanzado(brutoEstimado, tipoPeriodo);
        if (simulacion.netoBase < netoObjetivo) min = brutoEstimado; else max = brutoEstimado;
    }
    return brutoEstimado;
}

function dibujarGrafica(neto, isr, imssDeducciones) {
    const ctx = document.getElementById('graficaResultados').getContext('2d');
    if (graficaPastel) graficaPastel.destroy(); 
    if(isr + imssDeducciones === 0) imssDeducciones = 0.01; 

    const labelNeto = 'Sueldo Libre: ' + formatearMoneda(neto);
    const labelIsr = 'Impuesto SAT: ' + formatearMoneda(isr);
    const labelImss = 'IMSS / Deducciones: ' + formatearMoneda(imssDeducciones);

    graficaPastel = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [labelNeto, labelIsr, labelImss],
            datasets: [{
                data: [neto, isr, imssDeducciones], backgroundColor: ['#27ae60', '#e74c3c', '#f39c12'],
                borderWidth: 2, borderColor: '#ffffff'
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#333' } } } }
    });
    document.getElementById('cajaGrafica').style.display = 'block';
}

const calcularTotal = () => {
    const inputValor = parseFloat(document.getElementById('sueldoBase').value);
    const esInverso = document.getElementById('chkInverso').checked && !modoAguinaldoActivo;
    const tipoPeriodo = document.getElementById('selPeriodo').value;

    if (isNaN(inputValor) || inputValor <= 0) return;

    let brutoReal = esInverso ? encontrarBrutoDesdeNeto(inputValor, tipoPeriodo) : inputValor;
    let impuestos = calcularImpuestosAvanzado(brutoReal, tipoPeriodo);
    let netoEfectivo = impuestos.netoBase;
    let htmlDeducciones = '', totalDeduccionesExtras = impuestos.imss;

    document.getElementById('dcGravable').innerText = formatearMoneda(impuestos.desglose.gravable);
    document.getElementById('dcLimite').innerText = formatearMoneda(impuestos.desglose.limite);
    document.getElementById('dcBase').innerText = formatearMoneda(impuestos.desglose.base);
    document.getElementById('dcTasa').innerText = impuestos.desglose.tasa.toFixed(2) + '%';
    document.getElementById('dcMarginal').innerText = formatearMoneda(impuestos.desglose.marginal);
    document.getElementById('dcCuota').innerText = formatearMoneda(impuestos.desglose.cuota);
    document.getElementById('dcRetener').innerText = "-" + formatearMoneda(impuestos.isr);
    
    if(modoAguinaldoActivo) {
        document.getElementById('lblSbcBase').style.display = 'none'; document.getElementById('dcSbc').style.display = 'none';
        document.getElementById('filaExentoAguinaldo').style.display = 'flex';
        document.getElementById('dcExento').innerText = "-" + formatearMoneda(impuestos.desglose.exentoAguinaldo);
    } else {
        document.getElementById('lblSbcBase').style.display = 'inline'; document.getElementById('dcSbc').style.display = 'inline';
        document.getElementById('dcSbc').innerText = formatearMoneda(impuestos.desglose.sbcMensual);
        document.getElementById('filaExentoAguinaldo').style.display = 'none';
    }

    if (impuestos.desglose.subsidio > 0) {
        document.getElementById('filaSubsidio').style.display = 'flex'; document.getElementById('dcSubsidio').innerText = "-" + formatearMoneda(impuestos.desglose.subsidio);
    } else { document.getElementById('filaSubsidio').style.display = 'none'; }

    if(!modoAguinaldoActivo) {
        if (document.getElementById('chkAhorro').checked) { let desc = brutoReal * ((parseFloat(document.getElementById('valAhorro').value) || 0) / 100); netoEfectivo -= desc; totalDeduccionesExtras += desc; htmlDeducciones += `<div class="fila-resultado"><span>Fondo Ahorro:</span><span class="valor-negativo">-${formatearMoneda(desc)}</span></div>`; }
        if (document.getElementById('chkInfonavit').checked) { let info = parseFloat(document.getElementById('valInfonavit').value) || 0; netoEfectivo -= info; totalDeduccionesExtras += info; htmlDeducciones += `<div class="fila-resultado"><span>Infonavit:</span><span class="valor-negativo">-${formatearMoneda(info)}</span></div>`; }
        if (document.getElementById('chkFonacot').checked) { let fona = parseFloat(document.getElementById('valFonacot').value) || 0; netoEfectivo -= fona; totalDeduccionesExtras += fona; htmlDeducciones += `<div class="fila-resultado"><span>FONACOT:</span><span class="valor-negativo">-${formatearMoneda(fona)}</span></div>`; }
        if (document.getElementById('chkPension').checked) { let descPen = impuestos.netoBase * ((parseFloat(document.getElementById('valPension').value) || 0) / 100); netoEfectivo -= descPen; totalDeduccionesExtras += descPen; htmlDeducciones += `<div class="fila-resultado"><span>Pensión:</span><span class="valor-negativo">-${formatearMoneda(descPen)}</span></div>`; }
    }

    if (!modoAguinaldoActivo && document.getElementById('chkVales').checked) { document.getElementById('filaVales').style.display = 'flex'; document.getElementById('resValesEfectivo').innerText = formatearMoneda(parseFloat(document.getElementById('valVales').value) || 0); } else { document.getElementById('filaVales').style.display = 'none'; }
    if (document.getElementById('chkCostoEmpresa').checked) { const cargaPatronal = brutoReal * 0.234; document.getElementById('filaCostoEmpresa').style.display = 'block'; document.getElementById('resCostoTotal').innerText = formatearMoneda(brutoReal + cargaPatronal); } else { document.getElementById('filaCostoEmpresa').style.display = 'none'; }

    document.getElementById('resIsr').innerText = "-" + formatearMoneda(impuestos.isr);
    document.getElementById('resImss').innerText = "-" + formatearMoneda(impuestos.imss);
    document.getElementById('contenedorDeducciones').innerHTML = htmlDeducciones;
    document.getElementById('resNetoEfectivo').innerText = formatearMoneda(netoEfectivo);
    
    if(esInverso || modoAguinaldoActivo) { document.getElementById('filaBrutoObjetivo').style.display = 'flex'; document.getElementById('resBruto').innerText = formatearMoneda(brutoReal); } else { document.getElementById('filaBrutoObjetivo').style.display = 'none'; }

    dibujarGrafica(netoEfectivo, impuestos.isr, totalDeduccionesExtras);
    const seccionResultados = document.getElementById('seccionResultados');
    seccionResultados.style.display = 'block'; seccionResultados.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

document.getElementById('btnCalcular').addEventListener('click', calcularTotal);
document.getElementById('sueldoBase').addEventListener('keypress', function (e) { if (e.key === 'Enter') calcularTotal(); });

document.getElementById('btnDescargarPDF').addEventListener('click', function() {
    const seccion = document.getElementById('seccionResultados');
    const printTitle = document.createElement('h2');
    printTitle.style.textAlign = 'center';
    printTitle.style.marginBottom = '20px';
    printTitle.style.borderBottom = '2px solid #000';
    printTitle.style.paddingBottom = '10px';
    printTitle.style.color = '#000';
    printTitle.innerText = modoAguinaldoActivo ? 'CalculadoraISR.com.mx - Recibo de Aguinaldo' : 'CalculadoraISR.com.mx - Recibo de Nómina';
    
    seccion.insertBefore(printTitle, seccion.firstChild);
    window.print();
    setTimeout(() => { seccion.removeChild(printTitle); }, 1000);
});

document.getElementById('btnCompartir').addEventListener('click', function() {
    const neto = document.getElementById('resNetoEfectivo').innerText;
    let mensaje = "";
    if(modoAguinaldoActivo) {
        mensaje = `🎄 ¡Acabo de calcular mi aguinaldo! Me van a tocar ${neto} libres de polvo y paja. Calcula el tuyo y prepárate para Navidad aquí: https://calculadoraisr.com.mx`;
    } else {
        const bruto = document.getElementById('sueldoBase').value;
        mensaje = `💸 ¡Acabo de calcular mi nómina! De un sueldo de $${bruto}, me quedan ${neto} libres. Checa cuánto te quita el SAT en tu recibo usando esta calculadora: https://calculadoraisr.com.mx`;
    }
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(mensaje), '_blank');
});