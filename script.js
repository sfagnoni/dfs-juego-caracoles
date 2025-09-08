document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const startButton = document.getElementById('start-button');
    const snailStatsContainer = document.getElementById('snail-stats');

    const snailImages = [
        'path/to/snail-rocket.png',   // Asegúrate de usar las rutas correctas
        'path/to/snail-fan.png',
        'path/to/snail-mechanical.png',
        'path/to/snail-goo.png'
    ];

    const snailData = [
        { name: "Turbo Snail", speed: 5, acceleration: 3, stickiness: 1, id: 'snail-0' },
        { name: "Wind Runner", speed: 4, acceleration: 4, stickiness: 2, id: 'snail-1' },
        { name: "Gear Crawler", speed: 6, acceleration: 2, stickiness: 1, id: 'snail-2' },
        { name: "Sticky Paws", speed: 3, acceleration: 3, stickiness: 5, id: 'snail-3' }
    ];

    let snails = []; // Array para almacenar los elementos del DOM y sus estados

    function createSnailsAndStats() {
        track.innerHTML = ''; // Limpiar pista
        snailStatsContainer.innerHTML = ''; // Limpiar estadísticas

        snails = []; // Resetear el array de caracoles

        snailData.forEach((data, index) => {
            // Crear elemento caracol
            const snailDiv = document.createElement('div');
            snailDiv.classList.add('snail');
            snailDiv.id = data.id;
            snailDiv.style.top = `${20 + (index * 65)}px`; // Posicionar verticalmente
            const snailImg = document.createElement('img');
            snailImg.src = snailImages[index];
            snailImg.alt = data.name;
            snailDiv.appendChild(snailImg);
            track.appendChild(snailDiv);

            snails.push({
                element: snailDiv,
                position: 0,
                currentSpeed: 0,
                data: data // Guardar los datos del caracol aquí
            });

            // Crear tarjeta de estadísticas
            const card = document.createElement('div');
            card.classList.add('snail-card');
            card.innerHTML = `
                <h3>${data.name}</h3>
                <p>Velocidad: ${data.speed}</p>
                <div class="stat-bar-container"><div class="stat-bar stat-speed" style="width: ${(data.speed / 6) * 100}%"></div></div>
                <p>Aceleración: ${data.acceleration}</p>
                <div class="stat-bar-container"><div class="stat-bar stat-acceleration" style="width: ${(data.acceleration / 5) * 100}%"></div></div>
                <p>Pegajosidad: ${data.stickiness}</p>
                <div class="stat-bar-container"><div class="stat-bar stat-stickiness" style="width: ${(data.stickiness / 5) * 100}%"></div></div>
            `;
            snailStatsContainer.appendChild(card);
        });
    }

    function moveSnail(snail) {
        // La velocidad base puede depender de la "velocidad" del caracol
        let baseMovement = snail.data.speed * 0.5; // Ajustar el multiplicador para que la carrera dure

        // La aceleración puede incrementar la velocidad gradualmente al inicio
        // Podríamos hacer que `currentSpeed` se incremente hasta un máximo
        snail.currentSpeed = Math.min(snail.currentSpeed + (snail.data.acceleration * 0.1), snail.data.speed * 1.5);

        // La pegajosidad puede restar movimiento
        const stickinessPenalty = snail.data.stickiness * 0.2; // Penalización por pegajosidad
        
        let actualMovement = Math.max(0, baseMovement + (snail.currentSpeed * 0.5) - stickinessPenalty);

        snail.position += actualMovement;
        snail.element.style.left = `${snail.position}px`;
    }

    function startRace() {
        startButton.disabled = true;
        let raceInterval;
        const finishLine = track.clientWidth - 100; // Ajustar la línea de meta

        // Resetear posiciones y velocidades
        snails.forEach(snail => {
            snail.position = 0;
            snail.currentSpeed = 0;
            snail.element.style.left = '0px';
        });

        raceInterval = setInterval(() => {
            let winnerFound = false;
            snails.forEach(snail => {
                moveSnail(snail);
                if (snail.position >= finishLine) {
                    alert(`¡${snail.data.name} ha ganado la carrera!`);
                    clearInterval(raceInterval);
                    startButton.disabled = false;
                    winnerFound = true;
                    // Opcional: reiniciar caracoles a la posición inicial después de un ganador
                    // setTimeout(createSnailsAndStats, 2000); // Reiniciar después de 2 segundos
                }
            });
        }, 80); // Frecuencia de actualización

        // Si la carrera no termina en X tiempo, puedes agregar un timeout
        setTimeout(() => {
            if (!winnerFound && startButton.disabled) { // Si nadie ha ganado todavía
                alert("La carrera ha terminado sin un ganador claro en el tiempo estipulado. ¡Empate!");
                clearInterval(raceInterval);
                startButton.disabled = false;
            }
        }, 60000); // Por ejemplo, 60 segundos
    }

    // Inicializar caracoles y estadísticas al cargar la página
    createSnailsAndStats();

    startButton.addEventListener('click', startRace);
});