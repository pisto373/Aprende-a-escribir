// Variables globales
let puntos = 0;
let tiempoRestante = 180;
let timer = null;
let modoActual = '';
let mejoras = {
    oscuro: false,
    arcoiris: false,
    velocidad: false,
    dobles: false,
    fondos: false,
    sonidos: false,
    avatar: false,
    teclado: false,
    stickers: false,
    secretas: false,
    efectos: false,
    musica: false,
    reto: false,
    triples: false
};
let temporizadorOscuro = null;
let temporizadorArcoiris = null;
let temporizadorVelocidad = null;
let temporizadorDobles = null;
let temporizadorTriples = null;
let avatarContenedor = null;
let avatarMensajeTimeout = null;
let avatarImgSrc = 'avatar.avif';
const mensajesAvatar = [
    "¡Sigue así!",
    "¡No te rindas!",
    "Recuerda usar todos tus dedos",
    "¡Eres un campeón!",
    "Si te equivocas, inténtalo de nuevo",
    "¡Muy bien!",
    "¿Sabías que puedes mejorar cada día?",
    "¡La práctica te hace mejor!"
];

// Fondos personalizados disponibles
const fondosDisponibles = [
    'fondo-estrellas', 'fondo-nubes', 'fondo-circuitos', 'fondo-colores'
];

// Frases secretas
const frasesSecretas = [
    "La computadora puede hacer millones de calculos por segundo",
    "El primer mouse fue inventado en 1964",
    "El lenguaje de programacion Python es muy popular",
    "Un byte son ocho bits",
    "El internet conecta computadoras de todo el mundo"
];

// Música de fondo
let musicaFondo = null;

// Avatar
let avatarImg = null;

// Stickers
let stickerTimeout = null;

// Sonidos
let sonidoCorrecto = null;

// Sonidos divertidos (varios)
const sonidosDivertidos = [
    'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b1e3b.mp3',
    'https://cdn.pixabay.com/audio/2022/10/16/audio_12b5fae5b2.mp3',
    'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b1e3b.mp3',
    'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b1e3b.mp3'
];

// Frases para cada modo
const frases = {
    principiante: [
        "La computadora es divertida",
        "El raton mueve el cursor",
        "El teclado tiene muchas teclas",
        "La pantalla muestra imagenes",
        "El monitor es grande"
    ],
    avanzado: [
        "El procesador es el cerebro de la computadora",
        "La memoria RAM ayuda a que todo sea rapido",
        "El disco duro guarda los archivos importantes",
        "El sistema operativo controla la computadora",
        "La impresora imprime documentos desde la computadora"
    ],
    experto: [
        "La programacion permite crear aplicaciones y juegos en la computadora",
        "Las redes conectan muchas computadoras para compartir informacion",
        "El internet es una red mundial de computadoras",
        "El software es el conjunto de programas que usa la computadora",
        "La seguridad informatica protege los datos de la computadora"
    ],
    carrera: "Las computadoras son maquinas electronicas que procesan informacion. Nos ayudan a aprender, jugar y comunicarnos. Es importante aprender a usarlas correctamente y con responsabilidad. La mecanografia es una habilidad muy util que nos permite escribir mas rapido y con menos errores."
};

// Elementos del DOM
const elementos = {
    puntos: document.getElementById('puntos'),
    areaJuego: document.getElementById('area-juego'),
    textoObjetivo: document.getElementById('texto-objetivo'),
    textoUsuario: document.getElementById('texto-usuario'),
    tiempo: document.getElementById('tiempo'),
    contador: document.getElementById('contador'),
    modales: {
        tutorial: document.getElementById('modal-tutorial'),
        tienda: document.getElementById('modal-tienda'),
        resultado: document.getElementById('modal-resultado')
    },
    botones: {
        tutorial: document.getElementById('tutorial'),
        principiante: document.getElementById('principiante'),
        avanzado: document.getElementById('avanzado'),
        experto: document.getElementById('experto'),
        carrera: document.getElementById('carrera'),
        tienda: document.getElementById('tienda'),
        cerrarTutorial: document.getElementById('cerrar-tutorial'),
        cerrarTienda: document.getElementById('cerrar-tienda'),
        intentarNuevo: document.getElementById('intentar-nuevo'),
        salir: document.getElementById('salir')
    }
};

