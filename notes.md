# Error Log -- { RESOLVED }
1. Error: Expected one matching request for criteria "Match URL: http://localhost:8000.api/login/" and found none
2. Error: Expected no open requests and found 1: "POST" "/api/login"

# Rider Request Component
>> Should handle requests made through form submissions
>> >> Can't bind to "latitude since it isnt a known property of "agm-map"
1. If "agm-map" is an Angular component and it has "latitude" input then verify that it is part of this module.

```
Error: Template parse errors:
Can't bind to 'latitude' since it isn't a known property of 'agm-map'.
1. If 'agm-map' is an Angular component and it has 'latitude' input, then verify that it is part of this module.
2. If 'agm-map' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("
          </div>
          <!-- new -->
          <agm-map [ERROR ->][latitude]="lat" [longitude]="lng" [zoom]="zoom">
            <agm-marker *ngFor="let marker of marke"): ng:///DynamicTestModule/RiderRequestComponent.html@23:19
Can't bind to 'longitude' since it isn't a known property of 'agm-map'.
1. If 'agm-map' is an Angular component and it has 'longitude' input, then verify that it is part of this module.
2. If 'agm-map' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("
          </div>
          <!-- new -->
          <agm-map [latitude]="lat" [ERROR ->][longitude]="lng" [zoom]="zoom">
            <agm-marker *ngFor="let marker of markers" [latitude]="m"): ng:///DynamicTestModule/RiderRequestComponent.html@23:36
Can't bind to 'zoom' since it isn't a known property of 'agm-map'.
1. If 'agm-map' is an Angular component and it has 'zoom' input, then verify that it is part of this module.
2. If 'agm-map' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("
          </div>
          <!-- new -->
          <agm-map [latitude]="lat" [longitude]="lng" [ERROR ->][zoom]="zoom">
            <agm-marker *ngFor="let marker of markers" [latitude]="marker.lat()" [long"): ng:///DynamicTestModule/RiderRequestComponent.html@23:54
Can't bind to 'latitude' since it isn't a known property of 'agm-marker'.
1. If 'agm-marker' is an Angular component and it has 'latitude' input, then verify that it is part of this module.
2. If 'agm-marker' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("tude]="lat" [longitude]="lng" [zoom]="zoom">
            <agm-marker *ngFor="let marker of markers" [ERROR ->][latitude]="marker.lat()" [longitude]="marker.lng()" [label]="marker.label">
            </agm-marker"): ng:///DynamicTestModule/RiderRequestComponent.html@24:55
Can't bind to 'longitude' since it isn't a known property of 'agm-marker'.
1. If 'agm-marker' is an Angular component and it has 'longitude' input, then verify that it is part of this module.
2. If 'agm-marker' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("ng" [zoom]="zoom">
            <agm-marker *ngFor="let marker of markers" [latitude]="marker.lat()" [ERROR ->][longitude]="marker.lng()" [label]="marker.label">
            </agm-marker>
          </agm-map>
"): ng:///DynamicTestModule/RiderRequestComponent.html@24:81
Can't bind to 'label' since it isn't a known property of 'agm-marker'.
1. If 'agm-marker' is an Angular component and it has 'label' input, then verify that it is part of this module.
2. If 'agm-marker' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("    <agm-marker *ngFor="let marker of markers" [latitude]="marker.lat()" [longitude]="marker.lng()" [ERROR ->][label]="marker.label">
            </agm-marker>
          </agm-map>
"): ng:///DynamicTestModule/RiderRequestComponent.html@24:108
'agm-marker' is not a known element:
1. If 'agm-marker' is an Angular component, then verify that it is part of this module.
2. If 'agm-marker' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. ("      <!-- new -->
          <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
            [ERROR ->]<agm-marker *ngFor="let marker of markers" [latitude]="marker.lat()" [longitude]="marker.lng()" [labe"): ng:///DynamicTestModule/RiderRequestComponent.html@24:12
'agm-map' is not a known element:
1. If 'agm-map' is an Angular component, then verify that it is part of this module.
2. If 'agm-map' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. ("
          </div>
          <!-- new -->
          [ERROR ->]<agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
            <agm-marker *ngFor="let marker"): ng:///DynamicTestModule/RiderRequestComponent.html@23:10
```