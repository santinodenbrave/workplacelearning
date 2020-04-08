let lastColorIndex = 0;

function getChartColor(reset = false) {
    if (reset) {
        lastColorIndex = 0;
    }
    const colors = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ];
    if (lastColorIndex === colors.length) {
        lastColorIndex = 0;
    }
    return colors[lastColorIndex++];
}
