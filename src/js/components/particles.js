const PARTICLES_PER_ZONE = 1;
const ZONE_COLUMNS = 2;
const ZONES_QUANTITY = 6; // only multiples of 2 permitted
const THRESHOLD_WIDTH = .5;
const THRESHOLD_HEIGHT = .75;
const PARTICLE_WIDTH = 32;
const PARTICLE_HEIGHT = 32;

export default class Particles {
  constructor() {
    this._dmz = this._createDMZ();
    this._zones = this._createZones(ZONES_QUANTITY);
    this._particlesQuantity = PARTICLES_PER_ZONE * ZONES_QUANTITY;
    this._$particles = document.querySelector('.particles');

    this._currentSwitch = 0;
  }

  init() {
    for (let i = 0; i < this._particlesQuantity; i++) {
      this._$particles.appendChild(this._createParticle().element);
    }
  }

  /**
  * A DMZ (demilitarised zone) is an area that the particles shouldn't touch so that
  * content isn't blocked.
  */
  _createDMZ() {
    const dmzWidth = window.innerWidth * THRESHOLD_WIDTH;
    const dmzHeight = window.innerHeight * THRESHOLD_HEIGHT;
    const minX = Math.floor((window.innerWidth / 2) - (dmzWidth / 2));
    const minY = Math.floor((window.innerHeight / 2) - (dmzHeight / 2));

    return {
      width: dmzWidth,
      height: dmzHeight,
      top: minY,
      left: minX,
      bottom: Math.floor(minY + dmzHeight),
      right: Math.floor(minX + dmzWidth),
    };
  }

  _createZones(quantity) {
    const rows = Math.ceil(quantity / ZONE_COLUMNS);
    const remainder = quantity % ZONE_COLUMNS;
    const midX = Math.floor(window.innerWidth / ZONE_COLUMNS);
    const midY = Math.floor(window.innerHeight / rows);

    let row = 0;
    let column = 0;
    let count = 0;
    let zones = [];

    for (row; row < rows; row++) {
      for (column; column < ZONE_COLUMNS; column++) {
        zones.push({
          switch: 0,
          width: midX,
          height: midY,
          top: row * midY,
          left: column * midX,
          bottom: row * midY + midY,
          right: column * midX + midX,
          particleId: row
        });
      }

      column = 0;
    }

    return zones;
  }

  /**
  * Goes through the lifecycle of a particle:
  * killing the existing one and replacing it with a new one.
  * @param {Object=} particle
  */
  _runParticleLifecycle(particle) {
    // death
    if (particle) {
      particle.element.classList.remove('particle--visible');

      setTimeout(() => {
        particle.element.parentNode.removeChild(particle.element);
      }, 250);
      particle.zone.switch = particle.zone.switch ? 0 : 1;
    }

    // birth
    this._$particles.appendChild(this._createParticle().element);
  }

  /**
  * Creates a particle:
  * - in a random zone that's available.
  * - in a random position within that zone.
  * - with a lifespan between 4 and 12 seconds.
  * Sets a timeout that goes through particle lifecycle.
  *
  * @return {Object}
  */
  _createParticle() {
    const zone = this._getRandomZone();
    const position = this._getRandomPosition(zone);
    const $element = document.getElementById(`particle-${zone.particleId}`).content.cloneNode(true).querySelector('.particle');

    const particle = {
      zone,
      position,
      element: $element,
      lifespan: (4 + Math.floor(Math.random() * 8)) * 1000,
    };

    window.setTimeout(
      () => {
        this._runParticleLifecycle(particle);
      },
      particle.lifespan
    );

    $element.classList.add('particle');
    setTimeout(() => {
      $element.classList.add('particle--visible');
    }, 250);
    $element.style.top = `${position.y}px`;
    $element.style.left = `${position.x}px`;

    return particle;
  }

  /**
  * Get a random zone from an array of available ones.
  * @return {Object}
  */
  _getRandomZone() {
    const availableZones = this._zones.filter(zone => zone.switch === this._currentSwitch);

    // if there are no available zones, flip the switch and run again
    if (availableZones.length == 0) {
      this._currentSwitch = this._currentSwitch ? 0 : 1;
      return this._getRandomZone();
    }

    const randomZone = availableZones[Math.floor(Math.random() * availableZones.length)];

    // mark this as "used" by "flipping" flag
    randomZone.switch = this._currentSwitch ? 0 : 1;

    return randomZone;
  }

  /**
  * Get random position within a zone.
  * Recursive if the generated coordinates fall within the restricted area.
  * @param  {Object} zone
  * @return {Object}
  */
  _getRandomPosition(zone) {
    // the last bit (particle width or height / 2) allows the particle to be
    // generated slightly offscreen in an attempt to feel more "dynamic"
    const position = {
      x: Math.floor(zone.left + (Math.random() * zone.width) - (PARTICLE_WIDTH / 2)),
      y: Math.floor(zone.top + (Math.random() * zone.height) - (PARTICLE_HEIGHT / 2))
    };

    if (
      position.x >= this._dmz.left &&
      position.x <= this._dmz.right &&
      position.y >= this._dmz.top &&
      position.y <= this._dmz.bottom
    ) {
      return this._getRandomPosition(zone);
    } else {
      return position;
    }
  }
}