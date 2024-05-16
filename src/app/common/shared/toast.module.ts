import { NgModule } from "@angular/core";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
    ],
    imports: [
        ToastModule
    ],
    exports: [
        ToastModule
    ],
    providers: [MessageService]
})
export class ToastWrapperModule { }