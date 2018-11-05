export class Events {
    static MAP_MOVE = 'map.move';

    static MAP_STATE_LOADED = 'map.state.loaded';
    static MAP_STATE_MOVE = 'map.state.move';
    static MAP_SET_RESOLUTION = 'map.resolution.set';

    static MAP_DRAW_DELETE = 'map.draw.delete';
    static MAP_DRAW_EDIT = 'map.draw.edit';
    static MAP_DRAW_FEATURE_CREATED = 'map.draw.feature.created';
    static MAP_DRAW_INTERACTIONS_DISABLE = 'map.draw.interactions.disable';
    static MAP_DRAW_JSON_LAYERS_ADD = 'map.draw.json.layers.add';
    static MAP_DRAW_NAME_DISPLAY_SUBSCRIBE = 'map.draw.name.display.subscribe';
    static MAP_DRAW_NAME_DISPLAY_UNSUBSCRIBE = 'map.draw.name.display.unsubscribe';
    static MAP_DRAW_OBJECT_REGISTER = 'map.draw.object.register';
    static MAP_DRAW_OBJECT_ADD = 'map.draw.object.add';
    static MAP_DRAW_OBJECT_DISPLAY = 'map.draw.object.display';
    static MAP_DRAW_KML_EXPORT = 'map.draw.kml.export';
    static MAP_DRAW_GPX_EXPORT = 'map.draw.gpx.export';
    static MAP_DRAW_GEO_JSON_EXPORT = 'map.draw.geojson.export';
    static MAP_DRAW_PNG_EXPORT = 'map.draw.png.export';
    static MAP_DRAW_GPS_IMPORT = 'map.draw.gps.import';
    static MAP_DRAW_TRACK_RECORD = 'map.draw.track.record';
    static MAP_SCREEN_PRINT = 'map.screen.print';

    static MAP_FILE_SAVE = 'map.file.save';
    static MAP_FILE_EXPORT = 'map.file.export';
    static MAP_FILE_OPEN_MULTIPLE = 'map.file.open.multiple';
    static MAP_FILE_LOAD_GPS = 'map.file.open';

    static OL_DRAW_START = 'drawstart';
    static OL_DRAW_END = 'drawend';
    static OL_DRAW_SELECT = 'select';

    static OL_MAP_CHANGE_ACTIVE = 'change:active';
    static OL_MAP_CHANGE_ROTATION = 'change:rotation';
    static OL_MAP_POSTRENDER = 'postrender';
    static OL_MAP_POINTERMOVE = 'pointermove';
}
