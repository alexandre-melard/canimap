import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Slider from 'bootstrap-slider';
import * as $ from 'jquery';

@Component({
  moduleId: module.id.toString(),
  selector: 'slider',
  templateUrl: 'slider.component.html'
})

export class SliderComponent {
  message:any;
  @Output() valueChanged = new EventEmitter<any>();
  @Input() value:any;
  @Input() id:any;
  @Input() target:any;
  @Input() layerTarget:any;

  ngOnInit() {
    let slider = new Slider("#" + this.id + " > input", {});
    slider.setValue(this.value);
    let valueChanged = this.valueChanged;
    let layerTarget = this.layerTarget;
    slider.on("change", function (state) {
      console.log("new value:" + state.newValue);
      valueChanged.emit({target: layerTarget, value: state.newValue});
    })
    console.log('moving slider to overlays');
    $("#" + this.id).appendTo("#" + this.target);
  }
}
