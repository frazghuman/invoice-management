import { NgModule } from "@angular/core";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    declarations: [
    ],
    imports: [
        ConfirmDialogModule
    ],
    exports: [
        ConfirmDialogModule
    ],
    providers: [ConfirmationService]
})
export class ConfirmDialogWrapperModule { }