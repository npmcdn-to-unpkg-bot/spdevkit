/* tslint:disable */

require('jquery');
require('leaflet');
require('geojson');

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
    PropertyPaneTextField,
    PropertyPaneDropdown
} from '@ms/sp-client-platform';

import styles from './Recordpoint.module.scss';
import strings from './loc/Strings.resx';

import {
    Map,
    Icon,
} from "leaflet";

import {
} from "geojson";

import * as $ from 'jquery';



export interface IRecordpointWebPartProps {
  zoom: number;
  heatmap_variable: string;
  authname: string;
  authkey: string;
  pokedatahosturl: string;
  pokedatahostpolltime: number;
}

export default class RecordpointWebPart extends BaseClientSideWebPart<IRecordpointWebPartProps> {

  private map: Map;
  private icon: Icon;
  private layer: L.LayerGroup<L.ILayer>;

  public constructor(context: IWebPartContext) {
    super(context);

    this.host.resourceLoader.loadCSS("https://npmcdn.com/leaflet@0.7.7/dist/leaflet.css");
  }

  private pollPokemonOneHost(): void {
    //console.log('pollPokemonOneHost');

    var url = "http://" + this.properties.pokedatahosturl + "/api/values/get";
    console.log(url);
    var webPart = this;

    $.get(url, function( data ) {

      if(webPart.layer != null)
      {
        webPart.map.removeLayer(webPart.layer);
      }

      var jsonObject = JSON.parse(data);

      webPart.layer = L.geoJson(jsonObject,
                                {
                                  style: RecordpointWebPart.setFeatureStyle
                                }).addTo(webPart.map);

    });
    setTimeout(() => {
          this.pollPokemonOneHost();
      }, this.properties.pokedatahostpolltime * 1000);
  };

  private initialiseMap(): void {

    // set up the map
    var map = new L.Map('map');

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl,
    {
      //minZoom: 8,
      //maxZoom: 12,
      //continuousWorld: true,
      detectRetina: true,
      attribution: osmAttrib
    });

