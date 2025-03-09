// Get DOM elements
const clock = document.getElementById('clock');
const digitalTime = document.getElementById('digital-time');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');

// Create and append numbers container
const numbersContainer = document.createElement('div');
numbersContainer.style.position = 'absolute';
numbersContainer.style.width = '100%';
numbersContainer.style.height = '100%';
numbersContainer.style.transform = 'rotate(-6deg)';
clock.appendChild(numbersContainer);

// Generate clock numbers (1 to 12)
for (let n = 1; n <= 12; n++) {
    const angle = n * 30;
    const numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    numberDiv.style.transform = `rotate(${angle}deg)`;
    const innerDiv = document.createElement('div');
    innerDiv.style.transform = `translate(0, -90px) rotate(${-angle + 6}deg)`;
    innerDiv.textContent = n;
    numberDiv.appendChild(innerDiv);
    numbersContainer.appendChild(numberDiv);
}

// Initialize current time
const now = new Date();
let currentHour = now.getHours();
let currentMinute = now.getMinutes() + now.getSeconds() / 60;

// Function to update clock hands and digital display
function updateClock() {
    // Calculate display time
    const totalMinutes = currentHour * 60 + currentMinute;
    const roundedTotalMinutes = Math.round(totalMinutes);
    const displayHour = (Math.floor(roundedTotalMinutes / 60) % 12) || 12;
    const displayMinute = roundedTotalMinutes % 60;
    digitalTime.textContent = `${String(displayHour).padStart(2, '0')}:${String(displayMinute).padStart(2, '0')}`;

    // Calculate angles for hands
    const minuteAngle = currentMinute * 6;
    const hourAngle = (currentHour % 12) * 30 + (currentMinute / 60) * 30;

    // Apply transformations to hands
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
}

// Set initial clock state
updateClock();

// Variables for drag interaction
let dragging = false;
let previousAngle = 0;

// Function to calculate angle from event position
function getClockAngle(event) {
    const touch = event.touches ? event.touches[0] : event;
    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    const dx = touchX - centerX;
    const dy = touchY - centerY;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle = (angle + 90) % 360;
    if (angle < 0) angle += 360;
    return angle;
}

// Drag handlers
function startDrag(event) {
    event.preventDefault();
    dragging = true;
    previousAngle = getClockAngle(event);
}

function handleDrag(event) {
    event.preventDefault();
    if (dragging) {
        const currentAngle = getClockAngle(event);
        let delta = currentAngle - previousAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        const minuteChange = delta / 6;
        currentMinute += minuteChange;
        while (currentMinute >= 60) {
            currentMinute -= 60;
            currentHour = (currentHour + 1) % 24;
        }
        while (currentMinute < 0) {
            currentMinute += 60;
            currentHour = (currentHour - 1 + 24) % 24;
        }
        updateClock();
        previousAngle = currentAngle;
    }
}

function endDrag() {
    dragging = false;
}

// Attach event listeners for mouse and touch
clock.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', handleDrag);
document.addEventListener('mouseup', endDrag);
clock.addEventListener('touchstart', startDrag);
document.addEventListener('touchmove', handleDrag);
document.addEventListener('touchend', endDrag);