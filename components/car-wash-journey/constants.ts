// Découpage de la progression du scroll (0 à 1) en phases, repris tel quel
// par la scène, les particules et la barre de progression.
const WASH_START = 0.55;
const WASH_END = 0.9;
const WASH_DURATION = WASH_END - WASH_START;

export const PHASES = {
  roadStart: 0,
  roadEnd: 0.45,
  arriveEnd: WASH_START,
  wash1End: WASH_START + WASH_DURATION * 0.25, // prélavage
  wash2End: WASH_START + WASH_DURATION * 0.5, // mousse active
  wash3End: WASH_START + WASH_DURATION * 0.75, // rinçage
  washEnd: WASH_END, // lustrage
  resultEnd: 1,
};

// Position du sol dans la scène (en % de la hauteur de la "fenêtre"), sur
// laquelle s'alignent la voiture, la façade et le premier plan.
export const GROUND_Y_PERCENT = 80;

// Position des deux roues à l'intérieur du sprite car-clean.webp /
// car-dirt.webp, mesurée une fois sur l'image source (en % de la largeur et
// de la hauteur de la voiture). Sert à superposer les roues qui tournent au
// bon endroit.
export const WHEEL_LEFT_X_PERCENT = 17.3;
export const WHEEL_RIGHT_X_PERCENT = 79.6;
export const WHEEL_Y_PERCENT = 76;
export const WHEEL_DIAMETER_PERCENT = 17;

// Ratio largeur/hauteur du sprite de la voiture (car-clean.webp).
export const CAR_ASPECT_RATIO = 1654 / 659;
