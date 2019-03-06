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
  public constructor(){
    super();

    SPComponentLoader.loadCss('../../../node_modules/materialize-css/dist/css/materialize.min.css');
    SPComponentLoader.loadCss('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
    SPComponentLoader.loadScript('../../../node_modules/materialize-css/dist/js/materialize.min.js');
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
