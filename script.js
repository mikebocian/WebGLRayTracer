function getVector(a) {
    return vec2.subtract(vec2.create(), [a[0], a[1]], [a[2], a[3]])
}

function findAngleBetweenSegments(a, b) {
    return findAngleBetweenVectors(getVector(a), getVector(b))
}


function findAngleBetweenVectors(v1, v2) {
    var angle = Math.atan2(v1[1], v1[0]) - Math.atan2(v2[1], v2[0]);
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
}

function flat(collection) {
    var result = [];
    collection.forEach(function (a) {
        result = result.concat(a);
    });

    return result;
}

function trace(a, obstacles, counter, obstacleId) {

    var results = [];
    if (counter > 2) {
        //return;
    }


    var res = getClosestIntersectionPoint(a, obstacles, obstacleId);
    if (res) {
        results.push([a[0], a[1], res.point[0], res.point[1]]);

        var angle = Math.PI - 2 * findAngleBetweenSegments(res.obstacle, [a[0], a[1], res.point[0], res.point[1]]);
        var b = rotate([res.point[0], res.point[1], a[0], a[1]], [Math.sin(angle), Math.cos(angle)])

        var items = trace(b, obstacles, ++counter, res.id);
        results = results.concat(items);
    }
    else {
        results.push(a);
    }
    return results;
}

function getClosestIntersectionPoint(a, obstacles, obstacleId) {

    var minDistance = 1000000;
    var closestObstacle;
    var closestIntersectionPoint;

    for (var i = 0; i < obstacles.length; i++) {
        if (i == obstacleId) {
            continue;
        }
        var obstacle = obstacles[i];

        var intersectionPoint = getIntersectionPoint(a, obstacle);
        if (intersectionPoint != undefined) {
            var dist = vec2.distance([a[0], a[1]], intersectionPoint)
            if (dist < minDistance) {
                minDistance = dist;
                closestObstacle = obstacle;
                closestIntersectionPoint = intersectionPoint;
            }
        }
    }
    if (closestObstacle == undefined) {
        return;
    }
    else {
        return {obstacle: closestObstacle, point: closestIntersectionPoint, id: obstacles.indexOf(closestObstacle)};
    }
}

function rotate(a, rot) {

    var vector = vec2.subtract(vec2.create(), [a[2], a[3]], [a[0], a[1]])

    var rotated = [
        vector[0] * rot[1] + vector[1] * rot[0],
        vector[1] * rot[1] - vector[0] * rot[0]
    ];

    rotated = vec2.scale(vec2.create(), rotated, 1000);


    var added = vec2.add(vec2.create(), rotated, [a[0], a[1]])

    return [a[0], a[1], added[0], added[1]];
}

function getIntersectionPoint(a, b) {
    return checkLineIntersection([a[0], a[1]], [a[2], a[3]], [b[0], b[1]], [b[2], b[3]])
}

function checkLineIntersection(a1, a2, b1, b2) {

    var denominator, a, b, numerator1, numerator2, result = [];

    denominator = ((b2[1] - b1[1]) * (a2[0] - a1[0])) - ((b2[0] - b1[0]) * (a2[1] - a1[1]));
    if (denominator == 0) {
        return;
    }

    a = a1[1] - b1[1];
    b = a1[0] - b1[0];
    numerator1 = ((b2[0] - b1[0]) * a) - ((b2[1] - b1[1]) * b);
    numerator2 = ((a2[0] - a1[0]) * a) - ((a2[1] - a1[1]) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    result[0] = a1[0] + (a * (a2[0] - a1[0]));
    result[1] = a1[1] + (a * (a2[1] - a1[1]));

    if (a > 0 && a < 1 && b > 0 && b < 1) {
        return result;
    }
};
