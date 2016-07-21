/* tslint:disable */

require('jquery');
require('leaflet');

import {
  DisplayMode
} from '@ms/sp-client-base';

import {
    IClientSideWebPart,
    IPropertyPanePage,
    IPropertyPaneFieldType,
    HostType,
    BaseClientSideWebPart,
    IPropertyPaneSettings,
    IWebPartContext,
    IWebPartData,
    PropertyPaneTextField
} from '@ms/sp-client-platform';

import styles from './Recordpoint.module.scss';
import strings from './loc/Strings.resx';

import {
    Map,
    Icon,
    TileLayerFactory,
} from "leaflet";

import * as $ from 'jquery';



export interface IRecordpointWebPartProps {
  description: string;
}

export default class RecordpointWebPart extends BaseClientSideWebPart<IRecordpointWebPartProps> {

  private map: Map;
  private icon: Icon;
  private tilelayerFactory: TileLayerFactory;

  public constructor(context: IWebPartContext) {
    super(context);
    //this.host.resourceLoader.loadCSS('http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css');
  }

  private loadMap(): void {
      var map = L.map('map').setView([37.8, -96], 4);
      L.tileLayer(`https://maps.googleapis.com/maps/api/staticmap?center=Australia&size=640x400&style=element:labels|visibility:off&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&key=AIzaSyCUiOmkVArLLyttejvDdxwpmyg3aIifaKE`, {
          maxZoom: 18,
          attribution: 'Microsoft SharePoint 2016 Dev Kitchen',
          id: 'mapbox.streets'
      }).addTo(map);

      this.map = map;
  }

  public render(mode: DisplayMode, data?: IWebPartData): void {

    this.domElement.innerHTML += `
      <div class="${styles.recordpoint}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${this.properties.description} Hello Google maps!</p>
              <a href="https://github.com/OfficeDev/SharePointUXFramework/wiki" class="ms-Button ${styles.button}">
                <span class="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
      </div>
      <div id="map" style="height:600px"></div>
    </div>`;

      setTimeout(() => {
          this.loadMap();
      }, 1000);
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
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


/* tslint:enable */