import { Component, OnInit } from '@angular/core';
import { LogService } from '../_services/log.service';
import { MapService } from '../_services/map.service';
import { EventService } from '../_services/event.service';
import { Events } from '../_consts/events';
import { Map } from 'ol/Map';

declare var $;

@Component({
    moduleId: module.id.toString(),
    selector: 'app-compass',
    templateUrl: 'compass.component.html',
    styleUrls: ['compass.component.css']
})

export class CompassComponent implements OnInit {
    message: any;

    constructor(
        private logService: LogService,
        private eventService: EventService,
        private mapService: MapService) { }

    ngOnInit() {
        const me = this;
        this.eventService.subscribe(Events.MAP_STATE_LOADED, (map: Map) => {
            map.getView().on(Events.OL_MAP_CHANGE_ROTATION, (rotation) => {
                const degree = - Math.round((rotation.oldValue * (180 / Math.PI) * -1) + 100);
                const rotateCSS = 'rotate(' + (degree + 90) + 'deg)';
                $('#rotateable').css({
                    '-moz-transform': rotateCSS,
                    '-webkit-transform': rotateCSS
                });
            });
        });
        $('#rotateable').draggable({
            handle: '#rotate',
            opacity: 0.001,
            helper: 'clone',
            drag: function (event) {
                const // get center of div to rotate
                    pw = document.getElementById('rotateable'),
                    pwBox = pw.getBoundingClientRect(),
                    center_x = (pwBox.left + pwBox.right) / 2,
                    center_y = (pwBox.top + pwBox.bottom) / 2,
                    // get mouse position
                    mouse_x = event.pageX,
                    mouse_y = event.pageY,
                    radians = Math.atan2(center_x - mouse_x, center_y - mouse_y),
                    degree = - Math.round(radians * (180 / Math.PI));
                // degree = Math.round((radians * (180 / Math.PI) * -1) + 100);

                me.mapService.rotate(radians);

                const rotateCSS = 'rotate(' + (degree) + 'deg)';
                $('#rotateable').css({
                    '-moz-transform': rotateCSS,
                    '-webkit-transform': rotateCSS
                });
            }
        });
    }
}

