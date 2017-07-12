import { Directive } from '@angular/core';

/**
 * Generated class for the FileuploadDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[fileupload]' // Attribute selector
})
export class FileuploadDirective {

  constructor() {
    console.log('Hello FileuploadDirective Directive');
  }

}
