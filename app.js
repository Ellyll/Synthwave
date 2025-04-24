document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    console.log({ context: context });

    window.addEventListener('resize', () => {
        draw(context);
    });

    draw(context);
});

function maximiseCanvas(canvas) {
    const maxX = window.innerWidth - 5;
    const maxY = window.innerHeight - 5;
    canvas.width = maxX;
    canvas.height = maxY;
}

function draw(context) {
    maximiseCanvas(context.canvas);

    drawSun(context);
    drawMountains(context);
    drawHaze(context);
}

function drawSun(context) {
    const radius = Math.min(context.canvas.height, context.canvas.width) * 0.125;
    const x = context.canvas.width / 2;
    const y = context.canvas.height / 4;

    const gradient = context.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.25);
    gradient.addColorStop(0, "#A4A");
    gradient.addColorStop(0.85, "#A4A");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(x, y, radius * 1.25, 0, Math.PI*2);
    context.fill();
}

function drawMountains(context) {

    const baseMountainHeight = context.canvas.height / 3; //2.25
    const yOffset = baseMountainHeight;

    const mountains = [
        { fillStyle: '#551155', mountainHeight: baseMountainHeight },
        { fillStyle: '#661166', mountainHeight: baseMountainHeight / 2 },
        { fillStyle: '#771177', mountainHeight: baseMountainHeight / 4 }
    ];

    const savedShadowColor = context.shadowColor;
    const savedShadowBlur = context.shadowBlur;

    mountains.forEach( m => {
        const maxY = context.canvas.height - yOffset; // Bottom
        const minY = context.canvas.height / 4;            // Top

        const points = generateMountains(context, m.mountainHeight, minY, maxY, yOffset);
            // .map(p => ({
            //     x: p.x,
            //     y: Math.max(Math.min(p.y - heightOffset, context.canvas.height - heightOffset), context.canvas.height / 4)
            // }));

        context.beginPath()
        context.moveTo(points[0].x, points[0].y);
        context.fillStyle = m.fillStyle;
        context.shadowColor = m.fillStyle;
        context.shadowBlur = 50;
        for (let i = 1; i<points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.lineTo(context.canvas.width, context.canvas.height - yOffset);
        context.lineTo(0, context.canvas.height - yOffset);
        context.lineTo(points[0].x, points[0].y);
        context.fill();
    });

    context.shadowBlur = savedShadowBlur;
    context.shadowColor = savedShadowColor;
}

function generateMountains(context, mountainHeight, minY, maxY, yOffset) {
    const step = context.canvas.width / 50;

    let h = context.canvas.height - mountainHeight - yOffset;
    const hStep = context.canvas.height / 25;

    const points = [];
    for (let x = 0; x <= context.canvas.width + 1 ; x += step) {
        h += hStep * (Math.random() - 0.5);
        //let y = h;
        if (h > maxY)
            h = maxY;
        if (h < minY)
            h = minY;
        points.push({x, y: h});
    }
    return points;
}

function drawHaze(context) {
    const radius = Math.min(context.canvas.height, context.canvas.width) * 2;
    const x = context.canvas.width / 2;
    const y = context.canvas.height / 2;

    const gradient = context.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    gradient.addColorStop(0, "rgba(170, 68, 170, 0.175)");
    gradient.addColorStop(1, "rgba(170, 68, 170, 0)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(x, y, radius, 0, Math.PI*2);
    context.fill();
}