// Lógica para avanzar entre los pasos del tutorial
const pasosTutorial = [
    'tutorial-paso-1',
    'tutorial-paso-2',
    'tutorial-paso-3',
    'tutorial-paso-4',
    'tutorial-paso-5',
    'tutorial-paso-6'
];
let pasoActualTutorial = 0;

// Stickers animados para el tutorial
const stickersTutorial = ['⭐', '👏', '😃', '🎉', '👍', '🌟', '🥳', '💡'];
function mostrarStickerTutorial() {
    const sticker = document.createElement('div');
    sticker.className = 'tutorial-sticker';
    sticker.textContent = stickersTutorial[Math.floor(Math.random() * stickersTutorial.length)];
    document.body.appendChild(sticker);
    setTimeout(() => sticker.remove(), 1200);
}

// Stickers para los modales del tutorial
const stickersTutorialModales = ['⭐', '👏', '😃', '🎉', '👍', '🌟', '🥳', '💡'];
function mostrarStickerTutorialModal(pasoId) {
    const stickerDiv = document.querySelector(`#${pasoId} .sticker-tutorial-modal`);
    if (stickerDiv) {
        stickerDiv.textContent = stickersTutorialModales[Math.floor(Math.random() * stickersTutorialModales.length)];
    }
}

// Mostrar sticker al mostrar cada paso del tutorial
function mostrarPasoTutorial(idx) {
    pasosTutorial.forEach((id, i) => {
        const paso = document.getElementById(id);
        if (paso) paso.classList.toggle('oculto', i !== idx);
    });
    pasoActualTutorial = idx;
    mostrarStickerTutorialModal(pasosTutorial[idx]);
}

// Botones 'Siguiente' del tutorial
function configurarBotonesTutorial() {
    document.querySelectorAll('.btn-tutorial-siguiente').forEach((btn, idx) => {
        btn.onclick = function() {
            mostrarPasoTutorial(idx + 1);
            mostrarStickerTutorial();
            // Iniciar práctica solo al entrar al paso 4
            if (pasosTutorial[idx + 1] === 'tutorial-paso-4') {
                iniciarPracticaTutorial();
            }
        };
    });
}

// Inicializar tutorial al abrir modal
if (document.getElementById('modal-tutorial')) {
    mostrarPasoTutorial(0);
    configurarBotonesTutorial();
}

// Funciones de utilidad
function mostrarModal(modal) {
    modal.style.display = 'flex';
}

function ocultarModal(modal) {
    modal.style.display = 'none';
}

function actualizarPuntos(cantidad) {
    if (mejoras.triples) cantidad *= 3;
    if (mejoras.dobles) cantidad *= 2;
    puntos += cantidad;
    elementos.puntos.textContent = puntos;
}

function iniciarTemporizador() {
    tiempoRestante = 180;
    elementos.contador.textContent = tiempoRestante;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        tiempoRestante--;
        elementos.contador.textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(timer);
            // Solo mostrar el mensaje si el usuario sigue en modo carrera
            if (modoActual === 'carrera' && !elementos.areaJuego.classList.contains('oculto')) {
                mostrarResultado('¡Se acabó el tiempo!', 'No lograste completar el texto a tiempo.');
            }
        }
    }, 1000);
}

function reproducirSonidoDivertido() {
    if (mejoras.sonidos) {
        const url = sonidosDivertidos[Math.floor(Math.random() * sonidosDivertidos.length)];
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(()=>{});
    }
}

