require("leaflet-draw");

L.drawLocal.draw.handlers.circle.tooltip.start = 'cliquez et déplacez la sourie pour déssiner le disque';
L.drawLocal.draw.handlers.circle.radius = 'rayon';
L.drawLocal.draw.handlers.marker.tooltip.start = 'cliquez sur la carte pour placer le marker';
L.drawLocal.draw.handlers.polygon.tooltip.start = 'cliquez pour placer le premier point';
L.drawLocal.draw.handlers.polygon.tooltip.cont = 'cliquez pour placer le point suivant';
L.drawLocal.draw.handlers.polygon.tooltip.end = 'cliquez sur le premier point pour terminer le polygone';
L.drawLocal.draw.handlers.polyline.tooltip.start = 'cliquez pour placer le premier point';
L.drawLocal.draw.handlers.polyline.tooltip.cont = 'cliquez pour placer le point suivant';
L.drawLocal.draw.handlers.polyline.tooltip.end = 'cliquez sur le dernier point pour terminer la figure';
L.drawLocal.draw.handlers.polyline.error = '<strong>Erreur:</strong> les limites ne peuvent pas se croiser';
L.drawLocal.draw.handlers.rectangle.tooltip.start = 'cliquez et déplacez la sourie pour dessiner le rectangle';
L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'relachez le bouton de la sourie pour terminer la figure';
// L.drawLocal.draw.handlers.circlemarker.tooltip.start = 'cliquez sur la carte pour placer le marker';
