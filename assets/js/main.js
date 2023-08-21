//VARIABlES
const selectm = document.getElementById(`monedacon`);
const pesosinit = document.getElementById(`pesosinit`);
const resultado = document.getElementById(`convert`);
const botonconvert = document.getElementById(`btnconvertir`);
const graph = document.getElementById(`grafica`);
let chart;
const urlApi = 'https://mindicador.cl/api/';
//VARIABLES
//GET DATOS
const getData = async() => {
    try {
        const res = await fetch(urlApi);
        const data = await res.json();
        return data;
    } catch (error) {
        alert('No se pudo obtener los datos')
    }      
    }
//GET DATOS
//FUNCIONES
async function mostrarmonedas() { //agreaga los option a la etiqueta select desde la api
    try {
        const data = await getData();
        Object.keys(data).forEach((monedaKey) => {
            const moneda = data[monedaKey];
            if (moneda.codigo && moneda.valor) {
                const option = document.createElement('option');
                option.value = moneda.valor;
                option.textContent = `${moneda.codigo}`;
                selectm.appendChild(option);
            }
        });
    } catch (error) {
        console.error(error);
    }
}
async function convertirMoneda() { //convierte el valor a la moneda seleccionada y muestra el grafico
    const monedaSelect = parseFloat(selectm.value);
    const valorPesosInit = parseFloat(pesosinit.value);
    graph.innerHTML = '';
    if (!isNaN(valorPesosInit) && !isNaN(monedaSelect) && valorPesosInit >= 0) {
        const resultadoConversion = valorPesosInit / monedaSelect;
        resultado.textContent = `$${resultadoConversion.toFixed(2)}`;
        let fechas = await getfechas();
        let valor = await getvalorh();
        graficos(fechas, valor);
    } else {
        alert('Por favor, selecciona una moneda válida y proporciona un valor válido.');
    }
}
function formatearFecha(fecha) { //formatea la fecha con el formato d/m/a
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
}
async function getfechas() { //obtine las ultimas 10 fechas de la moneda seleccionada
    try {
        const codigoSeleccionado = selectm.options[selectm.selectedIndex].textContent;
        const urlfinal = urlApi+codigoSeleccionado;
        const res = await fetch(urlfinal);
        const data = await res.json();
        const monedaSeleccionada = data.serie;
        const fechas = monedaSeleccionada.map(moneda => moneda.fecha);
        const fechasFormateadas = fechas.map(formatearFecha);
        const ultimas10Fechas = fechasFormateadas.slice(0, 10);
        ultimas10Fechas.reverse();
        return ultimas10Fechas;
    } catch (error) {
        console.error(error);
    }
}
async function getvalorh() { //obtiene los ultimos 10 valores de la moneda seleccionada
        try {
            const codigoSeleccionado = selectm.options[selectm.selectedIndex].textContent;
            const urlfinal = urlApi+codigoSeleccionado;
            const res = await fetch(urlfinal);
            const data = await res.json();
            const monedaSeleccionada = data.serie;
            const valorh = monedaSeleccionada.map(moneda => moneda.valor);
            const valorh10 = valorh.slice(0, 10);
            return valorh10;
        } catch (error) {
            console.error(error);
        }
    }
//FUNCIONES
//GRAFICOS
function graficos(fecha,valor){ //despliega el grafico con los array de las ultimas 10 fehcas y valores de la moneda seleccionada
    const labels = fecha;
    const info = valor;
    const dataset1 = {
        label: "Ultimos 10 días",
        data: valor,
        borderColor: 'rgba(248, 37, 37, 0.8)',
        fill: false,
        tension: 0.1
    };
    
    const data = {
        labels: labels,
        datasets: [dataset1]
    };
    
    const config = {
        type: 'line',
        data: data,
    };
    if (chart) chart.destroy();
    chart = new Chart(graph, config);
    
}
//GRAFICOS
//LLAMADO DE FUNCIONES
window.addEventListener('load', mostrarmonedas);
botonconvert.addEventListener('click', convertirMoneda);
//LLAMADO DE FUNCIONES