import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MyApp } from '../app/app.component';
import { IonicModule } from 'ionic-angular';
import { TransactionComponent } from './transaction/transaction';
import { UpTransactionComponent } from './up-transaction/up-transaction';
import { RecTransactionComponent } from './rec-transaction/rec-transaction';


@NgModule({
	declarations: [TransactionComponent,
    UpTransactionComponent,
    RecTransactionComponent ],
	imports: [ CommonModule, IonicModule.forRoot(MyApp) ],
	exports: [TransactionComponent,
    UpTransactionComponent,
    RecTransactionComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}