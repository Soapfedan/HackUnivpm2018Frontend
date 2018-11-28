import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MyApp } from '../app/app.component';
import { IonicModule } from 'ionic-angular';
import { DynamicComponent } from './dynamic/dynamic';
import { CustomComponent } from './custom/custom';

@NgModule({
	declarations: [ DynamicComponent,
    CustomComponent ],
	imports: [ CommonModule, IonicModule.forRoot(MyApp) ],
	exports: [ DynamicComponent,
    CustomComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}