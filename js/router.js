// 1. Configuración Principal
// Aquí ya integré el ID de tu documento de Google Sheets convertido a formato de lectura (CSV)
const sheetURL = "https://docs.google.com/spreadsheets/d/1feAFhIGcRuHPn25KfKxSDANYrVIJbQX8OdY-Q5rzjVU/export?format=csv";

// El número de teléfono actual para pruebas
const telefonoWhatsApp = "523348572070";

// 2. Control de Navegación (Switch de Módulos)
function navigateTo(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.remove('active'));

    // Desactivar todos los botones de la barra superior
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(button => button.classList.remove('active'));

    // Mostrar la sección que el usuario seleccionó
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    // Iluminar el botón correspondiente
    const clickedButton = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(sectionId));
    if (clickedButton) clickedButton.classList.add('active');
}

// 3. Lógica para Extraer y Mostrar los Datos de Google Sheets
async function cargarServicios() {
    try {
        // Conectarse a la hoja de cálculo
        const respuesta = await fetch(sheetURL);
        const datosCSV = await respuesta.text();
        
        // Dividir el archivo por filas y quitar la primera fila (los encabezados)
        const filas = datosCSV.split('\n').map(fila => fila.trim()).filter(fila => fila !== '');
        filas.shift(); 

        // Limpiar los contenedores HTML antes de inyectar los datos
        document.getElementById('grid-Barbería').innerHTML = '';
        document.getElementById('grid-Manicure').innerHTML = '';
        document.getElementById('grid-Spa').innerHTML = '';

        // Recorrer cada fila de tu Excel
        filas.forEach(fila => {
            // Separar cada columna por coma
            const columnas = fila.split(',');
            
            // Seguridad: Asegurarnos de que la fila tenga todas sus columnas
            if (columnas.length < 9) return;

            // Asignar nombres a cada columna basándonos en tu estructura
            const categoria = columnas[1];
            const servicio = columnas[2];
            const descripcion = columnas[3];
            const precio = columnas[4];
            const tiempo = columnas[5];
            const img = columnas[6];
            const msg = columnas[7];
            const estado = columnas[8];

            // Si en tu Excel dice algo distinto a "Activo" (ej. "Inactivo"), se salta ese servicio
            if (estado.toLowerCase() !== 'activo') return;

            // Crear el enlace automático de WhatsApp con el texto exacto de tu columna
            const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(msg)}`;

            // Construir el diseño visual de la tarjeta
            const tarjetaHTML = `
                <div class="menu-card">
                    <img src="${img}" alt="${servicio}" class="menu-img">
                    <div class="menu-info">
                        <h3 class="menu-title">${servicio}</h3>
                        <p class="menu-desc">${descripcion}</p>
                        <div class="menu-meta">
                            <span class="menu-price">$${precio}.00 MXN</span>
                            <span class="menu-time">${tiempo}</span>
                        </div>
                        <a href="${urlWhatsApp}" target="_blank" class="btn-whatsapp">Agendar por WhatsApp</a>
                    </div>
                </div>
            `;

            // Buscar en qué categoría va y pegarlo en su lugar
            const contenedor = document.getElementById(`grid-${categoria}`);
            if (contenedor) {
                contenedor.innerHTML += tarjetaHTML;
            }
        });

    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
    }
}

// 4. Inicializar todo cuando la página termine de cargar
window.onload = () => {
    cargarServicios();
};