function mostrarResultado(titulo, mensaje, correcto = false) {
    const modal = elementos.modales.resultado;
    document.getElementById('titulo-resultado').textContent = titulo;
    document.getElementById('mensaje-resultado').textContent = mensaje;
    const divErrores = document.getElementById('errores');
    divErrores.classList.add('oculto');

    // Mostrar sticker si está comprado y es correcto
    if (correcto && mejoras.stickers) mostrarSticker();
    // Sonido correcto
    if (correcto && mejoras.sonidos) reproducirSonidoDivertido();
    // Cambiar mensaje del avatar si está activo
    if (correcto && mejoras.avatar) mensajeAvatarMotivacion();

    const botonesDiv = document.querySelector('.botones-resultado');
    botonesDiv.innerHTML = '';

    if (correcto) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.id = 'siguiente';
        btnSiguiente.textContent = 'Siguiente';
        btnSiguiente.onclick = () => {
            ocultarModal(modal);
            // Sonido divertido al cambiar de frase
            if (mejoras.sonidos) reproducirSonidoDivertido();
            if (mejoras.velocidad && (modoActual === 'principiante' || modoActual === 'avanzado' || modoActual === 'experto')) {
                iniciarModo(modoActual);
            } else if (modoActual === 'principiante' || modoActual === 'avanzado' || modoActual === 'experto') {
                setTimeout(() => iniciarModo(modoActual), 1000);
            } else {
                iniciarModo(modoActual);
            }
        };
        botonesDiv.appendChild(btnSiguiente);
    } else {
        const btnIntentar = document.createElement('button');
        btnIntentar.id = 'intentar-nuevo';
        btnIntentar.textContent = 'Intentar de nuevo';
        btnIntentar.onclick = () => {
            ocultarModal(modal);
            iniciarModo(modoActual);
        };
        const btnSalir = document.createElement('button');
        btnSalir.id = 'salir';
        btnSalir.textContent = 'Salir';
        btnSalir.onclick = () => {
            ocultarModal(modal);
            elementos.areaJuego.classList.add('oculto');
            if (timer) clearInterval(timer);
        };
        botonesDiv.appendChild(btnIntentar);
        botonesDiv.appendChild(btnSalir);
    }
    mostrarModal(modal);
}

function verificarTexto() {
    const textoObjetivo = elementos.textoObjetivo.textContent;
    const textoUsuario = elementos.textoUsuario.value;
    // Solo verificar cuando el texto tenga la misma longitud que el objetivo
    if (textoUsuario.length === textoObjetivo.length) {
        if (textoUsuario === textoObjetivo) {
            let puntosGanados = 0;
            let mensajePuntos = '';
            let esReto = retoDiarioActivo && textoObjetivo === retoDiarioFrase;
            switch (modoActual) {
                case 'principiante': puntosGanados = 10; break;
                case 'avanzado': puntosGanados = 20; break;
                case 'experto': puntosGanados = 30; break;
                case 'carrera': puntosGanados = 50; break;
            }
            if (mejoras.secretas && Math.random() < 0.2) {
                // 20% de probabilidad de frase secreta
                elementos.textoObjetivo.textContent = frasesSecretas[Math.floor(Math.random() * frasesSecretas.length)];
            }
            if (esReto) {
                puntosGanados += 50;
                mensajePuntos = '¡Completaste el reto diario! +50 puntos extra. ';
            }
            let puntosTotales = puntosGanados;
            if (mejoras.triples) puntosTotales *= 3;
            if (mejoras.dobles) puntosTotales *= 2;
            mensajePuntos += mejoras.triples ? `¡Has ganado ${puntosTotales} puntos (triple puntuacion)!` : (mejoras.dobles ? `¡Has ganado ${puntosTotales} puntos (doble puntuacion)!` : `¡Has ganado ${puntosTotales} puntos!`);
            actualizarPuntos(puntosGanados);
            mostrarResultado('¡Felicitaciones!', mensajePuntos, true);
        } else {
            mostrarResultado('¡Ups!', 'Te equivocaste, intenta de nuevo.');
        }
    }
}

// Restaurar función original de iniciarModo y eliminar teclado virtual libre fuera del tutorial
function iniciarModo(modo) {
    if (timer) clearInterval(timer);
    modoActual = modo;
    elementos.areaJuego.classList.remove('oculto');
    elementos.textoUsuario.value = '';
    if (mejoras.efectos) aplicarEfectosTexto();
    if (mejoras.avatar) mostrarAvatar();
    if (modo === 'carrera') {
        elementos.tiempo.classList.remove('oculto');
        elementos.textoObjetivo.textContent = frases.carrera;
        iniciarTemporizador();
    } else if (mejoras.reto && Math.random() < 0.2) {
        // 20% de probabilidad de reto diario
        elementos.tiempo.classList.add('oculto');
        elementos.textoObjetivo.textContent = retoDiarioFrase;
    } else if (mejoras.secretas && Math.random() < 0.2) {
        // 20% de probabilidad de frase secreta
        elementos.tiempo.classList.add('oculto');
        elementos.textoObjetivo.textContent = frasesSecretas[Math.floor(Math.random() * frasesSecretas.length)];
    } else {
        elementos.tiempo.classList.add('oculto');
        const frasesModo = frases[modo];
        elementos.textoObjetivo.textContent = frasesModo[Math.floor(Math.random() * frasesModo.length)];
    }
}

