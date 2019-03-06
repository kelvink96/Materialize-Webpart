import {Version} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'MaterialDesignWebPartStrings';
import {SPComponentLoader} from '@microsoft/sp-loader';
import * as $ from 'jquery';
import styles from "./MaterialDesignWebPart.module.scss";
import components from './materialize.scss';
import MyForm from "./MyForm";

export interface IMaterialDesignWebPartProps {
  description: string;
}

export default class MaterialDesignWebPart extends BaseClientSideWebPart<IMaterialDesignWebPartProps> {

  // Load Resources
  public constructor() {
    super();

    /*SPComponentLoader.loadCss('../../../node_modules/materialize-css/dist/css/materialize.min.css');
    SPComponentLoader.loadCss('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
    SPComponentLoader.loadScript('../../../node_modules/materialize-css/dist/js/materialize.min.js');*/
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css');
    SPComponentLoader.loadCss('https://use.fontawesome.com/releases/v5.7.2/css/all.css');
    SPComponentLoader.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js');
    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js');

  }

  // Work on Main Window
  public render(): void {

    this.domElement.innerHTML = MyForm.formHtml;

    // On Click function
    $(function () {
      $('.click').on('click', function () {
        console.log($('.f-name').val());
        console.log($('.user-mobile').val());
      });
    });
  }

  protected static get dataVersion(): Version {
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
