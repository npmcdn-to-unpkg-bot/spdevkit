import {
  DisplayMode
} from '@ms/sp-client-base';

import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  IWebPartData,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@ms/sp-client-platform';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import strings from './loc/Strings.resx';
import Spdevkitgdrive, { ISpdevkitgdriveProps } from './Spdevkitgdrive';
import MockGDrive from './tests/MockGDrive';

export interface ISpdevkitgdriveWebPartProps {
  description: string;
  apikey: string;
  docnum: number;
  doc: string;
}

export interface GDriveList {
  value: GDriveDoc[];
}

export interface GDriveDoc {
  Title: string;
  Id: string;
}

export default class SpdevkitgdriveWebPart extends BaseClientSideWebPart<ISpdevkitgdriveWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

    private _getMockListData(): Promise<GDriveList> {
    return MockGDrive.get(this.host.pageContext.webAbsoluteUrl).then(() => {
        const listData: GDriveList = {
            value:
            [
                { Title: 'Mock List 1', Id: '1' },
                { Title: 'Mock List 2', Id: '2' },
                { Title: 'Mock List 3', Id: '3' }
            ]
            };

        return listData;
    }) as Promise<GDriveList>;
  }

  private _getListData(): Promise<GDriveList> {
  return this.host.httpClient.get(this.host.pageContext.webAbsoluteUrl + `/_api/web/lists?$filter=Hidden eq false`)
    .then((response: Response) => {
    return response.json();
    });
  }

  private _renderListAsync(): void {

    // Test environment
    if (this.host.hostType === HostType.TestPage) {
        this._getMockListData().then((response) => {
            this._renderList(response.value);
        });

        // SharePoint environment
    } else if (this.host.hostType === HostType.ModernPage) {
        this._getListData()
            .then((response) => {
                this._renderList(response.value);
            });
                    // Classic SharePoint environment
    } else if (this.host.hostType == HostType.ClassicPage) {
        this._getListData()
            .then((response) => {
                this._renderList(response.value);
            });
    }
  }

  private _renderList(items: GDriveDoc[]): void {
    let html: string = '';
    items.forEach((item: GDriveDoc) => {
        html += `
        <div>
            <div>
                <span>${item.Title}</span>
                <span>${item.Id}</span>
            </div>
        </div>`;
    });

    this.domElement.innerHTML += html;
  }

  public render(mode: DisplayMode, data?: IWebPartData): void {
    const element: React.ReactElement<ISpdevkitgdriveProps> = React.createElement(Spdevkitgdrive, {
      description: this.properties.description
    });

    ReactDom.render(element, this.domElement);

    this._renderListAsync();
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.AuthenticationPaneName
          },
          groups: [
            {
              groupName: strings.AuthenticationGroupName,
              groupFields: [
                PropertyPaneTextField('apikey', {
                  label: 'API Key'
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "Web Part Configuration"
          },
          groups: [
            {
              groupName: "View",
              groupFields: [
                PropertyPaneTextField('docnum', {
                  label: 'Number of Documents'
                })
              ],
            },
            {
              groupName: "Document Types",
              groupFields: [
                PropertyPaneCheckbox('doc', {
                  label: '.doc'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
