// =========================================================================
// DATOS FISCALES ACTUALIZADOS A 2026
// =========================================================================

// TABLA DE ISR 2026 (Mensual). 
// Límites ajustados estimando la inflación acumulada para 2026.
const tablaISR = [
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
];

// Salario Mínimo General 2026 (Mensual aproximado) - Para validaciones futuras si es necesario
const SALARIO_MINIMO_MENSUAL = 9582.00; 

// Formateador de moneda nativo para México
const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cantidad);
};

// =========================================================================
// INTERFAZ DE USUARIO (Mostrar/Ocultar campos)
// =========================================================================

const checkboxes = ['chkVales', 'chkAhorro', 'chkInfonavit', 'chkFonacot', 'chkPension'];
checkboxes.forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        // Al marcar el checkbox, mostramos el input correspondiente
        const inputId = id.replace('chk', 'val');
        const inputElement = document.getElementById(inputId);
        inputElement.style.display = this.checked ? 'block' : 'none';
        
        // Limpiamos el valor si el usuario desmarca la opción
        if(!this.checked) inputElement.value = '';
    });
});

// Lógica del Switch Inverso (Neto a Bruto)
document.getElementById('chkInverso').addEventListener('change', function() {
    const lbl = document.getElementById('lblSueldo');
    const input = document.getElementById('sueldoBase');
    if(this.checked) {
        lbl.innerText = "Sueldo Neto DESEADO (Libre mensual):";
        input.placeholder = "Ej. 20000";
    } else {
        lbl.innerText = "Sueldo Bruto Mensual (MXN):";
        input.placeholder = "Ej. 15000";
    }
});

// =========================================================================
// MOTOR MATEMÁTICO
// =========================================================================

// Función base para calcular ISR e IMSS de un sueldo bruto
function calcularImpuestosBase(bruto) {
    let isr = 0;
    
    // Si gana el salario mínimo o menos, no paga ISR por ley
    if (bruto > SALARIO_MINIMO_MENSUAL) {
        for (let i = tablaISR.length - 1; i >= 0; i--) {
            if (bruto >= tablaISR[i].limiteInferior) {
                isr = tablaISR[i].cuotaFija + ((bruto - tablaISR[i].limiteInferior) * (tablaISR[i].porcentaje / 100));
                break;
            }
        }
    }

    // Cálculo estimado de IMSS (Estándar de 2.6%)
    // Nota interna: El cálculo real usa la UMA 2026 ($117.31 diarios) y el SBC. 
    // Para fines de esta calculadora, el 2.6% directo mantiene la rapidez y la aproximación deseada.
    let imss = bruto <= SALARIO_MINIMO_MENSUAL ? 0 : (bruto * 0.026);
    
    return { isr, imss, netoBase: bruto - isr - imss };
}

// Algoritmo de Búsqueda Binaria para encontrar el Bruto a partir del Neto deseado
function encontrarBrutoDesdeNeto(netoObjetivo) {
    let min = netoObjetivo;
    let max = netoObjetivo * 2; // El bruto rara vez será más del doble del neto
    let brutoEstimado = 0;

    // 40 iteraciones nos dan precisión al nivel de centavos
    for (let i = 0; i < 40; i++) { 
        brutoEstimado = (min + max) / 2;
        let simulacion = calcularImpuestosBase(brutoEstimado);
        if (simulacion.netoBase < netoObjetivo) {
            min = brutoEstimado;
        } else {
            max = brutoEstimado;
        }
    }
    return brutoEstimado;
}

// =========================================================================
// FUNCIÓN PRINCIPAL DE CÁLCULO Y RENDERIZADO
// =========================================================================

