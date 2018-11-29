import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MyApp } from '../app/app.component';
import { IonicModule } from 'ionic-angular';


@NgModule({
	declarations: [ ],
	imports: [ CommonModule, IonicModule.forRoot(MyApp) ],
	exports: [ ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}