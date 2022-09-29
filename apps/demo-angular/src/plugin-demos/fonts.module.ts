import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { FontsComponent } from './fonts.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: FontsComponent }])],
  declarations: [FontsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FontsModule {}