// Event Listeners
elementos.botones.tutorial.addEventListener('click', () => mostrarModal(elementos.modales.tutorial));
elementos.botones.principiante.addEventListener('click', () => iniciarModo('principiante'));
elementos.botones.avanzado.addEventListener('click', () => iniciarModo('avanzado'));
elementos.botones.experto.addEventListener('click', () => iniciarModo('experto'));
elementos.botones.carrera.addEventListener('click', () => iniciarModo('carrera'));
elementos.botones.tienda.addEventListener('click', () => mostrarModal(elementos.modales.tienda));

elementos.botones.cerrarTutorial.addEventListener('click', () => ocultarModal(elementos.modales.tutorial));
elementos.botones.cerrarTienda.addEventListener('click', () => ocultarModal(elementos.modales.tienda));

elementos.botones.intentarNuevo.addEventListener('click', () => {
    ocultarModal(elementos.modales.resultado);
    iniciarModo(modoActual);
});

elementos.botones.salir.addEventListener('click', () => {
    ocultarModal(elementos.modales.resultado);
    elementos.areaJuego.classList.add('oculto');
    if (timer) clearInterval(timer);
});

elementos.textoUsuario.addEventListener('input', () => {
    if (modoActual !== 'carrera') {
        verificarTexto();
    } else {
        // En modo carrera, verificar cuando el usuario presione Enter o termine de escribir
        if (event.key === 'Enter' || elementos.textoUsuario.value.length === elementos.textoObjetivo.textContent.length) {
            verificarTexto();
        }
    }
});

