import { spline } from '@georgedoescode/spline';
import SimplexNoise from 'simplex-noise';

document.addEventListener('DOMContentLoaded', superReveal, false);

/**
 * Help from: https://georgefrancis.dev/writing/build-a-smooth-animated-blob-with-svg-and-js/
 *
 */
const pathBlue = document.querySelector('#blobBlue path');
const root = document.documentElement;

function createPoints() {
  const points = [];
  const numPoints = 6;
  const angleStep = (Math.PI * 2) / numPoints;
  const rad = 75;

  for (var i = 1; i <= numPoints; i++) {
    const theta = i * angleStep;
    const x = 100 + Math.cos(theta) * rad;
    const y = 100 + Math.sin(theta) * rad;

    points.push({
      x,
      y,
      originX: x,
      originY: y,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
    });
  }

  return points;
}

const points = createPoints();
const simplex = new SimplexNoise();
let noiseStep = 0.0005;

function noise(x, y) {
  return simplex.noise2D(x, y);
}

(function animate() {
  pathBlue.setAttribute('d', spline(points, 1, true));

  for (var i = 0, len = points.length; i < len; i++) {
    const point = points[i];

    const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
    const nY = noise(point.noiseOffsetY, point.noiseOffsetY);

    const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
    const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

    point.x = x;
    point.y = y;

    point.noiseOffsetX += noiseStep;
    point.noiseOffsetY += noiseStep;
  }

  requestAnimationFrame(animate);
})();

function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

function superReveal() {
  const superToReveal = document.getElementById('superFigFig');

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(superToReveal);

  function handleIntersect(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
      }
    });

    document.getElementById('superFig').classList.add('loaded');
  }
}
