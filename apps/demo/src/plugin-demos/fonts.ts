import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedFonts } from '@demo/shared';
import {} from '@nativescript-community/fonts';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedFonts {}
