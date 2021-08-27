/**
 * from
 * https://github.com/georgedoescode/splinejs#readme
 *
 */
function formatPoints(points, close) {
  points = [...points];
  // so that coords can be passed as objects or arrays
  if (!Array.isArray(points[0])) {
    points = points.map(({ x, y }) => [x, y]);
  }

  if (close) {
    const lastPoint = points[points.length - 1];
    const secondToLastPoint = points[points.length - 2];

    const firstPoint = points[0];
    const secondPoint = points[1];

    points.unshift(lastPoint);
    points.unshift(secondToLastPoint);

    points.push(firstPoint);
    points.push(secondPoint);
  }

  return points.flat();
}

function spline(points = [], tension = 1, close = false, cb) {
  points = formatPoints(points, close);

  const size = points.length;
  const last = size - 4;

  const startPointX = close ? points[2] : points[0];
  const startPointY = close ? points[3] : points[1];

  let path = 'M' + [startPointX, startPointY];

  cb && cb('MOVE', [startPointX, startPointY]);

  const startIteration = close ? 2 : 0;
  const maxIteration = close ? size - 4 : size - 2;
  const inc = 2;

  for (let i = startIteration; i < maxIteration; i += inc) {
    const x0 = i ? points[i - 2] : points[0];
    const y0 = i ? points[i - 1] : points[1];

    const x1 = points[i + 0];
    const y1 = points[i + 1];

    const x2 = points[i + 2];
    const y2 = points[i + 3];

    const x3 = i !== last ? points[i + 4] : x2;
    const y3 = i !== last ? points[i + 5] : y2;

    const cp1x = x1 + ((x2 - x0) / 6) * tension;
    const cp1y = y1 + ((y2 - y0) / 6) * tension;

    const cp2x = x2 - ((x3 - x1) / 6) * tension;
    const cp2y = y2 - ((y3 - y1) / 6) * tension;

    path += 'C' + [cp1x, cp1y, cp2x, cp2y, x2, y2];

    cb && cb('CURVE', [cp1x, cp1y, cp2x, cp2y, x2, y2]);
  }

  return path;
}

function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

function createPoints() {
  const points = [];
  const numPoints = 6;
  const angleStep = (Math.PI * 2) / numPoints;
  const radius = 225;

  for (let i = 1; i <= numPoints; i++) {
    const theta = i * angleStep;
    const x = 225 + Math.cos(theta) * radius;
    const y = 225 + Math.sin(theta) * radius;

    points.push({
      x: x,
      y: y,
      originX: x,
      originY: y,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
    });
  }

  return points;
}

function main() {
  const path = document.querySelector('path');
  const root = document.documentElement;
  const points = createPoints();
  const simplex = new SimplexNoise();
  console.log(simplex);

  // how fast we progress thru 'time'
  // higher => faster
  let noiseStep = 0.0005;

  function noise(x, y) {
    return simplex.noise2D(x, y);
  }

  (function animate() {
    path.setAttribute('d', spline(points, 1, true));

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
      const nY = noise(point.noiseOffsetY, point.noiseOffsetY);

      const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
      const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

      point.x = x;
      point.y = y;

      // progress the point's x, y through 'time'
      point.noiseOffsetX += noiseStep;
      point.noiseOffsetY += noiseStep;
    }

    requestAnimationFrame(animate);
  })();
}

main();
