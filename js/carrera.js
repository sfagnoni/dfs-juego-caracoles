const randomInRange = (min, max) => Math.random() * (max - min) + min;

const track = document.getElementById('track');
const startButton = document.getElementById('start-button');

const snailImages = [
    'imgs/helicol.png',
    'imgs/magicol.png',
    'imgs/mecanicol.png',
    'imgs/turbocol.png'
];

let snailData;
let snails


const getSnails = () => {

    snails ? snails.forEach(snail => track.removeChild(snail)) : null;

    let snailData = [];

    axios.get("http://localhost:3000/v1/snails", {
        headers: {
            "Content-Type": 'application/json',
            "authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            snailData = response.data.snails;
            console.log(snailData);
            startButton.innerText = "¡Iniciar Carrera!";
        })
        .catch(error => {
            console.error("Error fetching snails, using local data:", error);
            snailData = [
                { name: "Helicol", speed: randomInRange(2, 5), acceleration: randomInRange(1, 2), stickiness: randomInRange(2, 3), id: 'snail-0' },
                { name: "Magicol", speed: randomInRange(3, 4), acceleration: randomInRange(4, 5), stickiness: randomInRange(2, 3), id: 'snail-1' },
                { name: "Mecanicol", speed: randomInRange(3, 4), acceleration: randomInRange(1, 2), stickiness: randomInRange(1, 2), id: 'snail-2' },
                { name: "Turbocol", speed: randomInRange(2, 4), acceleration: randomInRange(3, 5), stickiness: randomInRange(2, 3), id: 'snail-3' }
            ];
            startButton.innerText = "Carrera local";
        }).finally(() => {

            snails = snailData.map((data, index) => {
                const snail = document.createElement('div');
                const img = document.createElement("img");
                img.src = snailImages[index];
                snail.appendChild(img);
                snail.classList.add('snail');
                snail.id = data.id;
                snail.data = data;
                snail.position = 0;
                snail.verticalPosition = 335 + index * 100; // Espaciado vertical entre caracoles
                snail.style.top = `${snail.verticalPosition}px`;
                snail.currentSpeed = 0;
                track.appendChild(snail);
                return snail;
            });

            snails.forEach(snail => {
                snail.element = snail;
            });

            startButton.disabled = false;

        })

}

//getSnails();

function moveSnail(snail) {
    // La velocidad base puede depender de la "velocidad" del caracol
    let baseMovement = snail.data.speed * 0.8; // Ajustar el multiplicador para que la carrera dure

    // La aceleración puede incrementar la velocidad gradualmente al inicio
    // Que `currentSpeed` se incremente hasta un máximo
    snail.currentSpeed = Math.min(snail.currentSpeed + (snail.data.acceleration * 0.1), snail.data.speed * 1.5);

    // La pegajosidad resta movimiento
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

                clearInterval(raceInterval);
                startButton.disabled = false;
                winnerFound = true;
                alert(`¡${snail.data.name} ha ganado la carrera!`);
                getSnails();
                startButton.innerText = "Cargando datos de nueva carrera...";
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

startButton.addEventListener('click', startRace);
startButton.innerText = "Cargando información de la carrera...";
startButton.disabled = true;
getSnails();