    // start the map in South-East England
    map.setView(new L.LatLng(47.6356316,-122.1409979), this.properties.zoom);
    map.addLayer(osm);

/*
    var featuresOrig = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.16453552246094,47.706527200903395],[-122.16522216796875,47.64665567309623],[-122.18582153320312,47.647118264705576],[-122.18856811523436,47.634626853219274],[-122.20504760742186,47.64341741711686],[-122.20642089843749,47.6737103919566],[-122.21672058105469,47.68341892265674],[-122.21603393554688,47.697516190510555],[-122.20882415771484,47.700057915247314],[-122.16453552246094,47.706527200903395]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.16453552246094,47.680876386847544],[-122.10067749023438,47.68203210030427],[-122.0866012573242,47.665156141945474],[-122.09278106689453,47.65521295468833],[-122.10582733154295,47.6529003141482],[-122.10445404052733,47.64295479273205],[-122.08797454833983,47.63115648664202],[-122.18753814697266,47.634626853219274],[-122.18547821044923,47.64758085221801],[-122.16453552246094,47.64642437575518],[-122.16453552246094,47.680876386847544]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.20573425292967,47.64295479273205],[-122.2060775756836,47.64873730307524],[-122.21397399902344,47.6524377737497],[-122.22461700439453,47.63971630732309],[-122.23011016845702,47.65220650201415],[-122.23217010498048,47.63925365016244],[-122.24109649658203,47.64596177800046],[-122.24349975585938,47.61796699180625],[-122.23148345947267,47.613106865322756],[-122.22461700439453,47.607320411466404],[-122.22152709960936,47.616115568315756],[-122.20573425292967,47.607320411466404],[-122.21466064453125,47.60847775345513],[-122.21706390380861,47.60269078742121],[-122.20504760742186,47.58046288819408],[-122.11235046386717,47.57768373696443],[-122.10823059082031,47.59875528481801],[-122.11200714111328,47.607320411466404],[-122.091064453125,47.62190104905555],[-122.08728790283202,47.62722312591712],[-122.08797454833983,47.631387851583746],[-122.18788146972655,47.634626853219274],[-122.20573425292967,47.64295479273205]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.22770690917969,47.59435643156871],[-122.22393035888672,47.58694700071011],[-122.20367431640624,47.578841734571306],[-122.20401763916016,47.570966845786124],[-122.20985412597656,47.56587069843866],[-122.20882415771484,47.54223662718361],[-122.21500396728514,47.53227005016189],[-122.22667694091795,47.52461999690649],[-122.2459030151367,47.53551519020612],[-122.23937988281251,47.54223662718361],[-122.23148345947267,47.55683540041267],[-122.23388671874999,47.5686504766426],[-122.25414276123047,47.5820839916191],[-122.25414276123047,47.59273570820418],[-122.2500228881836,47.592272635166125],[-122.24693298339844,47.5952825366688],[-122.23834991455078,47.59111493464383],[-122.22770690917969,47.59435643156871]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.34134674072267,47.589494110887394],[-122.28675842285158,47.58879945676841],[-122.28641510009766,47.583705044846596],[-122.27920532226562,47.56772390029974],[-122.26959228515624,47.56702895728551],[-122.2562026977539,47.55034755878121],[-122.26306915283205,47.534124440491674],[-122.29499816894531,47.533660849056794],[-122.34374999999999,47.5714301073211],[-122.34134674072267,47.589494110887394]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.28710174560547,47.589494110887394],[-122.28710174560547,47.59898679316619],[-122.27954864501955,47.620512592064074],[-122.2836685180664,47.62398366540192],[-122.27714538574219,47.631850578394406],[-122.27817535400389,47.64272347900328],[-122.2898483276367,47.64665567309623],[-122.30117797851561,47.647118264705576],[-122.30941772460938,47.64804343563356],[-122.3097610473633,47.64295479273205],[-122.32177734375,47.6524377737497],[-122.32967376708984,47.645036570200254],[-122.32967376708984,47.63555224538428],[-122.33654022216795,47.62745450827172],[-122.32830047607422,47.62259526372312],[-122.33585357666014,47.6017648134425],[-122.34134674072267,47.59065184726404],[-122.28710174560547,47.589494110887394]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.43644714355469,47.66145657256136],[-122.41687774658202,47.65058757118734],[-122.41996765136719,47.643648727772906],[-122.3935317993164,47.630462385671116],[-122.38426208496094,47.632544660928296],[-122.3773956298828,47.631850578394406],[-122.37808227539061,47.62699174253825],[-122.36366271972655,47.62120682516921],[-122.3488998413086,47.60986653003798],[-122.3382568359375,47.60107032220255],[-122.32864379882811,47.62236385985822],[-122.33757019042969,47.62722312591712],[-122.3434066772461,47.643880037404706],[-122.37224578857423,47.657987988142274],[-122.37979888916016,47.655675470505955],[-122.3832321166992,47.66145657256136],[-122.39524841308595,47.66376883415158],[-122.40829467773436,47.66677462110549],[-122.40829467773436,47.67139857075435],[-122.42237091064453,47.667930646923494],[-122.43644714355469,47.66145657256136]]]}},{"type":"Feature","properties":{"density":0},"geometry":{"type":"Polygon","coordinates":[[[-122.3818588256836,47.70953052491089],[-122.27542877197264,47.709299506131345],[-122.2719955444336,47.69612974297274],[-122.26341247558594,47.68757916850813],[-122.25379943847655,47.68757916850813],[-122.24555969238281,47.68341892265674],[-122.24933624267578,47.6750974355193],[-122.2671890258789,47.66469371011086],[-122.27542877197264,47.65359411706439],[-122.27508544921875,47.64827472580503],[-122.28675842285158,47.655906726878456],[-122.29877471923828,47.64804343563356],[-122.30907440185545,47.648506014952225],[-122.32177734375,47.653825382654695],[-122.3269271850586,47.65266904446106],[-122.3324203491211,47.645036570200254],[-122.33585357666014,47.64434265359565],[-122.34546661376953,47.64896859017401],[-122.35061645507812,47.64896859017401],[-122.36572265625,47.65521295468833],[-122.37190246582031,47.6603004033596],[-122.37979888916016,47.660762874112834],[-122.38941192626953,47.66862425012441],[-122.39662170410156,47.66584978201617],[-122.40520477294922,47.66931784410792],[-122.40966796874999,47.676253276991204],[-122.40623474121092,47.680876386847544],[-122.40383148193361,47.68480570814145],[-122.4045181274414,47.690352481405704],[-122.40657806396484,47.69312564683551],[-122.40383148193361,47.697516190510555],[-122.39318847656249,47.70098214806642],[-122.38494873046875,47.70514099299205],[-122.3818588256836,47.70953052491089]]]}}]};
*/
    var features =
    {
      "type":"FeatureCollection",
      "features":
      [
        {
          "type":"Feature",
          "properties":
          {
            density: 0
          },
          "geometry":
          {
            "type":"Polygon",
            "coordinates":
            [
              [
                [-122.16453552246094,47.706527200903395],
                [-122.16522216796875,47.64665567309623],
                [-122.18582153320312,47.647118264705576],
                [-122.18856811523436,47.634626853219274],
                [-122.20504760742186,47.64341741711686],
                [-122.20642089843749,47.6737103919566],
                [-122.21672058105469,47.68341892265674],
                [-122.21603393554688,47.697516190510555],
                [-122.20882415771484,47.700057915247314],
                [-122.16453552246094,47.706527200903395]
              ]
            ]
          }
        }
      ]
    };

