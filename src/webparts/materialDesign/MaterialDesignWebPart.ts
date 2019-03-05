import {Version} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'MaterialDesignWebPartStrings';
import * as styles from 'materialize-css';
import {SPComponentLoader} from '@microsoft/sp-loader';

export interface IMaterialDesignWebPartProps {
  description: string;
}

export default class MaterialDesignWebPart extends BaseClientSideWebPart<IMaterialDesignWebPartProps> {

  public render(): void {

    SPComponentLoader.loadCss('../../../node_modules/materialize-css/dist/css/materialize.min.css');
    SPComponentLoader.loadCss('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
    SPComponentLoader.loadScript('../../../node_modules/materialize-css/dist/js/materialize.min.js');

    this.domElement.innerHTML = `
       <div class="row">
      <div class="row">
        <div class="input-field col s6">
          <i class="fas fa-user prefix"></i>
          <input id="icon_prefix" type="text" class="validate">
          <label for="icon_prefix">First Name</label>
        </div>
        <div class="input-field col s6">
          <i class="fas fa-mobile prefix"></i>
          <input id="icon_telephone" type="tel" class="validate">
          <label for="icon_telephone">Mobile No.</label>
        </div>
      </div>
  </div>
        `;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