// Compras en la tienda
document.querySelectorAll('.comprar').forEach(boton => {
    boton.addEventListener('click', () => {
        const item = boton.dataset.item;
        const precios = {
            oscuro: 100,
            arcoiris: 150,
            velocidad: 200,
            dobles: 300,
            fondos: 120,
            sonidos: 80,
            avatar: 140,
            teclado: 110,
            stickers: 90,
            secretas: 130,
            efectos: 100,
            musica: 160,
            reto: 200,
            triples: 250
        };
        
        if (puntos >= precios[item]) {
            puntos -= precios[item];
            elementos.puntos.textContent = puntos;
            mejoras[item] = true;
            
            switch (item) {
                case 'oscuro':
                    document.body.classList.add('modo-oscuro');
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorOscuro) clearTimeout(temporizadorOscuro);
                    temporizadorOscuro = setTimeout(() => {
                        document.body.classList.remove('modo-oscuro');
                        mejoras.oscuro = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 300000); // 5 minutos
                    break;
                case 'arcoiris':
                    document.body.classList.add('modo-arcoiris');
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorArcoiris) clearTimeout(temporizadorArcoiris);
                    temporizadorArcoiris = setTimeout(() => {
                        document.body.classList.remove('modo-arcoiris');
                        mejoras.arcoiris = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 300000); // 5 minutos
                    break;
                case 'velocidad':
                    if (timer) {
                        tiempoRestante += 30;
                        elementos.contador.textContent = tiempoRestante;
                    }
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorVelocidad) clearTimeout(temporizadorVelocidad);
                    temporizadorVelocidad = setTimeout(() => {
                        mejoras.velocidad = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 300000); // 5 minutos
                    break;
                case 'dobles':
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorDobles) clearTimeout(temporizadorDobles);
                    temporizadorDobles = setTimeout(() => {
                        mejoras.dobles = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 300000); // 5 minutos
                    break;
                case 'fondos':
                    mostrarSelectorFondos();
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorFondos) clearTimeout(temporizadorFondos);
                    temporizadorFondos = setTimeout(() => {
                        mejoras.fondos = false;
                        // Quitar fondo animado y clases
                        const fondoPrevio = document.getElementById('fondo-animado');
                        if (fondoPrevio) fondoPrevio.remove();
                        document.body.classList.remove('fondo-estrellas', 'fondo-nubes', 'fondo-circuitos', 'fondo-colores');
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 300000); // 5 minutos
                    break;
                case 'sonidos':
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    setTimeout(() => {
                        mejoras.sonidos = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'avatar':
                    mostrarAvatar();
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorAvatar) clearTimeout(temporizadorAvatar);
                    temporizadorAvatar = setTimeout(() => {
                        mejoras.avatar = false;
                        ocultarAvatar();
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 300000); // 5 minutos
                    break;
                case 'teclado':
                    document.getElementById('texto-usuario').style.background = '#e0f7fa';
                    document.getElementById('texto-usuario').style.borderColor = '#ff9800';
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    setTimeout(() => {
                        mejoras.teclado = false;
                        document.getElementById('texto-usuario').style.background = '';
                        document.getElementById('texto-usuario').style.borderColor = '';
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'stickers':
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    setTimeout(() => {
                        mejoras.stickers = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'secretas':
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    setTimeout(() => {
                        mejoras.secretas = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'efectos':
                    aplicarEfectosTexto();
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    setTimeout(() => {
                        mejoras.efectos = false;
                        aplicarEfectosTexto();
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'musica':
                    reproducirMusica();
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    // Agregar botón de pausar/reanudar
                    if (!document.getElementById('btn-musica')) {
                        const btnMusica = document.createElement('button');
                        btnMusica.id = 'btn-musica';
                        btnMusica.textContent = 'Pausar música';
                        btnMusica.style.marginLeft = '10px';
                        btnMusica.onclick = function() {
                            if (musicaFondo.paused) {
                                reproducirMusica();
                                btnMusica.textContent = 'Pausar música';
                            } else {
                                pausarMusica();
                                btnMusica.textContent = 'Reanudar música';
                            }
                        };
                        boton.parentNode.appendChild(btnMusica);
                    }
                    setTimeout(() => {
                        mejoras.musica = false;
                        pausarMusica();
                        if (document.getElementById('btn-musica')) document.getElementById('btn-musica').remove();
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'reto':
                    retoDiarioActivo = true;
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    alert('¡Reto diario activado! Busca la frase especial para ganar puntos extra.');
                    setTimeout(() => {
                        mejoras.reto = false;
                        retoDiarioActivo = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
                case 'triples':
                    boton.disabled = true;
                    boton.textContent = '¡Comprado!';
                    if (temporizadorTriples) clearTimeout(temporizadorTriples);
                    mejoras.triples = true;
                    temporizadorTriples = setTimeout(() => {
                        mejoras.triples = false;
                        boton.disabled = false;
                        boton.textContent = 'Comprar';
                    }, 60000); // 1 minuto
                    break;
            }
        } else {
            alert('No tienes suficientes puntos para comprar esta mejora.');
        }
    });
});

// Efectos de texto
function aplicarEfectosTexto() {
    if (mejoras.efectos) {
        elementos.textoObjetivo.style.textShadow = '0 0 10px #4CAF50, 0 0 20px #2196F3';
        elementos.textoObjetivo.style.transition = 'text-shadow 0.5s';
    } else {
        elementos.textoObjetivo.style.textShadow = '';
    }
}

// Cambiar fondo
function cambiarFondo(nombreFondo) {
    // Eliminar fondo animado anterior si existe
    const fondoPrevio = document.getElementById('fondo-animado');
    if (fondoPrevio) fondoPrevio.remove();
    document.body.classList.remove('fondo-estrellas', 'fondo-nubes', 'fondo-circuitos', 'fondo-colores');
    document.body.classList.add(nombreFondo);

    // Crear fondo animado
    const fondoAnimado = document.createElement('div');
    fondoAnimado.id = 'fondo-animado';
    fondoAnimado.className = 'fondo-animado ' + nombreFondo;

    if (nombreFondo === 'fondo-estrellas') {
        for (let i = 0; i < 30; i++) {
            const estrella = document.createElement('div');
            estrella.className = 'estrella';
            estrella.style.left = Math.random() * 100 + 'vw';
            estrella.style.top = (Math.random() * -100) + 'px';
            estrella.style.animationDelay = (Math.random() * 8) + 's';
            fondoAnimado.appendChild(estrella);
        }
    } else if (nombreFondo === 'fondo-nubes') {
        for (let i = 0; i < 8; i++) {
            const nube = document.createElement('div');
            nube.className = 'nube';
            nube.style.top = (Math.random() * 80) + 'vh';
            nube.style.animationDelay = (Math.random() * 14) + 's';
            // No agregar gotas de lluvia
            fondoAnimado.appendChild(nube);
        }
    } else if (nombreFondo === 'fondo-circuitos') {
        for (let i = 0; i < 15; i++) {
            const circuito = document.createElement('div');
            circuito.className = 'circuito';
            circuito.style.left = Math.random() * 100 + 'vw';
            circuito.style.animationDelay = (Math.random() * 10) + 's';
            fondoAnimado.appendChild(circuito);
        }
    } else if (nombreFondo === 'fondo-colores') {
        const colores = ['#f44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0'];
        for (let i = 0; i < 20; i++) {
            const bola = document.createElement('div');
            bola.className = 'color-bola';
            bola.style.background = colores[Math.floor(Math.random() * colores.length)];
            bola.style.top = (Math.random() * 90) + 'vh';
            bola.style.animationDelay = (Math.random() * 7) + 's';
            fondoAnimado.appendChild(bola);
        }
    }
    document.body.appendChild(fondoAnimado);
}

// Mostrar selector de fondos
function mostrarSelectorFondos() {
    if (!document.getElementById('selector-fondos')) {
        const selector = document.createElement('div');
        selector.id = 'selector-fondos';
        selector.style.position = 'fixed';
        selector.style.top = '20px';
        selector.style.right = '20px';
        selector.style.background = '#fff';
        selector.style.border = '2px solid #4CAF50';
        selector.style.borderRadius = '10px';
        selector.style.padding = '10px';
        selector.style.zIndex = '9999';
        selector.innerHTML = '<strong>Elige un fondo:</strong><br>' + fondosDisponibles.map(f => `<button style="margin:5px" onclick="cambiarFondo(\'${f}\')">${f.replace('fondo-','')}</button>`).join('') + '<br><button onclick="document.getElementById(\'selector-fondos\').remove()">Cerrar</button>';
        document.body.appendChild(selector);
    }
}
window.cambiarFondo = cambiarFondo;

// Mostrar avatar
function mostrarAvatar() {
    if (!avatarContenedor) {
        avatarContenedor = document.createElement('div');
        avatarContenedor.className = 'avatar-contenedor';
        // Imagen del avatar
        avatarImg = document.createElement('img');
        avatarImg.src = avatarImgSrc;
        avatarImg.alt = 'Avatar';
        avatarImg.className = 'avatar-img';
        avatarContenedor.appendChild(avatarImg);
        // Sticker animado
        const sticker = document.createElement('div');
        sticker.className = 'avatar-sticker';
        sticker.textContent = '⭐';
        avatarContenedor.appendChild(sticker);
        // Mensaje
        const mensaje = document.createElement('div');
        mensaje.className = 'avatar-mensaje';
        mensaje.textContent = mensajesAvatar[Math.floor(Math.random() * mensajesAvatar.length)];
        avatarContenedor.appendChild(mensaje);
        document.body.appendChild(avatarContenedor);
        // Cambiar mensaje cada 10 segundos
        avatarMensajeTimeout = setInterval(() => {
            mensaje.textContent = mensajesAvatar[Math.floor(Math.random() * mensajesAvatar.length)];
        }, 10000);
    } else {
        // Si ya existe, solo actualiza la imagen
        if (avatarImg) avatarImg.src = avatarImgSrc;
    }
}
function ocultarAvatar() {
    if (avatarContenedor) {
        avatarContenedor.remove();
        avatarContenedor = null;
        if (avatarMensajeTimeout) clearInterval(avatarMensajeTimeout);
    }
}
// Cambiar mensaje del avatar al acertar una frase
function mensajeAvatarMotivacion() {
    if (avatarContenedor) {
        const mensaje = avatarContenedor.querySelector('.avatar-mensaje');
        if (mensaje) {
            mensaje.textContent = mensajesAvatar[Math.floor(Math.random() * mensajesAvatar.length)];
        }
    }
}

// Mostrar sticker
function mostrarSticker() {
    if (!document.getElementById('sticker')) {
        const sticker = document.createElement('div');
        sticker.id = 'sticker';
        sticker.textContent = '⭐';
        sticker.style.position = 'fixed';
        sticker.style.top = '50%';
        sticker.style.left = '50%';
        sticker.style.transform = 'translate(-50%, -50%) scale(2)';
        sticker.style.fontSize = '4em';
        sticker.style.zIndex = '9999';
        sticker.style.transition = 'opacity 1s';
        document.body.appendChild(sticker);
        stickerTimeout = setTimeout(() => {
            sticker.style.opacity = '0';
            setTimeout(() => sticker.remove(), 1000);
        }, 1200);
    }
}

// Música de fondo
function reproducirMusica() {
    if (!musicaFondo) {
        musicaFondo = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12b5fae5b2.mp3');
        musicaFondo.loop = true;
    }
    musicaFondo.play();
}
function pausarMusica() {
    if (musicaFondo) musicaFondo.pause();
}

// Reto diario
let retoDiarioActivo = false;
let retoDiarioFrase = "Hoy escribe sin errores: La computadora ayuda a resolver problemas";

// Lógica interactiva para el paso de práctica del tutorial (modificada para 5 letras)
const teclasPractica = ['a','s','d','f','j','k','l','ñ','q','w','e','r','u','i','o','p','z','x','c','v','b','n','m'];
let secuenciaPractica = [];
let indiceSecuencia = 0;
let btnSiguientePractica = null;

function crearTecladoVirtualPractica(idContenedor, teclaResaltar) {
    const filas = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l','ñ'],
        ['z','x','c','v','b','n','m']
    ];
    const cont = document.getElementById(idContenedor);
    cont.innerHTML = '';
    filas.forEach(fila => {
        const filaDiv = document.createElement('div');
        filaDiv.className = 'fila-teclado';
        fila.forEach(tecla => {
            const teclaDiv = document.createElement('div');
            teclaDiv.className = 'tecla-virtual' + (tecla === teclaResaltar ? ' tecla-activa' : '');
            teclaDiv.textContent = tecla.toUpperCase();
            filaDiv.appendChild(teclaDiv);
        });
        cont.appendChild(filaDiv);
    });
}

function iniciarPracticaTutorial() {
    // Generar una secuencia de 5 letras aleatorias
    secuenciaPractica = [];
    for (let i = 0; i < 5; i++) {
        let letra;
        do {
            letra = teclasPractica[Math.floor(Math.random() * teclasPractica.length)];
        } while (secuenciaPractica.includes(letra));
        secuenciaPractica.push(letra);
    }
    indiceSecuencia = 0;
    crearTecladoVirtualPractica('teclado-virtual-practica', secuenciaPractica[indiceSecuencia]);
    btnSiguientePractica = document.querySelector('#tutorial-paso-4 .btn-tutorial-siguiente');
    if (btnSiguientePractica) btnSiguientePractica.disabled = true;
    document.getElementById('feedback-tutorial').textContent = '';
}

document.addEventListener('keydown', function(e) {
    const paso4 = document.getElementById('tutorial-paso-4');
    if (paso4 && !paso4.classList.contains('oculto')) {
        if (e.key.toLowerCase() === secuenciaPractica[indiceSecuencia]) {
            mostrarStickerTutorial();
            indiceSecuencia++;
            if (indiceSecuencia < secuenciaPractica.length) {
                crearTecladoVirtualPractica('teclado-virtual-practica', secuenciaPractica[indiceSecuencia]);
                document.getElementById('feedback-tutorial').textContent = '¡Muy bien!';
            } else {
                crearTecladoVirtualPractica('teclado-virtual-practica', '');
                document.getElementById('feedback-tutorial').textContent = '¡Secuencia completada!';
                if (btnSiguientePractica) btnSiguientePractica.disabled = false;
            }
        } else {
            document.getElementById('feedback-tutorial').textContent = 'Intenta de nuevo';
            // Sacudir la tecla incorrecta
            const teclas = document.querySelectorAll('#teclado-virtual-practica .tecla-virtual');
            teclas.forEach(t => {
                if (t.textContent.toLowerCase() === e.key.toLowerCase()) {
                    t.classList.add('tecla-error');
                    setTimeout(() => t.classList.remove('tecla-error'), 400);
                }
            });
        }
    }
});

// Lógica para práctica libre del tutorial (paso 5)
const inputTutorialLibre = document.getElementById('input-tutorial-libre');
const btnFinalizarTutorialLibre = document.querySelector('#tutorial-paso-5 .btn-tutorial-siguiente');
const frasePracticaLibre = 'La computadora es divertida';
if (inputTutorialLibre && btnFinalizarTutorialLibre) {
    inputTutorialLibre.addEventListener('input', function() {
        if (inputTutorialLibre.value === frasePracticaLibre) {
            btnFinalizarTutorialLibre.disabled = false;
            document.getElementById('feedback-tutorial-libre').textContent = '¡Correcto!';
        } else {
            btnFinalizarTutorialLibre.disabled = true;
            document.getElementById('feedback-tutorial-libre').textContent = '';
        }
    });
}

// Lógica para el paso 2: posición de los dedos
const teclasPosicionInicial = ['a','s','d','f','j','k','l','ñ'];
let teclasPresionadas = new Set();
const btnSiguientePaso2 = document.querySelector('#tutorial-paso-2 .btn-tutorial-siguiente');

function crearTecladoPosicionDedos() {
    const filas = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l','ñ'],
        ['z','x','c','v','b','n','m']
    ];
    const cont = document.getElementById('teclado-posicion-dedos');
    if (!cont) return;
    cont.innerHTML = '';
    filas.forEach(fila => {
        const filaDiv = document.createElement('div');
        filaDiv.className = 'fila-teclado';
        fila.forEach(tecla => {
            let clase = 'tecla-virtual';
            if (teclasPosicionInicial.includes(tecla)) clase += ' tecla-posicion';
            if (teclasPresionadas.has(tecla)) clase += ' tecla-completada';
            const teclaDiv = document.createElement('div');
            teclaDiv.className = clase;
            teclaDiv.textContent = tecla.toUpperCase();
            filaDiv.appendChild(teclaDiv);
        });
        cont.appendChild(filaDiv);
    });
}

// Mostrar teclado al entrar al paso 2
const observerPaso2 = new MutationObserver(() => {
    const paso2 = document.getElementById('tutorial-paso-2');
    if (paso2 && !paso2.classList.contains('oculto')) {
        teclasPresionadas = new Set();
        crearTecladoPosicionDedos();
        if (btnSiguientePaso2) btnSiguientePaso2.disabled = true;
    }
});
observerPaso2.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

document.addEventListener('keydown', function(e) {
    const paso2 = document.getElementById('tutorial-paso-2');
    if (paso2 && !paso2.classList.contains('oculto')) {
        const tecla = e.key.toLowerCase();
        if (teclasPosicionInicial.includes(tecla)) {
            teclasPresionadas.add(tecla);
            crearTecladoPosicionDedos();
            if (teclasPosicionInicial.every(t => teclasPresionadas.has(t))) {
                if (btnSiguientePaso2) btnSiguientePaso2.disabled = false;
            }
        }
    }
});

// Lógica para el paso 3: Reconociendo el teclado
function crearTecladoVirtualReconocimiento(teclaResaltar = '') {
    const filas = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l','ñ'],
        ['z','x','c','v','b','n','m']
    ];
    const cont = document.getElementById('teclado-virtual');
    if (!cont) return;
    cont.innerHTML = '';
    filas.forEach(fila => {
        const filaDiv = document.createElement('div');
        filaDiv.className = 'fila-teclado';
        fila.forEach(tecla => {
            let clase = 'tecla-virtual';
            if (tecla === teclaResaltar) clase += ' tecla-activa';
            const teclaDiv = document.createElement('div');
            teclaDiv.className = clase;
            teclaDiv.textContent = tecla.toUpperCase();
            filaDiv.appendChild(teclaDiv);
        });
        cont.appendChild(filaDiv);
    });
}

// Mostrar teclado y mensaje al entrar al paso 3
const observerPaso3 = new MutationObserver(() => {
    const paso3 = document.getElementById('tutorial-paso-3');
    if (paso3 && !paso3.classList.contains('oculto')) {
        crearTecladoVirtualReconocimiento();
        // Mensaje de ayuda
        let ayuda = document.getElementById('mensaje-ayuda-reconocimiento');
        if (!ayuda) {
            ayuda = document.createElement('div');
            ayuda.id = 'mensaje-ayuda-reconocimiento';
            ayuda.textContent = '¡Presiona cualquier tecla para ver cómo se ilumina!';
            ayuda.style.fontSize = '1.1em';
            ayuda.style.color = '#2196F3';
            ayuda.style.margin = '10px 0 18px 0';
            paso3.insertBefore(ayuda, document.getElementById('teclado-virtual'));
        }
    }
});
observerPaso3.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

document.addEventListener('keydown', function(e) {
    const paso3 = document.getElementById('tutorial-paso-3');
    if (paso3 && !paso3.classList.contains('oculto')) {
        crearTecladoVirtualReconocimiento(e.key.toLowerCase());
        setTimeout(() => crearTecladoVirtualReconocimiento(''), 250);
    }
}); 