const calcularTotal = () => {
    const inputValor = parseFloat(document.getElementById('sueldoBase').value);
    const esInverso = document.getElementById('chkInverso').checked;

    if (isNaN(inputValor) || inputValor <= 0) {
        alert("Por favor, ingresa un monto válido mayor a cero."); 
        return;
    }

    // 1. Determinar el Sueldo Bruto Real
    let brutoReal = esInverso ? encontrarBrutoDesdeNeto(inputValor) : inputValor;
    
    // 2. Calcular Impuestos de Ley
    let impuestos = calcularImpuestosBase(brutoReal);
    let netoEfectivo = impuestos.netoBase;
    
    // Variable para acumular el código HTML de las deducciones extra
    let htmlDeducciones = '';

    // 3. Procesar Deducciones Extra (El orden importa)
    
    // Fondo de Ahorro
    if (document.getElementById('chkAhorro').checked) {
        const porcentaje = parseFloat(document.getElementById('valAhorro').value) || 0;
        const descuentoAhorro = brutoReal * (porcentaje / 100);
        netoEfectivo -= descuentoAhorro;
        htmlDeducciones += `<div class="fila-resultado"><span>Fondo de Ahorro (${porcentaje}%):</span><span class="valor-negativo">-${formatearMoneda(descuentoAhorro)}</span></div>`;
    }

    // Infonavit
    if (document.getElementById('chkInfonavit').checked) {
        const infonavit = parseFloat(document.getElementById('valInfonavit').value) || 0;
        netoEfectivo -= infonavit;
        htmlDeducciones += `<div class="fila-resultado"><span>Crédito Infonavit:</span><span class="valor-negativo">-${formatearMoneda(infonavit)}</span></div>`;
    }

    // FONACOT
    if (document.getElementById('chkFonacot').checked) {
        const fonacot = parseFloat(document.getElementById('valFonacot').value) || 0;
        netoEfectivo -= fonacot;
        htmlDeducciones += `<div class="fila-resultado"><span>Préstamo FONACOT:</span><span class="valor-negativo">-${formatearMoneda(fonacot)}</span></div>`;
    }

    // Pensión Alimenticia (Legalmente se calcula sobre el Neto base, antes de deducciones personales como préstamos)
    if (document.getElementById('chkPension').checked) {
        const porcentajePension = parseFloat(document.getElementById('valPension').value) || 0;
        const descuentoPension = impuestos.netoBase * (porcentajePension / 100);
        netoEfectivo -= descuentoPension;
        htmlDeducciones += `<div class="fila-resultado"><span>Pensión Alimenticia (${porcentajePension}%):</span><span class="valor-negativo">-${formatearMoneda(descuentoPension)}</span></div>`;
    }

    // 4. Procesar Ingresos Extra (Vales)
    if (document.getElementById('chkVales').checked) {
        const vales = parseFloat(document.getElementById('valVales').value) || 0;
        document.getElementById('filaVales').style.display = 'flex';
        document.getElementById('resValesEfectivo').innerText = formatearMoneda(vales);
    } else {
        document.getElementById('filaVales').style.display = 'none';
    }

    // 5. Inyectar todos los resultados en el HTML
    document.getElementById('resIsr').innerText = "-" + formatearMoneda(impuestos.isr);
    document.getElementById('resImss').innerText = "-" + formatearMoneda(impuestos.imss);
    document.getElementById('contenedorDeducciones').innerHTML = htmlDeducciones;
    document.getElementById('resNetoEfectivo').innerText = formatearMoneda(netoEfectivo);
    
    // Mostrar u ocultar la fila de "Sueldo Bruto Necesario" dependiendo del modo
    if(esInverso) {
        document.getElementById('filaBrutoObjetivo').style.display = 'flex';
        document.getElementById('resBruto').innerText = formatearMoneda(brutoReal);
    } else {
        document.getElementById('filaBrutoObjetivo').style.display = 'none';
    }

    // Mostrar la tarjeta de resultados con una animación suave
    const seccionResultados = document.getElementById('seccionResultados');
    seccionResultados.style.display = 'block';
    
    // Pequeño truco visual: hacer scroll automático hacia los resultados en móviles
    seccionResultados.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// Asignar el evento al botón de calcular
document.getElementById('btnCalcular').addEventListener('click', calcularTotal);

// Permitir calcular presionando "Enter"
document.getElementById('sueldoBase').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calcularTotal();
    }
});