    var layer = L.geoJson(features,
                          {
                            style: RecordpointWebPart.setFeatureStyle
                          }
    ).addTo(map);

    this.map = map;
    this.layer = layer;

    $( "div" ).find("#map").css( "height", "700px" );
  }

  static getColour(d) {
      return d > 1000 ? '#800026' :
            d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
            d > 100  ? '#FC4E2A' :
            d > 50   ? '#FD8D3C' :
            d > 20   ? '#FEB24C' :
            d > 10   ? '#FED976' :
                        '#FFEDA0';
  }

  static setFeatureStyle(feature:any)
  {
    var style = {
        fillColor: RecordpointWebPart.getColour(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };

    return style;
  }

  public render(mode: DisplayMode, data?: IWebPartData): void {

    this.domElement.innerHTML += `
      <div class="${styles.recordpoint}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeLighter ms-fontColor-black ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-black">Pokemon Go!</span> <img src="../data/5Pikachu.png" height="30px"></img>
              <div id="map"></div>
            </div>
          </div>
      </div>
    </div>`;

    // prob. better to use promises, but I can't be bothered learning how to do it in typescript and time is running out!
    setTimeout(() => {
          this.initialiseMap();
      }, 1000);

    setTimeout(() => {
          this.pollPokemonOneHost();
      }, 5000);
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
              groupName: 'Connectivity',
              groupFields: [
                PropertyPaneTextField('authname', {
                  label: 'Auth Name'
                }),
                PropertyPaneTextField('authkey', {
                  label: 'Auth Key'
                }),
                PropertyPaneTextField('pokedatahosturl', {
                  label: 'Pokemon Go Service'
                }),
                PropertyPaneTextField('pokedatahostpolltime', {
                  label: 'Poll the Pokemon Go Service ever X seconds'
                })
              ]
            },
            {
              groupName: 'Map Configuration',
              groupFields: [
                PropertyPaneTextField('zoom', {
                  label: 'Zoom Level'
                }),
                PropertyPaneDropdown('heatmap_variable', {
                label: 'Heatmap Statistic',
                options: [
                  {key: 'Poke', text: 'Pokemon'},
                  {key: 'Pop', text: 'Population'}
                ]
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